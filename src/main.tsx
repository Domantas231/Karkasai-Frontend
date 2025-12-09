import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global styles
import './index.css'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'

// PrimeReact theme
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css' 
import 'primereact/resources/primereact.min.css' 

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)