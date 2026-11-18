import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ProLayout } from '@/components/layout/ProLayout'
import { SessionProvider } from '@/hooks/useSession'
import { FavoritesProvider } from '@/hooks/useFavorites'

const page = (load: () => Promise<{ default: React.ComponentType }>) => {
  const C = lazy(load)
  return <C />
}

const router = createBrowserRouter([
  { path: '/connexion', element: page(() => import('@/pages/auth/Connexion')) },
  { path: '/inscription', element: page(() => import('@/pages/auth/Inscription')) },
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: page(() => import('@/pages/public/Home')) },
      { path: 'ecoles', element: page(() => import('@/pages/public/ecole/EcolesHub')) },
      { path: 'favoris', element: page(() => import('@/pages/public/ecole/Favoris')) },
      { path: 'ecoles/formations/:id/preinscription', element: page(() => import('@/pages/public/ecole/Preinscription')) },
      { path: 'ecoles/formations/:id/:tab?', element: page(() => import('@/pages/public/ecole/FormationDetail')) },
      { path: 'ecoles/auto-ecoles', element: page(() => import('@/pages/public/auto-ecole/AutoEcoles')) },
      { path: 'ecoles/auto-ecoles/:id/avis/nouveau', element: page(() => import('@/pages/public/ecole/DonnerAvis')) },
      { path: 'ecoles/auto-ecoles/:id/permis/:code/inscription', element: page(() => import('@/pages/public/auto-ecole/InscriptionAutoEcole')) },
      { path: 'ecoles/auto-ecoles/:id/permis/:code/inscription/modifier/:section', element: page(() => import('@/pages/public/auto-ecole/ModifierInscription')) },
      { path: 'ecoles/auto-ecoles/:id/permis/:code/:tab?', element: page(() => import('@/pages/public/auto-ecole/PermisDetail')) },
      { path: 'ecoles/auto-ecoles/:id/:tab?', element: page(() => import('@/pages/public/auto-ecole/AutoEcoleProfil')) },
      { path: 'ecoles/:type/etablissement/:id/avis/nouveau', element: page(() => import('@/pages/public/ecole/DonnerAvis')) },
      { path: 'ecoles/:type/etablissement/:id/:tab?', element: page(() => import('@/pages/public/ecole/EcoleProfil')) },
      { path: 'ecoles/:type/:tab?', element: page(() => import('@/pages/public/ecole/TypeListing')) },
      { path: 'consultation', element: page(() => import('@/pages/public/HorsPerimetre')) },
      { path: 'emploi', element: page(() => import('@/pages/public/HorsPerimetre')) },
      { path: '*', element: page(() => import('@/pages/public/NotFound')) },
    ],
  },
  {
    path: '/pro/ecole',
    element: <ProLayout />,
    children: [
      { index: true, element: page(() => import('@/pages/pro/Dashboard')) },
      { path: 'profil/:tab?', element: page(() => import('@/pages/pro/Profil')) },
      { path: 'formations', element: page(() => import('@/pages/pro/Formations')) },
      { path: 'formations/nouvelle', element: page(() => import('@/pages/pro/CreerFormation')) },
      { path: 'formations/:id/modifier', element: page(() => import('@/pages/pro/CreerFormation')) },
      { path: 'contenus/actualites/:id', element: page(() => import('@/pages/pro/Publication')) },
      { path: 'contenus/:tab?', element: page(() => import('@/pages/pro/Contenus')) },
      { path: 'statistiques', element: page(() => import('@/pages/pro/Statistiques')) },
      { path: 'parametres/utilisateurs/inviter', element: page(() => import('@/pages/pro/InviterUtilisateur')) },
      { path: 'parametres/:section?', element: page(() => import('@/pages/pro/Parametres')) },
    ],
  },
])

export default function App() {
  return (
    <SessionProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </FavoritesProvider>
    </SessionProvider>
  )
}
