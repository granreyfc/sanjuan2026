/*
 * Contenido editable de todas las secciones.
 *
 * ── FOTOS ──────────────────────────────────────────────────────────────
 * 1. Guardá los archivos en  web/public/fotos/  (crear si hace falta).
 * 2. Poné el path acá como  src: '/fotos/nombre.jpg'  y un alt descriptivo.
 * Mientras src esté vacío ('') la página muestra un marco placeholder
 * elegante con la descripción, así se ve dónde va cada foto.
 */

export const elViaje = {
  // Si está en false, la sección muestra un mensaje de "próximamente".
  // Cambiar a true cuando el equipo esté viajando o ya en San Juan para
  // mostrar el itinerario, stats y galería del viaje.
  activo: true,
  // Se muestra cuando la sección está apagada (desde acá o desde /admin)
  mensajeBloqueado: {
    titulo: 'PRÓXIMAMENTE',
    subtitulo: 'El viaje',
    descripcion:
      'Cuando arranque el viaje a San Juan vas a ver acá el itinerario, las estadísticas y las fotos de todo el camino del colectivo.',
    cta: 'Doná kilómetros',
    ctaHref: '#donar',
  },
  intro:
    'Más de 900 kilómetros separan a San Nicolás de San Juan. Este es el plan para llegar al torneo nacional representando a nuestra ciudad.',
  stats: [
    { valor: '983', unidad: 'km', label: 'de ruta' },
    { valor: '5', unidad: 'días', label: 'de torneo' },
    { valor: '14', unidad: '', label: 'jugadores' },
    { valor: '11', unidad: 'DE AGOSTO 2026', label: 'fecha del viaje' },
  ],
  itinerario: [
    {
      titulo: 'Salida desde San Nicolás',
      texto: 'El plantel completo parte en colectivo desde el club.',
    },
    {
      titulo: 'Llegada a San Juan capital',
      texto: 'Acreditación en el torneo e instalación en el alojamiento.',
    },
    {
      titulo: 'A la cancha',
      texto: 'Comienza el sueño: primer partido del nacional.',
    },
  ],
  // Las fotos del viaje se suben desde el panel /admin cuando arranque
  fotos: [],
  // Recuerdo del último torneo nacional que jugó el club
  ultimoViaje: {
    titulo: 'El último nacional',
    subtitulo: 'Así vivimos el viaje a Mendoza, nuestro último torneo nacional.',
    video: {
      src: '/videos/viaje-mendoza.mp4',
      alt: 'Viaje del plantel al torneo nacional de Mendoza',
      // Imagen estática antes del play: escudo sobre fondo negro
      poster: '/fotos/poster-viaje-mendoza.jpg',
    },
  },
}

/*
 * ── MÚSICA ─────────────────────────────────────────────────────────────
 * Reproductor flotante opcional (abajo a la derecha): nunca suena solo,
 * arranca cuando el visitante le da play. Los archivos van en
 * web/public/mp3/ con nombres sin espacios ni tildes.
 */
export const musica = {
  pistas: [
    { src: '/mp3/rescate-quiero-mas-paz.mp3', titulo: 'Quiero más / Paz', artista: 'Rescate' },
  ],
}

export const elClub = {
  historia: [
    'Gran Rey FC nació como un sueño en los años 80, en el corazón del pastor Hugo Weiss de querer afectar la sociedad por medio del deporte, y a personas que quizás de otras formas no se llegaría, de mostrar que IGR es familia, una familia que abraza, apoya, alienta y acompaña en cada situación; dentro y fuera de la cancha.',
    'En el año 2019 ese sueño se hizo realidad y se fundo el club "Gran Rey FC", comenzando a competir en la liga local de futsal, con un plantel de jugadores que buscaba reflejar los valores de IGR y representarnos en cada partido.',
    'Hoy el equipo tiene la oportunidad de representar los valores y pilares de IGR a nivel nacional. Cada aporte nos acerca más a poder afectar la sociedad con un mensaje de esperanza, construyendo un equipo con valores cristianos que pueda competir con clubes de todo el pais.',
  ],
  valores: ['Pertenencia', 'Esfuerzo', 'Humildad', 'Familia'],
  fotoPrincipal: { src: '/fotos/club-hinchada.jpg', alt: 'La hinchada de Gran Rey FC' },
  // Las tres categorías del club, cada una con su foto de grupo
  categorias: {
    titulo: 'Nuestras categorías',
    subtitulo: 'Tres planteles, una misma familia',
    items: [
      { nombre: 'Primera', foto: { src: '/fotos/club-plantel.jpg', alt: 'Plantel de primera de Gran Rey FC' } },
      { nombre: 'Reserva', foto: { src: '/fotos/club-reserva.jpg', alt: 'Plantel de reserva de Gran Rey FC' } },
      { nombre: 'Sub-13', foto: { src: '/fotos/club-inferiores.jpg', alt: 'Plantel sub-13 de Gran Rey FC' } },
    ],
  },
  galeria: [
    { src: '/fotos/club-festejo.jpg', alt: 'Festejo de gol' },
    { src: '/fotos/club-2.jpg', alt: 'El plantel en acción' },
    { src: '/fotos/club-3.jpg', alt: 'Momento del equipo' },
    { src: '/fotos/club-4.jpg', alt: 'La familia Gran Rey' },
    { src: '/fotos/club-5.jpg', alt: 'Gran Rey FC' },
    { src: '/fotos/viaje-plantel.jpg', alt: 'El plantel entrenando' },
  ],
  entrenamientos: {
    titulo: 'A fondo',
    subtitulo: 'Así se entrena el plantel, puro trabajo.',
    videos: [
      { src: '/videos/entrenamiento-1.mp4', alt: 'Entrenamiento del plantel 1' },
      { src: '/videos/entrenamiento-2.mp4', alt: 'Entrenamiento del plantel 2' },
      { src: '/videos/entrenamiento-3.mp4', alt: 'Entrenamiento del plantel 3' },
    ],
  },
  desdeAdentro: {
    titulo: 'GRFC desde adentro',
    subtitulo: 'Una mirada a la familia, el día a día y lo que nos mueve.',
    videoUrl: 'https://youtu.be/ofPRCULNszA',
  },
}

export const donar = {
  cbu: '0070117020000008411695',
  titular: 'ASOCIACION CIVIL GRAN REY DE SAN NICOLAS',
  mercadoPagoLink: '',

  // Métrica de kilómetros: 983 km × $6.500 = la meta de $6.389.500.
  kilometros: {
    total: 983,
    valorPorKm: 6500,
    titulo: 'Doná kilómetros',
    subtitulo: 'Cada aporte nos acerca a San Juan.',
    labelRecorrido: 'km recorridos',
    labelPorRecorrer: 'km por recorrer',
    mensajeCierre: '983 kilómetros nos separan de San Juan. Con tu ayuda, el colectivo avanza.',
  },
  montosSugeridos: [
    { monto: 6500, etiqueta: '1 kilómetro' },
    { monto: 13000, etiqueta: '2 kilómetros' },
    { monto: 32500, etiqueta: '5 kilómetros' },
  ],
  notaTransparencia:
    'Cada peso donado se destina exclusivamente al viaje: transporte, alojamiento, comidas e inscripción.',
}

export const actualizaciones = {
  // Si está en false, la sección muestra un mensaje de "próximamente".
  // Cambiar a true cuando el equipo esté viajando o en San Juan para
  // mostrar las novedades del diario del viaje.
  activo: false,
  mensajeBloqueado: {
    titulo: 'PRÓXIMAMENTE',
    subtitulo: 'Diario del viaje',
    descripcion:
      'Acá podrás ver todas las actualizaciones del plantel cuando estemos en San Juan: fotos, resultados y momentos del nacional.',
    cta: 'Doná kilómetros',
    ctaHref: '#donar',
  },
  items: [
    {
      fecha: '2026-07-10',
      titulo: 'Arrancó la campaña',
      texto:
        'Lanzamos la recaudación para el viaje a San Juan. Compartí la página con quien quieras sumar.',
      foto: { src: '', alt: 'Presentación de la campaña' },
    },
    {
      fecha: '2026-07-05',
      titulo: 'Clasificamos al nacional',
      texto:
        'El equipo cerró una fase regional soñada y sacó el pasaje al torneo nacional de San Juan.',
      foto: { src: '', alt: 'Festejo de la clasificación' },
    },
    {
      fecha: '2026-06-28',
      titulo: 'Nueva fecha de entrenamiento solidario',
      texto:
        'Sumamos un entrenamiento abierto a la comunidad para juntar fondos y compartir con los vecinos.',
      foto: { src: '', alt: 'Entrenamiento abierto' },
    },
  ],
}

export const contacto = {
  // COMPLETAR con los datos reales
  email: 'granreyfc@gmail.com',
  instagram: '@granreyfutbolclub',
  instagramUrl: 'https://www.instagram.com/granreyfutbolclub/',
  whatsapp: '+54 9 3364 56-0519',
  whatsappUrl: 'https://wa.me/5493364560519',
  ciudad: 'San Nicolás de los Arroyos, Buenos Aires',
}
