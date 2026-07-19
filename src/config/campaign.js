/*
 * Fuente única de verdad del estado de la campaña.
 *
 * ── CÓMO VINCULAR GOOGLE SHEETS ────────────────────────────────────────
 * 1. Creá una hoja con este formato exacto (fila 1 encabezados, fila 2 valores):
 *
 *        |    A    |     B      |
 *      1 |  meta   | recaudado  |
 *      2 | 3400000 |  2450000   |
 *
 *    (los valores pueden tener puntos o $: "3.400.000" también funciona)
 *
 * 2. En Google Sheets: Archivo → Compartir → Publicar en la web
 *    → elegí la hoja → formato "Valores separados por comas (.csv)"
 *    → Publicar → copiá el link (termina en `?output=csv` o `pub?output=csv`).
 *
 * 3. Pegá ese link en SHEET_URL acá abajo. Nada más: la página va a leer
 *    la hoja al cargar y, si falla o está vacío, usa FALLBACK.
 *
 * Nota: Google cachea la publicación ~5 minutos, así que los cambios en la
 * hoja pueden tardar unos minutos en verse en la página.
 */
export const SHEET_URL = ''

// Valores usados mientras SHEET_URL esté vacío o si la lectura falla.
// La meta equivale a los 983 km de la ruta a $6.500 el kilómetro.
export const FALLBACK = {
  goal: 6_389_500,
  raised: 3_375_000,
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
