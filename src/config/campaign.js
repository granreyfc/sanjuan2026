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
  'https://docs.google.com/spreadsheets/d/1CZL1jdLPgZzNEYOE2177Y88LdlGWO1s2W_wsAEhvrH8/gviz/tq?tqx=out:csv&sheet=Hoja%201'

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

/*
 * ── REGISTRO AUTOMÁTICO DE DONACIONES EN LA HOJA ──────────────────────
 * Una página estática no puede escribir directo en Google Sheets; el
 * puente estándar es un Formulario de Google vinculado a la hoja:
 *
 * 1. En la hoja: Herramientas → Crear un formulario nuevo.
 * 2. Agregale dos preguntas de respuesta corta: "Monto" y "Kilómetros".
 * 3. En el formulario: ⋮ → "Obtener vínculo previamente completado",
 *    completá cualquier valor, "Obtener vínculo" y del link copiá los
 *    ids `entry.NNNNN` de cada campo.
 * 4. Pegá acá la URL del form (terminada en /formResponse) y los ids.
 *
 * Cada donación confirmada agrega una fila (con fecha) en la pestaña
 * "Respuestas de formulario" de la misma hoja. Mientras url esté vacía,
 * no se envía nada.
 */
export const FORM_DONACIONES = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSfGb3fhOVoHUi0vCVO6PolEtmatGpGZK5xozbTbqKOnbQRiLg/formResponse',
  campoMonto: 'entry.1883628862',
  campoKms: 'entry.202458942',
}

export function registrarDonacion({ monto, kms }) {
  const { url, campoMonto, campoKms } = FORM_DONACIONES
  if (!url) return
  const datos = new URLSearchParams()
  if (campoMonto) datos.append(campoMonto, String(monto))
  if (campoKms) datos.append(campoKms, String(kms))
  // no-cors: Google Forms no responde CORS; el envío igual llega
  fetch(url, { method: 'POST', mode: 'no-cors', body: datos }).catch(() => {})
}
