import { useEffect, useRef, useState } from 'react'
import { Music, Pause, Play, SkipForward, X } from 'lucide-react'
import { asset } from '../../config/assets.js'
import { musica } from '../../config/content.js'

/*
 * Reproductor de música flotante (abajo a la derecha), opcional: nunca
 * arranca solo, el visitante decide si quiere música. Cerrado es un botón
 * redondo con la nota; abierto es una píldora negra con borde dorado, en
 * la línea del resto de la web. La música sigue sonando aunque se cierre
 * la píldora; el "vinilo" gira mientras suena.
 */
export default function MusicPlayer() {
  const pistas = musica.pistas
  const [abierto, setAbierto] = useState(false)
  const [sonando, setSonando] = useState(false)
  const [idx, setIdx] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.65
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (sonando) audio.play().catch(() => setSonando(false))
    else audio.pause()
  }, [sonando, idx])

  if (!pistas.length) return null
  const pista = pistas[idx]

  const siguiente = () => {
    setIdx((i) => (i + 1) % pistas.length)
    setSonando(true)
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio
        ref={audioRef}
        src={asset(pista.src)}
        preload="none"
        loop={pistas.length === 1}
        onEnded={siguiente}
      />

      {abierto ? (
        <div className="menu-drop flex items-center gap-3 rounded-full border border-gold-300/35 bg-bg/95 py-2 pl-2 pr-3 shadow-card backdrop-blur-xl">
          {/* Vinilo: gira mientras suena */}
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300/45 bg-bg-elevated text-gold-300 ${
              sonando ? 'vinyl-spin' : ''
            }`}
            aria-hidden="true"
          >
            <Music size={18} strokeWidth={2} />
          </span>

          <span className="min-w-0 max-w-[9.5rem]">
            <span className="block truncate font-slab text-sm font-bold text-gold-100">
              {pista.titulo}
            </span>
            <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-soft">
              {pista.artista}
            </span>
          </span>

          <button
            type="button"
            onClick={() => setSonando((v) => !v)}
            aria-label={sonando ? 'Pausar la música' : 'Reproducir la música'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 text-bg shadow-gold transition-transform duration-200 hover:scale-105"
          >
            {sonando ? <Pause size={17} strokeWidth={2.5} /> : <Play size={17} strokeWidth={2.5} className="ml-0.5" />}
          </button>

          {pistas.length > 1 && (
            <button
              type="button"
              onClick={siguiente}
              aria-label="Siguiente canción"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-300/30 text-gold-200 transition-colors duration-200 hover:border-gold-300/60 hover:text-gold-100"
            >
              <SkipForward size={15} strokeWidth={2} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar el reproductor (la música sigue)"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-soft transition-colors duration-200 hover:text-gold-100"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir el reproductor de música"
          className={`relative flex h-13 w-13 items-center justify-center rounded-full border border-gold-300/40 bg-bg/95 p-4 text-gold-300 shadow-card backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-300/70 hover:shadow-gold active:scale-90 ${
            sonando ? 'vinyl-spin' : 'music-ping'
          }`}
        >
          <Music size={20} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
