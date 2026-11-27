import { Bell, Heart, UserRound, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/utils/routes'
import { cn } from '@/shared/utils/cn'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'

interface Raccourci {
  cle: 'favoris' | 'notifications' | 'profil'
  icone: LucideIcon
  rond: string
  plein?: boolean
  vers?: string
}

const RACCOURCIS: Raccourci[] = [
  { cle: 'favoris', icone: Heart, rond: 'bg-teinte-rose text-rose-600', plein: true },
  { cle: 'notifications', icone: Bell, rond: 'bg-teinte-emeraude text-emeraude', vers: ROUTES.notifications },
  { cle: 'profil', icone: UserRound, rond: 'bg-teinte-violet text-violet', vers: ROUTES.profil },
]

const CLASSES_RACCOURCI =
  'flex h-full w-full items-center gap-1.5 rounded-lg border border-line bg-white p-2 text-left transition-colors hover:border-brand-600/30 hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

/**
 * Les trois raccourcis de la colonne de droite (Raccourcis de yibolo-client).
 * « Mes favoris » filtre le fil sur les publications mises en favoris ; un
 * second clic retire le filtre.
 */
export function Raccourcis({ favoris, basculerFavoris }: { favoris: boolean; basculerFavoris: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  // Le nombre de notifications non lues, sur le raccourci.
  const nonLues = useNotificationsCompte(account?.id).filter((n) => !n.lu).length
  // Une école : pas de favoris ; ses notifications et son profil sont dans son espace pro.
  const ecole = !!account && account.role !== 'utilisateur'
  const raccourcis = ecole
    ? RACCOURCIS.filter((r) => r.cle !== 'favoris').map((r) => ({ ...r, vers: r.cle === 'profil' ? ROUTES.pro.profile() : ROUTES.pro.settings('notifications') }))
    : RACCOURCIS

  return (
    <section aria-labelledby="titre-raccourcis" className="@container flex flex-col gap-3">
      <h2 id="titre-raccourcis" className="text-[0.9375rem] font-bold text-navy-900">
        {t('raccourcis.titre')}
      </h2>

      <ul className={cn('grid grid-cols-1 gap-2', raccourcis.length === 3 ? '@min-[30rem]:grid-cols-3' : '@min-[30rem]:grid-cols-2')}>
        {raccourcis.map(({ cle, icone: Icone, rond, plein, vers }) => {
          const contenu: ReactNode = (
            <>
              <span className={cn('relative flex size-[1.875rem] shrink-0 items-center justify-center rounded-full', rond)}>
                <Icone className="size-4" fill={plein ? 'currentColor' : 'none'} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-xs font-bold text-navy-900">{t(`raccourcis.${cle}`)}</span>
                <span className="mt-0.5 text-[0.6875rem] text-muted">{t(`raccourcis.${cle}Aide`)}</span>
              </span>
            </>
          )
          if (!vers)
            return (
              <li key={cle}>
                <button
                  type="button"
                  aria-pressed={favoris}
                  title={favoris ? t('raccourcis.retirerFiltre') : undefined}
                  onClick={basculerFavoris}
                  className={cn(CLASSES_RACCOURCI, favoris && 'border-rose-300 bg-rose-50 hover:border-rose-400 hover:bg-rose-50')}
                >
                  {contenu}
                  {favoris && <X className="ml-auto size-4 shrink-0 text-rose-600" aria-hidden="true" />}
                </button>
              </li>
            )
          return (
            <li key={cle}>
              <Link to={vers} className={cn(CLASSES_RACCOURCI, 'relative')}>
                {contenu}
                {cle === 'notifications' && nonLues > 0 && (
                  <span className="absolute top-1/2 right-2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-rose-500 text-[0.625rem] font-bold text-white" aria-label={t('raccourcis.nonLues', { count: nonLues })}>
                    {nonLues}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
