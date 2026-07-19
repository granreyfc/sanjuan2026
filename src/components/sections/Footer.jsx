import escudo from '../../assets/escudo.png'

export default function Footer() {
  return (
    <footer className="border-t border-gold-300/15 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 text-center">
        <img src={escudo} alt="Escudo Gran Rey FC" className="h-16 w-auto" />
        <p className="font-brand text-sm font-bold tracking-[0.24em] text-gold-100">
          GRAN REY FC
        </p>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-soft sm:text-xs">
          Un equipo <span className="text-gold-300">★</span> Una familia{' '}
          <span className="text-gold-300">★</span> Un objetivo
        </p>
        <p className="text-sm text-soft sm:text-xs">
          © {new Date().getFullYear()} Gran Rey FC — San Nicolás de los Arroyos
        </p>
      </div>
    </footer>
  )
}
