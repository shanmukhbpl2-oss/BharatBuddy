import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BharatBuddy from './BharatBuddy.jsx'

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.overflow = 'hidden'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=5')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.log('SW registration failed:', err))
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BharatBuddy />
  </StrictMode>,
)
