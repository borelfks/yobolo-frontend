import { SectionBadges, SectionBoutons, SectionChamps, SectionCouleurs, SectionTexte } from '@/modules/design-system/components/SectionsBase'
import { SectionFormulaires } from '@/modules/design-system/components/SectionsFormulaires'
import { SectionChargement, SectionDonnees, SectionEtats, SectionGraphiques, SectionNavigation, SectionSurfaces } from '@/modules/design-system/components/SectionsBlocs'

const SOMMAIRE = [
  ['couleurs', 'Couleurs'],
  ['texte', 'Texte'],
  ['boutons', 'Boutons'],
  ['badges', 'Badges et puces'],
  ['champs', 'Champs'],
  ['formulaires', 'Marque et formulaires'],
  ['navigation', 'Navigation'],
  ['surfaces', 'Menus et fenêtres'],
  ['donnees', 'Tableau'],
  ['graphiques', 'Graphiques'],
  ['chargement', 'Chargement'],
  ['etats', 'États et erreurs'],
] as const

/**
 * DESIGN SYSTEM (développement seulement, /design-system) : tous les
 * composants de src/shared/shadcn et src/shared/blocs, avec leurs variantes et
 * leurs états, pour vérifier qu'ils sont identiques au canevas. Absent du site
 * publié : ses textes de démonstration ne passent donc pas par la traduction.
 */
export function DesignSystem() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-page flex-col gap-1 px-4 py-6">
          <p className="text-xs font-bold tracking-[0.06em] text-subtle-foreground uppercase">YIBOLO</p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.01em] text-foreground">Design system</h1>
          <p className="text-sm text-muted-foreground">Les composants du canevas, construits sur shadcn/ui. Front et admin partagent les mêmes.</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-page gap-6 px-4 py-6 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Sommaire" className="lg:sticky lg:top-6 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {SOMMAIRE.map(([id, nom]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-sm px-3 py-2 text-sm font-semibold text-foreground-soft no-underline hover:bg-accent hover:text-primary">
                  {nom}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex min-w-0 flex-col gap-6">
          <SectionCouleurs />
          <SectionTexte />
          <SectionBoutons />
          <SectionBadges />
          <SectionChamps />
          <SectionFormulaires />
          <SectionNavigation />
          <SectionSurfaces />
          <SectionDonnees />
          <SectionGraphiques />
          <SectionChargement />
          <SectionEtats />
        </main>
      </div>
    </div>
  )
}
