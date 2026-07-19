/*
 * Server de producción del sitio + API de administración.
 *
 * Reemplaza a `vite preview`: sirve el build de dist/ en el mismo puerto
 * (4173, el que apunta ngrok) y suma una API mínima para el panel /admin:
 *
 *   GET  /api/estado                → estado público (ajuste, viaje, fotos)
 *   POST /api/admin/login           → valida la contraseña
 *   POST /api/admin/estado          → guarda ajusteRecaudado / viajeActivo
 *   POST /api/admin/foto            → sube una foto (JSON con dataURL)
 *   POST /api/admin/foto-eliminar   → borra una foto subida
 *
 * El estado vive en admin-data.json y las fotos subidas en
 * public/fotos/subidas/ (sobreviven a los rebuilds; se sirven directo
 * desde ahí). La contraseña es básica y hardcodeada a pedido: protege de
 * curiosos, no de atacantes.
 *
 * Correr con: npm run serve
 */
import { createReadStream } from 'node:fs'
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, 'dist')
const SUBIDAS_DIR = join(__dirname, 'public', 'fotos', 'subidas')
const DATA_FILE = join(__dirname, 'admin-data.json')

const PUERTO = 4173
const ADMIN_PASS = 'grfc@2026'
const MAX_BODY = 12 * 1024 * 1024 // 12MB: alcanza para una foto de celular

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

const EXT_POR_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// ── Estado persistido ──────────────────────────────────────────────────
const ESTADO_DEFAULT = { ajusteRecaudado: 0, viajeActivo: null, fotos: [] }
let estado = { ...ESTADO_DEFAULT }

async function cargarEstado() {
  try {
    estado = { ...ESTADO_DEFAULT, ...JSON.parse(await readFile(DATA_FILE, 'utf8')) }
  } catch {
    estado = { ...ESTADO_DEFAULT }
  }
}

async function guardarEstado() {
  await writeFile(DATA_FILE, JSON.stringify(estado, null, 2))
}

// ── Helpers HTTP ───────────────────────────────────────────────────────
function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(data))
}

function leerBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0
    const chunks = []
    req.on('data', (c) => {
      total += c.length
      if (total > MAX_BODY) {
        reject(new Error('body demasiado grande'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(new Error('JSON inválido'))
      }
    })
    req.on('error', reject)
  })
}

async function servirArchivo(req, res, filePath) {
  let info
  try {
    info = await stat(filePath)
    if (!info.isFile()) throw new Error('no es archivo')
  } catch {
    return false
  }

  const ext = extname(filePath).toLowerCase()
  const headers = {
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    // Los assets hasheados pueden cachearse para siempre; el resto se revalida
    'Cache-Control': filePath.includes('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  }

  // Soporte de Range: iOS lo exige para reproducir video/audio
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]))
    const end = range[1] && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1
    if (start >= info.size || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${info.size}` })
      res.end()
      return true
    }
    res.writeHead(206, {
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${info.size}`,
      'Content-Length': end - start + 1,
    })
    createReadStream(filePath, { start, end }).pipe(res)
    return true
  }

  res.writeHead(200, { ...headers, 'Content-Length': info.size })
  createReadStream(filePath).pipe(res)
  return true
}

// ── API ────────────────────────────────────────────────────────────────
async function manejarApi(req, res, ruta) {
  if (ruta === '/api/estado' && req.method === 'GET') {
    return json(res, 200, estado)
  }

  if (!ruta.startsWith('/api/admin/') || req.method !== 'POST') {
    return json(res, 404, { error: 'no existe' })
  }

  let body
  try {
    body = await leerBody(req)
  } catch (e) {
    return json(res, 400, { error: e.message })
  }

  if (body.pass !== ADMIN_PASS) {
    return json(res, 401, { error: 'contraseña incorrecta' })
  }

  if (ruta === '/api/admin/login') {
    return json(res, 200, { ok: true })
  }

  if (ruta === '/api/admin/estado') {
    if (Number.isFinite(Number(body.ajusteRecaudado))) {
      estado.ajusteRecaudado = Math.round(Number(body.ajusteRecaudado))
    }
    if (body.viajeActivo === true || body.viajeActivo === false || body.viajeActivo === null) {
      estado.viajeActivo = body.viajeActivo
    }
    await guardarEstado()
    return json(res, 200, estado)
  }

  if (ruta === '/api/admin/foto') {
    const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(body.dataUrl ?? '')
    if (!match) return json(res, 400, { error: 'imagen inválida (jpg, png o webp)' })
    const ext = EXT_POR_MIME[match[1]]
    const nombre = `viaje-${Date.now()}.${ext}`
    await mkdir(SUBIDAS_DIR, { recursive: true })
    await writeFile(join(SUBIDAS_DIR, nombre), Buffer.from(match[2], 'base64'))
    estado.fotos.push({
      src: `/fotos/subidas/${nombre}`,
      alt: String(body.alt || 'Foto del viaje').slice(0, 120),
    })
    await guardarEstado()
    return json(res, 200, estado)
  }

  if (ruta === '/api/admin/foto-eliminar') {
    const src = String(body.src ?? '')
    if (!src.startsWith('/fotos/subidas/') || src.includes('..')) {
      return json(res, 400, { error: 'src inválido' })
    }
    estado.fotos = estado.fotos.filter((f) => f.src !== src)
    await guardarEstado()
    await unlink(join(__dirname, 'public', normalize(src))).catch(() => {})
    return json(res, 200, estado)
  }

  return json(res, 404, { error: 'no existe' })
}

// ── Server ─────────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname)

  try {
    if (ruta.startsWith('/api/')) return await manejarApi(req, res, ruta)

    if (ruta.includes('..')) {
      res.writeHead(400)
      return res.end()
    }

    // Fotos subidas por el admin: se sirven desde public/ (fuente viva)
    if (ruta.startsWith('/fotos/subidas/')) {
      if (await servirArchivo(req, res, join(__dirname, 'public', normalize(ruta)))) return
    }

    if (ruta !== '/' && (await servirArchivo(req, res, join(DIST, normalize(ruta))))) return

    // SPA fallback: cualquier otra ruta (incluida /admin) sirve el index
    await servirArchivo(req, res, join(DIST, 'index.html'))
  } catch (e) {
    console.error(e)
    res.writeHead(500)
    res.end('error interno')
  }
})

await cargarEstado()
server.listen(PUERTO, () => {
  console.log(`Sitio + admin en http://localhost:${PUERTO}`)
})
