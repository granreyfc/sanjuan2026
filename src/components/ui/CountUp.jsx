import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView.js'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/*
 * Cuenta de 0 hasta `value` cuando el número entra al viewport.
 * Si `value` no es numérico ("AGOSTO"), lo muestra tal cual.
 */
export default function CountUp({ value, duration = 1600 }) {
  const target = Number(value)
  const isNumeric = Number.isFinite(target)
  const [ref, inView] = useInView()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!isNumeric || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(target)
      return
    }

    let frame
    let start
    const tick = (now) => {
      if (start === undefined) start = now
      const t = Math.min(1, (now - start) / duration)
      setShown(Math.round(target * easeOutCubic(t)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isNumeric, inView, target, duration])

  if (!isNumeric) return <span>{value}</span>
  return <span ref={ref}>{shown}</span>
}
