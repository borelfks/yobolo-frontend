import { StrictMode, Suspense, lazy } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
// La traduction s'initialise avant le premier affichage.
import '@/i18n'
import { App } from '@/app/App'
import { queryClient } from '@/api/queryClient'
import { startData } from '@/data'
import { ecouterErreursGlobales } from '@/app/erreursGlobales'
import { SessionProvider } from '@/modules/compte/auth/hooks/useSession'
import { FavoritesProvider } from '@/shared/hooks/useFavorites'
import '@/app/styles/globals.css'

// Outils de TanStack Query, en développement seulement (absents du build).
const QueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
  : () => null

const container = document.getElementById('root')

if (!container) {
  throw new Error('Élément racine #root introuvable dans index.html.')
}

// Charge les fausses données (src/data/fausses-donnees, copie du testeur dans son navigateur) en arrière-plan.
ecouterErreursGlobales()
void startData()

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </SessionProvider>
      <Suspense>
        <QueryDevtools />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
)
