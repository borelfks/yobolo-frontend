import type {
  Actualite,
  AutoEcole,
  AvisAutoEcole,
  AvisEtablissement,
  DocumentPro,
  Etablissement,
  Favorite,
  Formation,
  FormationPro,
  InscriptionAutoEcole,
  ParametresEtablissement,
  Preinscription,
  QuestionFaq,
  SessionAutoEcole,
  UtilisateurPro,
} from '@/shared/types'

/**
 * Les collections enregistrées et le type de leurs éléments. Une collection =
 * une table SQLite aujourd'hui, un point d'API ou une collection Firestore
 * demain. Chaque élément a un `id` texte.
 */
export type Collections = {
  etablissements: Etablissement
  formations: Formation
  formationsPro: FormationPro
  autoEcoles: AutoEcole
  sessions: SessionAutoEcole
  avisEtablissements: AvisEtablissement
  avisAutoEcoles: AvisAutoEcole
  actualites: Actualite
  documents: DocumentPro
  faq: QuestionFaq
  utilisateurs: UtilisateurPro
  preinscriptions: Preinscription
  inscriptionsAutoEcole: InscriptionAutoEcole
  favoris: Favorite
  parametres: ParametresEtablissement
}

export type CollectionName = keyof Collections

export const COLLECTIONS = [
  'etablissements',
  'formations',
  'formationsPro',
  'autoEcoles',
  'sessions',
  'avisEtablissements',
  'avisAutoEcoles',
  'actualites',
  'documents',
  'faq',
  'utilisateurs',
  'preinscriptions',
  'inscriptionsAutoEcole',
  'favoris',
  'parametres',
] as const satisfies readonly CollectionName[]

/** Les données de départ : un tableau par collection. */
export type Seed = { [K in CollectionName]: Collections[K][] }

/** Identifiant des enregistrements de la maquette, visibles pour tous les établissements. */
export const POUR_TOUS = '*'
