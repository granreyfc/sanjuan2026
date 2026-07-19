import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { contacto } from '../../config/content.js'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

// lucide-react ya no trae íconos de marcas; glyph inline con el mismo trazo
function Instagram({ size = 18, strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const DATOS = [
  { icon: Mail, label: 'Email', valor: contacto.email, href: `mailto:${contacto.email}` },
  { icon: Instagram, label: 'Instagram', valor: contacto.instagram, href: contacto.instagramUrl },
  { icon: MessageCircle, label: 'WhatsApp', valor: contacto.whatsapp, href: contacto.whatsappUrl },
  { icon: MapPin, label: 'Ciudad', valor: contacto.ciudad, href: null },
]

export default function Contacto() {
  return (
    <section id="contacto" className="relative border-t border-gold-300/10 bg-bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Hablemos" title="CONTACTO" />

        <div className="mx-auto mt-14 max-w-2xl">
          {/* Botón principal de WhatsApp */}
          <Reveal delay={100}>
            <a
              href={contacto.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="gold-shine group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 px-8 py-4 text-center text-sm font-bold uppercase leading-tight tracking-[0.12em] text-bg shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-hover sm:text-base"
            >
              <MessageCircle
                size={22}
                strokeWidth={2.5}
                className="shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              Escribinos por WhatsApp
            </a>
            <p className="mt-3 text-center text-sm text-soft sm:text-xs">
              Te respondemos por {contacto.whatsapp}
            </p>
          </Reveal>

          {/* Datos de contacto */}
          <ul className="mt-10 space-y-4">
            {DATOS.map(({ icon: Icon, label, valor, href }, i) => (
              <Reveal as="li" key={label} delay={i * 90}>
                <a
                  href={href ?? undefined}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className={`flex items-center gap-4 rounded-2xl border border-gold-300/20 bg-bg-elevated px-5 py-4 transition-colors ${
                    href ? 'hover:border-gold-300/45' : 'cursor-default'
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300/30 text-gold-300">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-soft sm:text-[10px]">
                      {label}
                    </span>
                    <span className="text-base text-ink sm:text-sm">{valor}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
