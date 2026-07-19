/*
 * Fuente única de verdad del estado de la campaña.
 *
 * ── LA HOJA DE GOOGLE SHEETS ───────────────────────────────────────────
 * https://docs.google.com/spreadsheets/d/1CZL1jdLPgZzNEYOE2177Y88LdlGWO1s2W_wsAEhvrH8/edit
 *
 * 1. Formato (fila 1 encabezados, fila 2 valores):
 *
 *        |    A    |     B      |
 *      1 |  meta   | recaudado  |
 *      2 | 6389500 |     0      |
 *
 *    (los valores pueden tener puntos o $: "3.400.000" también funciona)
 *
 * 2. La hoja tiene que ser pública de lectura: Compartir →
 *    "Cualquier persona con el enlace" → Lector. Sin eso, Google
 *    devuelve una pantalla de login y la página usa FALLBACK.
 *
 * Nota: Google puede cachear unos minutos, así que los cambios en la
 * hoja pueden tardar un poco en verse en la página.
 */
export const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1CZL1jdLPgZzNEYOE2177Y88LdlGWO1s2W_wsAEhvrH8/gviz/tq?tqx=out:csv'

// Valores usados mientras SHEET_URL esté vacío o si la lectura falla.
// La meta equivale a los 983 km de la ruta a $6.500 el kilómetro.
export const FALLBACK = {
  goal: 6_389_500,
  raised: 0,
}

export function progressPct({ raised, goal }) {
  if (!goal || goal <= 0) return 0
  return Math.min(100, (raised / goal) * 100)
}

const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function formatArs(amount) {
  return arsFormatter.format(amount)
}
