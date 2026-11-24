import type { Actualite, Etablissement, Formation, OffreEmploi, Publication } from '@/shared/types'

/**
 * Le fil de l'accueil connecté, copié de l'accueil de yibolo-client : ce qu'il
 * mélange (publications, offres d'emploi, formations), ses filtres et ses tris.
 */

/** « conseil » : les publications des experts ; « actualite » : les actualités publiées par les établissements. */
export type GenreDuFil = 'tout' | 'publication' | 'conseil' | 'actualite' | 'offre' | 'formation'

export const GENRES_DU_FIL: GenreDuFil[] = ['tout', 'publication', 'conseil', 'actualite', 'offre', 'formation']

/** Les offres, les formations et les actualités n'ont ni domaine, ni sujet, ni lecteurs à compter. */
export const GENRES_DE_PUBLICATIONS: GenreDuFil[] = ['tout', 'publication', 'conseil']

export type TriDuFil = 'recentes' | 'lues'

export const TRIS_DU_FIL: TriDuFil[] = ['recentes', 'lues']

export type EntreeDuFil =
  | { genre: 'publication'; cle: string; date: string; publication: Publication }
  | { genre: 'offre'; cle: string; date: string; offre: OffreEmploi }
  | { genre: 'formation'; cle: string; date: string; formation: Formation }
  | { genre: 'actualite'; cle: string; date: string; actualite: Actualite; etablissement: Etablissement }

/** Le badge à côté du nom de l'auteur. `membre` : un compte Utilisateur qui publie (absent de yibolo-client). */
export type TypeDePastille = 'consultant' | 'ecole' | 'entreprise' | 'membre'

export type NatureDuFil = 'publication' | 'offre' | 'formation' | 'actualite'

/** Nombre d'éléments du fil montrés à la fois (« Voir plus » montre les suivants). */
export const TAILLE_DU_FIL = 12

/** Les gestes sous le filet d'une carte (« J'aime », « Commenter », « Partager »). */
export const CLASSES_GESTE =
  'inline-flex h-[2.5rem] min-w-0 items-center justify-center gap-[0.1875rem] rounded-md px-0.5 text-[0.625rem] font-medium transition-colors hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none sm:h-[2rem]'

/** Le cadre des trois panneaux (fil, colonne de droite). */
export const CLASSES_PANNEAU = 'rounded-xl border border-line bg-white p-3 shadow-sm'

/** La grille du fil : une, deux ou trois cartes de front selon la largeur du panneau. */
export const CLASSES_GRILLE_DU_FIL = 'grid gap-2.5 @min-[30rem]:grid-cols-2 @min-[40rem]:grid-cols-3'

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

/** Une publication correspond-elle aux domaines, au sujet et à la recherche choisis ? */
export function correspond(publication: Publication, { domaines, sujet, recherche }: { domaines: string[]; sujet?: string; recherche: string }) {
  if (domaines.length > 0 && !publication.domaines.some((domaine) => domaines.includes(domaine))) return false
  if (sujet && !publication.sujets.includes(sujet)) return false
  if (!recherche) return true
  const cherche = recherche.toLocaleLowerCase()
  return [publication.titre, publication.texte].some((texte) => texte?.toLocaleLowerCase().includes(cherche))
}

/** Une date absente (formation créée avant l'accueil) passe en tête du fil. */
export const instant = (date: string) => (date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER)

/** Les fenêtres que les raccourcis et « À faire » ouvrent sur l'accueil. */
export type FenetreAccueil = 'notifications' | 'profil' | 'formations'
