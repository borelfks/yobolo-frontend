import { LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { couleurDuDomaine, iconeDuDomaine } from '@/modules/communaute/accueil/accueilDomaines'
import { useDomainesExpertise } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'

const CLASSES_LIGNE =
  'flex w-full items-center gap-2.5 rounded-md px-2 py-[0.4375rem] text-left text-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

/**
 * La colonne des domaines, à gauche du fil sur grand écran (DomainesExpertise
 * de yibolo-client) — la même liste que le menu des domaines, mais dépliée.
 * Elle ne s'affiche qu'à partir de `2xl`. Un domaine se choisit et se retire
 * du même geste : c'est un filtre, pas une navigation.
 */
export function DomainesExpertise({ choisis, onChange }: { choisis: string[]; onChange: (domaines: string[]) => void }) {
  const { t } = useTranslation('accueil')
  const domaines = useDomainesExpertise()

  if (domaines.length === 0) return null

  const basculer = (id: string) => onChange(choisis.includes(id) ? choisis.filter((un) => un !== id) : [...choisis, id])
  const tous = choisis.length === 0

  return (
    <div className="flex max-h-[calc(100dvh-9rem)] flex-col gap-3 overflow-y-auto rounded-xl border border-line bg-white p-3 shadow-sm">
      <h2 className="px-1 text-sm font-bold text-navy-900">{t('domaines.expertise')}</h2>

      <ul className="flex flex-col gap-0.5">
        <li>
          <button
            type="button"
            aria-pressed={tous}
            onClick={() => onChange([])}
            className={cn(CLASSES_LIGNE, tous ? 'bg-brand-50 font-semibold text-brand-700' : 'font-medium text-ink hover:bg-page')}
          >
            <LayoutGrid className="size-[1.125rem] shrink-0 text-brand-700" aria-hidden="true" />
            <span className="min-w-0 flex-1 leading-snug">{t('domaines.tousLesDomaines')}</span>
          </button>
        </li>

        {domaines.map((domaine) => {
          const Icone = iconeDuDomaine(domaine.id)
          const choisi = choisis.includes(domaine.id)
          return (
            <li key={domaine.id}>
              <button
                type="button"
                aria-pressed={choisi}
                title={domaine.nom}
                onClick={() => basculer(domaine.id)}
                className={cn(CLASSES_LIGNE, choisi ? 'bg-brand-50 font-semibold text-brand-700' : 'font-medium text-ink hover:bg-page')}
              >
                <Icone className={cn('size-[1.125rem] shrink-0', couleurDuDomaine(domaine.id))} aria-hidden="true" />
                <span className="min-w-0 flex-1 leading-snug">{domaine.nom}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
