import { useEffect, useRef, useState } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import escudo from '../assets/escudo.png'

const LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'El Club', href: '#el-club' },
  { label: 'El Viaje', href: '#el-viaje' },
  { label: 'Donar', href: '#donar' },
  { label: 'Actualizaciones', href: '#actualizaciones' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      // La barra de progreso se actualiza directo en el DOM para no
      // re-renderizar el navbar en cada frame de scroll
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-gold-300/25 bg-bg/95 shadow-[0_10px_40px_rgba(0,0,0,0.45)]'
          : 'border-gold-300/15 bg-bg/80'
      }`}
    >
      <nav className="mx-auto flex h-[88px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <a href="#inicio" className="flex shrink-0 items-center gap-3">
          <img src={escudo} alt="Escudo Gran Rey FC" className="h-14 w-auto drop-shadow-[0_0_18px_rgba(212,175,55,0.25)]" />
          <span className="hidden font-brand text-lg font-bold tracking-[0.2em] text-gold-100 sm:block">
            GRAN REY FC
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="relative text-[13px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold-300 after:transition-transform after:duration-300 hover:text-gold-100 hover:after:scale-x-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#donar"
            className="hidden items-center gap-2 rounded-full border border-gold-300/40 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-300/70 hover:shadow-gold sm:flex"
          >
            <Heart size={16} strokeWidth={2} className="heart-beat" />
            Donar
          </a>
          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-gold-300/25 p-2.5 text-gold-100 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Progreso de lectura de la página */}
      <span
        ref={barRef}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-100"
        aria-hidden="true"
      />

      {open && (
        <ul className="menu-drop border-t border-gold-300/15 bg-bg-elevated px-5 py-4 lg:hidden">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-gold-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
