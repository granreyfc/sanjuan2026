import AdminPanel from './components/admin/AdminPanel.jsx'
import Navbar from './components/Navbar.jsx'
import MusicPlayer from './components/ui/MusicPlayer.jsx'
import Hero from './components/hero/Hero.jsx'
import ElViaje from './components/sections/ElViaje.jsx'
import ElClub from './components/sections/ElClub.jsx'
import Donar from './components/sections/Donar.jsx'
import Actualizaciones from './components/sections/Actualizaciones.jsx'
import Contacto from './components/sections/Contacto.jsx'
import Footer from './components/sections/Footer.jsx'

function App() {
  // Ruta /admin: panel del club (sin router; una sola página especial)
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminPanel />
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ElClub />
        <ElViaje />
        <Donar />
        <Actualizaciones />
        <Contacto />
      </main>
      <Footer />
      <MusicPlayer />
    </>
  )
}

export default App
