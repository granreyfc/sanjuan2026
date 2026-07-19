/*
 * Colectivo vintage en SVG inline, dibujado mirando hacia la izquierda
 * (el viaje va de San Nicolás hacia San Juan, es decir, de derecha a
 * izquierda en el mapa). Está centrado en (0,0) para que MapRoute pueda
 * posicionarlo y rotarlo con un solo transform.
 *
 * La carrocería rebota con .bus-bob mientras la sombra y las ruedas
 * quedan fijas al camino: se lee como la suspensión de un micro andando.
 *
 * Ocupa ~150×64 unidades del viewBox del mapa. Si más adelante hay un
 * asset ilustrado del colectivo, este componente se reemplaza por un
 * <image> manteniendo la misma caja.
 */
export default function BusIcon() {
  return (
    <g>
      {/* sombra bajo el colectivo (fija: la carrocería rebota sobre ella) */}
      <ellipse cx="0" cy="32" rx="70" ry="9" fill="#000" opacity="0.5" />

      {/* carrocería y detalles: todo lo que rebota con la suspensión */}
      <g className="bus-bob">
        {/* carrocería */}
        <rect x="-72" y="-26" width="144" height="50" rx="12" fill="#101010" stroke="#d4af37" strokeWidth="3" />
        {/* trompa redondeada */}
        <path d="M -72 -6 Q -82 -4 -82 6 L -82 14 Q -82 22 -72 22 Z" fill="#101010" stroke="#d4af37" strokeWidth="3" />
        {/* techo */}
        <rect x="-64" y="-32" width="128" height="10" rx="5" fill="#d4af37" />

        {/* franja lateral dorada */}
        <rect x="-72" y="2" width="144" height="5" fill="#9a7223" />

        {/* ventanillas */}
        {[-58, -32, -6, 20, 46].map((x) => (
          <rect key={x} x={x} y="-19" width="18" height="14" rx="3" fill="#f6e7a1" opacity="0.9" />
        ))}
        {/* parabrisas */}
        <rect x="-80" y="-2" width="9" height="12" rx="3" fill="#f6e7a1" opacity="0.9" />

        {/* faro delantero: titila mientras el colectivo avanza */}
        <circle cx="-78" cy="14" r="3.5" fill="#fff7d6" className="headlight-glow" />
      </g>

      {/* ruedas fijas al camino */}
      {[-42, 44].map((x) => (
        <g key={x}>
          <circle cx={x} cy="26" r="12" fill="#080808" stroke="#d4af37" strokeWidth="3" />
          <circle cx={x} cy="26" r="4" fill="#d4af37" />
        </g>
      ))}
    </g>
  )
}
