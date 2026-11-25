import { LayoutGrid, MoreHorizontal, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { iconeDuDomaine, teinteDuDomaine } from '@/features/accueil/accueilDomaines'
import { Deroulant } from '@/features/accueil/components/Deroulant'
import { useDomainesExpertise } from '@/data/hooks'
import { Checkbox } from '@/shared/components/forms/Fields'
import type { DomaineExpertise, Publication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

const SUR_TELEPHONE = 3
const SUR_ORDINATEUR = 4
const RECHERCHE_DES = 8

interface MenuDesDomainesProps {
  choisis: string[]
  onChange: (domaines: string[]) => void
  /** Ce qui est déjà lu : les domaines les plus actifs passent devant. */
  publications: Publication[]
}

/**
 * Le menu des domaines (MenuDesDomaines de yibolo-client) : une icône ronde et
 * son nom, « Tous » en tête, « Plus » à la fin pour la liste entière. Les
 * domaines choisis prennent les premières places, puis ceux qui ont le plus de
 * publications. Les domaines viennent de la base (`domainesExpertise`).
 */
export function MenuDesDomaines({ choisis, onChange, publications }: MenuDesDomainesProps) {
  const { t } = useTranslation('accueil')
  const domaines = useDomainesExpertise()

  if (domaines.length === 0) return null

  const activite = new Map<string, number>()
  for (const publication of publications) {
    for (const domaine of publication.domaines) activite.set(domaine, (activite.get(domaine) ?? 0) + 1)
  }
  const rang = (id: string) => (choisis.includes(id) ? -2 - (choisis.length - choisis.indexOf(id)) : 0)
  const ranges = [...domaines].sort((a, b) => rang(a.id) - rang(b.id) || (activite.get(b.id) ?? 0) - (activite.get(a.id) ?? 0))
  const horsDeVue = (combien: number) => ranges.slice(combien).filter((domaine) => choisis.includes(domaine.id)).length
  const plusSurTelephone = domaines.length > SUR_TELEPHONE
  const plusSurOrdinateur = domaines.length > SUR_ORDINATEUR

  const basculer = (id: string) => onChange(choisis.includes(id) ? choisis.filter((un) => un !== id) : [...choisis, id])

  return (
    <div role="group" aria-label={t('domaines.libelle')} className="grid grid-cols-5 gap-1 sm:grid-cols-6 sm:gap-2">
      <Domaine icone={LayoutGrid} libelle={t('domaines.tous')} choisi={choisis.length === 0} onClick={() => onChange([])} />
      {ranges.slice(0, SUR_ORDINATEUR).map((domaine, position) => (
        <Domaine
          key={domaine.id}
          icone={iconeDuDomaine(domaine.id)}
          teinte={teinteDuDomaine(domaine.id)}
          libelle={domaine.nom}
          choisi={choisis.includes(domaine.id)}
          onClick={() => basculer(domaine.id)}
          className={position >= SUR_TELEPHONE ? 'max-sm:hidden' : undefined}
        />
      ))}
      {(plusSurTelephone || plusSurOrdinateur) && (
        <TousLesDomaines
          domaines={domaines}
          choisis={choisis}
          onBasculer={basculer}
          onEffacer={() => onChange([])}
          horsDeVueSurTelephone={horsDeVue(SUR_TELEPHONE)}
          horsDeVueSurOrdinateur={horsDeVue(SUR_ORDINATEUR)}
          className={cn(!plusSurTelephone && 'max-sm:hidden', !plusSurOrdinateur && 'sm:hidden')}
        />
      )}
    </div>
  )
}

const CLASSES_DOMAINE =
  'group/domaine flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

function Rond({ icone: Icone, choisi, teinte }: { icone: LucideIcon; choisi: boolean; teinte?: string }) {
  return (
    <span
      className={cn(
        'flex size-10 items-center justify-center rounded-full transition-all motion-reduce:transition-none',
        choisi
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
          : cn(teinte ?? 'bg-white text-ink ring-1 ring-line', 'group-hover/domaine:scale-105 motion-reduce:group-hover/domaine:scale-100'),
      )}
    >
      <Icone className="size-4" aria-hidden="true" />
    </span>
  )
}

function Libelle({ children, choisi }: { children: string; choisi: boolean }) {
  return (
    <span className={cn('line-clamp-2 w-full text-center text-[0.6875rem] leading-tight hyphens-auto sm:text-xs', choisi ? 'font-semibold text-brand-700' : 'font-medium text-muted group-hover/domaine:text-ink')}>
      {children}
    </span>
  )
}

interface DomaineProps {
  icone: LucideIcon
  teinte?: string
  libelle: string
  choisi: boolean
  onClick: () => void
  className?: string
}

function Domaine({ icone, teinte, libelle, choisi, onClick, className }: DomaineProps) {
  return (
    <button type="button" aria-pressed={choisi} title={libelle} onClick={onClick} className={cn(CLASSES_DOMAINE, className)}>
      <Rond icone={icone} choisi={choisi} teinte={teinte} />
      <Libelle choisi={choisi}>{libelle}</Libelle>
    </button>
  )
}

interface TousLesDomainesProps {
  domaines: DomaineExpertise[]
  choisis: string[]
  onBasculer: (id: string) => void
  onEffacer: () => void
  horsDeVueSurTelephone: number
  horsDeVueSurOrdinateur: number
  className?: string
}

function TousLesDomaines({ domaines, choisis, onBasculer, onEffacer, horsDeVueSurTelephone, horsDeVueSurOrdinateur, className }: TousLesDomainesProps) {
  const { t } = useTranslation('accueil')
  const [saisie, setSaisie] = useState('')
  const terme = saisie.trim().toLocaleLowerCase()
  const visibles = terme ? domaines.filter((domaine) => domaine.nom.toLocaleLowerCase().includes(terme)) : domaines

  const compte = (nombre: number, surQuelEcran: string) =>
    nombre > 0 && (
      <span
        className={cn(
          'absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-caption3 font-semibold text-white tabular-nums ring-2 ring-white',
          surQuelEcran,
        )}
      >
        +{nombre}
      </span>
    )

  return (
    <Deroulant
      align="end"
      onChange={(ouvert) => !ouvert && setSaisie('')}
      bouton={
        <>
          <span className="relative">
            <Rond icone={MoreHorizontal} choisi={false} />
            {compte(horsDeVueSurTelephone, 'flex sm:hidden')}
            {compte(horsDeVueSurOrdinateur, 'hidden sm:flex')}
          </span>
          <Libelle choisi={false}>{t('domaines.plus')}</Libelle>
        </>
      }
      classesBouton={cn(CLASSES_DOMAINE, className)}
      classesPanneau="w-[20rem] gap-1 p-1"
    >
      {() => (
        <>
          <div className="flex items-center justify-between gap-2 px-2 pt-1.5 pb-1">
            <p className="text-sm font-semibold text-ink">{t('domaines.libelle')}</p>
            {choisis.length > 0 && (
              <button
                type="button"
                onClick={onEffacer}
                className="rounded text-xs font-medium text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
              >
                {t('domaines.effacer')}
              </button>
            )}
          </div>
          {domaines.length > RECHERCHE_DES && (
            <label className="mx-1 mb-1 flex h-8 items-center gap-2 rounded-lg border border-line bg-white px-2.5 focus-within:border-brand-500">
              <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={saisie}
                onChange={(evenement) => setSaisie(evenement.target.value)}
                placeholder={t('domaines.chercher')}
                aria-label={t('domaines.chercher')}
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          )}
          <ul className="flex max-h-72 flex-col overflow-y-auto">
            {visibles.map((domaine) => (
              <li key={domaine.id}>
                <Checkbox
                  label={domaine.nom}
                  checked={choisis.includes(domaine.id)}
                  onChange={() => onBasculer(domaine.id)}
                  className="items-center gap-3 rounded-md px-2 py-2 hover:bg-page"
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </Deroulant>
  )
}
