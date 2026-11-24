import { useTranslation } from 'react-i18next'
import type { GenreDuFil } from '@/features/accueil/accueilFil'
import { cn } from '@/shared/utils/cn'

const ONGLETS: GenreDuFil[] = ['tout', 'conseil', 'actualite', 'offre', 'formation']

const CLASSES_ONGLET =
  'inline-flex h-[2.4rem] shrink-0 items-center rounded-md px-3.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none sm:h-[1.875rem]'

/**
 * La rangée de types sous « Publications récentes » (OngletsDuFil de
 * yibolo-client). Elle commande le MÊME état que le menu « Type » : c'est un
 * raccourci, pas un second filtre. « Conseils » = les publications des
 * experts ; « Actualités » = les actualités publiées par les établissements.
 */
export function OngletsDuFil({ genre, onChange }: { genre: GenreDuFil; onChange: (genre: GenreDuFil) => void }) {
  const { t } = useTranslation('accueil')

  return (
    <div role="group" aria-label={t('onglets.libelle')} className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {ONGLETS.map((un) => (
        <button
          key={un}
          type="button"
          aria-pressed={genre === un}
          onClick={() => onChange(un)}
          className={cn(
            CLASSES_ONGLET,
            genre === un ? 'border border-brand-600 bg-brand-600 font-semibold text-white' : 'border border-line bg-white font-medium text-ink hover:bg-page',
          )}
        >
          {t(`genres.${un}`)}
        </button>
      ))}
    </div>
  )
}
