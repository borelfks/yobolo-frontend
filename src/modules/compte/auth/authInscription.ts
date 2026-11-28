import type { Role, TypeEcole } from '@/shared/types'
import type { Autorite } from '@/shared/utils/accords'

/**
 * L'inscription (canevas « Personne physique » et « École ») : profils,
 * étapes, types d'établissement et ce qui en dépend.
 */

/** Les profils, dans l'ordre du canevas ; Consultant et Entreprise sont « Bientôt disponible ». */
export const PROFILS = ['personne', 'ecole', 'consultant', 'entreprise'] as const
export type Profil = (typeof PROFILS)[number]
export const profilOuvert = (p: Profil) => p === 'personne' || p === 'ecole'

export type Etape = 'profil' | 'vous' | 'acces' | 'infos' | 'code' | 'verification'
export const ETAPES: Record<'personne' | 'ecole', Etape[]> = {
  personne: ['profil', 'vous', 'acces', 'code'],
  ecole: ['profil', 'infos', 'code', 'verification'],
}

/** Les types d'établissement de l'étape « Infos ». */
export const TYPES_ETABLISSEMENT = ['ipes', 'cfp', 'autres', 'auto'] as const
export type TypeEtablissement = (typeof TYPES_ETABLISSEMENT)[number]

/** Pour chaque type : son type d'école, le rôle du compte, l'autorité proposée et l'exemple de numéro d'accord. */
export const PAR_TYPE: Record<TypeEtablissement, { type: TypeEcole; role: Exclude<Role, 'utilisateur'>; autorite: Autorite; exemple: 'minesup' | 'minefop' | 'mint' }> = {
  ipes: { type: 'IPES', role: 'ipes', autorite: 'MINESUP', exemple: 'minesup' },
  cfp: { type: 'CFP', role: 'cfp', autorite: 'MINEFOP', exemple: 'minefop' },
  autres: { type: 'Autre', role: 'autre', autorite: 'MINEFOP', exemple: 'minefop' },
  // Pas encore d'espace auto-école : le compte est rattaché aux « Autres » (son établissement garde le type Auto-école).
  auto: { type: 'Auto-école', role: 'autre', autorite: 'MINT', exemple: 'mint' },
}

/** Le type de l'étape « Infos » à partir d'un compte déjà enregistré (reprise). */
export const typeDuCompte = (t?: TypeEcole): TypeEtablissement =>
  (Object.keys(PAR_TYPE) as TypeEtablissement[]).find((k) => PAR_TYPE[k].type === t) ?? 'ipes'

/** Les fonctions du responsable (libellés : auth, inscription.fonctions.<clé>). */
export const FONCTIONS = ['directeur', 'promoteur', 'fondateur', 'directeurEtudes', 'responsableAdministratif', 'gerant', 'secretaire', 'autre'] as const
