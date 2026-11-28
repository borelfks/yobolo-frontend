import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/blocs/Etats'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Button } from '@/shared/shadcn/button'
import { useParametresRecherche } from '@/shared/hooks/useParametresRecherche'
import { pageDe } from '@/shared/utils/pages'
import { ROUTES } from '@/shared/utils/routes'
import { Ariane } from '@/modules/ecole/etablissements/components/Bases'
import { EnteteListe, RangeePilules } from '@/modules/ecole/etablissements/components/liste/EnteteListe'
import { FiltreBascule, FiltreListe } from '@/modules/ecole/etablissements/components/liste/FiltreListe'
import { BarreResultats, PaginationListe } from '@/modules/ecole/etablissements/components/liste/Resultats'
import { GrilleVignettes, SquelettePageListe, VignetteEcole } from '@/modules/ecole/etablissements/components/Vignette'
import { useEcolesResumees } from '@/modules/ecole/etablissements/hooks/useEcolesResumees'
import {
  FILTRES_ETABLISSEMENTS,
  lireSelection,
  optionsDuFiltre,
  PAR_PAGE,
  parmi,
  passeFiltres,
  TRIS_ETABLISSEMENTS,
  trierEtablissements,
  valeursEtablissement,
  type FiltreEtablissement,
  type GenreEcole,
} from '@/modules/ecole/etablissements/schoolListing'
import { isTypeSlug } from '@/modules/ecole/etablissements/schoolTypes'
import type { TypeSlug } from '@/shared/types'

/**
 * Liste d'un type d'établissement (planches « IPES / CFP / Autres : liste ») :
 * un seul gabarit. En-tête (titre, types, filtres Ville, Diplôme, Domaine,
 * Cours, Établissement vérifié), nombre de résultats et tri, vignettes,
 * pagination. Filtres, tri et page sont dans l'adresse.
 */
export function TypeListing() {
  const { type, tab } = useParams({ strict: false })
  if (!isTypeSlug(type)) return <Navigate to={ROUTES.schools} replace />
  // Les anciens onglets (filières, diplômes, régions…) n'existent plus : la liste les remplace.
  if (tab) return <Navigate to={ROUTES.schoolType(type)} replace />
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-3 sm:px-4 sm:pt-4 sm:pb-10">
      <ChargementDonnees fallback={<SquelettePageListe />}>
        <ListeType type={type} />
      </ChargementDonnees>
    </div>
  )
}

function ListeType({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const ecoles = useEcolesResumees()
  const [params, setParams] = useParametresRecherche()
  const selection = lireSelection(params, FILTRES_ETABLISSEMENTS)
  const verifie = params.get('verifie') === '1'
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const tri = parmi(params.get('tri'), TRIS_ETABLISSEMENTS)
  const tous = ecoles.filter((e) => e.genre === type)
  const nombres = Object.fromEntries((['ipes', 'cfp', 'autres', 'auto'] as GenreEcole[]).map((g) => [g, ecoles.filter((e) => e.genre === g).length])) as Record<GenreEcole, number>
  const passe = (e: (typeof tous)[number], sauf?: FiltreEtablissement) =>
    passeFiltres((f) => valeursEtablissement(e, f), selection, FILTRES_ETABLISSEMENTS, sauf) &&
    (!verifie || e.verifie) &&
    (!q || [e.nom, e.sigle, e.quartier, e.ville, ...e.formations.flatMap((f) => [f.nom, f.domaine ?? ''])].join(' ').toLowerCase().includes(q))
  const liste = trierEtablissements(tous.filter((e) => passe(e)), tri)
  const { page, pages, elements } = pageDe(liste, Number(params.get('page') ?? 1), PAR_PAGE)
  const resultats = t('liste.etablissements', { count: liste.length })

  const modifier = (maj: (p: URLSearchParams) => void) =>
    setParams((p) => {
      maj(p)
      p.delete('page')
      return p
    })
  const cocher = (f: FiltreEtablissement, valeurs: string[]) =>
    modifier((p) => {
      p.delete(f)
      valeurs.forEach((v) => p.append(f, v))
    })
  const toutEffacer = () => modifier((p) => [...FILTRES_ETABLISSEMENTS, 'verifie', 'q'].forEach((k) => p.delete(k)))
  const aFiltres = FILTRES_ETABLISSEMENTS.some((f) => selection[f].length > 0) || verifie || Boolean(q)

  const libelleOption = (f: FiltreEtablissement, v: string) => (f === 'cours' ? t(`liste.cours.${v as 'jour' | 'soir'}`) : v)
  const options = (f: FiltreEtablissement) =>
    optionsDuFiltre(tous, f, valeursEtablissement, (e) => passe(e, f))
      .map((o) => ({ ...o, libelle: libelleOption(f, o.valeur) }))
      .sort((a, b) => (f === 'cours' ? a.valeur.localeCompare(b.valeur) : b.nombre - a.nombre || a.libelle.localeCompare(b.libelle)))

  return (
    <>
      <Ariane items={[{ label: t('ui.ariane.ecole'), to: ROUTES.schools }, { label: t(`liste.titres.${type}`) }]} />
      <EnteteListe
        titre={t(`liste.titres.${type}`)}
        intro={t(`liste.intros.${type}`)}
        genre={type}
        nombres={nombres}
        filtres={
          <RangeePilules>
            {FILTRES_ETABLISSEMENTS.map((f) => (
              <FiltreListe
                key={f}
                titre={t(`liste.filtres.${f}`)}
                options={options(f)}
                coches={selection[f]}
                onChange={(v) => cocher(f, v)}
                recherche={f === 'cours' ? undefined : t(`liste.chercher.${f}`)}
                resultats={resultats}
              />
            ))}
            <FiltreBascule libelle={t('ui.verifie')} actif={verifie} onChange={(on) => modifier((p) => (on ? p.set('verifie', '1') : p.delete('verifie')))} />
            {aFiltres && (
              <Button variant="link" className="flex-none px-1.5" onClick={toutEffacer}>
                {t('ui.toutEffacer')}
              </Button>
            )}
          </RangeePilules>
        }
      />
      <BarreResultats
        texte={resultats}
        tri={{
          valeur: tri,
          options: TRIS_ETABLISSEMENTS.map((v) => ({ valeur: v, libelle: t(`liste.tris.${v}`) })),
          onChange: (v) => modifier((p) => (v === 'pertinence' ? p.delete('tri') : p.set('tri', v))),
        }}
      />
      {liste.length === 0 ? (
        <EmptyState
          titre={t('liste.vide')}
          className="rounded-none border-x-0 sm:rounded-lg sm:border-x"
          action={
            <Button variant="secondary" onClick={toutEffacer}>
              {t('ui.reinitialiser')}
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
