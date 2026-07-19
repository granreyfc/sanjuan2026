import { Crown } from 'lucide-react'
import Reveal from './Reveal.jsx'

/*
 * Encabezado estándar de sección: eyebrow + título Cinzel + divisor
 * con corona, siguiendo la guía de estilo. Aparece al entrar en pantalla.
 */
export default function SectionHeading({ eyebrow, title }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 break-words text-balance font-display text-[clamp(1.75rem,8vw,3rem)] font-bold tracking-wide sm:text-4xl lg:text-5xl">
        <span className="gold-gradient-text">{title}</span>
      </h2>
      <div className="mt-5 flex items-center justify-center gap-4" aria-hidden="true">
        <span className="h-px w-20 bg-gradient-to-r from-transparent to-gold-300/50" />
        <Crown size={16} className="text-gold-300" />
        <span className="h-px w-20 bg-gradient-to-l from-transparent to-gold-300/50" />
      </div>
    </Reveal>
  )
}
