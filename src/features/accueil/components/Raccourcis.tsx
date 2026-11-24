import { Bell, GraduationCap, Heart, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/utils/routes'
import { cn } from '@/shared/utils/cn'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { FenetreFormations } from '@/features/accueil/components/FenetreFormations'
import { FenetreNotifications } from '@/features/accueil/components/FenetreNotifications'
import { FenetreProfil } from '@/features/accueil/components/FenetreProfil'

interface Raccourci {
  cle: 'formations' | 'favoris' | 'notifications' | 'profil'
  icone: LucideIcon
  rond: string
  plein?: boolean
  /** Une adresse, ou la fenêtre ouverte sur place (formations, notifications, profil). */
  vers?: string
}

const RACCOURCIS: Raccourci[] = [
  { cle: 'formations', icone: GraduationCap, rond: 'bg-brand-50 text-brand-600' },
  { cle: 'favoris', icone: Heart, rond: 'bg-teinte-rose text-rose-600', plein: true, vers: ROUTES.accueilEnregistres },
  { cle: 'notifications', icone: Bell, rond: 'bg-teinte-emeraude text-emeraude' },
  { cle: 'profil', icone: UserRound, rond: 'bg-teinte-violet text-violet' },
]

const CLASSES_RACCOURCI =
  'flex h-full w-full items-center gap-1.5 rounded-lg border border-line bg-white p-2 text-left transition-colors hover:border-brand-600/30 hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

/**
 * Les quatre raccourcis de la colonne de droite (Raccourcis de yibolo-client).
 * « Mes favoris » est le fil filtré sur les publications mises de côté.
 */
export function Raccourcis() {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const [fenetre, setFenetre] = useState<'formations' | 'notifications' | 'profil' | null>(null)
  // Le nombre de notifications non lues, sur le raccourci.
  const nonLues = useNotificationsCompte(account?.id).filter((n) => !n.lu).length

  return (
    <section aria-labelledby="titre-raccourcis" className="@container flex flex-col gap-3">
      <h2 id="titre-raccourcis" className="text-[0.9375rem] font-bold text-navy-900">
        {t('raccourcis.titre')}
      </h2>

      <ul className="grid grid-cols-2 gap-2 @min-[38rem]:grid-cols-4">
        {RACCOURCIS.map(({ cle, icone: Icone, rond, plein, vers }) => {
          const contenu: ReactNode = (
            <>
              <span className={cn('relative flex size-[1.875rem] shrink-0 items-center justify-center rounded-full', rond)}>
                <Icone className="size-4" fill={plein ? 'currentColor' : 'none'} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[0.6875rem] font-bold text-navy-900">{t(`raccourcis.${cle}`)}</span>
                <span className="mt-0.5 text-[0.625rem] text-muted">{t(`raccourcis.${cle}Aide`)}</span>
              </span>
            </>
          )
          return (
            <li key={cle}>
              {vers ? (
                <Link to={vers} className={CLASSES_RACCOURCI}>
                  {contenu}
                </Link>
              ) : (
                <button type="button" onClick={() => setFenetre(cle as 'formations' | 'notifications' | 'profil')} className={cn(CLASSES_RACCOURCI, 'relative')}>
                  {contenu}
                  {cle === 'notifications' && nonLues > 0 && (
                    <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[0.5625rem] font-bold text-white" aria-label={t('notifications.resume', { count: nonLues })}>
                      {nonLues}
                    </span>
                  )}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {fenetre === 'formations' && <FenetreFormations onFermer={() => setFenetre(null)} />}
      {fenetre === 'notifications' && <FenetreNotifications onFermer={() => setFenetre(null)} />}
      {fenetre === 'profil' && <FenetreProfil onFermer={() => setFenetre(null)} />}
    </section>
  )
}
