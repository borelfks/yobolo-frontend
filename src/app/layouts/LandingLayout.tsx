import { ScrollRestoration } from 'react-router'
import { LandingFooter } from '@/app/layouts/LandingFooter'
import { LandingHeader } from '@/app/layouts/LandingHeader'
import { RouteOutlet } from '@/app/routes/RouteOutlet'

/**
 * Le cadre de la landing, copié du PublicLayout de yibolo-client : l'en-tête
 * flotte au-dessus de la photo du héro, chaque section porte sa propre
 * largeur, le pied de page porte la phrase de fin. `.theme-client` applique
 * le style de yibolo-client (police Geist, espacement de 0,3 rem, couleurs).
 */
export function LandingLayout() {
  return (
    <div className="theme-client flex min-h-screen flex-col">
      <ScrollRestoration />
      <LandingHeader flottante />
      <main className="flex-1">
        <RouteOutlet />
      </main>
      <LandingFooter />
    </div>
  )
}
