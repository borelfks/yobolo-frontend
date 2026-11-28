import type { FavoriteKind, Formation, PermisCode, TypeSlug } from '@/shared/types'

/**
 * Logique des listes de l'univers École (page École, listes IPES / CFP /
 * Autres, auto-écoles) : la forme commune d'une école résumée, les filtres,
 * les tris et la lecture des filtres dans l'adresse. Tout se calcule à partir
 * des données (aucun chiffre écrit ici).
 */

/** Le genre d'une école : un type d'établissement, ou une auto-école. */
export type GenreEcole = TypeSlug | 'auto'

/** Une école résumée pour les vignettes et les filtres (établissement ou auto-école). */
export type EcoleResumee = {
  id: string
  genre: GenreEcole
  nom: string
  sigle: string
  image: string
  logo?: string
  ville: string
  quartier: string
  region: string
  /** Établissement vérifié : ses accords (création, ouverture) sont enregistrés. */
  verifie: boolean
  note: number
  nbAvis: number
  filieres: string[]
  /** Les formations publiées (vide pour une auto-école). */
  formations: Formation[]
  rentree: string
  /** Année de création (auto-écoles). */
  creation?: number
  /** Les permis proposés, dans l'ordre A → E (auto-écoles). */
  permis: PermisCode[]
  /** L'adresse de sa fiche. */
  href: string
  /** Le genre de favori qu'elle devient. */
  favori: FavoriteKind
}

/** Résultats par page dans les listes (canevas : « 1 – 10 sur N »). */
export const PAR_PAGE = 10

/** Les filières d'une vignette : toutes jusqu'à 4, sinon les 3 premières et « +N ». */
export function resumeFilieres(filieres: string[]) {
  return filieres.length > 4 ? [...filieres.slice(0, 3), `+${filieres.length - 3}`] : filieres
}

/** Ordre « Pertinence » : vérifiés d'abord, puis le plus d'avis, puis le plus de formations. */
export function parPertinence(a: EcoleResumee, b: EcoleResumee) {
  return Number(b.verifie) - Number(a.verifie) || b.nbAvis - a.nbAvis || b.formations.length - a.formations.length
}

/* --- Listes IPES, CFP, Autres ---------------------------------------------- */

export const TRIS_ETABLISSEMENTS = ['pertinence', 'notes', 'formations', 'nom'] as const
export type TriEtablissements = (typeof TRIS_ETABLISSEMENTS)[number]

export function trierEtablissements(liste: EcoleResumee[], tri: TriEtablissements) {
  const copie = [...liste]
  if (tri === 'notes') return copie.sort((a, b) => b.note - a.note || b.nbAvis - a.nbAvis)
  if (tri === 'formations') return copie.sort((a, b) => b.formations.length - a.formations.length)
  if (tri === 'nom') return copie.sort((a, b) => a.nom.localeCompare(b.nom))
  return copie.sort(parPertinence)
}

/** Les filtres en liste des établissements, dans l'ordre du canevas. */
export const FILTRES_ETABLISSEMENTS = ['ville', 'diplome', 'domaine', 'cours'] as const
export type FiltreEtablissement = (typeof FILTRES_ETABLISSEMENTS)[number]
/** Les valeurs du filtre « Cours » (libellés traduits à l'affichage). */
export type ValeurCours = 'jour' | 'soir'

/** Les valeurs d'un établissement pour un filtre. */
export function valeursEtablissement(e: EcoleResumee, filtre: FiltreEtablissement): string[] {
  if (filtre === 'ville') return [e.ville]
  if (filtre === 'diplome') return e.formations.map((f) => f.diplome)
  if (filtre === 'domaine') return e.formations.flatMap((f) => (f.domaine ? [f.domaine] : []))
  const cours: ValeurCours[] = []
  if (e.formations.some((f) => f.mode.includes('Jour'))) cours.push('jour')
  if (e.formations.some((f) => f.mode.includes('Soir'))) cours.push('soir')
  return cours
}

/* --- Auto-écoles -------------------------------------------------------- */

export const TRIS_AUTO_ECOLES = ['pertinence', 'notes', 'nom', 'anciennes'] as const
export type TriAutoEcoles = (typeof TRIS_AUTO_ECOLES)[number]

export function trierAutoEcoles(liste: EcoleResumee[], tri: TriAutoEcoles) {
  const copie = [...liste]
  if (tri === 'nom') return copie.sort((a, b) => a.nom.localeCompare(b.nom))
  if (tri === 'anciennes') return copie.sort((a, b) => (a.creation ?? 0) - (b.creation ?? 0))
  return copie.sort((a, b) => b.note - a.note || b.nbAvis - a.nbAvis || b.permis.length - a.permis.length)
}

export const FILTRES_AUTO_ECOLES = ['permis', 'ville'] as const
export type FiltreAutoEcole = (typeof FILTRES_AUTO_ECOLES)[number]

export function valeursAutoEcole(a: EcoleResumee, filtre: FiltreAutoEcole): string[] {
  return filtre === 'permis' ? a.permis : [a.ville]
}

/* --- Filtres communs ------------------------------------------------------- */

/** Les valeurs cochées de chaque filtre, lues dans l'adresse (`?ville=Douala&ville=Kribi`). */
export function lireSelection<F extends string>(params: URLSearchParams, filtres: readonly F[]) {
  return Object.fromEntries(filtres.map((f) => [f, params.getAll(f)])) as Record<F, string[]>
}

/** Passe les filtres cochés, sauf `sauf` (pour compter les options d'un filtre ouvert). */
export function passeFiltres<F extends string>(valeurs: (filtre: F) => string[], selection: Record<F, string[]>, filtres: readonly F[], sauf?: F) {
  return filtres.every((f) => f === sauf || selection[f].length === 0 || selection[f].some((v) => valeurs(f).includes(v)))
}

/** Les options d'un filtre : toutes ses valeurs, avec le nombre d'écoles qui passent les autres filtres. */
export function optionsDuFiltre<F extends string>(liste: EcoleResumee[], filtre: F, valeurs: (e: EcoleResumee, f: F) => string[], passe: (e: EcoleResumee) => boolean) {
  const nombres = new Map<string, number>()
  for (const e of liste.filter(passe)) for (const v of new Set(valeurs(e, filtre))) nombres.set(v, (nombres.get(v) ?? 0) + 1)
  const toutes = [...new Set(liste.flatMap((e) => valeurs(e, filtre)))]
  return toutes.map((valeur) => ({ valeur, nombre: nombres.get(valeur) ?? 0 }))
}

/** Ajoute ou retire une valeur cochée. */
export const basculer = (liste: string[], valeur: string) => (liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur])

/** Une valeur reconnue dans une liste fermée, sinon la première. */
export function parmi<T extends string>(valeur: string | null, liste: readonly T[]): T {
  return (liste as readonly string[]).includes(valeur ?? '') ? (valeur as T) : liste[0]!
}
