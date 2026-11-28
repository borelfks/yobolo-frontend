import type { Publication } from '@/shared/types'

/**
 * Le fil de l'accueil connecté, tel que le canevas le montre (planche
 * « Accueil ») : des publications d'experts, filtrées par domaines, sujets,
 * experts et « Enregistrées », triées par date ou par nombre de commentaires.
 */

export type TriDuFil = 'recentes' | 'commentees'

export const TRIS_DU_FIL: TriDuFil[] = ['recentes', 'commentees']

/** Les trois listes de choix du fil (pilules « Domaines », « Sujets », « Experts »). */
export type FiltreDuFil = 'domaines' | 'sujets' | 'experts'

export const FILTRES_DU_FIL: FiltreDuFil[] = ['domaines', 'sujets', 'experts']

/** Nombre de publications montrées d'abord, puis à chaque « Afficher plus de publications ». */
export const TAILLE_DU_FIL = 5

/** Nombre d'experts montrés dans la colonne de droite avant « Voir les N experts ». */
export const EXPERTS_EN_APERCU = 3

/** Nombre de sujets du moment (les plus employés). */
export const SUJETS_DU_MOMENT = 6

/** L'identifiant du champ « Ajouter un commentaire… » : « Commenter » y place le curseur. */
export const CHAMP_COMMENTAIRE = 'nouveau-commentaire'

/** Longueur maximale d'un commentaire ou d'une réponse. */
export const LONGUEUR_MAX_COMMENTAIRE = 1000

/** Longueur de l'extrait d'une publication dans le fil, avant « …voir plus ». */
const LONGUEUR_EXTRAIT = 200

/** Le texte entier d'une publication : son titre (s'il y en a un) en première ligne. */
export function texteDe(publication: Pick<Publication, 'titre' | 'texte'>) {
  const texte = publication.texte.trim()
  return publication.titre?.trim() ? `${publication.titre.trim()}\n${texte}` : texte
}

/** La première ligne d'une publication : son titre dans les listes (favoris, « Plus de publications de… »). */
export function premiereLigne(publication: Pick<Publication, 'titre' | 'texte'>) {
  return texteDe(publication).split('\n')[0]?.trim() ?? ''
}

/**
 * L'extrait du fil : les deux premières lignes, coupées vers 200 caractères
 * sur un espace. `suite` : le texte est plus long (« …voir plus »).
 */
export function extraitDe(publication: Pick<Publication, 'titre' | 'texte'>) {
  const texte = texteDe(publication)
  const lignes = texte.split('\n').filter((l) => l.trim())
  let extrait = lignes.slice(0, 2).join('\n')
  if (extrait.length > LONGUEUR_EXTRAIT) {
    const coupe = extrait.lastIndexOf(' ', LONGUEUR_EXTRAIT)
    extrait = extrait.slice(0, coupe > 80 ? coupe : LONGUEUR_EXTRAIT)
  }
  return { extrait, suite: texte.replace(/\n+/g, '\n').length > extrait.length + 2 }
}

/** « Création d’entreprise » → « CreationEntreprise » : le mot-dièse d'un sujet (sans le #). */
export function motDiese(nom: string) {
  return nom
    .replace(/(^|\s)[dlDL][’']/g, ' ')
    .replace(/[’']/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((mot) => mot[0]!.toUpperCase() + mot.slice(1))
    .join('')
}

/** Sans accents ni majuscules, pour chercher « fiscalite » comme « Fiscalité ». */
const simplifier = (texte: string) => texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase()

/** La recherche du fil : dans le texte de la publication et le nom de son auteur. */
export function contient(publication: Publication, recherche: string, nomAuteur = '') {
  if (!recherche) return true
  return simplifier(`${texteDe(publication)} ${nomAuteur}`).includes(simplifier(recherche))
}

/** Une date absente passe en tête du fil. */
export const instant = (date: string) => (date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER)

/** Ajouter ou retirer un identifiant d'une liste de choix. */
export const basculerDans = (liste: string[], id: string) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id])

/** Les initiales d'un nom (« Jean Dupont » → « JD »), quand il n'y a pas de photo. */
export const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .map((mot) => mot[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
