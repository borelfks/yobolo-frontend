import { ArgumentsSection } from '@/modules/landing/components/ArgumentsSection'
import { HeroSection } from '@/modules/landing/components/HeroSection'
import { ServicesSection } from '@/modules/landing/components/ServicesSection'

/**
 * L'accueil, copié de yibolo-client : le héro et sa recherche, les cinq
 * services, les quatre arguments ; la phrase de fin vit dans le pied de page
 * (cadre LandingLayout).
 */
export function Home() {
  return (
    <>
      <HeroSection />
      <div className="mt-12 space-y-14 px-3 pb-14 sm:mt-14 sm:space-y-16">
        <ServicesSection />
        <ArgumentsSection />
      </div>
    </>
  )
}
