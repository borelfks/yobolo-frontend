import { useState } from 'react'
import { Link, NavLink, ScrollRestoration } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/shared/components/ui/Logo'
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher'
import { NotificationsBell, UserMenu } from '@/app/layouts/AccountMenu'
import { Button } from '@/shared/components/ui/Button'
import { useSession } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { RouteOutlet } from '@/app/routes/RouteOutlet'
import { publicNav } from '@/app/layouts/navConfig'
import { ROUTES } from '@/shared/utils/routes'

/** L'aide et les pages de loi (comme le pied de page de l'accueil). */
const AIDE = [
  { cle: 'aide', vers: ROUTES.help },
  { cle: 'conditions', vers: ROUTES.terms },
] as const

export function PublicLayout() {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const [open, setOpen] = useState(false)
  // Connecté, « Accueil » et le logo mènent à la page d'arrivée du compte (l'accueil connecté
  // pour l'utilisateur, l'espace pro pour une école) : la landing est réservée aux visiteurs.
  const accueil = account ? account.home : ROUTES.home
  const vers = (to: string) => (to === ROUTES.home ? accueil : to)
  return (
    <div className="app-cadre flex min-h-dvh flex-col">
      <ScrollRestoration />
      <header className="sticky top-0 z-30 border-b border-line/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-2 px-3 sm:gap-4 sm:px-5">
          <Logo to={accueil} />
          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {publicNav.map((l) => (
              <NavLink
                key={l.to}
                to={vers(l.to)}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors',
                    isActive ? 'bg-navy-800 text-white shadow' : 'text-navy-800 hover:bg-brand-50',
                  )
                }
              >
                <l.icon className="size-5" />
                {t(l.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
            <LanguageSwitcher />
            {account ? (
              <>
                <NotificationsBell href={account?.role === 'utilisateur' ? ROUTES.espace('notifications') : undefined} />
                <span className="hidden h-8 w-px bg-line sm:block" />
                <UserMenu withTestData />
              </>
            ) : (
              <>
                <Button to={ROUTES.signIn} variant="ghost" size="sm">
                  {t('account.signIn')}
                </Button>
                <Button to={ROUTES.signUp} size="sm">
                  {t('account.signUp')}
                </Button>
              </>
            )}
            <button type="button" aria-label={t('nav.menu')} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full hover:bg-brand-50 lg:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-line bg-white p-3 lg:hidden">
            {publicNav.map((l) => (
              <NavLink
                key={l.to}
                to={vers(l.to)}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-4 py-3 font-semibold', isActive ? 'bg-navy-800 text-white' : 'text-navy-800')}
              >
                <l.icon className="size-5" />
                {t(l.labelKey)}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">
        <RouteOutlet />
      </main>
      <Footer />
    </div>
  )
}

/**
 * La partie basse du pied de page de l'accueil (LandingFooter) : logo et
 * devise, Aide · Conditions, copyright. Seule la couleur change : fond bleu
 * nuit, texte blanc. Sans la vague ni la phrase de la marque (décision du
 * 2026-11-24). Espacements de l'accueil repris en valeurs exactes (la landing
 * compte 0,3 rem par pas, ici 0,25 rem).
 */
function Footer() {
  const { t } = useTranslation('layout')
  return (
    <footer className="mt-16 bg-navy-900 px-[2.7rem] py-[2.4rem] text-white sm:px-[3.9rem] lg:px-[5.1rem]">
      <div className="flex flex-col gap-[1.5rem] sm:flex-row sm:items-center sm:justify-between">
        <Logo light />
        <nav aria-label={t('accueil.piedDePage.groupeAide')}>
          <ul className="flex flex-wrap gap-x-[1.8rem]">
            {AIDE.map(({ cle, vers }) => (
              <li key={cle}>
                <Link to={vers} className="inline-block rounded-sm py-[0.6rem] font-client text-sm text-white/70 transition-colors hover:text-white">
                  {t(`accueil.piedDePage.liens.${cle}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mt-[1.2rem] font-client text-xs text-white/60">{t('accueil.piedDePage.copyright')}</p>
    </footer>
  )
}
