import { useEffect, useState } from 'react'

/*
 * Estado administrable del sitio (lo maneja el panel /admin):
 * - ajusteRecaudado: pesos que se suman/restan a lo recaudado
 * - viajeActivo: fuerza mostrar/ocultar la sección El Viaje (null = lo
 *   que diga content.js)
 * - fotos: fotos del viaje subidas desde el panel
 *
 * Se pide una sola vez por carga de página (promesa compartida). Si la
 * API no está (p. ej. `vite dev` sin el server), quedan los defaults y
 * el sitio funciona igual.
 */
export const ESTADO_DEFAULT = { ajusteRecaudado: 0, viajeActivo: null, fotos: [] }

let promesa = null

export function fetchEstado() {
  if (!promesa) {
    promesa = fetch('/api/estado', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : ESTADO_DEFAULT))
      .catch(() => ESTADO_DEFAULT)
  }
  return promesa
}

export function useAdminEstado() {
  const [estado, setEstado] = useState(ESTADO_DEFAULT)

  useEffect(() => {
    let montado = true
    fetchEstado().then((e) => montado && setEstado({ ...ESTADO_DEFAULT, ...e }))
    return () => {
      montado = false
    }
  }, [])

  return estado
}
