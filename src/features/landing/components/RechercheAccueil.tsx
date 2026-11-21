import { ArrowRight, ChevronDown, Search } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/shared/utils/routes'

type CleModule = 'consultants' | 'formations' | 'ecoles' | 'offres'

/** Chaque module et le paramètre que sa page lit comme recherche de départ. */
const MODULES: { cle: CleModule; vers: string; parametre: string }[] = [
  { cle: 'consultants', vers: ROUTES.consultation, parametre: 'q' },
  { cle: 'formations', vers: ROUTES.courses, parametre: 'q' },
  { cle: 'ecoles', vers: ROUTES.schools, parametre: 'recherche' },
  { cle: 'offres', vers: ROUTES.emploi, parametre: 'q' },
]

/**
 * La recherche en pilule du héro (copiée de yibolo-client) : le module choisi
 * à gauche, le champ, la flèche orange. Elle part vers la page du module.
 */
export function RechercheAccueil() {
  const { t } = useTranslation('landing')
  const navigate = useNavigate()
  const idModule = useId()
  const idChamp = useId()
  const [module, setModule] = useState<CleModule>('consultants')
  const [texte, setTexte] = useState('')

  const rechercher = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault()
    const choisi = MODULES.find((candidat) => candidat.cle === module) ?? MODULES[0]!
    const recherche = texte.trim()
    navigate(recherche ? `${choisi.vers}?${new URLSearchParams({ [choisi.parametre]: recherche })}` : choisi.vers)
  }

  return (
    <form
      role="search"
      onSubmit={rechercher}
      className="mx-auto flex max-w-4xl items-center gap-1 rounded-full bg-card p-1.5 pl-3 shadow-[0_14px_32px_-8px_rgb(24_24_27/0.14),0_4px_8px_-4px_rgb(24_24_27/0.06)] ring-1 ring-border/70 focus-within:ring-2 focus-within:ring-ring sm:gap-2 sm:pl-5"
    >
      <Search className="hidden size-5 shrink-0 text-muted-foreground sm:block" aria-hidden="true" />

      <label htmlFor={idModule} className="sr-only">
        {t('recherche.libelleModule')}
      </label>
      <span className="relative flex shrink-0 items-center">
        <select
          id={idModule}
          value={module}
          onChange={(evenement) => setModule(evenement.target.value as CleModule)}
          className="h-10 cursor-pointer appearance-none rounded-full bg-transparent pr-6 pl-2 text-sm font-medium text-foreground outline-none hover:bg-survol"
        >
          {MODULES.map(({ cle }) => (
            <option key={cle} value={cle}>
              {t(`recherche.modules.${cle}`)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 size-4 text-muted-foreground" aria-hidden="true" />
      </span>

      <span aria-hidden="true" className="h-6 w-px shrink-0 bg-border" />

      <label htmlFor={idChamp} className="sr-only">
        {t('recherche.libelleChamp')}
      </label>
      {/* Le champ « bare » de yibolo-client : sans habillage, la pilule porte le cadre et le focus. */}
      <input
        id={idChamp}
        type="search"
        value={texte}
        onChange={(evenement) => setTexte(evenement.target.value)}
        placeholder={t('recherche.exemple')}
        className="flex h-10 w-full min-w-0 flex-1 truncate border-none bg-transparent px-4 text-base text-foreground outline-none transition-[color,border-color,box-shadow] duration-150 ease-out placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50"
      />

      <button
        type="submit"
        aria-label={t('recherche.envoyer')}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-white transition-colors hover:bg-orange/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:size-12"
      >
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  )
}
