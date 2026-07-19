import { useLayoutEffect, useRef, useState } from 'react'
import mapaArg from '../../assets/mapa-arg.png'
import BusIcon from './BusIcon.jsx'

/*
 * El mapa y la ruta comparten un único sistema de coordenadas: el viewBox
 * del SVG coincide con los píxeles de mapa-arg.png (946×1663), así que las
 * coordenadas de abajo se leen directamente sobre la imagen y escalan solas
 * en cualquier tamaño de pantalla.
 *
 * ── AJUSTAR A OJO ──────────────────────────────────────────────────────
 * Si los pines no caen exactamente sobre las ciudades, corregí estos
 * puntos (y los puntos de control de ROUTE_D para la curva de la ruta).
 */
const MAP = { w: 946, h: 1663 }
const CROP_H = 1200 // el hero muestra el mapa hasta esta altura (norte + centro)

const SAN_NICOLAS = { x: 618, y: 540 }
const SAN_JUAN = { x: 248, y: 462 }

// Curva en zig-zag suave San Nicolás → punto intermedio → San Juan
const ROUTE_D = `M ${SAN_NICOLAS.x} ${SAN_NICOLAS.y}
                 C 560 620, 500 600, 470 520
                 S 380 420, ${SAN_JUAN.x} ${SAN_JUAN.y}`

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

function Pin({ x, y, pulse = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Anillo que late sobre el destino: marca la meta del viaje */}
      {pulse && (
        <circle
          cx="0"
          cy="-39"
          r="26"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2.5"
          className="pin-pulse"
        />
      )}
      <ellipse cx="0" cy="4" rx="14" ry="5" fill="#000" opacity="0.55" />
      <path
        d="M0 0 C -13 -18 -21 -25 -21 -39 A 21 21 0 1 1 21 -39 C 21 -25 13 -18 0 0 Z"
        fill="#101010"
        stroke="#d4af37"
        strokeWidth="3"
      />
      <circle cx="0" cy="-38" r="7.5" fill="#f6e7a1" />
    </g>
  )
}

/*
 * Etiquetas de ciudad en HTML superpuesto al mapa (no dentro del SVG):
 * así NO escalan con el mapa y se mantienen legibles en celular, donde
 * el texto SVG quedaba de ~7px. x/y van en % del viewBox del mapa.
 */
function Label({ x, y, lines, className = '' }) {
  return (
    <div
      className={`absolute left-[var(--lx)] top-[var(--ly)] rounded-lg border border-gold-300/45 bg-[#0a0a0a]/95 px-3 py-1.5 shadow-card ${className}`}
      style={{ '--lx': `${x}%`, '--ly': `${y}%` }}
    >
      <p className="whitespace-nowrap font-slab text-xs font-bold tracking-[0.12em] text-gold-100 sm:text-sm">
        {lines[0]}
      </p>
      {lines[1] && (
        <p className="whitespace-nowrap font-slab text-[11px] tracking-[0.14em] text-muted sm:text-xs">
          {lines[1]}
        </p>
      )}
    </div>
  )
}

/*
 * progress: porcentaje animado (0–100). El colectivo, el tramo iluminado
 * de la ruta y la tarjeta de progreso comparten este valor.
 */
export default function MapRoute({ progress }) {
  const pathRef = useRef(null)
  const [totalLength, setTotalLength] = useState(0)

  useLayoutEffect(() => {
    setTotalLength(pathRef.current.getTotalLength())
  }, [])

  // Posición y orientación del colectivo sobre la ruta
  let bus = null
  if (pathRef.current && totalLength > 0) {
    const traveled = (progress / 100) * totalLength
    const point = pathRef.current.getPointAtLength(traveled)
    const before = pathRef.current.getPointAtLength(Math.max(0, traveled - 2))
    const after = pathRef.current.getPointAtLength(Math.min(totalLength, traveled + 2))

    // El colectivo está dibujado mirando a la izquierda (sentido del viaje),
    // por eso se corrige el ángulo con -180 y se acota para que nunca quede
    // en una inclinación exagerada.
    let angle = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI - 180
    if (angle < -180) angle += 360
    angle = clamp(angle, -18, 18)

    bus = { x: point.x, y: point.y, angle, traveled }
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${MAP.w} ${CROP_H}`}
        className="w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        role="img"
        aria-label={`Mapa de Argentina con la ruta del viaje de San Nicolás a San Juan, recorrida al ${Math.round(progress)}%`}
      >
        <defs>
          {/* Máscara que revela la ruta iluminada solo hasta el punto recorrido */}
          <mask id="traveled-mask">
            <path
              d={ROUTE_D}
              fill="none"
              stroke="#fff"
              strokeWidth="34"
              strokeDasharray={bus ? `${bus.traveled} ${totalLength}` : `0 1`}
            />
          </mask>
          {/* Máscara que "dibuja" la ruta punteada al cargar la página:
              el trazo se revela de San Nicolás hacia San Juan */}
          <mask id="draw-mask">
            <path
              d={ROUTE_D}
              fill="none"
              stroke="#fff"
              strokeWidth="40"
              strokeLinecap="round"
              style={{
                '--route-len': totalLength || 2000,
                strokeDasharray: totalLength || 2000,
                strokeDashoffset: totalLength || 2000,
                animation: 'route-draw 2s cubic-bezier(0.45, 0, 0.2, 1) 0.25s both',
              }}
            />
          </mask>
          <linearGradient id="map-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#080808" stopOpacity="0" />
            <stop offset="1" stopColor="#080808" stopOpacity="1" />
          </linearGradient>
        </defs>

        <image href={mapaArg} x="0" y="0" width={MAP.w} height={MAP.h} />

        {/* La ruta es tinta oscura punteada, como los pines y el colectivo:
            sobre el mapa pergamino dorado el trazo claro no contrasta.
            Los tres paths comparten dasharray "1 24" y el mismo route-flow
            (período/fase), así los puntos quedan siempre alineados. */}

        {/* Se dibuja al cargar (draw-mask) y sus puntos fluyen a San Juan */}
        <g mask="url(#draw-mask)">
          {/* Halo claro bajo los puntos: los mantiene visibles cuando la
              ruta cruza las montañas oscuras del oeste */}
          <path
            d={ROUTE_D}
            fill="none"
            stroke="#fff7d6"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="1 24"
            opacity="0.45"
            style={{ animation: 'route-flow 2.5s linear infinite' }}
          />

          {/* Guía punteada tenue: titila marcando el camino que falta */}
          <path
            ref={pathRef}
            d={ROUTE_D}
            fill="none"
            stroke="#101010"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeDasharray="1 24"
            opacity="0.75"
            style={{
              animation:
                'route-flow 2.5s linear infinite, route-pulse 3.2s ease-in-out infinite',
            }}
          />
        </g>

        {/* Tramo recorrido: puntos "entintados" a fondo con glow dorado
            (el drop-shadow viene de .route-flow) que avanzan con el micro */}
        <path
          d={ROUTE_D}
          fill="none"
          stroke="#101010"
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeDasharray="1 24"
          className="route-flow"
          mask="url(#traveled-mask)"
        />

        <Pin x={SAN_NICOLAS.x} y={SAN_NICOLAS.y} />
        <Pin x={SAN_JUAN.x} y={SAN_JUAN.y} pulse />

        {bus && (
          <g transform={`translate(${bus.x} ${bus.y - 30}) rotate(${bus.angle})`}>
            <BusIcon />
          </g>
        )}

        {/* Fundido del borde inferior del mapa hacia el fondo */}
        <rect x="0" y={CROP_H - 180} width={MAP.w} height="182" fill="url(#map-fade)" />
      </svg>

      {/* Capa de etiquetas HTML: los nombres ya están en el aria-label del svg */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* En pantallas chicas la caja no entra a la derecha del pin:
            se ancla al borde y baja apenas debajo del pin */}
        <Label
          x={((SAN_NICOLAS.x + 28) / MAP.w) * 100}
          y={((SAN_NICOLAS.y - 18) / CROP_H) * 100}
          lines={['SAN NICOLÁS', 'BUENOS AIRES']}
          className="max-sm:left-auto max-sm:right-1 max-sm:top-[46%]"
        />
        <Label
          x={((SAN_JUAN.x - 175) / MAP.w) * 100}
          y={((SAN_JUAN.y + 22) / CROP_H) * 100}
          lines={['SAN JUAN']}
        />
      </div>
    </div>
  )
}
