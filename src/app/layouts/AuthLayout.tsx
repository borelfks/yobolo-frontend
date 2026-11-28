import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { ChoixLangue } from '@/shared/blocs/ChoixLangue'
import { MarqueYibolo } from '@/shared/blocs/Marque'
import { Button } from '@/shared/shadcn/button'
import { Img } from '@/shared/ui/Img'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { PiedDePage } from './PiedDePage'

const POINTS = ['schools', 'consultants', 'jobs', 'skills'] as const

function Logo({ to }: { to: string }) {
  const { t } = useTranslation('layout')
  return (
    <Lien to={to} aria-label={t('entete.accueilAria')} className="flex shrink-0 no-underline">
      <MarqueYibolo taille={34} />
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
    <div className="app-cadre grid min-h-dvh grid-cols-[minmax(0,1fr)] bg-background text-foreground lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]">
      <main className="flex min-w-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-1.5 px-4 lg:px-12">
          <div className="mr-auto flex">
            <Logo to={ROUTES.home} />
          </div>
          <Button asChild variant="ghost" size="md" className="px-3 font-semibold hover:bg-primary-soft">
            <Lien to={ROUTES.home}>
              <ArrowLeft aria-hidden />
              <span className="lg:hidden">{t('authLayout.home')}</span>
              <span className="max-lg:hidden">{t('authLayout.backHome')}</span>
            </Lien>
          </Button>
          <ChoixLangue auth />
        </div>
        <div className="flex flex-1 flex-col justify-start px-5 pt-6 pb-12 lg:justify-center lg:px-12 lg:pt-8 lg:pb-14">
          <div className="mx-auto flex w-full max-w-[400px] flex-col">{children}</div>
        </div>
      </main>

      <aside className="hidden p-3 lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-lg p-12 text-white">
          <Img src="/images/accueil/ecoles.jpg" alt="" className="absolute inset-0 size-full object-cover object-[center_25%]" />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/92 via-foreground/35 via-55% to-transparent" />
          <div className="relative flex max-w-[540px] flex-col gap-5">
            <h2 className="text-[34px] leading-[1.15] font-extrabold tracking-[-0.02em]">{t('authLayout.headline')}</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-ui text-white/92">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" aria-hidden className="mt-px size-5 shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-success-bright" />
                    <path d="m8 12 3 3 5-6" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="stroke-white" />
                  </svg>
                  {t(`authLayout.points.${p}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
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

/** Ancienne carte de l'inscription (remplacée au lot des pages publiques). */
export function AuthCard({ children }: { children: ReactNode; title?: string }) {
  const { t } = useTranslation('layout')
  return (
    <CadreAuth texte={t('authLayout.dejaCompte')}>
      <CarteAuth>{children}</CarteAuth>
    </CadreAuth>
  )
}
