import { dateRelative, formaterDate } from '@/shared/utils/dates'

/** Date et heure exactes, en infobulle de la date relative : « 5 nov. 2026, 09:30 ». */
export function dateHeureDuFil(valeur: string) {
  return formaterDate(valeur, 'moyenneHeure')
}

/**
 * L'âge d'un élément plutôt que sa date — « il y a 3 h », « hier » —, comme
 * dans yibolo-client. Au-delà d'une semaine, la date reprend la main.
 */
export function dateRelativeDuFil(valeur: string) {
  return dateRelative(valeur)
}
