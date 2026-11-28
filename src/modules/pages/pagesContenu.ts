/**
 * Le contenu des pages « Aide et contact » et « Conditions générales »
 * (canevas, planche « Legal ») : les identifiants seulement, les textes sont
 * dans locales/ (namespace « pages ») pour être traduits.
 */

/** Les thèmes de l'aide, dans l'ordre du canevas. */
export const THEMES_AIDE = ['compte', 'ecoles', 'auto', 'avis', 'favoris', 'pro'] as const
export type ThemeAide = (typeof THEMES_AIDE)[number]

/** Les questions fréquentes et leur thème (textes : aide.faq.<id>.q et .r). */
export const QUESTIONS_AIDE = [
  { id: 'creerCompte', theme: 'compte' },
  { id: 'motDePasse', theme: 'compte' },
  { id: 'supprimer', theme: 'compte' },
  { id: 'trouverFormation', theme: 'ecoles' },
  { id: 'verifie', theme: 'ecoles' },
  { id: 'contacter', theme: 'ecoles' },
  { id: 'tarifs', theme: 'auto' },
  { id: 'choisirAuto', theme: 'auto' },
  { id: 'donnerAvis', theme: 'avis' },
  { id: 'favoris', theme: 'favoris' },
  { id: 'ajouterEtablissement', theme: 'pro' },
  { id: 'modifierFiche', theme: 'pro' },
] as const satisfies readonly { id: string; theme: ThemeAide }[]

/** Les sujets du formulaire de contact (textes : aide.contact.sujets.<id>). */
export const SUJETS_CONTACT = ['compte', 'ecoles', 'auto', 'avis', 'favoris', 'pro', 'autre'] as const

/** Les articles des conditions générales et leur nombre de paragraphes (textes : conditions.articles.<id>.titre, .p1, .p2). */
export const ARTICLES_CONDITIONS = [
  { id: 'a1', n: 1, paras: ['p1'] },
  { id: 'a2', n: 2, paras: ['p1', 'p2'] },
  { id: 'a3', n: 3, paras: ['p1'] },
  { id: 'a4', n: 4, paras: ['p1', 'p2'] },
  { id: 'a5', n: 5, paras: ['p1', 'p2'] },
  { id: 'a6', n: 6, paras: ['p1'] },
  { id: 'a7', n: 7, paras: ['p1', 'p2'] },
  { id: 'a8', n: 8, paras: ['p1'] },
  { id: 'a9', n: 9, paras: ['p1'] },
  { id: 'a10', n: 10, paras: ['p1'] },
] as const
