import type { Publication, SujetPublication } from '@/shared/types'

/**
 * Le fil de l'accueil connecté, copié de l'accueil de yibolo-client : ses
 * filtres et ses tris. Il ne montre que des publications (décision du
 * 2026-11-24 : ni offres d'emploi, ni formations, ni actualités dans le fil).
 */

/** La nature d'une carte du fil (pastille de l'en-tête) : il n'y a plus que des publications. */
export type NatureDuFil = 'publication'

/** Le badge à côté du nom de l'auteur. `membre` : un compte Utilisateur qui publie (absent de yibolo-client). */
export type TypeDePastille = 'consultant' | 'ecole' | 'entreprise' | 'membre'

export type TriDuFil = 'recentes' | 'lues'

export const TRIS_DU_FIL: TriDuFil[] = ['recentes', 'lues']

/** Longueur maximale d'un commentaire ou d'une réponse. */
export const LONGUEUR_MAX_COMMENTAIRE = 1000

/** Nombre d'éléments du fil montrés à la fois (« Voir plus » montre les suivants). */
export const TAILLE_DU_FIL = 12

/** Les gestes sous le filet d'une carte (« J'aime », « Commenter », « Partager »). */
export const CLASSES_GESTE =
  'inline-flex h-[2.5rem] min-w-0 items-center justify-center gap-[0.1875rem] rounded-md px-0.5 text-xs font-medium transition-colors hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none sm:h-[2rem]'

/** Le cadre des trois panneaux (fil, colonne de droite). */
export const CLASSES_PANNEAU = 'rounded-xl border border-line bg-white p-3 shadow-sm'

/** La grille du fil : une, deux ou trois cartes de front selon la largeur du panneau. */
export const CLASSES_GRILLE_DU_FIL = 'grid gap-3 @min-[30rem]:grid-cols-2 @min-[52rem]:grid-cols-3'

const LONGUEUR_TITRE_DEDUIT = 140

/** Espaces insécables avant : ; ! ? » et après «, comme dans la maquette. */
function insecables(titre: string) {
  return titre.replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ')
}

/**
 * Le titre et l'extrait d'une publication. Sans titre, la première ligne en
 * tient lieu (coupée à la fin d'une phrase si elle est trop longue).
 */
export function titreEtExtrait(publication: Pick<Publication, 'titre' | 'texte'>) {
  const texte = publication.texte.trim()
  if (publication.titre?.trim()) {
    return { titre: insecables(publication.titre.trim()), extrait: texte }
  }
  const [premiereLigne = '', ...reste] = texte.split('\n')
  const ligne = premiereLigne.trim()
  if (ligne.length <= LONGUEUR_TITRE_DEDUIT) {
    return { titre: insecables(ligne), extrait: reste.join('\n').trim() }
  }
  const debut = ligne.slice(0, LONGUEUR_TITRE_DEDUIT)
  const finDePhrase = Math.max(...['. ', '? ', '! '].map((fin) => debut.lastIndexOf(fin)))
  const coupe = finDePhrase > 40 ? finDePhrase + 1 : LONGUEUR_TITRE_DEDUIT
  return {
    titre: insecables(ligne.slice(0, coupe).trim()) + (coupe === LONGUEUR_TITRE_DEDUIT ? '…' : ''),
    extrait: [ligne.slice(coupe).trim(), ...reste].join('\n').trim(),
  }
}

/** Sans accents ni majuscules, pour chercher « fiscalite » comme « Fiscalité ». */
const simplifier = (texte: string) => texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

/**
 * Une publication correspond-elle aux domaines, au sujet et à la recherche ?
 * La recherche lit le titre, le texte, et `autres` : l'auteur, sa ville, les
 * noms des domaines et des sujets (« un mot clé, un domaine, une ville, un expert »).
 */
export function correspond(publication: Publication, { domaines, sujet, recherche }: { domaines: string[]; sujet?: string; recherche: string }, autres: (string | undefined)[] = []) {
  if (domaines.length > 0 && !publication.domaines.some((domaine) => domaines.includes(domaine))) return false
  if (sujet && !publication.sujets.includes(sujet)) return false
  if (!recherche) return true
  const cherche = simplifier(recherche)
  return [publication.titre, publication.texte, ...autres].some((texte) => texte !== undefined && simplifier(texte).includes(cherche))
}

/** Une date absente passe en tête du fil. */
export const instant = (date: string) => (date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER)


/** Le libellé d'un sujet (« creation-entreprise » → « Création d’entreprise ») ; inconnu, son identifiant lisible. */
export function nomDuSujet(id: string, sujets: SujetPublication[]) {
  return sujets.find((s) => s.id === id)?.nom ?? id.replaceAll('-', ' ')
}

const LIGNE_DE_LISTE = /^\d+[.)]\s+/

/** Le texte d'un article en blocs : paragraphes, et suites « 1. … 2. … » regroupées en liste numérotée. */
export function blocsDuTexte(texte: string): { liste: boolean; lignes: string[] }[] {
  const blocs: { liste: boolean; lignes: string[] }[] = []
  for (const ligne of texte.split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
    const dansUneListe = LIGNE_DE_LISTE.test(ligne)
    const dernier = blocs.at(-1)
    if (dansUneListe && dernier?.liste) dernier.lignes.push(ligne.replace(LIGNE_DE_LISTE, ''))
    else blocs.push({ liste: dansUneListe, lignes: [dansUneListe ? ligne.replace(LIGNE_DE_LISTE, '') : ligne] })
  }
  return blocs
}
