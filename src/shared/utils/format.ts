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
