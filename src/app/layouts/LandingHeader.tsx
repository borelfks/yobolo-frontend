import { clsx } from 'clsx'
import { UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { NotificationsBell, UserMenu } from '@/app/layouts/AccountMenu'
import { LandingLogo } from '@/app/layouts/LandingLogo'
import { useSession } from '@/features/auth/hooks/useSession'
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher'
import { ROUTES } from '@/shared/utils/routes'

// Doit rester égal au breakpoint `md` de Tailwind.
const REQUETE_PETIT_ECRAN = '(max-width: 47.9375rem)'

// Passé ce défilement, l'en-tête flottant a quitté la photo : il redevient une barre pleine.
const SEUIL_DEFILEMENT = 24

/** Le bouton « Se connecter » de yibolo-client (buttonVariants, taille sm, en pilule). */
const BOUTON =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full h-8 px-4 text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
const BOUTON_SECONDAIRE = 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
const BOUTON_CONTOUR = 'border border-input bg-background hover:bg-survol'

function useMedia(requete: string) {
  const [correspond, setCorrespond] = useState(() => window.matchMedia(requete).matches)

  useEffect(() => {
    const media = window.matchMedia(requete)
    const surFranchissement = (evenement: MediaQueryListEvent) => setCorrespond(evenement.matches)
    media.addEventListener('change', surFranchissement)
    return () => media.removeEventListener('change', surFranchissement)
  }, [requete])

  return correspond
}

/** Vrai dès que la page a défilé — suivi seulement pour l'en-tête flottant. */
function useDefile(actif: boolean) {
  const [defile, setDefile] = useState(false)

  useEffect(() => {
    if (!actif) return
    const mesurer = () => setDefile(window.scrollY > SEUIL_DEFILEMENT)
    mesurer()
    window.addEventListener('scroll', mesurer, { passive: true })
    return () => window.removeEventListener('scroll', mesurer)
  }, [actif])

  return defile
}

/**
 * L'en-tête de la landing (copié de yibolo-client) : il flotte au-dessus de la
 * photo du héro — fond transparent, texte blanc — puis redevient une barre
 * pleine dès que la page défile. Connecté, la barre porte la cloche et le
 * menu du compte et reste solide.
 */
export function LandingHeader({ flottante = false }: { flottante?: boolean }) {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const petitEcran = useMedia(REQUETE_PETIT_ECRAN)
  const defile = useDefile(flottante)

  const surPhoto = flottante && !defile && !account

  return (
    <header
      className={clsx(
        'top-0 border-b transition-colors duration-300',
        flottante ? 'fixed inset-x-0 z-40' : 'sticky z-20',
        surPhoto ? 'border-transparent bg-transparent' : 'border-border/60 bg-background/90 backdrop-blur',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full items-center justify-between gap-2 transition-[padding] duration-300 sm:gap-4',
          flottante ? 'px-9 sm:px-13 lg:px-17' : 'px-4 lg:px-6',
          surPhoto ? 'pt-5 pb-3 md:pt-9' : 'py-3',
        )}
      >
        <Link
          to={account ? account.home : ROUTES.home}
          className={clsx('shrink-0 rounded-md focus-visible:ring-2 focus-visible:outline-none', surPhoto ? 'focus-visible:ring-white' : 'focus-visible:ring-ring')}
        >
          <LandingLogo surPhoto={surPhoto} avecDevise />
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <LanguageSwitcher light={surPhoto} />
          {account ? (
            <>
              <NotificationsBell />
              <UserMenu />
            </>
          ) : (
            <Link to={ROUTES.signIn} className={clsx(BOUTON, surPhoto ? BOUTON_SECONDAIRE : BOUTON_CONTOUR)}>
              {!petitEcran && <UserRound className="size-[1.1rem]" aria-hidden="true" />}
              {t('accueil.entete.seConnecter')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
