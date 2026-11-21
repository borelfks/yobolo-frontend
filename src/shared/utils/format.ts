import { currentLocale } from '@/i18n'

/**
 * Formats qui suivent la langue choisie : « 450 000 » et « 4,7 » en français,
 * « 450,000 » et « 4.7 » en anglais. À utiliser à la place de toLocaleString('fr-FR').
 */

/** 450000 → « 450 000 » (fr) / « 450,000 » (en). Marche aussi pour les décimaux : 4.7 → « 4,7 » / « 4.7 ». */
export function num(n: number) {
  return new Intl.NumberFormat(currentLocale()).format(n)
}

/** 450000 → « 450 000 FCFA » (fr) / « 450,000 FCFA » (en). */
export function fcfa(amount: number, suffix = 'FCFA') {
  return `${num(amount)} ${suffix}`
}

/** Date courte : « 15/11/2026 » (fr) / « 15/11/2026 » (en-GB), ou selon les options données. */
export function shortDate(date: Date | string, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  return new Date(date).toLocaleDateString(currentLocale(), options)
}

/** Mois français, en entier ou abrégés, tels qu'ils figurent dans les données de démo. */
const MOIS: Record<string, number> = {
  janvier: 0, 'janv.': 0, février: 1, 'févr.': 1, mars: 2, avril: 3, 'avr.': 3, mai: 4, juin: 5,
  juillet: 6, 'juil.': 6, août: 7, septembre: 8, 'sept.': 8, octobre: 9, 'oct.': 9, novembre: 10, 'nov.': 10, décembre: 11, 'déc.': 11,
}

/**
 * Date écrite en français dans les données de démo (« 15 novembre 2026 », « 01 déc. 2026 »)
 * → la même date dans la langue choisie, au même format (mois entier ou abrégé).
 * Un texte qui n'est pas une date est rendu tel quel.
 */
export function demoDate(value: string) {
  const m = /^(\d{1,2}) (\S+) (\d{4})$/.exec(value.trim())
  const month = m ? MOIS[m[2]!.toLowerCase()] : undefined
  if (!m || month === undefined) return value
  return shortDate(new Date(Number(m[3]), month, Number(m[1])), { day: '2-digit', month: m[2]!.endsWith('.') ? 'short' : 'long', year: 'numeric' })
}

/** Photo de démonstration stable, tirée d'une graine. */
export function photo(seed: string, w = 640, h = 420) {
  return `https://picsum.photos/seed/yibolo-${encodeURIComponent(seed)}/${w}/${h}`
}

/** Portrait de démonstration. */
export function portrait(n: number, gender: 'men' | 'women' = 'men') {
  return `https://randomuser.me/api/portraits/${gender}/${n % 100}.jpg`
}

export function initials(name: string) {
  return name
    .replace(/^(M\.|Mme|Me|Dr)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
