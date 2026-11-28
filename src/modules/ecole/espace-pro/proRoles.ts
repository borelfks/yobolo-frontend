/** Rôles des données (en français) → clé de traduction (nom et description du canevas). */
export const CLES_ROLES = {
  Administrateur: 'admin',
  'Responsable pédagogique': 'pedagogie',
  Communication: 'communication',
  Secrétariat: 'secretariat',
  Consultation: 'lecture',
} as const

export type CleRole = (typeof CLES_ROLES)[keyof typeof CLES_ROLES]

export const cleRole = (nom: string): CleRole | undefined => (nom in CLES_ROLES ? CLES_ROLES[nom as keyof typeof CLES_ROLES] : undefined)
