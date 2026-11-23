/**
 * Types du domaine Yibolo, à un seul endroit.
 * Les données de démonstration (src/mocks) et les écrans les importent d'ici.
 */

/* --- Écoles (IPES, CFP, Autres) -------------------------------------------- */

export type TypeEcole = 'IPES' | 'CFP' | 'Auto-école' | 'Autre'

export type ModeCours = 'Jour' | 'Soir' | 'Jour & Soir'

export type Etablissement = {
  id: string
  nom: string
  sigle: string
  type: TypeEcole
  region: string
  ville: string
  quartier: string
  note: number
  avis: number
  image: string
  filieres: string[]
  formations: number
  description: string
  telephone: string
  email: string
  rentree: string
  /** Photo du bâtiment dans l'en-tête de la fiche. */
  photoFiche?: string
  /** Les filières mises en avant sur la fiche (img33). */
  principales?: string[]
}

export type Formation = {
  id: string
  etablissementId: string
  nom: string
  code: string
  filiere: string
  diplome: string
  niveau: string
  dureeMois: number
  mode: ModeCours
  fraisInscription: number
  fraisAn: number
  rentree: string
  statut: 'Publiée' | 'En attente' | 'Brouillon'
  image: string
  description: string
}

/** Les trois types d'école qui partagent le même gabarit (IPES, CFP, Autres). */
export type TypeSlug = 'ipes' | 'cfp' | 'autres'

export type Avis = { id: string; nom: string; role: string; note: number; date: string; texte: string; utile: number; avatar: string }

/* --- Auto-écoles et permis ------------------------------------------------- */

export type PermisCode = 'A' | 'B' | 'C' | 'D' | 'E'

export type Permis = {
  code: PermisCode
  nom: string
  vehicule: string
  duree: string
  prix: number
  image: string
  description: string
  /** Sous-titre court des listes (img55). */
  sous: string
  /** Photo de la page Tarifs (img56). */
  tarifImage: string
  ageMin: number
  prerequis?: string
}

export type AutoEcole = {
  id: string
  nom: string
  region: string
  ville: string
  quartier: string
  note: number
  avis: number
  formes: number
  image: string
  permis: PermisCode[]
  creation: number
  telephone: string
  email: string
  site: string
  adresse?: string
  logo?: string
}

/* --- Inscription en auto-école --------------------------------------------- */

/** Brouillon d'inscription partagé entre les étapes et les pages « Modifier ». */
export type InscriptionDraft = {
  nom: string
  prenom: string
  naissance: string
  sexe: string
  telephone: string
  email: string
  ville: string
  quartier: string
  autoEcoleId: string
  permis: PermisCode
  session: string
  pieces: Record<string, boolean>
}

/* --- Favoris --------------------------------------------------------------- */

/** Un favori : une formation, un établissement, une auto-école ou un permis. */
export type FavoriteKind = 'formation' | 'etablissement' | 'auto-ecole' | 'permis'

export type Favorite = { id: string; kind: FavoriteKind; folder: string }

/* --- Comptes de démonstration ---------------------------------------------- */

/** Les comptes de démonstration : un compte = un espace. */
export type Role = 'utilisateur' | 'ipes' | 'cfp' | 'autre'

export type Account = {
  role: Role
  name: string
  subtitle: string
  avatar: string
  home: string
  /** L'établissement géré, pour les comptes école. */
  ecoleId?: string
  label: string
  description: string
}

/* --- Données enregistrées dans la base de test (src/data) ----------------- */
/*
 * Les enregistrements qui portent `etablissementId: '*'` (ou `autoEcoleId: '*'`)
 * sont ceux de la maquette : ils s'affichent pour tous les établissements,
 * comme avant. Ceux créés par les testeurs portent le vrai identifiant.
 */

export type StatutPublication = 'Publiée' | 'En attente' | 'Brouillon'

/** Une ligne du tableau « Gérer les formations » de l'espace pro. */
export type FormationPro = {
  id: string
  etablissementId: string
  nom: string
  code: string
  filiere: string
  ton: string
  diplome: string
  duree: string
  rentree: string
  statut: StatutPublication
}

export type SessionAutoEcole = {
  id: string
  permis: PermisCode
  debut: string
  horaires: string[]
  duree: string
  places: number
}

export type AvisEtablissement = Avis & { etablissementId: string }

export type AvisAutoEcole = {
  id: string
  autoEcoleId: string
  nom: string
  date: string
  note: number
  texte: string
  avatar: string
}

export type Actualite = {
  id: string
  etablissementId: string
  titre: string
  date: string
  statut: 'Publiée' | 'Brouillon'
  categorie: string
  vues: number
  partages: number
  image: string
}

export type DocumentPro = {
  id: string
  etablissementId: string
  nom: string
  type: string
  categorie: string
  taille: string
  date: string
  statut: string
}

export type QuestionFaq = {
  id: string
  etablissementId: string
  q: string
  r: string
  categorie: string
}

export type UtilisateurPro = {
  id: string
  etablissementId: string
  nom: string
  role: string
  telephone: string
  email: string
  statut: string
  connexion: string
  avatar: string
  vous?: boolean
}

/** Une préinscription envoyée depuis la fiche d'une formation. */
export type Preinscription = {
  id: string
  formationId: string
  etablissementId: string
  /** Date d'envoi (ISO). */
  envoyeeLe: string
  statut: 'Envoyée'
  /** Les champs saisis, tels quels. */
  donnees: Record<string, string>
}

/** Une inscription à un permis, envoyée à une auto-école. */
export type InscriptionAutoEcole = {
  id: string
  autoEcoleId: string
  permis: PermisCode
  envoyeeLe: string
  statut: 'Envoyée'
  donnees: InscriptionDraft
}

/** Réglages de l'espace pro d'un établissement (Paramètres). */
export type ParametresEtablissement = {
  /** Identifiant de l'établissement. */
  id: string
  valeurs: Record<string, string | boolean>
}
