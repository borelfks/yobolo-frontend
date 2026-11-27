import { useTranslation } from 'react-i18next'
import { Lien } from '@/shared/ui/Lien'
import { usePublications, useSujetsPublication } from '@/data/hooks'
import { nomDuSujet, titreEtExtrait } from '@/modules/communaute/accueil/accueilFil'
import { VisuelPublication } from '@/modules/communaute/accueil/components/article/VisuelPublication'
import type { Publication } from '@/shared/types'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const NOMBRE = 5

/**
 * « Publications similaires » (PublicationsSimilaires de yibolo-client) : les
 * cinq plus proches — mêmes sujets et domaines d'abord, puis le même auteur.
 */
export function PublicationsSimilaires({ publication }: { publication: Publication }) {
  const { t } = useTranslation('accueil')
  const sujets = useSujetsPublication()
  const publiees = usePublications().filter((une) => une.statut === 'publiee' && une.id !== publication.id)

  const proximite = (une: Publication) =>
    une.sujets.filter((sujet) => publication.sujets.includes(sujet)).length * 2 +
    une.domaines.filter((domaine) => publication.domaines.includes(domaine)).length +
    (une.auteurId === publication.auteurId ? 1 : 0)
  const similaires = publiees.toSorted((a, b) => proximite(b) - proximite(a)).slice(0, NOMBRE)

  if (similaires.length === 0) return null

  return (
    <section aria-label={t('article.similaires')} className="flex flex-col gap-3">
      <h2 className="text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">{t('article.similaires')}</h2>
      <ul className="flex flex-col divide-y divide-line">
        {similaires.map((une) => (
          <li key={une.id} className="py-3 first:pt-0 last:pb-0">
            <article className="group relative flex gap-3">
              <VisuelPublication publication={une} petit className="aspect-[4/3] w-20 shrink-0 self-start rounded-md" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {une.sujets[0] && <span className="text-[0.625rem] font-semibold tracking-wider text-brand-700 uppercase">{nomDuSujet(une.sujets[0], sujets)}</span>}
                <h3 className="line-clamp-3 text-sm leading-snug font-semibold text-navy-900">
                  <Lien to={ROUTES.publication(une.id)} className="outline-none group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:underline">
                    {titreEtExtrait(une).titre}
                  </Lien>
                </h3>
                <time dateTime={une.publieeLe} className="text-xs text-muted-foreground">
                  {shortDate(une.publieeLe, { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
