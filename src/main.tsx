// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Load the big base stylesheet first
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
