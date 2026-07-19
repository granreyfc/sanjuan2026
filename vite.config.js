import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio bajo https://granreyfc.github.io/sanjuan2026/
  base: '/sanjuan2026/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
    // El navegador siempre revalida antes de usar su caché: el index.html
    // nuevo se ve al toque (los assets hasheados devuelven 304 baratos)
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
})
