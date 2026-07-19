import { ImageIcon } from 'lucide-react'
import { asset } from '../../config/assets.js'

/*
 * Marco de foto. Si `src` está vacío muestra un placeholder elegante con
 * la descripción, así queda claro qué foto va en cada lugar. Cuando el
 * path esté cargado en src/config/content.js, renderiza la imagen.
 *
 * className controla tamaño y aspecto (ej: "aspect-video", "aspect-[4/3]").
 */
export default function PhotoSlot({ src, alt, className = '' }) {
  if (src) {
    return (
      <figure className={`overflow-hidden rounded-[20px] border border-gold-300/25 shadow-card ${className}`}>
        <img
          src={asset(src)}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
        />
      </figure>
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-gold-300/30 bg-bg-elevated p-6 text-center ${className}`}
      role="img"
      aria-label={`Espacio reservado para foto: ${alt}`}
    >
      <ImageIcon size={28} strokeWidth={1.5} className="text-gold-500" />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-soft sm:text-xs">{alt}</p>
    </div>
  )
}
