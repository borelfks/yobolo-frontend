import { Bookmark, Check, ChevronDown, EllipsisVertical, Link2, PenLine, RotateCcw, Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { GENRES_DE_PUBLICATIONS, GENRES_DU_FIL, TRIS_DU_FIL, type GenreDuFil } from '@/features/accueil/accueilFil'
import { Deroulant } from '@/features/accueil/components/Deroulant'
import { ChoixDuMenu, SeparateurDuMenu } from '@/features/accueil/components/ElementsDuFil'
import { MenuDesDomaines } from '@/features/accueil/components/MenuDesDomaines'
import type { FiltresDuFil } from '@/features/accueil/hooks/useFiltresDuFil'
import { usePartage } from '@/features/accueil/hooks/usePartage'
import { useVilles } from '@/data/hooks'
import type { Publication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

const ATTENTE_DE_SAISIE = 350

const CLASSES_BOUTON_FILTRE =
  'inline-flex h-[2.5rem] shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

const CLASSES_FILTRE_NEUTRE = 'border-line bg-white text-ink hover:bg-page data-[state=open]:bg-page'

const CLASSES_FILTRE_ACTIF = 'border-brand-600/40 bg-brand-50 text-brand-700'

/** Une ligne d'un choix unique dans un menu (Ville, Type), avec la coche du choix actuel. */
const CLASSES_CHOIX_RADIO =
  'flex items-center gap-2 rounded-lg py-2 pr-2.5 pl-2 text-left text-sm text-ink transition-colors hover:bg-page focus-visible:bg-page focus-visible:outline-none'

interface BarreDuFilProps {
  filtres: FiltresDuFil
  changer: (suite: Partial<FiltresDuFil>) => void
  changerDeGenre: (genre: GenreDuFil) => void
  nombreDansLeBouton: number
  publications: Publication[]
  /** Vrai si un filtre est choisi. */
  filtre: boolean
  toutVoir: () => void
}

/**
 * Le haut du fil (BarreDuFil de yibolo-client) : la recherche, « Ville »,
 * « Type », « Plus de filtres » et le menu ⋮, puis les filtres choisis en
 * pastilles qu'on retire d'un geste, et les domaines — sauf à partir de `2xl`,
 * où la colonne de gauche les porte. La recherche reste en haut pendant qu'on
 * fait défiler le fil.
 */
export function BarreDuFil({ filtres, changer, changerDeGenre, nombreDansLeBouton, publications, filtre, toutVoir }: BarreDuFilProps) {
  const { t } = useTranslation('accueil')
  const villes = useVilles()
  const nomVille = villes.find((v) => v.id === filtres.ville)?.nom

  const pastilles: { cle: string; libelle: string; retirer: () => void }[] = []
  if (filtres.enregistres) pastilles.push({ cle: 'vue', libelle: t('filtres.mesEnregistres'), retirer: () => changer({ enregistres: false }) })
  if (filtres.miennes) pastilles.push({ cle: 'miennes', libelle: t('filtres.mesPublications'), retirer: () => changer({ miennes: false }) })
  if (filtres.ville) pastilles.push({ cle: 'ville', libelle: nomVille ?? filtres.ville, retirer: () => changer({ ville: undefined }) })
  if (filtres.sujet) pastilles.push({ cle: 'sujet', libelle: `#${filtres.sujet}`, retirer: () => changer({ sujet: undefined }) })
  if (filtres.genre !== 'tout') pastilles.push({ cle: 'genre', libelle: t(`genres.${filtres.genre}`), retirer: () => changer({ genre: 'tout' }) })
  if (filtres.tri !== 'recentes') pastilles.push({ cle: 'tri', libelle: t(`tris.${filtres.tri}`), retirer: () => changer({ tri: 'recentes' }) })

  // Un fragment, pas un bloc : un élément `sticky` reste prisonnier de son
  // parent, et la barre doit tenir en haut sur toute la hauteur du fil.
  return (
    <>
      {/* Collée sous la barre du haut du site (68 px). */}
      <div className="sticky top-[68px] z-20 -mx-3 -mt-3 -mb-2 flex flex-col gap-2.5 rounded-t-xl bg-white/95 px-3 pt-3 pb-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <ChampDeRecherche recherche={filtres.recherche} onRecherche={(recherche) => changer({ recherche })} />

          <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            <Deroulant
              bouton={
                <>
                  {nomVille ?? t('filtres.ville')}
                  <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
                </>
              }
              classesBouton={cn(CLASSES_BOUTON_FILTRE, filtres.ville ? CLASSES_FILTRE_ACTIF : CLASSES_FILTRE_NEUTRE)}
              classesPanneau="max-h-[min(22rem,70dvh)] w-[13rem] overflow-y-auto p-1"
            >
              {(fermer) => (
                <div role="radiogroup" aria-label={t('filtres.ville')} className="flex flex-col">
                  {[{ id: '', nom: t('filtres.toutesLesVilles') }, ...villes].map((v) => {
                    const choisie = (filtres.ville ?? '') === v.id
                    return (
                      <button
                        key={v.id || 'toutes'}
                        type="button"
                        role="radio"
                        aria-checked={choisie}
                        onClick={() => {
                          changer({ ville: v.id || undefined })
                          fermer()
                        }}
                        className={CLASSES_CHOIX_RADIO}
                      >
                        <span className="flex size-4 shrink-0 items-center justify-center">{choisie && <Check className="size-4 text-brand-600" aria-hidden="true" />}</span>
                        {v.nom}
                      </button>
                    )
                  })}
                </div>
              )}
            </Deroulant>

            <MenuDuType genre={filtres.genre} onChange={changerDeGenre} />

            <BoutonFiltres filtres={filtres} nombre={nombreDansLeBouton} changer={changer} />

            <MenuAutres filtres={filtres} changer={changer} filtre={filtre} toutVoir={toutVoir} />
          </div>
        </div>

        {pastilles.length > 0 && (
          <ul aria-label={t('filtres.actifs')} className="flex flex-wrap gap-2">
            {pastilles.map((pastille) => (
              <li key={pastille.cle}>
                <button
                  type="button"
                  onClick={pastille.retirer}
                  aria-label={t('filtres.retirer', { filtre: pastille.libelle })}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-brand-50 pr-2 pl-3 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                >
                  {pastille.libelle}
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="2xl:hidden">
        {GENRES_DE_PUBLICATIONS.includes(filtres.genre) && (
          <MenuDesDomaines choisis={filtres.domaines} onChange={(domaines) => changer({ domaines })} publications={publications} />
        )}

        {filtres.domaines.length > 0 && filtres.genre === 'tout' && filtres.tri === 'recentes' && !filtres.enregistres && !filtres.miennes && !filtres.sujet && (
          <p className="mt-2 text-xs text-muted">{t('domaines.seulementLesPublications')}</p>
        )}
      </div>
    </>
  )
}

function ChampDeRecherche({ recherche, onRecherche }: { recherche: string; onRecherche: (recherche: string) => void }) {
  const { t } = useTranslation('accueil')
  const [saisie, setSaisie] = useState(recherche)
  const [rechercheConnue, setRechercheConnue] = useState(recherche)
  const minuteur = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(minuteur.current), [])

  // La recherche change ailleurs (« Tout voir », retour arrière) : le champ suit.
  if (recherche !== rechercheConnue) {
    setRechercheConnue(recherche)
    setSaisie(recherche)
  }

  const lancer = (valeur: string) => {
    window.clearTimeout(minuteur.current)
    onRecherche(valeur)
  }

  return (
    <form
      role="search"
      className="flex h-[2.5rem] min-w-0 flex-1 rounded-md transition-shadow focus-within:ring-4 focus-within:ring-brand-600/15"
      onSubmit={(evenement) => {
        evenement.preventDefault()
        lancer(saisie)
      }}
    >
      <div className="relative min-w-0 flex-1">
        <input
          type="search"
          aria-label={t('recherche.libelle')}
          enterKeyHint="search"
          autoComplete="off"
          value={saisie}
          onChange={(evenement) => {
            const valeur = evenement.target.value
            setSaisie(valeur)
            window.clearTimeout(minuteur.current)
            minuteur.current = window.setTimeout(() => onRecherche(valeur), ATTENTE_DE_SAISIE)
          }}
          placeholder={t('recherche.placeholder')}
          className="h-full w-full rounded-l-md border border-r-0 border-line bg-white pr-9 pl-3.5 text-[0.8125rem] text-ink outline-none placeholder:text-slate-400 focus:border-brand-600 [&::-webkit-search-cancel-button]:hidden"
        />
        {saisie && (
          <button
            type="button"
            aria-label={t('recherche.effacer')}
            title={t('recherche.effacer')}
            onClick={() => {
              setSaisie('')
              lancer('')
            }}
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-page hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <button
        type="submit"
        aria-label={t('recherche.libelle')}
        className="flex w-[2.75rem] shrink-0 items-center justify-center rounded-r-md bg-brand-600 text-white transition-colors hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Search className="size-[1.125rem]" aria-hidden="true" />
      </button>
    </form>
  )
}

function MenuDuType({ genre, onChange }: { genre: GenreDuFil; onChange: (genre: GenreDuFil) => void }) {
  const { t } = useTranslation('accueil')
  return (
    <Deroulant
      bouton={
        <>
          {t('filtres.type')}
          <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
        </>
      }
      classesBouton={cn(CLASSES_BOUTON_FILTRE, genre === 'tout' ? CLASSES_FILTRE_NEUTRE : CLASSES_FILTRE_ACTIF)}
      classesPanneau="w-[13rem] p-1"
    >
      {(fermer) => (
        <div role="radiogroup" aria-label={t('filtres.type')} className="flex flex-col">
          {GENRES_DU_FIL.map((un) => (
            <button
              key={un}
              type="button"
              role="radio"
              aria-checked={genre === un}
              onClick={() => {
                onChange(un)
                fermer()
              }}
              className={CLASSES_CHOIX_RADIO}
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                {genre === un && <Check className="size-4 text-brand-600" aria-hidden="true" />}
              </span>
              {t(`genres.${un}`)}
            </button>
          ))}
        </div>
      )}
    </Deroulant>
  )
}

/** La vue et l'ordre : une petite fenêtre, appliquée dès qu'on touche. */
function BoutonFiltres({ filtres, nombre, changer }: { filtres: FiltresDuFil; nombre: number; changer: (suite: Partial<FiltresDuFil>) => void }) {
  const { t } = useTranslation('accueil')
  const { genre, tri, enregistres, miennes } = filtres
  const ordonnable = GENRES_DE_PUBLICATIONS.includes(genre)

  return (
    <Deroulant
      align="end"
      bouton={
        <>
          {t('filtres.bouton')}
          {nombre > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-caption3 font-semibold text-white tabular-nums">
              {nombre}
            </span>
          )}
          <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
        </>
      }
      classesBouton={cn(CLASSES_BOUTON_FILTRE, 'relative', nombre > 0 ? CLASSES_FILTRE_ACTIF : CLASSES_FILTRE_NEUTRE)}
      classesPanneau="w-[21rem] gap-4 p-4"
    >
      {(fermer) => (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-semibold text-ink">{t('filtres.titre')}</p>
            {nombre > 0 && (
              <button
                type="button"
                onClick={() => changer({ enregistres: false, miennes: false, genre: 'tout', tri: 'recentes' })}
                className="rounded text-xs font-medium text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
              >
                {t('filtres.reinitialiser')}
              </button>
            )}
          </div>

          <div role="group" aria-label={t('filtres.vue')} className="grid grid-cols-2 gap-1 rounded-xl bg-page p-1">
            {([false, true] as const).map((vue) => (
              <button
                key={String(vue)}
                type="button"
                aria-pressed={enregistres === vue && !miennes}
                onClick={() => changer({ enregistres: vue, miennes: false })}
                className={cn(
                  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none',
                  enregistres === vue && !miennes ? 'bg-white font-semibold text-ink shadow-sm' : 'font-medium text-muted hover:text-ink',
                )}
              >
                {vue && <Bookmark className="size-3.5" aria-hidden="true" />}
                {vue ? t('filtres.mesEnregistres') : t('filtres.toutLeFil')}
              </button>
            ))}
          </div>

          {enregistres || miennes ? (
            <p className="text-xs leading-relaxed text-muted">{t(miennes ? 'filtres.miennesExplique' : 'filtres.enregistresExplique')}</p>
          ) : (
            ordonnable && (
              <fieldset className="flex flex-col gap-2">
                <legend className="pb-2 text-xs font-semibold tracking-wider text-muted uppercase">{t('filtres.ordre')}</legend>
                <div className="flex flex-wrap gap-2">
                  {TRIS_DU_FIL.map((un) => (
                    <Choix key={un} choisi={tri === un} onClick={() => changer({ tri: un })}>
                      {t(`tris.${un}`)}
                    </Choix>
                  ))}
                </div>
                {tri === 'lues' && genre === 'tout' && <p className="text-xs leading-relaxed text-muted">{t('filtres.luesSeulementPublications')}</p>}
              </fieldset>
            )
          )}

          <button
            type="button"
            onClick={fermer}
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('filtres.voir')}
          </button>
        </>
      )}
    </Deroulant>
  )
}

function Choix({ choisi, onClick, children }: { choisi: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={choisi}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none',
        choisi ? 'border-brand-600 bg-brand-600 font-semibold text-white' : 'border-line bg-white font-medium text-ink hover:bg-page',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Le menu ⋮ : réinitialiser les filtres, ses publications, ses publications
 * enregistrées, et le lien de la recherche en cours à partager.
 */
function MenuAutres({ filtres, changer, filtre, toutVoir }: { filtres: FiltresDuFil; changer: (suite: Partial<FiltresDuFil>) => void; filtre: boolean; toutVoir: () => void }) {
  const { t } = useTranslation('accueil')
  const { copierLeLien } = usePartage()

  return (
    <Deroulant
      align="end"
      etiquette={t('filtres.autres')}
      titre={t('filtres.autres')}
      bouton={<EllipsisVertical className="size-4" aria-hidden="true" />}
      classesBouton="inline-flex size-[2.5rem] shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-page hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none data-[state=open]:bg-page"
      classesPanneau="min-w-[15rem] p-1"
    >
      {(fermer) => (
        <>
          <ChoixDuMenu
            onClick={() => {
              fermer()
              changer({ miennes: !filtres.miennes })
            }}
          >
            <PenLine aria-hidden="true" />
            {filtres.miennes ? t('filtres.toutLeFil') : t('filtres.mesPublications')}
          </ChoixDuMenu>
          <ChoixDuMenu
            onClick={() => {
              fermer()
              changer({ enregistres: !filtres.enregistres })
            }}
          >
            <Bookmark aria-hidden="true" />
            {filtres.enregistres ? t('filtres.toutLeFil') : t('filtres.publicationsEnregistrees')}
          </ChoixDuMenu>
          <ChoixDuMenu
            onClick={() => {
              fermer()
              void copierLeLien(`${ROUTES.accueil}${window.location.search}`)
            }}
          >
            <Link2 aria-hidden="true" />
            {t('filtres.copierLaRecherche')}
          </ChoixDuMenu>
          {filtre && (
            <>
              <SeparateurDuMenu />
              <ChoixDuMenu
                onClick={() => {
                  fermer()
                  toutVoir()
                }}
              >
                <RotateCcw aria-hidden="true" />
                {t('filtres.reinitialiserLesFiltres')}
              </ChoixDuMenu>
            </>
          )}
        </>
      )}
    </Deroulant>
  )
}
