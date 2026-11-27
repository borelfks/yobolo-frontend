import type { Etablissement, Formation, TypeSlug } from '@/shared/types'
import { typeOfSlug } from '@/modules/ecole/etablissements/schoolTypes'

/**
 * Formations publiées des établissements d'un type (IPES, CFP, Autres).
 * Les formations et établissements viennent de la base (hooks de @/data/hooks),
 * passés par l'écran.
 */
export const formationsOfType = (type: TypeSlug, formations: Formation[], etablissements: Etablissement[]) =>
  formations.filter((f) => {
    // Comme avant, un identifiant inconnu renvoie le premier établissement.
    const e = etablissements.find((x) => x.id === f.etablissementId) ?? etablissements[0]
    return f.statut === 'Publiée' && e?.type === typeOfSlug[type]
  })
