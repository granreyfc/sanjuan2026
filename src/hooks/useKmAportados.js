import { useSyncExternalStore } from 'react'

/*
 * Kilómetros prometidos desde este dispositivo (persisten en localStorage).
 *
 * Cada promesa también queda registrada en la hoja del club vía el
 * formulario, y la página suma TODAS las promesas de la hoja al
 * recaudado. Para que el donante vea su aporte al instante sin contarlo
 * dos veces cuando la hoja lo refleje (Google cachea unos minutos), las
 * promesas locales solo suman al progreso durante una ventana de 30
 * minutos: después de eso ya vienen incluidas en la suma de la hoja.
 *
 * - recientes: km locales dentro de la ventana (suman al progreso)
 * - total: km históricos del dispositivo (para el "ya sumaste X km")
 *
 * Guardado y aviso a la UI separados a propósito: al confirmar se
 * GUARDA ya mismo (por si nunca vuelve de Mercado Pago), pero la UI se
 * entera al cerrar el modal, para animar el mapa con el visitante mirando.
 */
const KEY = 'grfc-km-aportados-v2'
const VENTANA_MS = 30 * 60 * 1000

const listeners = new Set()
let promesas = null
let snapshot = { recientes: 0, cantRecientes: 0, total: 0 }

function cargar() {
  if (promesas !== null) return
  try {
    const arr = JSON.parse(localStorage.getItem(KEY))
    promesas = Array.isArray(arr) ? arr : []
  } catch {
    promesas = []
  }
  recalcular()
}

function recalcular() {
  const ahora = Date.now()
  let recientes = 0
  let cantRecientes = 0
  let total = 0
  for (const p of promesas) {
    total += p.kms
    if (ahora - p.ts < VENTANA_MS) {
      recientes += p.kms
      cantRecientes++
    }
  }
  snapshot = { recientes, cantRecientes, total }
}

// Suma y persiste SIN avisar a la UI (ver notificarAporte)
export function guardarKmAportados(kms) {
  cargar()
  promesas.push({ kms, ts: Date.now() })
  localStorage.setItem(KEY, JSON.stringify(promesas))
  recalcular()
}

// Refresca a los suscriptos y emite el evento del festejo (+N km)
export function notificarAporte(kms) {
  cargar()
  recalcular()
  listeners.forEach((l) => l())
  window.dispatchEvent(new CustomEvent('grfc:aporte', { detail: { kms } }))
}

export function useKmAportados() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => {
      cargar()
      return snapshot
    },
  )
}
