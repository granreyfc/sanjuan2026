import { useSyncExternalStore } from 'react'

/*
 * Kilómetros aportados desde este dispositivo, compartidos entre la
 * sección Donar y el Hero (el colectivo del mapa avanza con ellos).
 * Persisten en localStorage.
 *
 * El guardado y el aviso a la UI están separados a propósito: al
 * confirmar la donación se GUARDA ya mismo (por si el visitante nunca
 * vuelve de Mercado Pago), pero la UI recién se entera al cerrar el
 * modal, para que la animación del colectivo corra cuando el visitante
 * está mirando el mapa y no escondida detrás del modal.
 */
const KEY = 'grfc-km-aportados'
const listeners = new Set()
let cache = null

function leer() {
  const v = Number(localStorage.getItem(KEY))
  return Number.isFinite(v) && v > 0 ? v : 0
}

export function getKmAportados() {
  if (cache === null) cache = leer()
  return cache
}

// Suma y persiste SIN avisar a la UI (ver notificarAporte)
export function guardarKmAportados(kms) {
  cache = getKmAportados() + kms
  localStorage.setItem(KEY, String(cache))
}

// Refresca a los suscriptos y emite el evento del festejo (+N km)
export function notificarAporte(kms) {
  listeners.forEach((l) => l())
  window.dispatchEvent(new CustomEvent('grfc:aporte', { detail: { kms } }))
}

export function useKmAportados() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    getKmAportados,
  )
}
