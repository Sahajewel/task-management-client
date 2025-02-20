import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import AuthProvider from './Routes/AuthProvider.jsx'
import MainApp from './Routes/MainApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
   <MainApp></MainApp>
   </AuthProvider>
  </StrictMode>,
)
