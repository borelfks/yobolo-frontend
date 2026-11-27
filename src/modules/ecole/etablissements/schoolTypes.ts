import type { TypeEcole, TypeSlug } from '@/shared/types'

/**
 * Configuration des types d'école : ce n'est pas une donnée (elle ne change
 * pas d'un établissement à l'autre), c'est la correspondance entre les
 * adresses (`/ecoles/ipes|cfp|autres`) et les types, et la couleur des badges.
 * Les chiffres de chaque type sont dans la base (table `typesEcole`).
 */

/** Couleur du badge de chaque type. */
export const typeTone: Record<TypeEcole, 'blue' | 'violet' | 'orange' | 'green'> = {
  IPES: 'blue',
  CFP: 'violet',
  'Auto-école': 'orange',
  Autre: 'green',
}

/** Le type d'école d'une adresse. */
export const typeOfSlug: Record<TypeSlug, TypeEcole> = { ipes: 'IPES', cfp: 'CFP', autres: 'Autre' }

/** L'adresse d'un type d'école. */
export const slugOfType = (t: TypeEcole): TypeSlug | 'auto-ecoles' =>
  t === 'IPES' ? 'ipes' : t === 'CFP' ? 'cfp' : t === 'Autre' ? 'autres' : 'auto-ecoles'

export const isTypeSlug = (s?: string): s is TypeSlug => s === 'ipes' || s === 'cfp' || s === 'autres'
