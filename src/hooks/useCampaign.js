import { useEffect, useState } from 'react'
import { FALLBACK, RESPUESTAS_URL, SHEET_URL } from '../config/campaign.js'
import { useAdminEstado } from './useAdminEstado.js'

// "$ 3.400.000" | "3,400,000" | "3400000" → 3400000
function parseAmount(cell) {
  const digits = String(cell).replace(/[^\d]/g, '')
  return digits ? Number(digits) : NaN
}

// Split naive de una línea CSV que tolera campos entre comillas.
function splitCsvLine(line) {
  return (line.match(/("([^"]*)"|[^,]+)/g) ?? []).map((f) =>
    f.replace(/^"|"$/g, '').trim(),
  )
}

/*
 * Busca las etiquetas "meta", "recaudado" y "donantes" en CUALQUIER
 * celda de la hoja y toma el valor de la celda de la derecha o, si no
 * hay número ahí, la de abajo. Así el formato es flexible: sirve tanto
 * en fila (etiquetas arriba, valores abajo) como en columna (etiqueta a
 * la izquierda, valor a la derecha), y tolera filas/columnas de más.
 */
function parseSheet(csv) {
  const filas = csv
    .trim()
    .split(/\r?\n/)
    .map((l) => splitCsvLine(l))
  if (!filas.length) return null

  const buscar = (etiqueta) => {
    for (let f = 0; f < filas.length; f++) {
      for (let c = 0; c < filas[f].length; c++) {
        if (filas[f][c].toLowerCase().trim() !== etiqueta) continue
        const derecha = parseAmount(filas[f][c + 1] ?? '')
        if (Number.isFinite(derecha)) return derecha
        const abajo = parseAmount(filas[f + 1]?.[c] ?? '')
        if (Number.isFinite(abajo)) return abajo
      }
    }
    return NaN
  }

  const goal = buscar('meta')
  const raised = buscar('recaudado')
  const donantes = buscar('donantes')
  if (!Number.isFinite(goal) || !Number.isFinite(raised) || goal <= 0) return null

  return { goal, raised, donantes: Number.isFinite(donantes) ? donantes : 0 }
}

/*
 * Pestaña de respuestas del formulario: una fila por promesa de
 * donación. Devuelve la suma de los montos y cuántas promesas hay.
 * Valida por encabezado ("monto") para no sumar cualquier cosa si la
 * URL cayera en otra pestaña.
 */
function parsePromesas(csv) {
  const filas = csv
    .trim()
    .split(/\r?\n/)
    .map((l) => splitCsvLine(l))
  if (filas.length < 1) return { suma: 0, cantidad: 0 }

  const montoIdx = filas[0].findIndex((h) => h.toLowerCase().trim() === 'monto')
  if (montoIdx === -1) return { suma: 0, cantidad: 0 }

  let suma = 0
  let cantidad = 0
  for (const fila of filas.slice(1)) {
    const monto = parseAmount(fila[montoIdx] ?? '')
    if (Number.isFinite(monto) && monto > 0) {
      suma += monto
      cantidad++
    }
  }
  return { suma, cantidad }
}

/*
 * Devuelve { goal, raised, loading, source }.
 * - Sin SHEET_URL configurada: valores de FALLBACK, sin request.
 * - Con SHEET_URL: fetch al CSV publicado; si algo falla, FALLBACK.
 * source: 'fallback' | 'sheet' (útil para debug).
 */
export function useCampaign() {
  // El ajuste del panel /admin corrige lo recaudado (p. ej. si alguien
  // prometió kilómetros pero nunca transfirió)
  const { ajusteRecaudado } = useAdminEstado()
  const [state, setState] = useState({
    ...FALLBACK,
    donantes: 0,
    loading: Boolean(SHEET_URL),
    source: 'fallback',
  })

  useEffect(() => {
    if (!SHEET_URL) return

    const controller = new AbortController()
    const bajar = (url) =>
      fetch(url, { signal: controller.signal }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })

    // Hoja 1 (meta + ajuste manual) y las promesas del formulario en
    // paralelo; si las promesas fallan, la campaña sigue sin ellas
    Promise.all([
      bajar(SHEET_URL),
      RESPUESTAS_URL ? bajar(RESPUESTAS_URL).catch(() => '') : Promise.resolve(''),
    ])
      .then(([csvHoja, csvPromesas]) => {
        const parsed = parseSheet(csvHoja)
        if (!parsed) throw new Error('No pude interpretar la hoja (¿formato meta/recaudado?)')
        const promesas = parsePromesas(csvPromesas)
        setState({
          goal: parsed.goal,
          // recaudado mostrado = ajuste manual (B2) + promesas del form
          raised: parsed.raised + promesas.suma,
          donantes: Math.max(parsed.donantes, promesas.cantidad),
          loading: false,
          source: 'sheet',
        })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.warn('[campaña] No se pudo leer Google Sheets, uso fallback:', err)
        setState({ ...FALLBACK, donantes: 0, loading: false, source: 'fallback' })
      })

    return () => controller.abort()
  }, [])

  return { ...state, raised: Math.max(0, state.raised + ajusteRecaudado) }
}
