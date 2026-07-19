import { Lock, MapPin } from 'lucide-react'

/*
 * Estado "próximamente" para secciones que todavía no están activas.
 * Muestra un título, descripción y CTA opcional.
 */
export default function ComingSoon({
  titulo,
  subtitulo,
  descripcion,
  cta,
  ctaHref,
  className = '',
}) {
  return (
    <div
      className={`mx-auto flex max-w-3xl flex-col items-center rounded-[24px] border border-gold-300/20 bg-bg-elevated p-10 text-center shadow-card sm:p-14 ${className}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/30 bg-bg text-gold-300">
        <Lock size={26} strokeWidth={1.8} />
      </span>

      {subtitulo && (
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
          {subtitulo}
        </p>
      )}

      <h3 className="mt-2 font-display text-3xl font-bold tracking-wide text-gold-100 sm:text-4xl">
        {titulo}
      </h3>

      <p className="mt-4 max-w-lg leading-relaxed text-muted">{descripcion}</p>

      {cta && ctaHref && (
        <a
          href={ctaHref}
          className="gold-shine group mt-8 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 px-6 py-3 text-center text-sm font-bold uppercase leading-tight tracking-[0.12em] text-bg shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-hover sm:px-8"
        >
          <MapPin
            size={18}
            strokeWidth={2.5}
            className="shrink-0 transition-transform duration-300 group-hover:scale-125"
          />
          <span className="max-w-[16ch] leading-tight">{cta}</span>
        </a>
      )}
    </div>
  )
}
