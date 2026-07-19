import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index-premium.css'
import App from './App.jsx'
import { iniciarAutoUpdate } from './autoUpdate.js'

iniciarAutoUpdate()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
