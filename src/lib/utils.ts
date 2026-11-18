import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const nf = new Intl.NumberFormat('fr-FR')

/** 450000 → « 450 000 FCFA » */
export function fcfa(amount: number, suffix = 'FCFA') {
  return `${nf.format(amount)} ${suffix}`
}

export function num(n: number) {
  return nf.format(n)
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
