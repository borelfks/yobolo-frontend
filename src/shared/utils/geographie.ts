import type { Arrondissement, Departement, Lieu } from '@/shared/types'

/**
 * Le découpage officiel du Cameroun (région → département → arrondissement),
 * comme dans yibolo-client. Les listes viennent de la base (tables
 * `departements` et `arrondissements`).
 */

const ORDRE_FRANCAIS = new Intl.Collator('fr', { sensitivity: 'base' })
const ROMAINS: Record<string, number> = { I: 1, V: 5, X: 10 }
const NUMERO = /\s+([IVX]+)(?:er|e)?$/

function valeurRomaine(chiffres: string) {
  let total = 0
  for (let rang = 0; rang < chiffres.length; rang++) {
    const valeur = ROMAINS[chiffres[rang] ?? ''] ?? 0
    const suivante = ROMAINS[chiffres[rang + 1] ?? ''] ?? 0
    total += valeur < suivante ? -valeur : valeur
  }
  return total
}

/** « Bafoussam Ier » avant « Bafoussam IIe », et « Ébolowa » parmi les E. */
export function parNom(a: { nom: string }, b: { nom: string }) {
  const numeroA = NUMERO.exec(a.nom)
  const numeroB = NUMERO.exec(b.nom)
  const baseA = numeroA ? a.nom.slice(0, numeroA.index) : a.nom
  const baseB = numeroB ? b.nom.slice(0, numeroB.index) : b.nom
  return ORDRE_FRANCAIS.compare(baseA, baseB) || (numeroA?.[1] ? valeurRomaine(numeroA[1]) : 0) - (numeroB?.[1] ? valeurRomaine(numeroB[1]) : 0)
}

/** Les départements d'une région et les arrondissements d'un département, dans l'ordre des noms. */
export function listesDuLieu(lieu: Pick<Lieu, 'region' | 'departement'>, departements: Departement[], arrondissements: Arrondissement[]) {
  return {
    departements: departements.filter((d) => d.region === lieu.region).sort(parNom),
    arrondissements: arrondissements.filter((a) => a.departement === lieu.departement).sort(parNom),
  }
}

/** La ville d'un lieu : celle de son arrondissement (« Douala III » → « Douala »). */
export function villeDuLieu(lieu: Pick<Lieu, 'arrondissement'>, arrondissements: Arrondissement[]) {
  return arrondissements.find((a) => a.id === lieu.arrondissement)?.ville ?? ''
}

/** Un lieu vide, ou repris d'un enregistrement (compte, établissement, brouillon). */
export function lieuDe(x?: { region?: string; departement?: string; arrondissement?: string; quartier?: string }): Lieu {
  return { region: x?.region ?? '', departement: x?.departement ?? '', arrondissement: x?.arrondissement ?? '', quartier: x?.quartier ?? '' }
}

/** Le lieu est complet (région, département, arrondissement et quartier). */
export const lieuComplet = (l: Lieu) => !!(l.region && l.departement && l.arrondissement && l.quartier.trim())
