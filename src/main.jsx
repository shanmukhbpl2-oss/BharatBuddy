import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BharatBuddy from './BharatBuddy.jsx'

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.overflow = 'hidden'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BharatBuddy />
  </StrictMode>,
)
