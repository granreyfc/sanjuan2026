import { useEffect, useState } from 'react'
import { Camera, Check, LogOut, Lock, RefreshCw, Trash2 } from 'lucide-react'
import escudo from '../../assets/escudo.png'
import { FALLBACK, formatArs } from '../../config/campaign.js'
import { donar, elViaje } from '../../config/content.js'

/*
 * Panel /admin: contraseña básica (se valida en el server, nunca viaja
 * en el bundle), ajuste de lo recaudado, visibilidad de la sección
 * El Viaje y subida de fotos del viaje. Todo persiste en el server
 * (admin-data.json + public/fotos/subidas/).
 */

async function llamarAdmin(ruta, datos) {
  const pass = sessionStorage.getItem('grfc-admin-pass') ?? ''
  const res = await fetch(`/api/admin/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pass, ...datos }),
  })
  if (res.status === 401) throw new Error('pass')
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'error del server')
  return res.json()
}

function Card({ titulo, children }) {
  return (
    <section className="rounded-[20px] border border-gold-300/25 bg-bg-elevated p-6 shadow-card">
      <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

const inputClase =
  'w-full rounded-xl border border-gold-300/25 bg-bg px-4 py-3 font-slab text-base text-ink outline-none transition-colors focus:border-gold-300/60'

const botonOro =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 px-6 text-sm font-bold uppercase tracking-[0.12em] text-bg shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-hover disabled:opacity-50 disabled:hover:translate-y-0'

export default function AdminPanel() {
  const [logueado, setLogueado] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [errorPass, setErrorPass] = useState(false)

  const [estado, setEstado] = useState(null)
  const [ajusteInput, setAjusteInput] = useState('0')
  const [altInput, setAltInput] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [ocupado, setOcupado] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)

  const salir = () => {
    sessionStorage.removeItem('grfc-admin-pass')
    setLogueado(false)
    setEstado(null)
  }

  const cargarEstado = () =>
    fetch('/api/estado', { cache: 'no-store' })
      .then((r) => r.json())
      .then((e) => {
        setEstado(e)
        setAjusteInput(String(e.ajusteRecaudado))
      })

  // Sesión previa en esta pestaña: probar la pass guardada
  useEffect(() => {
    if (!sessionStorage.getItem('grfc-admin-pass')) return
    llamarAdmin('login')
      .then(() => {
        setLogueado(true)
        return cargarEstado()
      })
      .catch(salir)
  }, [])

  const entrar = async (e) => {
    e.preventDefault()
    sessionStorage.setItem('grfc-admin-pass', passInput)
    try {
      await llamarAdmin('login')
      setLogueado(true)
      setErrorPass(false)
      await cargarEstado()
    } catch {
      salir()
      setErrorPass(true)
    }
  }

  const conAviso = async (fn) => {
    setOcupado(true)
    try {
      const nuevo = await fn()
      setEstado(nuevo)
      setAjusteInput(String(nuevo.ajusteRecaudado))
      setGuardadoOk(true)
      setTimeout(() => setGuardadoOk(false), 2000)
    } catch (err) {
      if (err.message === 'pass') salir()
      else alert(`No se pudo guardar: ${err.message}`)
    } finally {
      setOcupado(false)
    }
  }

  const guardarAjuste = () =>
    conAviso(() => llamarAdmin('estado', { ajusteRecaudado: Number(ajusteInput) || 0 }))

  const toggleViaje = (visible) => conAviso(() => llamarAdmin('estado', { viajeActivo: visible }))

  const subirFoto = () =>
    conAviso(
      () =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () =>
            llamarAdmin('foto', { dataUrl: reader.result, alt: altInput }).then((e) => {
              setArchivo(null)
              setAltInput('')
              resolve(e)
            }, reject)
          reader.onerror = () => reject(new Error('no pude leer el archivo'))
          reader.readAsDataURL(archivo)
        }),
    )

  const eliminarFoto = (src) => {
    if (!confirm('¿Borrar esta foto del sitio?')) return
    conAviso(() => llamarAdmin('foto-eliminar', { src }))
  }

  // ── Puerta de contraseña ─────────────────────────────────────────────
  if (!logueado) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-5">
        <img src={escudo} alt="Escudo Gran Rey FC" className="h-20 w-auto" />
        <h1 className="mt-4 font-display text-2xl font-bold tracking-wide">
          <span className="gold-gradient-text">PANEL DEL CLUB</span>
        </h1>
        <form onSubmit={entrar} className="mt-8 w-full max-w-xs space-y-3">
          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Contraseña"
            aria-label="Contraseña"
            autoFocus
            className={inputClase}
          />
          {errorPass && (
            <p className="text-center text-sm font-semibold text-red-400">
              Contraseña incorrecta
            </p>
          )}
          <button type="submit" className={`${botonOro} w-full`}>
            <Lock size={16} strokeWidth={2.5} />
            Entrar
          </button>
        </form>
      </main>
    )
  }

  if (!estado) return null

  const viajeVisible = estado.viajeActivo ?? elViaje.activo
  const recaudadoBase = FALLBACK.raised
  const recaudadoTotal = Math.max(0, recaudadoBase + (Number(ajusteInput) || 0))
  const kmTotales = Math.min(
    donar.kilometros.total,
    Math.floor(recaudadoTotal / donar.kilometros.valorPorKm),
  )

  // ── Panel ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-bg px-5 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={escudo} alt="" className="h-12 w-auto" />
            <h1 className="font-display text-xl font-bold tracking-wide">
              <span className="gold-gradient-text">PANEL DEL CLUB</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {guardadoOk && (
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-200">
                <Check size={14} /> Guardado
              </span>
            )}
            <button
              type="button"
              onClick={salir}
              className="flex items-center gap-1.5 rounded-full border border-gold-300/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-soft transition-colors hover:text-gold-100"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </header>

        <Card titulo="Ajuste de lo recaudado">
          <p className="text-sm leading-relaxed text-muted">
            Pesos que se <strong className="text-gold-100">suman o restan</strong> a lo
            recaudado que muestra la página (usá negativo si alguien prometió y no
            transfirió). Base actual: {formatArs(recaudadoBase)}.
          </p>
          <div className="mt-4 flex gap-3">
            <input
              type="number"
              step="500"
              value={ajusteInput}
              onChange={(e) => setAjusteInput(e.target.value)}
              aria-label="Ajuste en pesos"
              className={inputClase}
            />
            <button type="button" onClick={guardarAjuste} disabled={ocupado} className={botonOro}>
              <RefreshCw size={15} strokeWidth={2.5} />
              Guardar
            </button>
          </div>
          <p className="mt-3 text-sm text-muted">
            La página va a mostrar:{' '}
            <strong className="font-slab text-gold-100">{formatArs(recaudadoTotal)}</strong>{' '}
            <span className="text-soft">
              ({kmTotales} de {donar.kilometros.total} km)
            </span>
          </p>
        </Card>

        <Card titulo="Sección El Viaje">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm leading-relaxed text-muted">
              {viajeVisible
                ? 'La sección está visible: itinerario, stats, video y fotos.'
                : 'La sección muestra "Próximamente".'}
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={viajeVisible}
              aria-label="Mostrar la sección El Viaje"
              disabled={ocupado}
              onClick={() => toggleViaje(!viajeVisible)}
              className={`relative h-8 w-14 shrink-0 rounded-full border transition-colors duration-300 ${
                viajeVisible ? 'border-gold-300/60 bg-gold-300/30' : 'border-gold-300/25 bg-bg'
              }`}
            >
              <span
                className={`absolute top-1 h-5.5 w-5.5 rounded-full bg-gradient-to-r from-gold-100 to-gold-400 transition-all duration-300 ${
                  viajeVisible ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </Card>

        <Card titulo="Fotos del viaje">
          <p className="text-sm leading-relaxed text-muted">
            Aparecen en la sección El Viaje, en "Fotos del viaje". JPG, PNG o WebP.
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              aria-label="Elegir foto"
              className="w-full text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-gold-300/15 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-gold-100"
            />
            <input
              type="text"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              placeholder="Descripción corta (ej: Llegando a Mendoza)"
              aria-label="Descripción de la foto"
              className={inputClase}
            />
            <button
              type="button"
              onClick={subirFoto}
              disabled={!archivo || ocupado}
              className={`${botonOro} w-full`}
            >
              <Camera size={16} strokeWidth={2.5} />
              {ocupado ? 'Subiendo…' : 'Subir foto'}
            </button>
          </div>

          {estado.fotos.length > 0 && (
            <ul className="mt-5 grid grid-cols-3 gap-3">
              {estado.fotos.map((foto) => (
                <li key={foto.src} className="group relative">
                  <img
                    src={foto.src}
                    alt={foto.alt}
                    className="aspect-square w-full rounded-xl border border-gold-300/25 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarFoto(foto.src)}
                    aria-label={`Borrar ${foto.alt}`}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-red-300 opacity-90 backdrop-blur-sm transition-colors hover:text-red-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <p className="text-center text-xs text-soft">
          Los cambios se ven al recargar la página principal (o solos, en unos minutos).
        </p>
      </div>
    </main>
  )
}
