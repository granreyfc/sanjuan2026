import { useEffect, useRef, useState } from 'react'

/*
 * Devuelve [ref, inView]. `inView` pasa a true la primera vez que el
 * elemento entra al viewport y no vuelve a false (los reveals se
 * disparan una sola vez, al scrollear hacia abajo).
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, inView])

  return [ref, inView]
}
