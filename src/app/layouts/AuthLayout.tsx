import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { CadreConnexion } from '@/shared/blocs/CadreConnexion'
import { ChoixLangue } from '@/shared/blocs/ChoixLangue'
import { MarqueYibolo } from '@/shared/blocs/Marque'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { PiedDePage } from './PiedDePage'

const POINTS = ['schools', 'consultants', 'jobs', 'skills'] as const

function Logo({ to }: { to: string }) {
  const { t } = useTranslation('layout')
  return (
    <Lien to={to} aria-label={t('entete.accueilAria')} className="flex shrink-0 no-underline">
      <MarqueYibolo devise={t('accueil.entete.devise')} />
    </Lien>
  )
}

/**
 * L'écran de connexion du canevas : le formulaire à gauche sur le fond des
 * pages, la photo et la phrase de la marque à droite (ordinateur). Sur
 * téléphone, seule la colonne du formulaire reste.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('layout')
  return (
    <CadreConnexion
      logo={<Logo to={ROUTES.home} />}
      retour={
        <Button asChild variant="ghost" size="md" className="px-3 font-semibold hover:bg-primary-soft">
          <Lien to={ROUTES.home}>
            <ArrowLeft aria-hidden />
            <span className="lg:hidden">{t('authLayout.home')}</span>
            <span className="max-lg:hidden">{t('authLayout.backHome')}</span>
          </Lien>
        </Button>
      }
      photo="/images/accueil/ecoles.jpg"
      titre={t('authLayout.headline')}
      points={POINTS.map((p) => t(`authLayout.points.${p}`))}
    >
      {children}
    </CadreConnexion>
  )
}

/**
 * Le cadre des écrans d'inscription et de mot de passe oublié (canevas) : une
 * barre légère (logo, langue, « Déjà un compte ? » + « Se connecter »), la
 * carte de l'écran au centre, le pied de page.
 */
export function CadreAuth({ texte, logoVers = ROUTES.home, children }: { texte: string; logoVers?: string; children: ReactNode }) {
  const { t } = useTranslation('layout')
  return (
    <div className="app-cadre flex min-h-dvh flex-col items-center bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-page items-center justify-between gap-2.5 px-4 py-3.5 sm:py-5">
        <Logo to={logoVers} />
        <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <ChoixLangue auth />
          <span className="max-sm:hidden">{texte}</span>
          <Button asChild variant="secondary" size="md" className="text-sm">
            <Lien to={ROUTES.signIn}>{t('account.signIn')}</Lien>
          </Button>
        </span>
      </header>
      {children}
      <PiedDePage className="mt-auto w-full" />
    </div>
  )
}

const LARGEURS = { etroite: 'sm:max-w-[440px]', code: 'sm:max-w-[460px]', large: 'sm:max-w-[720px]' } as const

/**
 * La carte blanche d'un écran d'inscription ou de mot de passe : arrondie et
 * ombrée sur ordinateur, sur toute la largeur (bordée haut et bas) sur téléphone.
 */
export function CarteAuth({ largeur = 'large', centree = false, children, className }: { largeur?: keyof typeof LARGEURS; centree?: boolean; children: ReactNode; className?: string }) {
  return (
    <main
      className={cn(
        'mb-6 flex w-full flex-col gap-5 border-y border-border bg-card px-4 pt-6 pb-7 sm:w-[calc(100%-2rem)] sm:rounded-lg sm:border-0 sm:p-8 sm:shadow-panel',
        LARGEURS[largeur],
        centree ? 'sm:my-auto' : 'sm:mt-2 sm:mb-14',
        className,
      )}
    >
      {children}
    </main>
  )
}
