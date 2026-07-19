import escudo from '../../assets/escudo.png'
import { elClub } from '../../config/content.js'
import PhotoSlot from '../ui/PhotoSlot.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import VideoSlot from '../ui/VideoSlot.jsx'
import YouTubeEmbed from '../ui/YouTubeEmbed.jsx'

export default function ElClub() {
  return (
    <section id="el-club" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Nuestra historia" title="EL CLUB" />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <img src={escudo} alt="Escudo Gran Rey FC" className="h-20 w-auto" />
              <div>
                <p className="font-brand text-xl font-bold tracking-[0.18em] text-gold-100">
                  GRAN REY FC
                </p>
                <p className="text-base text-soft sm:text-sm">San Nicolás de los Arroyos</p>
              </div>
            </div>

            {elClub.historia.map((parrafo) => (
              <p key={parrafo.slice(0, 24)} className="mt-6 leading-relaxed text-muted">
                {parrafo}
              </p>
            ))}

            <ul className="mt-8 flex flex-wrap gap-3">
              {elClub.valores.map((valor) => (
                <li
                  key={valor}
                  className="rounded-full border border-gold-300/30 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold-200 transition-colors duration-300 hover:border-gold-300/60 hover:bg-gold-300/10 sm:text-xs"
                >
                  {valor}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150}>
            <PhotoSlot {...elClub.fotoPrincipal} className="aspect-[4/3] w-full" />
          </Reveal>
        </div>

        {/* Las tres categorías del club, cada una con su foto de grupo */}
        {elClub.categorias?.items?.length > 0 && (
          <div className="mt-20">
            <Reveal className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
                {elClub.categorias.subtitulo}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                <span className="gold-gradient-text">{elClub.categorias.titulo}</span>
              </h3>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {elClub.categorias.items.map(({ nombre, foto }, i) => (
                <Reveal key={nombre} delay={i * 110}>
                  <PhotoSlot {...foto} className="aspect-[4/3]" />
                  <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-gold-200">
                    {nombre}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-5 grid-cols-2 md:grid-cols-4">
          {elClub.galeria.map((foto, i) => (
            <Reveal key={foto.src || foto.alt} delay={i * 90}>
              <PhotoSlot {...foto} className="aspect-square" />
            </Reveal>
          ))}
        </div>

        {/* Videos de entrenamiento */}
        {elClub.entrenamientos?.videos?.length > 0 && (
          <div className="mt-20">
            <Reveal className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
                {elClub.entrenamientos.subtitulo || 'A fondo'}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                <span className="gold-gradient-text">{elClub.entrenamientos.titulo}</span>
              </h3>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {elClub.entrenamientos.videos.map((video, i) => (
                <Reveal key={video.alt} delay={i * 100}>
                  <VideoSlot {...video} className="aspect-[4/3]" />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* YouTube: GRFC desde adentro */}
        {elClub.desdeAdentro?.videoUrl && (
          <div className="mt-24">
            <Reveal className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
                {elClub.desdeAdentro.subtitulo}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                <span className="gold-gradient-text">{elClub.desdeAdentro.titulo}</span>
              </h3>
            </Reveal>
            <Reveal delay={150}>
              <YouTubeEmbed
                url={elClub.desdeAdentro.videoUrl}
                title={elClub.desdeAdentro.titulo}
                className="mx-auto max-w-4xl"
              />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}
