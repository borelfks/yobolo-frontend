import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { instant } from '@/features/accueil/accueilFil'
import { useOffresEmploi } from '@/data/hooks'
import { useOffreOuverte } from '@/features/accueil/hooks/useOffreOuverte'
import { ROUTES } from '@/shared/utils/routes'

const NOMBRE = 3

/**
 * Les trois dernières offres, dans la colonne de droite (OffresPopulaires de
 * yibolo-client : le titre « populaires » est celui de la maquette du client,
 * la liste montre les dernières parues). « Voir » ouvre la fiche de l'offre,
 * « Voir tout » le fil filtré sur les offres.
 */
export function OffresPopulaires() {
  const { t } = useTranslation('accueil')
  const { versLaFiche } = useOffreOuverte()
  const offres = useOffresEmploi()
    .toSorted((a, b) => instant(b.publieeLe) - instant(a.publieeLe))
    .slice(0, NOMBRE)

  return (
    <section aria-labelledby="titre-offres-accueil" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="titre-offres-accueil" className="text-[0.9375rem] font-bold text-navy-900">
          {t('offres.titre')}
        </h2>
        <Link
          to={ROUTES.accueilGenre('offre')}
          className="inline-flex shrink-0 items-center gap-1 rounded text-[0.6875rem] font-semibold text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        >
          {t('offres.voirTout')}
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>

      {offres.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-3 text-xs leading-relaxed text-muted">{t('offres.vide')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {offres.map((offre) => (
            <li key={offre.id} className="flex items-center gap-2.5 py-2.5">
              <span className="flex size-[2.25rem] shrink-0 items-center justify-center rounded-md bg-teinte-orange text-orange">
                <BriefcaseBusiness className="size-[1.125rem]" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <Link
                  to={versLaFiche(offre.id)}
                  title={offre.titre}
                  className="truncate text-xs font-bold text-navy-900 hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                >
                  {offre.titre}
                </Link>
                <span className="mt-0.5 truncate text-[0.6875rem] text-muted">
                  {offre.lieu} · {t(`contrats.${offre.typeDeContrat}`)}
                </span>
              </div>
              <Link
                to={versLaFiche(offre.id)}
                aria-label={t('offres.voirLOffre', { titre: offre.titre })}
                className="inline-flex h-[1.75rem] shrink-0 items-center rounded-md bg-brand-600 px-3 text-[0.6875rem] font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t('offres.voir')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
