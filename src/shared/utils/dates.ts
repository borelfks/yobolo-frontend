import { differenceInCalendarDays, differenceInSeconds, format, intlFormatDistance, isValid, parse, parseISO } from 'date-fns'
import { enGB, fr } from 'date-fns/locale'
import { currentLocale } from '@/i18n'

/*
 * Les dates, avec date-fns (identique dans le front et l'admin) :
 *  - à l'écran, dans la langue choisie : `formaterDate`, `dateRelative` ;
 *  - dans les données, toujours en français (comme le serveur) : `dateDesDonnees`, `horodatage` ;
 *  - pour les calculs, les fonctions de date-fns directement (addDays, subDays, startOfDay…).
 */

/** Les formes de date de l'interface (exemples en français ; l'anglais suit la même forme). */
const FORMES = {
  /** 15/11/2026 */
  chiffres: 'dd/MM/yyyy',
  /** 15 nov. 2026 */
  abregee: 'dd MMM yyyy',
  /** 5 nov. 2026 */
  moyenne: 'd MMM yyyy',
  /** 15 novembre 2026 */
  longue: 'dd MMMM yyyy',
  /** 5 novembre 2026 */
  longueSimple: 'd MMMM yyyy',
  /** 15 nov. */
  jourMois: 'dd MMM',
  /** lundi */
  jourSemaine: 'EEEE',
  /** 09:30 */
  heure: 'HH:mm',
  /** 15 nov. 2026, 09:30 */
  dateHeure: 'dd MMM yyyy, HH:mm',
  /** 5 nov. 2026, 09:30 */
  moyenneHeure: 'd MMM yyyy, HH:mm',
} as const
export type FormeDate = keyof typeof FORMES

/** La langue de date-fns qui suit celle de l'écran. */
const langueDates = () => (currentLocale().startsWith('en') ? enGB : fr)

/** Une date de la base (« 2026-11-15 », ISO complet) ou de l'application. */
export const versDate = (d: Date | string | number) => (typeof d === 'string' ? parseISO(d) : new Date(d))

/** Une date à l'écran, dans la langue choisie : `formaterDate(d, 'abregee')` → « 15 nov. 2026 » / « 15 Nov 2026 ». */
export function formaterDate(d: Date | string | number, forme: FormeDate = 'chiffres') {
  return format(versDate(d), FORMES[forme], { locale: langueDates() })
}

/**
 * L'âge d'un élément plutôt que sa date : « à l'instant », « il y a 3 h »,
 * « hier »… Au-delà d'une semaine, la date reprend la main. `unite: 'day'` :
 * compter en jours seulement (« aujourd'hui », « hier », « il y a 3 j »).
 * `style` : « il y a 3 h » (court, par défaut) ou « il y a 3 heures ».
 */
export function dateRelative(d: Date | string | number, { maintenant = new Date(), unite, style = 'short', semaine = true }: { maintenant?: Date | number; unite?: 'day'; style?: 'short' | 'long'; /** Passer à la date au-delà d'une semaine. */ semaine?: boolean } = {}) {
  const date = versDate(d)
  if (semaine && differenceInCalendarDays(maintenant, date) >= 7) return formaterDate(date, unite ? 'abregee' : 'moyenne')
  const options = { locale: currentLocale(), numeric: 'auto', style } as const
  // Moins d'une minute : « maintenant », plutôt qu'un nombre de secondes.
  if (!unite && Math.abs(differenceInSeconds(maintenant, date)) < 60) return intlFormatDistance(maintenant, maintenant, { ...options, unit: 'second' })
  return intlFormatDistance(date, maintenant, { ...options, unit: unite })
}

/* --- Dans les données (toujours en français, comme le serveur) ------------ */

/** « 27 nov. 2026 » : la date d'une donnée écrite maintenant. */
export const dateDesDonnees = (d: Date = new Date()) => format(d, FORMES.abregee, { locale: fr })

/** « 27 nov. 2026, 14:48 » : le moment d'une donnée écrite maintenant. */
export const horodatage = (d: Date = new Date()) => format(d, FORMES.dateHeure, { locale: fr })

/** « 2026-11-27 » : le jour d'une date (heure locale). */
export const jourISO = (d: Date | string | number) => format(versDate(d), 'yyyy-MM-dd')

/**
 * Une date écrite en français dans les données (« 15 novembre 2026 »,
 * « 01 déc. 2026 ») ; `undefined` si le texte n'en est pas une.
 */
export function lireDateFrancaise(texte: string): Date | undefined {
  const valeur = texte.trim()
  for (const motif of ['d MMMM yyyy', 'd MMM yyyy']) {
    const d = parse(valeur, motif, new Date(), { locale: fr })
    if (isValid(d)) return d
  }
  return undefined
}

/**
 * Une date écrite en français dans les données de démo → la même date dans la
 * langue choisie, au même format (mois entier ou abrégé). Un texte qui n'est
 * pas une date est rendu tel quel.
 */
export function demoDate(valeur: string) {
  const d = lireDateFrancaise(valeur)
  if (!d) return valeur
  return formaterDate(d, valeur.split(' ')[1]?.endsWith('.') ? 'abregee' : 'longue')
}
