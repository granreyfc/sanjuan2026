import { useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import escudo from '../../assets/escudo.png'

function getYouTubeId(url) {
  if (!url) return null
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/*
 * Embed de YouTube con portada propia: en vez de la miniatura de YouTube
 * se muestra una tapa con el escudo y el título al estilo de la web.
 * El iframe recién se carga cuando el visitante da play (con autoplay),
 * así la página no trae nada de YouTube hasta que hace falta.
 * Acepta links normales o de "compartir"; si la URL no es válida muestra
 * un mensaje en lugar de romper el layout.
 */
export default function YouTubeEmbed({ url, title = 'Video de YouTube', className = '' }) {
  const videoId = useMemo(() => getYouTubeId(url), [url])
  const [reproduciendo, setReproduciendo] = useState(false)

  if (!videoId) {
    return (
      <div className={`flex items-center justify-center rounded-[20px] border border-dashed border-gold-300/30 bg-bg-elevated p-8 text-center text-soft ${className}`}>
        <p className="text-sm">Enlace de YouTube no válido</p>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-[20px] border border-gold-300/25 shadow-card ${className}`}>
      <div className="relative aspect-video w-full">
        {reproduciendo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setReproduciendo(true)}
            aria-label={`Reproducir: ${title}`}
            className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-[#0a0a0a] px-8 py-6 sm:gap-5 sm:px-12"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 42%, rgba(212, 175, 55, 0.16) 0%, transparent 55%)',
            }}
          >
            <img
              src={escudo}
              alt=""
              className="h-12 w-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.35)] sm:h-24"
            />
            <span className="gold-gradient-text max-w-full text-balance text-center font-display text-xl font-bold uppercase leading-snug tracking-wide sm:text-3xl lg:text-4xl">
              {title}
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 text-bg shadow-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold-hover sm:h-14 sm:w-14">
              <Play size={20} strokeWidth={2.5} className="ml-0.5" />
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
