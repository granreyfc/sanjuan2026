import { useEffect, useState } from 'react'
import { FALLBACK, SHEET_URL } from '../config/campaign.js'
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
 * Convención de la hoja: fila 1 = encabezados (meta, recaudado),
 * fila 2 = valores. Si los encabezados vienen en otro orden, se
 * respeta el orden de las columnas por nombre.
 */
function parseSheet(csv) {
  const lines = csv.trim().split(/\r?\n/)
  if (lines.length < 2) return null

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase())
  const values = splitCsvLine(lines[1])

  let goalIdx = headers.indexOf('meta')
  let raisedIdx = headers.indexOf('recaudado')
  if (goalIdx === -1 || raisedIdx === -1) {
    goalIdx = 0
    raisedIdx = 1
  }

  const goal = parseAmount(values[goalIdx])
  const raised = parseAmount(values[raisedIdx])
  if (!Number.isFinite(goal) || !Number.isFinite(raised) || goal <= 0) return null

  return { goal, raised }
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
    loading: Boolean(SHEET_URL),
    source: 'fallback',
  })

  useEffect(() => {
    if (!SHEET_URL) return

    const controller = new AbortController()
    fetch(SHEET_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((csv) => {
        const parsed = parseSheet(csv)
        if (!parsed) throw new Error('No pude interpretar la hoja (¿formato meta/recaudado?)')
        setState({ ...parsed, loading: false, source: 'sheet' })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.warn('[campaña] No se pudo leer Google Sheets, uso fallback:', err)
        setState({ ...FALLBACK, loading: false, source: 'fallback' })
      })

    return () => controller.abort()
  }, [])

  return { ...state, raised: Math.max(0, state.raised + ajusteRecaudado) }
}
