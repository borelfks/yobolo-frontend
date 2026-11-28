import { useState } from 'react'
import { Navigate, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { RouteOutlet } from '@/app/routes/RouteOutlet'
import { PageSpinner } from '@/shared/blocs/Chargement'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Button } from '@/shared/shadcn/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/shadcn/sheet'
import { ROUTES } from '@/shared/utils/routes'
import { Entete } from './Entete'
import { MenuPro } from './MenuPro'
import { proNav } from './navConfig'
import { PiedDePage } from './PiedDePage'

/**
 * Le cadre de l'espace professionnel (canevas « Espace professionnel ») : la
 * barre du haut (univers « École » actif), le menu de l'établissement dans une
 * carte de 240 px à gauche, la page à droite, puis le pied de page. Sur
 * téléphone, un bouton « Menu de l'espace pro » ouvre le menu en tiroir.
 * Un compte = un espace : seul un compte école entre ici.
 */
export function ProLayout() {
  const { t } = useTranslation('layout')
  const { account, pret, compteId } = useSession()
  const { pathname } = useLocation()
  const [ouvert, setOuvert] = useState(false)
  // Un compte gardé dans le navigateur : on attend la base pour savoir s'il peut entrer.
  if (compteId && !pret) return <PageSpinner />
  if (!account?.ecoleId) return <Navigate to={ROUTES.signInSchool} replace />
  // La rubrique ouverte, rappelée à droite du bouton du menu (téléphone).
  const rubrique = [...proNav].reverse().find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to))) ?? proNav[0]!
  return (
    <div className="app-cadre flex min-h-dvh flex-col bg-background">
      <Entete />
      <div className="mx-auto flex w-full max-w-pro flex-1 flex-col gap-2 pb-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:px-4 lg:pt-6 lg:pb-10">
        {/* Ordinateur : le menu dans une carte, qui reste visible au défilement. */}
        <aside className="sticky top-[84px] hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
          <MenuPro />
        </aside>
        {/* Téléphone : le bouton du menu, puis le tiroir. */}
        <Sheet open={ouvert} onOpenChange={setOuvert}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="h-[52px] w-full justify-start gap-2.5 rounded-none border-b border-border bg-card px-4 text-ui text-foreground hover:bg-card lg:hidden"
            >
              <Menu className="size-[22px]" aria-hidden />
              <span className="flex-1 text-left">{t('pro.menuMobile')}</span>
              <span className="text-meta font-semibold text-primary-strong">{t(rubrique.labelKey)}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" showCloseButton={false} aria-describedby={undefined} className="w-[300px] max-w-[85vw] gap-0 overflow-y-auto shadow-drawer sm:max-w-[300px]">
            <SheetTitle className="sr-only">{t('pro.menuMobile')}</SheetTitle>
            <MenuPro
              onNavigate={() => setOuvert(false)}
              enTete={
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label={t('nav.closeMenu')}>
                    <X className="size-[22px]" aria-hidden />
                  </Button>
                </SheetClose>
              }
            />
          </SheetContent>
        </Sheet>
        <main className="min-w-0">
          <RouteOutlet />
        </main>
      </div>
      <PiedDePage />
    </div>
  )
}
