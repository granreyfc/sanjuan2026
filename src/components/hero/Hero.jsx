import { useEffect, useState } from 'react'
import { Crown, Heart } from 'lucide-react'
import leon from '../../assets/leon.png'
import { progressPct } from '../../config/campaign.js'
import { donar } from '../../config/content.js'
import { useAnimatedProgress } from '../../hooks/useAnimatedProgress.js'
import { useCampaign } from '../../hooks/useCampaign.js'
import { useKmAportados } from '../../hooks/useKmAportados.js'
import MapRoute from './MapRoute.jsx'
import ProgressCard from './ProgressCard.jsx'

// duration/delay desincronizan el titileo para que se sienta natural
const STARS = [
  { top: '12%', left: '4%', size: 14, opacity: 0.5, duration: 3.2, delay: 0 },
  { top: '28%', left: '46%', size: 10, opacity: 0.35, duration: 4.1, delay: 1.2 },
  { top: '8%', left: '58%', size: 12, opacity: 0.45, duration: 3.6, delay: 0.6 },
  { top: '55%', left: '51%', size: 16, opacity: 0.4, duration: 4.6, delay: 2 },
  { top: '70%', left: '6%', size: 10, opacity: 0.3, duration: 3.9, delay: 1.6 },
  { top: '18%', left: '90%', size: 12, opacity: 0.45, duration: 3.4, delay: 0.9 },
  { top: '62%', left: '95%', size: 10, opacity: 0.35, duration: 4.3, delay: 2.4 },
]

function Star({ size }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#d4af37" aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
    </svg>
  )
}

export default function Hero() {
  const { raised, donantes } = useCampaign()
  // Los km aportados desde este dispositivo también mueven el colectivo:
  // cuando cambian, la animación arranca de cero hasta la posición nueva
  const kmAportados = useKmAportados()

  // ÚNICA fuente del porcentaje del viaje: kilómetros (igual que la
  // sección Donar). $ recaudados / valorPorKm = km recorridos, sobre el
  // total de km de la ruta. Así el % del colectivo y el de "Doná
  // kilómetros" siempre coinciden.
  const { total, valorPorKm } = donar.kilometros
  const kmRecorridos = Math.min(total, Math.floor(raised / valorPorKm) + kmAportados)
  const raisedTotal = raised + kmAportados * valorPorKm
  const targetPct = progressPct({ goal: total, raised: kmRecorridos })
  const progress = useAnimatedProgress(targetPct)

  // Festejo del aporte recién confirmado (+N km con destello en la tarjeta)
  const [aporte, setAporte] = useState(null)
  useEffect(() => {
    const onAporte = (e) => setAporte({ kms: e.detail.kms, ts: Date.now() })
    window.addEventListener('grfc:aporte', onAporte)
    return () => window.removeEventListener('grfc:aporte', onAporte)
  }, [])

  return (
    <section id="inicio" className="relative overflow-hidden pt-[88px]">
      {/* Estrellas decorativas con titileo suave */}
      {STARS.map((star, i) => (
        <span
          key={i}
          className="star-twinkle pointer-events-none absolute"
          style={{
            top: star.top,
            left: star.left,
            '--star-o': star.opacity,
            '--twinkle-duration': `${star.duration}s`,
            '--twinkle-delay': `${star.delay}s`,
          }}
          aria-hidden="true"
        >
          <Star size={star.size} />
        </span>
      ))}

      {/* León watermark: el PNG (negro sobre transparente) se usa como
          máscara y se rellena con dorado, como pide la guía de estilo */}
      <div
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[780px] w-[560px] -translate-y-1/2 opacity-[0.13] lg:block"
        style={{
          background: 'linear-gradient(180deg, #f6e7a1, #9a7223)',
          maskImage: `url(${leon})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${leon})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* En mobile el mapa va primero (orden natural del DOM);
          en desktop queda como columna izquierda */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-4 lg:grid-cols-[46%_1fr] lg:gap-14 lg:px-8 lg:pt-8">
        {/* Mapa con ruta y colectivo */}
        <div className="hero-rise">
          <MapRoute progress={progress} />
        </div>

        {/* Texto + CTA + progreso, con entrada escalonada */}
        <div className="-mt-6 lg:mt-0 lg:pr-24">
          <h1
            className="hero-rise font-display text-5xl font-bold leading-[1.08] tracking-wide sm:text-6xl xl:text-7xl"
            style={{ animationDelay: '100ms' }}
          >
            <span className="gold-gradient-text">UN VIAJE,</span>
            <br />
            <span className="gold-gradient-text">UN SUEÑO</span>
          </h1>

          <div
            className="hero-rise mt-6 flex items-center gap-4"
            style={{ animationDelay: '200ms' }}
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-300/50" />
            <Crown size={18} className="text-gold-300" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-300/50" />
          </div>

          <p
            className="hero-rise mt-6 font-display text-lg font-semibold tracking-[0.22em] text-gold-200 sm:text-xl"
            style={{ animationDelay: '280ms' }}
          >
            DE SAN NICOLÁS A SAN JUAN
          </p>

          <p
            className="hero-rise mt-5 max-w-md leading-relaxed text-muted"
            style={{ animationDelay: '360ms' }}
          >
            Acompañanos en este viaje para representar a nuestro club y a
            nuestra iglesia en una competencia nacional. Tu aporte nos acerca a
            la meta.
          </p>

          <div className="hero-rise" style={{ animationDelay: '440ms' }}>
            <a
              href="#donar"
              className="gold-shine group mt-8 inline-flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 px-8 text-sm font-bold uppercase tracking-[0.14em] text-bg shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-hover"
            >
              <Heart size={18} strokeWidth={2.5} className="heart-beat" />
              Sumá tu aporte
            </a>
          </div>

          <div className="hero-rise mt-8" style={{ animationDelay: '520ms' }}>
            <ProgressCard
              progress={progress}
              targetPct={targetPct}
              raised={raisedTotal}
              donantes={donantes}
              aporte={aporte}
            />
          </div>
        </div>
      </div>

      <p className="hero-rise relative pb-10 text-center text-sm font-semibold uppercase tracking-[0.3em] text-soft sm:text-xs" style={{ animationDelay: '600ms' }}>
        Un equipo <span className="text-gold-300">★</span> Una familia{' '}
        <span className="text-gold-300">★</span> Un objetivo
      </p>
    </section>
  )
}
