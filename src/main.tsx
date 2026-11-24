import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// La traduction s'initialise avant le premier affichage.
import '@/i18n'
import { App } from '@/app/App'
import { startData } from '@/data'
import { SessionProvider } from '@/features/auth/hooks/useSession'
import { FavoritesProvider } from '@/shared/hooks/useFavorites'
import '@/app/styles/globals.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Élément racine #root introuvable dans index.html.')
}

// Ouvre la base (SQLite dans le navigateur, remplie au premier lancement avec src/data/depart/yibolo.sql) en arrière-plan.
void startData()

createRoot(container).render(
  <StrictMode>
    <SessionProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </SessionProvider>
  </StrictMode>,
)
