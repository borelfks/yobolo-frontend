import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { RouteOutlet } from '@/app/routes/RouteOutlet'
import { noterPage } from '@/shared/utils/mesures'
import { Entete } from './Entete'
import { PiedDePage } from './PiedDePage'

/** Le cadre des pages publiques et des comptes : barre du haut, page, pied de page (canevas). */
export function PublicLayout() {
  // La page affichée : une fiche ouverte ensuite saura d'où vient le visiteur (statistiques).
  const { pathname, search } = useLocation()
  useEffect(() => noterPage(pathname + search), [pathname, search])
  return (
    <div className="app-cadre flex min-h-dvh flex-col bg-background">
      <Entete />
      <main className="flex-1">
        <RouteOutlet />
      </main>
      <PiedDePage />
    </div>
  )
}
