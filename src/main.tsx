import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

// Remove loading fallback when React mounts
const loadingFallback = document.getElementById('loading-fallback')
if (loadingFallback) {
  loadingFallback.style.display = 'none'
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
