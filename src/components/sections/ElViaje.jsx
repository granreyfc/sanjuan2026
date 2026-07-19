import { elViaje } from '../../config/content.js'
import { useAdminEstado } from '../../hooks/useAdminEstado.js'
import ComingSoon from '../ui/ComingSoon.jsx'
import CountUp from '../ui/CountUp.jsx'
import PhotoSlot from '../ui/PhotoSlot.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import VideoSlot from '../ui/VideoSlot.jsx'

export default function ElViaje() {
  // El panel /admin puede forzar la sección (null = lo que diga content.js)
  // y aporta las fotos del viaje subidas desde ahí
  const estadoAdmin = useAdminEstado()
  const activo = estadoAdmin.viajeActivo ?? elViaje.activo
  const fotosViaje = [...elViaje.fotos.filter((f) => f.src), ...estadoAdmin.fotos]

  return (
    <section id="el-viaje" className="relative border-t border-gold-300/10 bg-bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="De San Nicolás a San Juan" title="EL VIAJE" />

        {!activo ? (
          <Reveal delay={120} className="mt-14">
            <ComingSoon {...elViaje.mensajeBloqueado} />
          </Reveal>
        ) : (
          <>
            <Reveal as="p" delay={100} className="mx-auto mt-8 max-w-2xl text-center leading-relaxed text-muted">
              {elViaje.intro}
            </Reveal>

            {/* Stats del viaje: los números cuentan desde 0 al entrar en pantalla */}
            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {elViaje.stats.map(({ valor, unidad, label }, i) => (
                <Reveal
                  key={label}
                  delay={i * 90}
                  className="rounded-[20px] border border-gold-300/20 bg-bg-elevated p-4 text-center shadow-card sm:p-6"
                >
                  <p className="break-words text-balance font-slab text-[clamp(1.75rem,10vw,2.5rem)] font-bold leading-tight text-gold-200 sm:text-3xl lg:text-4xl">
                    <CountUp value={valor} />
                    {unidad && <span className="ml-1 text-base text-gold-400 sm:text-xl">{unidad}</span>}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-soft sm:text-[11px]">
                    {label}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Itinerario */}
            <ol className="mx-auto mt-16 max-w-2xl">
              {elViaje.itinerario.map(({ titulo, texto }, i) => (
                <Reveal as="li" key={titulo} delay={i * 130} className="relative flex gap-5 pb-10 last:pb-0">
                  {/* línea vertical + nodo dorado */}
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-300/40 bg-bg-elevated font-slab text-sm font-bold text-gold-200">
                      {i + 1}
                    </span>
                    {i < elViaje.itinerario.length - 1 && (
                      <span className="mt-2 w-px flex-1 bg-gradient-to-b from-gold-300/40 to-gold-300/10" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-display text-lg font-semibold tracking-wide text-gold-100">
                      {titulo}
                    </h3>
                    <p className="mt-1.5 text-base leading-relaxed text-muted sm:text-sm">{texto}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* El último torneo nacional del club, en video (con sonido,
                arranca cuando el usuario le da play) */}
            {elViaje.ultimoViaje?.video?.src && (
              <div className="mt-20">
                <Reveal className="mb-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
                    {elViaje.ultimoViaje.subtitulo}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                    <span className="gold-gradient-text">{elViaje.ultimoViaje.titulo}</span>
                  </h3>
                </Reveal>
                <Reveal delay={150}>
                  {/* El video es vertical (9:16), formato celular */}
                  <VideoSlot
                    {...elViaje.ultimoViaje.video}
                    autoPlay={false}
                    className="mx-auto aspect-[9/16] w-full max-w-sm"
                  />
                </Reveal>
              </div>
            )}

            {/* Fotos del viaje: las de content.js + las subidas por /admin */}
            {fotosViaje.length > 0 && (
              <div className="mt-20">
                <Reveal className="mb-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
                    Momentos del camino
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                    <span className="gold-gradient-text">Fotos del viaje</span>
                  </h3>
                </Reveal>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  {fotosViaje.map((foto, i) => (
                    <Reveal key={foto.src} delay={i * 90}>
                      <PhotoSlot {...foto} className="aspect-square" />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
