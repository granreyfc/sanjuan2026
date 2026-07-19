import { useEffect, useState } from 'react'

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/*
 * Anima un valor de 0 hasta `target` con requestAnimationFrame.
 * Devuelve el valor intermedio; el colectivo, la barra y el contador
 * comparten este mismo valor para moverse en sincronía.
 */
export function useAnimatedProgress(target, { duration = 2400, delay = 400 } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    let frame
    let start
    const tick = (now) => {
      if (start === undefined) start = now
      const elapsed = now - start - delay
      const t = Math.min(1, Math.max(0, elapsed / duration))
      setValue(target * easeInOutCubic(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, delay])

  return value
}
