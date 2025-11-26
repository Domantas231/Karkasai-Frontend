import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'

import 'bootstrap/dist/css/bootstrap.css'

import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css' 
import 'primereact/resources/primereact.min.css' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
