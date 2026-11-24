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

/** « 20 décembre » / « 20 December » : la clôture d'une offre. */
export function jourEtMois(valeur: string) {
  return new Intl.DateTimeFormat(currentLocale(), { day: 'numeric', month: 'long' }).format(new Date(valeur))
}

/** Les mois tels qu'ils sont écrits dans les données (« 06 oct. 2026 », « 15 novembre 2026 »). */
const MOIS: Record<string, number> = {
  janvier: 0, 'janv.': 0, février: 1, 'févr.': 1, mars: 2, avril: 3, 'avr.': 3, mai: 4, juin: 5,
  juillet: 6, 'juil.': 6, août: 7, septembre: 8, 'sept.': 8, octobre: 9, 'oct.': 9, novembre: 10, 'nov.': 10, décembre: 11, 'déc.': 11,
}

/** Une date écrite en français dans les données (actualités) → date ISO, pour ranger le fil ; '' si illisible. */
export function isoDesDonnees(texte: string) {
  const m = /^(\d{1,2}) (\S+) (\d{4})$/.exec(texte.trim())
  const mois = m ? MOIS[m[2]!.toLowerCase()] : undefined
  if (!m || mois === undefined) return ''
  return new Date(Date.UTC(Number(m[3]), mois, Number(m[1]), 9)).toISOString()
}
