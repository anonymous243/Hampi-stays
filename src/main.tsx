import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SystemProvider } from './context/SystemContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "389686748462-nh36uj8ht8go4unb9607sclhgl1plb7r.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SystemProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </SystemProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
