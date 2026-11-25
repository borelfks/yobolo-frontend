import { currentLocale } from '@/i18n'

/** Date et heure exactes, en infobulle de la date relative. */
export function dateHeureDuFil(valeur: string) {
  return new Intl.DateTimeFormat(currentLocale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(valeur))
}

const MINUTE = 60_000
const HEURE = 60 * MINUTE
const JOUR = 24 * HEURE
const SEMAINE = 7 * JOUR

/**
 * L'âge d'un élément plutôt que sa date — « il y a 3 h », « hier » —, comme
 * dans yibolo-client. Au-delà d'une semaine, la date reprend la main.
 */
export function dateRelativeDuFil(valeur: string) {
  const langue = currentLocale()
  const ecart = Math.max(0, Date.now() - new Date(valeur).getTime())
  const relatif = new Intl.RelativeTimeFormat(langue, { numeric: 'auto', style: 'short' })
  if (ecart >= SEMAINE) return new Intl.DateTimeFormat(langue, { dateStyle: 'medium' }).format(new Date(valeur))
  if (ecart >= JOUR) return relatif.format(-Math.floor(ecart / JOUR), 'day')
  if (ecart >= HEURE) return relatif.format(-Math.floor(ecart / HEURE), 'hour')
  if (ecart >= MINUTE) return relatif.format(-Math.floor(ecart / MINUTE), 'minute')
  return relatif.format(0, 'second')
}
