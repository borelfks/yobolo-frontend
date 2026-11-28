import { useCollection } from '@/data'
import { useAutoEcoles, useEtablissements, useFormations } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'
import type { EcoleResumee } from '@/modules/ecole/etablissements/schoolListing'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'

const ORDRE_PERMIS: PermisCode[] = ['A', 'B', 'C', 'D', 'E']

/**
 * Toutes les écoles (établissements et auto-écoles) sous la forme commune des
 * listes, avec leurs vrais chiffres : note et nombre d'avis, formations
 * publiées. Un établissement est « vérifié » quand ses accords de création ou
 * d'ouverture sont enregistrés (table `accordsEtablissement`).
 */
export function useEcolesResumees(): EcoleResumee[] {
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const formations = useFormations().filter((f) => f.statut === 'Publiée')
  const accords = new Set(useCollection('accordsEtablissement').map((a) => a.etablissementId))
  const etabs: EcoleResumee[] = etablissements.map((e) => {
    const genre = slugOfType(e.type)
    return {
      id: e.id,
      genre: genre === 'auto-ecoles' ? 'auto' : genre,
      nom: e.nom,
      sigle: e.sigle,
      image: e.image,
      logo: e.logo ?? e.vignette,
      ville: e.ville,
      quartier: e.quartier,
      region: e.region,
      verifie: accords.has(e.id),
      note: e.note,
      nbAvis: e.avis,
      filieres: e.filieres,
      formations: formations.filter((f) => f.etablissementId === e.id),
      rentree: e.rentree,
      permis: [],
      href: genre === 'auto-ecoles' ? ROUTES.drivingSchool(e.id) : ROUTES.school(genre, e.id),
      favori: 'etablissement',
    }
  })
  const autos: EcoleResumee[] = autoEcoles.map((a) => ({
    id: a.id,
    genre: 'auto',
    nom: a.nom,
    sigle: '',
    image: a.image,
    logo: a.logo,
    ville: a.ville,
    quartier: a.quartier,
    region: a.region,
    verifie: false,
    note: a.note,
    nbAvis: a.avis,
    filieres: [],
    formations: [],
    rentree: '',
    creation: a.creation,
    permis: ORDRE_PERMIS.filter((c) => a.permis.includes(c)),
    href: ROUTES.drivingSchool(a.id),
    favori: 'auto-ecole',
  }))
  return [...etabs, ...autos]
}
