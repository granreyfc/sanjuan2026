import { useEffect, useRef } from 'react'
import { asset } from '../../config/assets.js'

/*
 * Reproductor para videos locales.
 *
 * Con autoPlay (default) va muteado y en loop para poder reproducirse
 * solo. Con autoPlay={false} espera al play del usuario y suena: para
 * videos largos/pesados donde el audio importa.
 *
 * El mute se refuerza por ref: React setea `muted` como propiedad pero
 * no escribe el atributo en el HTML, y Safari/iOS exige el atributo
 * para autorizar el autoplay (si no, el video queda quieto y al tocarlo
 * arranca con sonido).
 */
export default function VideoSlot({ src, alt, className = '', poster, autoPlay = true }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoPlay) return
    video.muted = true
    video.setAttribute('muted', '')
    video.play().catch(() => {
      // si el navegador igual bloquea el autoplay, queda el poster/primer frame
    })
  }, [autoPlay])

  return (
    <figure className={`group overflow-hidden rounded-[20px] border border-gold-300/25 shadow-card ${className}`}>
      <video
        ref={videoRef}
        src={asset(src)}
        poster={poster ? asset(poster) : undefined}
        muted={autoPlay}
        loop={autoPlay}
        playsInline
        autoPlay={autoPlay}
        preload="metadata"
        controls
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        aria-label={alt}
      />
    </figure>
  )
}
