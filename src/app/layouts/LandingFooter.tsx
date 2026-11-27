import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { LandingLogo } from '@/app/layouts/LandingLogo'
import { TraitCourbe, Vague } from '@/shared/ui/Vague'
import { ROUTES } from '@/shared/utils/routes'

/** L'aide et les pages de loi. */
const AIDE = [
  { cle: 'aide', vers: ROUTES.help },
  { cle: 'conditions', vers: ROUTES.terms },
] as const

/**
 * Le pied de page de la landing (copié de yibolo-client) : une vague claire,
 * la phrase de la marque soulignée d'orange, puis une ligne — le logo et sa
 * devise d'un côté, les liens de l'autre — et le copyright.
 */
export function LandingFooter() {
  const { t } = useTranslation('layout')

  return (
    <footer>
      <Vague className="-mb-px h-12 text-secondary sm:h-16" />
      <div className="bg-secondary px-9 pt-6 pb-8 sm:px-13 lg:px-17">
        <div className="text-center">
          <p className="mx-auto max-w-md text-2xl leading-snug font-medium text-foreground italic sm:text-3xl">{t('accueil.piedDePage.slogan')}</p>
          <TraitCourbe className="mx-auto mt-3 h-3 w-48 text-orange" />
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <LandingLogo avecDevise />
          <nav aria-label={t('accueil.piedDePage.groupeAide')}>
            <ul className="flex flex-wrap gap-x-6">
              {AIDE.map(({ cle, vers }) => (
                <li key={cle}>
                  <Link
                    to={vers}
                    className="inline-block rounded-sm py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {t(`accueil.piedDePage.liens.${cle}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{t('accueil.piedDePage.copyright')}</p>
      </div>
    </footer>
  )
}
