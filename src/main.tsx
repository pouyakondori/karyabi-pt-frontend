import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { GDPRProvider } from './contexts/GDPRContext'
import { locale, t } from './lib/i18n'
import './index.css'

document.documentElement.lang = 'fa'
document.documentElement.dir = 'rtl'
document.title = t('app.title', locale)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GDPRProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GDPRProvider>
    </BrowserRouter>
  </React.StrictMode>
)
