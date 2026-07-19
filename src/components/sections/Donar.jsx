import { useEffect, useRef, useState } from 'react'
import { Bus, Check, Copy, CreditCard, MapPin, MessageCircle, Route, X } from 'lucide-react'
import { contacto, donar } from '../../config/content.js'
import { formatArs, progressPct } from '../../config/campaign.js'
import { useAnimatedProgress } from '../../hooks/useAnimatedProgress.js'
import { useCampaign } from '../../hooks/useCampaign.js'
import {
  guardarKmAportados,
  notificarAporte,
  useKmAportados,
} from '../../hooks/useKmAportados.js'
import PhotoSlot from '../ui/PhotoSlot.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

function DatoCopiable({ label, valor }) {
  const [copiado, setCopiado] = useState(false)
  const timer = useRef(null)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiado(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopiado(false), 1800)
    } catch {
      // sin acceso al portapapeles no mostramos una confirmación falsa
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gold-300/20 bg-bg px-5 py-4">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-soft sm:text-[10px]">{label}</p>
        <p className="truncate font-slab text-base text-ink sm:text-sm">{valor}</p>
      </div>
      <button
        type="button"
        onClick={copiar}
        aria-label={`Copiar ${label}`}
        className={`shrink-0 rounded-full border p-2.5 transition-all duration-300 ${
          copiado
            ? 'scale-110 border-gold-300 bg-gold-300/15 text-gold-100'
            : 'border-gold-300/30 text-gold-200 hover:border-gold-300/60 hover:text-gold-100'
        }`}
      >
        {copiado ? <Check size={15} /> : <Copy size={15} />}
        <span aria-live="polite" className="sr-only">
          {copiado ? `${label} copiado al portapapeles` : ''}
        </span>
      </button>
    </div>
  )
}

const ICONS_KM = [MapPin, Route, Bus]

// WhatsApp del club con mensaje pre-armado para adjuntar el comprobante
const linkComprobante = (texto) => `${contacto.whatsappUrl}?text=${encodeURIComponent(texto)}`

/*
 * Modal de confirmación del aporte. Al confirmar: copia el CBU al
 * portapapeles, abre Mercado Pago en otra pestaña (el botón es un <a>
 * real para que ningún navegador bloquee la apertura) y avisa al padre
 * para sumar los kilómetros. Después muestra el estado "gracias" con el
 * CBU visible por si el copiado falló.
 */
function ModalAporte({ seleccion, onCerrar }) {
  const [fase, setFase] = useState('confirmar')
  const [copiado, setCopiado] = useState(false)

  // onCerrar recibe si el aporte quedó confirmado: al volver de un aporte
  // confirmado, Donar lleva al mapa y dispara la animación del colectivo
  const cerrar = () => onCerrar(fase === 'gracias')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const confirmar = () => {
    // El copiado va primero y sincrónico: cuando la pestaña nueva tome
    // el foco, el portapapeles de esta página deja de estar accesible
    navigator.clipboard
      .writeText(donar.cbu)
      .then(() => setCopiado(true))
      .catch(() => setCopiado(false))
    // Se persiste ya mismo (por si no vuelve de Mercado Pago); la UI
    // se entera al cerrar, para animar el mapa con el visitante mirando
    guardarKmAportados(seleccion.kms)
    setFase('gracias')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar aporte"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={cerrar}
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
      />
      <div className="menu-drop relative w-full max-w-md rounded-[24px] border border-gold-300/30 bg-bg-elevated p-7 text-center shadow-card sm:p-9">
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-soft transition-colors hover:text-gold-100"
        >
          <X size={18} />
        </button>

        {fase === 'confirmar' ? (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/35 bg-bg text-gold-300">
              <Bus size={26} strokeWidth={1.8} />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">
              Vas a aportar
            </p>
            <p className="mt-2 font-slab text-4xl font-bold text-gold-100">
              {seleccion.kms} km
              <span className="ml-2 text-xl text-soft">· {formatArs(seleccion.monto)}</span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-sm">
              Al confirmar copiamos el <strong className="text-gold-100">CBU</strong> a tu
              portapapeles y te llevamos a Mercado Pago para hacer la transferencia. Después
              mandanos el <strong className="text-gold-100">comprobante por WhatsApp</strong>{' '}
              y tus kilómetros se suman al recorrido del colectivo.
            </p>
            <a
              href={donar.mercadoPagoLink || 'https://www.mercadopago.com.ar'}
              target="_blank"
              rel="noreferrer"
              onClick={confirmar}
              className="gold-shine mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 px-6 text-sm font-bold uppercase tracking-[0.12em] text-bg shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-hover"
            >
              Confirmar e ir a Mercado Pago
            </a>
            <button
              type="button"
              onClick={cerrar}
              className="mt-3 w-full py-2 text-sm font-semibold uppercase tracking-[0.14em] text-soft transition-colors hover:text-gold-100"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/50 bg-gold-300/10 text-gold-200">
              <Check size={28} strokeWidth={2.2} />
            </span>
            <p className="mt-5 font-display text-2xl font-bold tracking-wide text-gold-100">
              ¡Gracias por sumar {seleccion.kms} km!
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted sm:text-sm">
              {copiado
                ? 'El CBU quedó copiado en tu portapapeles.'
                : 'No pudimos copiar el CBU automáticamente, lo tenés acá:'}{' '}
              Completá la transferencia y mandanos el comprobante por WhatsApp.
            </p>
            <p className="mt-4 rounded-2xl border border-gold-300/25 bg-bg px-4 py-3 font-slab text-sm text-gold-100">
              {donar.cbu}
            </p>
            <a
              href={linkComprobante(
                `¡Hola! Acabo de donar ${seleccion.kms} km (${formatArs(seleccion.monto)}) para el viaje a San Juan 🚌⚽ Les mando el comprobante.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="gold-shine mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 px-6 text-sm font-bold uppercase tracking-[0.12em] text-bg shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-hover"
            >
              <MessageCircle size={18} strokeWidth={2.5} />
              Enviar comprobante
            </a>
            <button
              type="button"
              onClick={cerrar}
              className="mt-3 w-full rounded-full border border-gold-300/40 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-gold-100 transition-all duration-200 hover:border-gold-300/70 hover:shadow-gold"
            >
              Listo
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Donar() {
  const { goal, raised } = useCampaign()
  const { total, valorPorKm, titulo, subtitulo, labelRecorrido, labelPorRecorrer, mensajeCierre } =
    donar.kilometros

  const kmAportados = useKmAportados()
  const [seleccion, setSeleccion] = useState(null)

  const cerrarModal = (confirmado) => {
    const kms = seleccion?.kms
    setSeleccion(null)
    if (!confirmado || !kms) return
    // De vuelta del modal: al mapa, a ver el colectivo avanzar con los
    // kilómetros nuevos (+ el festejo en la tarjeta de progreso)
    notificarAporte(kms)
    document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })
  }

  const kmRecorridos = Math.min(total, Math.floor(raised / valorPorKm) + kmAportados)
  const kmPorRecorrer = Math.max(0, total - kmRecorridos)
  const targetPctKm = progressPct({ raised: kmRecorridos, goal: total })
  const progresoKm = useAnimatedProgress(targetPctKm)

  return (
    <section id="donar" className="relative border-t border-gold-300/10 bg-bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Sumá tu aporte" title="DONAR" />

        {/* Kilómetros: el eje narrativo de la donación */}
        <Reveal delay={100} className="mx-auto mt-10 max-w-3xl rounded-[24px] border border-gold-300/20 bg-bg-elevated p-8 text-center shadow-card sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-soft sm:text-[11px]">{subtitulo}</p>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-wide text-gold-100 sm:text-4xl">
            {titulo}
          </h3>

          <div className="mt-6 flex items-end justify-center gap-2">
            <span className="font-slab text-6xl font-bold text-gold-200 sm:text-7xl">
              {kmRecorridos}
            </span>
            <span className="mb-2 text-base font-semibold uppercase tracking-[0.18em] text-soft sm:text-sm">
              / {total} {labelRecorrido}
            </span>
          </div>

          <div
            className="mt-6 h-5 overflow-hidden rounded-full border border-gold-300/20 bg-[#1a1a1a] sm:h-4"
            role="progressbar"
            aria-valuenow={Math.round(progresoKm)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje del viaje cubierto por donaciones"
          >
            <div
              className="bar-shimmer h-full rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500"
              style={{ width: `${progresoKm}%` }}
            >
              {/* Con la barra muy corta el número no entra: se oculta */}
              {progresoKm >= 12 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wider text-bg sm:text-[10px]">
                  {Math.round(progresoKm)}%
                </span>
              )}
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-sm">
            {mensajeCierre} Faltan <strong className="text-gold-100">{kmPorRecorrer} km</strong>.
          </p>

          {kmAportados > 0 && (
            <p className="mt-3 text-sm font-semibold text-gold-200">
              Desde este dispositivo ya sumaste{' '}
              <span className="font-slab">{kmAportados} km</span>. ¡Gracias por empujar el
              colectivo!
            </p>
          )}
        </Reveal>

        {/* Montos sugeridos: ahora cada tarjeta = kilómetros concretos */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {donar.montosSugeridos.map((item, i) => {
            const Icon = ICONS_KM[i % ICONS_KM.length]
            const kms = Math.round(item.monto / valorPorKm)
            return (
              <Reveal key={item.monto} delay={i * 100}>
                <button
                  type="button"
                  onClick={() => setSeleccion({ monto: item.monto, kms })}
                  className="group flex h-full w-full cursor-pointer flex-col items-center rounded-[20px] border border-gold-300/20 bg-bg-elevated p-6 text-center shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-gold-300/45 hover:shadow-gold sm:p-8"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/30 bg-bg text-gold-300 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <p className="mt-4 font-slab text-3xl font-bold text-gold-100">
                    {kms} <span className="text-lg text-gold-400">km</span>
                  </p>
                  <p className="mt-1 font-slab text-xl font-semibold text-soft">
                    {formatArs(item.monto)}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-soft sm:text-[11px]">
                    {item.etiqueta ?? 'Aporte sugerido'}
                  </p>
                </button>
              </Reveal>
            )
          })}
        </div>

        <Reveal as="p" delay={100} className="mx-auto mt-10 max-w-2xl text-center leading-relaxed text-muted">
          {donar.notaTransparencia}
        </Reveal>

        {/* Datos de transferencia + QR */}
        <div id="datos-bancarios" className="mx-auto mt-12 grid max-w-3xl grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_240px]">
          <Reveal className="space-y-3 rounded-[20px] border border-gold-300/25 bg-[rgba(18,18,18,0.9)] p-6 shadow-card">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted sm:text-[11px]">
              <CreditCard size={15} className="text-gold-300" />
              Transferencia bancaria
            </p>
            <DatoCopiable label="Alias" valor={donar.alias} />
            <DatoCopiable label="CBU" valor={donar.cbu} />
            <DatoCopiable label="Razón social" valor={donar.titular} />
            {/* Para quien transfiere por su cuenta, sin pasar por el modal */}
            <a
              href={linkComprobante(
                '¡Hola! Ya hice mi aporte para el viaje a San Juan 🚌⚽ Les mando el comprobante.',
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gold-300/40 text-sm font-semibold uppercase tracking-[0.14em] text-gold-100 transition-all duration-200 hover:border-gold-300/70 hover:shadow-gold"
            >
              <MessageCircle size={16} strokeWidth={2.2} />
              Enviar comprobante
            </a>
            {donar.mercadoPagoLink && (
              <a
                href={donar.mercadoPagoLink}
                target="_blank"
                rel="noreferrer"
                className="gold-shine mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 text-sm font-bold uppercase tracking-[0.14em] text-bg transition-all hover:-translate-y-0.5 hover:shadow-gold-hover"
              >
                Donar por Mercado Pago
              </a>
            )}
          </Reveal>

          <Reveal delay={150}>
            <PhotoSlot {...donar.qr} className="aspect-square" />
          </Reveal>
        </div>
      </div>
      {seleccion && <ModalAporte seleccion={seleccion} onCerrar={cerrarModal} />}
    </section>
  )
}
