import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Providers } from './providers.tsx';
import '@/styles/globals.css'

const root = document.getElementById('root');

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
)
