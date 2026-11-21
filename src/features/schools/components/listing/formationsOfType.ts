import { etablissementById, formations, typeConfig } from '@/mocks/schools'
import type { TypeSlug } from '@/shared/types'

/** Formations publiées des établissements d'un type (IPES, CFP, Autres). */
export const formationsOfType = (type: TypeSlug) => formations.filter((f) => f.statut === 'Publiée' && etablissementById(f.etablissementId).type === typeConfig[type].type)
