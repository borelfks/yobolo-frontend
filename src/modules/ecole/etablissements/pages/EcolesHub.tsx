import { useTranslation } from 'react-i18next'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { SkeletonZone } from '@/shared/blocs/Squelettes'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { RechercheEcole, RangeeEcole, VideEcole } from '@/modules/ecole/etablissements/components/Ecole'
import { SqueletteVignettes } from '@/modules/ecole/etablissements/components/Vignette'
import { useEcolesResumees } from '@/modules/ecole/etablissements/hooks/useEcolesResumees'
import { parPertinence, type GenreEcole } from '@/modules/ecole/etablissements/schoolListing'
import { useParametresRecherche } from '@/shared/hooks/useParametresRecherche'
import { ROUTES } from '@/shared/utils/routes'

const RANGEES: { genre: GenreEcole; lien: string }[] = [
  { genre: 'ipes', lien: ROUTES.schoolType('ipes') },
  { genre: 'cfp', lien: ROUTES.schoolType('cfp') },
  { genre: 'autres', lien: ROUTES.schoolType('autres') },
  { genre: 'auto', lien: ROUTES.drivingSchools },
]

/**
 * École (planches « École ») : la recherche (établissement ou formation, ville)
 * puis une rangée par type : IPES, CFP, Autres établissements, Auto-écoles,
 * avec leurs 4 premières vignettes ; une recherche montre tous les résultats.
 * Recherche et ville sont dans l'adresse (`?q=…&ville=…`).
 */
export function EcolesHub() {
  const { t } = useTranslation('schools')
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-4 sm:px-4 sm:pt-6 sm:pb-10">
      {/* La planche n'a pas de titre visible : il est lu par les lecteurs d'écran. */}
      <h1 className="sr-only">{t('ui.ariane.ecole')}</h1>
      <ChargementDonnees fallback={<SquelettePageEcole />}>
        <ContenuEcole />
      </ChargementDonnees>
    </div>
  )
}

function ContenuEcole() {
  const { t } = useTranslation('schools')
  const ecoles = useEcolesResumees()
  const [params, setParams] = useParametresRecherche()
  const q = params.get('q') ?? ''
  const ville = params.get('ville') ?? ''
  const changer = (cle: 'q' | 'ville', valeur: string) =>
    setParams(
      (p) => {
        if (valeur) p.set(cle, valeur)
        else p.delete(cle)
        return p
      },
      { replace: true },
    )
  const rq = q.trim().toLowerCase()
  const cherche = Boolean(rq || ville)
  const passe = (e: (typeof ecoles)[number]) =>
    (!ville || e.ville === ville) && (!rq || [e.nom, e.sigle, e.quartier, ...e.formations.flatMap((f) => [f.nom, f.domaine ?? '', f.diplome])].join(' ').toLowerCase().includes(rq))
  const villes = [...new Set(ecoles.map((e) => e.ville))].sort((a, b) => a.localeCompare(b))
  const rangees = RANGEES.map((r) => {
    const tous = ecoles.filter((e) => e.genre === r.genre)
    const trouves = tous.filter(passe).sort(parPertinence)
    return { ...r, tous, trouves }
  })
  return (
    <>
      <RechercheEcole q={q} ville={ville} villes={villes} onQ={(v) => changer('q', v)} onVille={(v) => changer('ville', v)} />
      {rangees.map((r) => r.trouves.length > 0 && <RangeeEcole key={r.genre} genre={r.genre} lien={r.lien} tous={r.tous} montres={cherche ? r.trouves : r.trouves.slice(0, 4)} cherche={cherche} />)}
      {rangees.every((r) => r.trouves.length === 0) && (
        <VideEcole
          titre={t('ecole.vide', { q: q.trim() || ville })}
          onEffacer={() =>
            setParams(
              (p) => {
                p.delete('q')
                p.delete('ville')
                return p
              },
              { replace: true },
            )
          }
        />
      )}
    </>
  )
}

/** Squelette de la page École : la recherche puis deux rangées de vignettes. */
function SquelettePageEcole() {
  return (
    <SkeletonZone className="gap-2 sm:gap-4">
      <div className="flex flex-wrap gap-2.5 border-b border-border bg-card px-4 py-3.5 sm:rounded-lg sm:border sm:p-4">
        <Skeleton className="h-11 flex-[1_1_220px]" />
        <Skeleton className="h-11 flex-[1_1_180px]" />
        <Skeleton className="h-11 w-full rounded-full sm:w-32" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col gap-3.5 border-y border-border bg-card py-4 sm:rounded-lg sm:border">
          <div className="flex flex-col gap-2 px-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          <div className="sm:px-4">
            <SqueletteVignettes />
          </div>
        </div>
      ))}
    </SkeletonZone>
  )
}
