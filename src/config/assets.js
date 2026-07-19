/*
 * Prefija las rutas de public/ con el base del deploy.
 * En GitHub Pages el sitio vive bajo /sanjuan2026/, así que un src
 * "/fotos/x.jpg" tiene que volverse "/sanjuan2026/fotos/x.jpg".
 * En local (base "/") devuelve la ruta tal cual.
 */
export const asset = (path) => import.meta.env.BASE_URL + String(path).replace(/^\//, '')
