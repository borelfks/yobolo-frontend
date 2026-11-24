import { BriefcaseBusiness, GraduationCap, Network, Sparkles, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/utils/routes'

type CleBande = 'formationContinue' | 'conseils' | 'emploi' | 'reseau' | 'competences'

/** Les cinq promesses et leur porte (les univers pas encore réalisés mènent à « bientôt disponible »). */
const PROMESSES: { cle: CleBande; icone: LucideIcon; vers: string }[] = [
  { cle: 'formationContinue', icone: GraduationCap, vers: ROUTES.courses },
  { cle: 'conseils', icone: Users, vers: ROUTES.consultation },
  { cle: 'emploi', icone: BriefcaseBusiness, vers: ROUTES.emploi },
  { cle: 'reseau', icone: Network, vers: ROUTES.accueil },
  { cle: 'competences', icone: Sparkles, vers: ROUTES.schools },
]

/**
 * La bande de clôture de l'accueil (BandeBasAccueil de yibolo-client) : les
 * cinq choses que la plateforme sert, chacune avec sa porte.
 */
export function BandeBasAccueil() {
  const { t } = useTranslation('accueil')

  return (
    <section aria-label={t('bande.libelle')} className="rounded-xl border border-line bg-white px-4 py-3.5 shadow-sm sm:px-6">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3 xl:flex xl:items-center xl:justify-between">
        {PROMESSES.map(({ cle, icone: Icone, vers }) => (
          <li key={cle}>
            <Link
              to={vers}
              className="group flex items-center gap-2 rounded-md text-[0.8125rem] font-medium text-navy-900 transition-colors hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none xl:text-xs xl:whitespace-nowrap"
            >
              <Icone className="size-[1.375rem] shrink-0 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0">{t(`bande.${cle}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** La devise manuscrite, soulignée d'un trait. */
export function DeviseAccueil() {
  const { t } = useTranslation('accueil')

  return (
    <p className="mx-auto flex w-fit -rotate-3 flex-col items-center font-manuscrite text-[1.5rem] leading-none text-navy-900">
      <span className="max-w-[13rem] text-center text-balance">{t('bande.devise')}</span>
      <svg aria-hidden="true" viewBox="0 0 160 14" className="mt-1 h-3 w-36 text-sun-400" fill="none">
        <path d="M3 10 C 45 2, 105 2, 157 8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </p>
  )
}
