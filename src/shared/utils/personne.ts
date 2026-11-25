/**
 * Les choix proposés à une personne physique (repris de yibolo-client) :
 * civilité et nationalité. Les libellés sont dans le namespace `common`
 * (`personne.civilites.*`, `personne.nationalites.*`).
 */
export const CIVILITES = ['Monsieur', 'Madame', 'Mademoiselle'] as const
export type Civilite = (typeof CIVILITES)[number]

export const NATIONALITES = ['Camerounaise', 'Tchadienne', 'Centrafricaine', 'EquatoGuineenne', 'Gabonaise', 'CongolaiseBrazzaville', 'CongolaiseDrCongo'] as const
export type Nationalite = (typeof NATIONALITES)[number]

export const estNationalite = (v?: string): v is Nationalite => NATIONALITES.includes(v as Nationalite)
