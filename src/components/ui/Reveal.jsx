import { useInView } from '../../hooks/useInView.js'

/*
 * Hace aparecer su contenido (fade + subida suave) cuando entra al
 * viewport. `delay` (ms) escalona elementos hermanos; `as` permite usar
 * la etiqueta semántica correcta ("li", "article", "p", ...).
 *
 * Ojo: no usar `as` sobre elementos que ya tengan transiciones propias
 * (hover con transition-all); en ese caso conviene envolverlos.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'reveal-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
