import type { TFunction } from 'i18next'
import type { AutoEcole, PermisCode } from '@/shared/types'

/*
 * Logique de la fiche d'une auto-école (planches « Fiche auto-école ») :
 * onglets, listes fixes de la maquette (traduites à l'affichage) et
 * traduction des valeurs fixes des données de démonstration.
 */

type T = TFunction<'driving-schools'>

/** Les onglets de la fiche, dans l'ordre (le premier n'a pas de segment d'adresse). */
export const ONGLETS_AUTO_ECOLE = ['', 'formations', 'tarifs', 'planning', 'galerie', 'avis'] as const
export type OngletAutoEcole = (typeof ONGLETS_AUTO_ECOLE)[number]

/** Les onglets de la page d'un permis (le premier n'a pas de segment d'adresse). */
export const ONGLETS_PERMIS = ['', 'programme', 'conditions', 'tarifs', 'planning'] as const
export type OngletPermis = (typeof ONGLETS_PERMIS)[number]

/** L'ordre des permis à l'affichage. */
export const ORDRE_PERMIS: PermisCode[] = ['A', 'B', 'C', 'D', 'E']

/** Les permis proposés par une auto-école, dans l'ordre A → E. */
export const permisDe = (a: Pick<AutoEcole, 'permis'>) => ORDRE_PERMIS.filter((c) => a.permis.includes(c))

/** « Pourquoi nous choisir ? » (clés de traduction, dans l'ordre de la maquette). */
export const whyKeys = ['approved', 'instructors', 'vehicles', 'successRate', 'flexibleHours', 'examSupport'] as const

/** « Ce que comprend le tarif ». */
export const includedKeys = ['code', 'driving', 'materials', 'exam', 'fees'] as const

/** « Bon à savoir » du planning. */
export const tipKeys = ['code', 'flexible', 'groups', 'open'] as const

/** Les types de formation (onglet Formations & Permis) ; chaque permis est une formation initiale. */
export const TYPES_FORMATION = ['tous', 'initial', 'refresher'] as const
export type TypeFormation = (typeof TYPES_FORMATION)[number]

/** « Lun – Ven » → libellé traduit. */
export function sessionDays(t: T, value: string) {
  return value === 'Lun – Ven' ? t('sessions.days.monFri') : value
}

/** « 08h – 12h » → horaires traduits. */
export function sessionHours(t: T, value: string) {
  const m = /^(\d{2})h – (\d{2})h$/.exec(value)
  return m ? t('sessions.hours', { from: m[1], to: m[2] }) : value
}

/** « ≈ 2 mois » → durée traduite. */
export function sessionDuration(t: T, value: string) {
  const m = /^≈ (\d+) mois$/.exec(value)
  return m ? t('sessions.duration', { count: Number(m[1]) }) : value
}

/** « Il y a 3 jours » / « Il y a 1 semaine » (avis de démo) → date relative traduite. */
export function reviewDate(t: T, value: string) {
  const m = /^Il y a (\d+) (jours?|semaines?)$/.exec(value)
  if (!m) return value
  const count = Number(m[1])
  return m[2]!.startsWith('jour') ? t('reviewDate.days', { count }) : t('reviewDate.weeks', { count })
}
