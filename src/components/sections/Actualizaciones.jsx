import { actualizaciones } from '../../config/content.js'
import ComingSoon from '../ui/ComingSoon.jsx'
import PhotoSlot from '../ui/PhotoSlot.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function Actualizaciones() {
  return (
    <section id="actualizaciones" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Diario del viaje" title="ACTUALIZACIONES" />

        {!actualizaciones.activo ? (
          <Reveal delay={120} className="mt-14">
            <ComingSoon {...actualizaciones.mensajeBloqueado} />
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {actualizaciones.items.map(({ fecha, titulo, texto, foto }, i) => (
              <Reveal key={titulo} delay={i * 110}>
                <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-gold-300/20 bg-bg-elevated shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-gold-300/40 hover:shadow-gold">
                  <PhotoSlot {...foto} className="aspect-video rounded-none border-0" />
                  <div className="flex flex-1 flex-col p-6">
                    <time
                      dateTime={fecha}
                      className="font-slab text-sm uppercase tracking-[0.16em] text-gold-300 sm:text-xs"
                    >
                      {formatoFecha.format(new Date(`${fecha}T00:00:00`))}
                    </time>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-wide text-gold-100">
                      {titulo}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted sm:text-sm">{texto}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
