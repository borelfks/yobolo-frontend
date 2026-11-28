import { useTranslation } from 'react-i18next'
import { usePermisListe } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { EmptyState } from '@/shared/blocs/Etats'
import { Button } from '@/shared/shadcn/button'
import { useParametresRecherche } from '@/shared/hooks/useParametresRecherche'
import type { PermisCode } from '@/shared/types'
import { pageDe } from '@/shared/utils/pages'
import { ROUTES } from '@/shared/utils/routes'
import { Ariane } from '@/modules/ecole/etablissements/components/Bases'
import { EnteteListe, RangeePilules } from '@/modules/ecole/etablissements/components/liste/EnteteListe'
import { FiltreListe } from '@/modules/ecole/etablissements/components/liste/FiltreListe'
import { BarreResultats, PaginationListe } from '@/modules/ecole/etablissements/components/liste/Resultats'
import { GrilleVignettes, SquelettePageListe, VignetteEcole } from '@/modules/ecole/etablissements/components/Vignette'
import { useEcolesResumees } from '@/modules/ecole/etablissements/hooks/useEcolesResumees'
import {
  basculer,
  FILTRES_AUTO_ECOLES,
  lireSelection,
  optionsDuFiltre,
  PAR_PAGE,
  parmi,
  passeFiltres,
  TRIS_AUTO_ECOLES,
  trierAutoEcoles,
  valeursAutoEcole,
  type FiltreAutoEcole,
  type GenreEcole,
} from '@/modules/ecole/etablissements/schoolListing'
import { TuilesPermis } from '@/modules/ecole/auto-ecoles/components/liste/TuilesPermis'

/**
 * La liste des auto-écoles (planche « Auto-écoles ») : le même gabarit que
 * les listes d'établissements (en-tête, types, filtres Permis et Ville),
 * plus « Les permis » qui se cochent comme le filtre. Filtres, tri et page
 * sont dans l'adresse.
 */
export function AutoEcoles() {
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-3 sm:px-4 sm:pt-4 sm:pb-10">
      <ChargementDonnees fallback={<SquelettePageListe />}>
        <ListeAutoEcoles />
      </ChargementDonnees>
    </div>
  )
}

function ListeAutoEcoles() {
  const { t } = useTranslation('driving-schools')
  const ecoles = useEcolesResumees()
  const catalogue = usePermisListe()
  const [params, setParams] = useParametresRecherche()
  const selection = lireSelection(params, FILTRES_AUTO_ECOLES)
  const tri = parmi(params.get('tri'), TRIS_AUTO_ECOLES)
  const tous = ecoles.filter((e) => e.genre === 'auto')
  const nombres = Object.fromEntries((['ipes', 'cfp', 'autres', 'auto'] as GenreEcole[]).map((g) => [g, ecoles.filter((e) => e.genre === g).length])) as Record<GenreEcole, number>
  const passe = (e: (typeof tous)[number], sauf?: FiltreAutoEcole) => passeFiltres((f) => valeursAutoEcole(e, f), selection, FILTRES_AUTO_ECOLES, sauf)
  const liste = trierAutoEcoles(tous.filter((e) => passe(e)), tri)
  const { page, pages, elements } = pageDe(liste, Number(params.get('page') ?? 1), PAR_PAGE)
  const resultats = t('liste.resultats', { count: liste.length })

  const modifier = (maj: (p: URLSearchParams) => void) =>
    setParams((p) => {
      maj(p)
      p.delete('page')
      return p
    })
  const cocher = (f: FiltreAutoEcole, valeurs: string[]) =>
    modifier((p) => {
      p.delete(f)
      valeurs.forEach((v) => p.append(f, v))
    })
  const toutEffacer = () => modifier((p) => FILTRES_AUTO_ECOLES.forEach((k) => p.delete(k)))
  const aFiltres = FILTRES_AUTO_ECOLES.some((f) => selection[f].length > 0)

  const libelleOption = (f: FiltreAutoEcole, v: string) => (f === 'permis' ? t('liste.optionPermis', { code: v, nom: t(`permis.${v as PermisCode}.name`) }) : v)
  const options = (f: FiltreAutoEcole) =>
    optionsDuFiltre(tous, f, valeursAutoEcole, (e) => passe(e, f))
      .map((o) => ({ ...o, libelle: libelleOption(f, o.valeur) }))
      .sort((a, b) => (f === 'permis' ? a.valeur.localeCompare(b.valeur) : b.nombre - a.nombre || a.libelle.localeCompare(b.libelle)))
  // Les permis proposés par au moins une auto-école, dans l'ordre A → E.
  const proposes = new Set(tous.flatMap((e) => e.permis))
  const tuiles = catalogue.filter((p) => proposes.has(p.code)).map((p) => ({ code: p.code, nom: t(`permis.${p.code}.name`), duree: t(`permis.${p.code}.duration`), ageMin: p.ageMin }))

  return (
    <>
      <Ariane items={[{ label: t('common.crumbs.school'), to: ROUTES.schools }, { label: t('liste.titre') }]} />
      <EnteteListe
        titre={t('liste.titre')}
        intro={t('liste.intro')}
        genre="auto"
        nombres={nombres}
        filtres={
          <RangeePilules>
            {FILTRES_AUTO_ECOLES.map((f) => (
              <FiltreListe key={f} titre={t(`liste.filtres.${f}`)} options={options(f)} coches={selection[f]} onChange={(v) => cocher(f, v)} recherche={f === 'ville' ? t('liste.chercherVille') : undefined} resultats={resultats} />
            ))}
            {aFiltres && (
              <Button variant="link" className="flex-none px-1.5" onClick={toutEffacer}>
                {t('liste.toutEffacer')}
              </Button>
            )}
          </RangeePilules>
        }
      />
      <TuilesPermis permis={tuiles} coches={selection.permis} onBasculer={(code: PermisCode) => cocher('permis', basculer(selection.permis, code))} />
      <BarreResultats
        texte={resultats}
        tri={{
          valeur: tri,
          options: TRIS_AUTO_ECOLES.map((v) => ({ valeur: v, libelle: t(`liste.tris.${v}`) })),
          onChange: (v) => modifier((p) => (v === 'pertinence' ? p.delete('tri') : p.set('tri', v))),
        }}
      />
      {liste.length === 0 ? (
        <EmptyState
          titre={t('liste.vide')}
          className="rounded-none border-x-0 sm:rounded-lg sm:border-x"
          action={
            <Button variant="secondary" onClick={toutEffacer}>
              {t('liste.reinitialiser')}
            </Button>
          }
        />
      ) : (
        <>
          <GrilleVignettes>
            {elements.map((e) => (
              <VignetteEcole key={e.id} ecole={e} />
            ))}
          </GrilleVignettes>
          <PaginationListe
            page={page}
            pages={pages}
            total={liste.length}
            parPage={PAR_PAGE}
            unite={t('liste.unite', { count: liste.length })}
            onPage={(n) => setParams((p) => (n > 1 ? p.set('page', String(n)) : p.delete('page'), p))}
          />
        </>
      )}
    </>
  )
}
