import { Crown, Sparkles } from 'lucide-react'
import { formatArs } from '../../config/campaign.js'

/*
 * progress: porcentaje animado (0–100), el mismo valor que mueve el
 * colectivo en el mapa. El monto mostrado se interpola con la misma
 * animación para que todo el hero avance junto.
 *
 * aporte: { kms, ts } del aporte recién confirmado; dispara el "+N km"
 * flotante y el destello del porcentaje (ts como key relanza el CSS).
 */
export default function ProgressCard({ progress, targetPct, raised, donantes = 0, aporte }) {
  const t = targetPct > 0 ? progress / targetPct : 0
  const shownRaised = Math.round(raised * t)

  return (
    <div className="w-full max-w-sm rounded-[20px] border border-gold-300/25 bg-[rgba(18,18,18,0.9)] p-6 shadow-card backdrop-blur-[20px]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted sm:text-[11px]">
        Recaudado hasta ahora
      </p>

      <p className="mt-2 font-slab text-4xl font-bold text-gold-100">
        {formatArs(shownRaised)}
      </p>

      <div
        className="mt-4 h-3 overflow-hidden rounded-full border border-gold-300/20 bg-[#1a1a1a]"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de la recaudación"
      >
        <div
          className="bar-shimmer h-full rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="relative text-sm text-muted">
          {aporte && (
            <span
              key={aporte.ts}
              className="aporte-pop absolute -top-6 left-0 flex items-center gap-1 whitespace-nowrap font-slab text-lg font-bold text-gold-100"
              aria-hidden="true"
            >
              <Sparkles size={16} className="text-gold-300" />+{aporte.kms} km
            </span>
          )}
          <span
            key={aporte?.ts ?? 'pct'}
            className={`font-slab text-2xl font-bold text-ink ${aporte ? 'pct-flash' : ''}`}
          >
            {Math.round(progress)}%
          </span>{' '}
          <span className="text-xs font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
            de la meta
          </span>
        </p>
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/35 text-gold-300">
          <Crown size={20} strokeWidth={2} />
        </span>
      </div>

      {donantes > 0 && (
        <p className="mt-3 border-t border-gold-300/15 pt-3 text-sm text-muted">
          Ya donaron{' '}
          <strong className="font-slab text-gold-100">{donantes}</strong>{' '}
          {donantes === 1 ? 'persona' : 'personas'}{' '}
          <span className="text-gold-300">♥</span>
        </p>
      )}
    </div>
  )
}
