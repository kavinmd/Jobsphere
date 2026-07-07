import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f1030',
              color: '#e2e8f0',
              border: '1px solid rgba(97, 114, 244, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#0f1030' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f1030' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
