import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Bunu içe aktar
import App from './App.jsx'
import './assets/styles/global.css' // CSS yolunun doğru olduğundan emin ol

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App bileşenini BrowserRouter ile sarmala */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)