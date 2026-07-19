/*
 * Recarga automática cuando se publica una versión nueva del sitio.
 *
 * Algunos navegadores se quedan con el index.html viejo en caché y nunca
 * ven los cambios. Esto baja el index.html fresco cada tanto (y cada vez
 * que el usuario vuelve a la pestaña), compara el nombre hasheado del
 * bundle con el que está corriendo y, si cambió, recarga la página.
 *
 * Para no cortar nada a mitad de uso: si hay audio o video CON sonido
 * reproduciéndose, la recarga espera a que el usuario deje la pestaña.
 * (Los videos muteados de entrenamiento no cuentan.)
 */
const INTERVALO_MS = 2 * 60 * 1000

export function iniciarAutoUpdate() {
  // En desarrollo (vite dev) no existe el bundle hasheado: no hay nada que vigilar
  const script = document.querySelector('script[src*="assets/index-"]')
  const bundleActual = script?.getAttribute('src')
  if (!bundleActual) return

  let recargaPendiente = false

  const hayMediaConSonido = () =>
    [...document.querySelectorAll('audio, video')].some((m) => !m.paused && !m.muted)

  const recargar = () => window.location.reload()

  async function chequear() {
    try {
      const res = await fetch(`/?v=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) return
      const html = await res.text()
      const publicado = html.match(/assets\/index-[\w-]+\.js/)?.[0]
      if (!publicado || bundleActual.includes(publicado)) return

      // Hay versión nueva publicada
      if (document.hidden || !hayMediaConSonido()) recargar()
      else recargaPendiente = true
    } catch {
      // sin conexión o túnel caído: se reintenta en el próximo ciclo
    }
  }

  setInterval(chequear, INTERVALO_MS)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && recargaPendiente) recargar()
    else if (!document.hidden) chequear()
  })
}
