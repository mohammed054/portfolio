import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter: GitHub Pages is static hosting with no SPA fallback, so
// BrowserRouter deep links like /portfolio/about return 404 (blank page).
// Hash URLs (/#/about) always serve index.html and work everywhere.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
