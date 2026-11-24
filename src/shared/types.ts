/**
 * Types du domaine Yibolo, à un seul endroit.
 * Les données de démonstration (src/mocks) et les écrans les importent d'ici.
 */

/* --- Écoles (IPES, CFP, Autres) -------------------------------------------- */

export type TypeEcole = 'IPES' | 'CFP' | 'Auto-école' | 'Autre'

export type ModeCours = 'Jour' | 'Soir' | 'Jour & Soir'

export type Etablissement = {
  /** Petite image carrée (barre latérale de l'espace pro, encart de la fiche formation). Sans elle : `image`. */
  vignette?: string
  /** Image de gauche de la bannière de l'espace pro (Profil). */
  banniere?: string
  /** Image de droite de la bannière de l'espace pro (« Changer la bannière »). */
  bandeau?: string
  /** Image de couverture (Profil › Médias). */
  couverture?: string
  logo?: string
  /** Photo de l'encart de la préinscription. */
  photoPreinscription?: string
  anneeCreation?: string
  /** Lieu-dit et adresse complète (Profil › Coordonnées). */
  lieuDit?: string
  adresse?: string
  /** Agrément et identifiants officiels (Profil › Agrément). */
  agrement?: { numero: string; date: string; autorite: string; expiration: string; niu: string; rccm: string }
  /** Rang parmi les premières cartes de l'annuaire École (absent : après). */
  vedette?: number
  /** Inscrit par un compte, en attente de la validation par YIBOLO : pas encore visible du public ni compté. */
  enVerification?: boolean
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
  /** Photo de l'en-tête de la fiche formation (sinon `image`). */
  photoEntete?: string
  /** Date de mise en ligne (ISO), pour ranger la formation dans le fil de l'accueil. */
  publieeLe?: string
  id: string
  etablissementId: string
  nom: string
  code: string
  filiere: string
  /** Domaine de l'annuaire (table `domaines`), pour le filtre « Filière ». */
  domaine?: string
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
  /** Prix affiché sur la fiche du permis (la maquette diffère de la liste). */
  prixFiche?: number
  /** La fiche propose « Être rappelé » au lieu du formulaire de contact. */
  contactRapide?: boolean
}

export type AutoEcole = {
  /** Nombre de photos annoncé dans l'aperçu. */
  nbPhotos?: number
  /** Rang parmi les premières cartes de l'annuaire École (absent : l'auto-école n'y figure pas). */
  vedette?: number
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
  /** Fichier joint de chaque pièce (identifiant dans la table `fichiers`). */
  fichiers?: Record<string, string>
}

/* --- Favoris --------------------------------------------------------------- */

/** Un favori : une formation, un établissement, une auto-école ou un permis. */
export type FavoriteKind = 'formation' | 'etablissement' | 'auto-ecole' | 'permis'

export type Favorite = { id: string; kind: FavoriteKind; folder: string; /** Vignette propre au favori (sinon l'image de l'élément). */ vignette?: string }

/* --- Comptes ---------------------------------------------------------------- */

/** Le rôle d'un compte : un compte = un espace. */
export type Role = 'utilisateur' | 'ipes' | 'cfp' | 'autre'

/** Ce que l'interface affiche du compte connecté. */
export type Account = {
  role: Role
  name: string
  subtitle: string
  avatar: string
  home: string
  /** L'établissement géré, pour les comptes école. */
  ecoleId?: string
}

/** Un compte enregistré dans la base (table `comptes`). */
export type Compte = Account & {
  id: string
  /** E-mail de connexion. */
  identifiant: string
  telephone: string
  /** « En vérification » après l'inscription, « Validé » après la validation par YIBOLO. */
  statut: 'Validé' | 'En vérification'
  /** Profil d'une personne physique (Mon espace › Mon profil). */
  civilite?: 'Monsieur' | 'Madame'
  naissance?: string
  region?: string
  ville?: string
  quartier?: string
  /** Mot de passe haché : sha256(sel + ':' + mot de passe), en hexadécimal. */
  motDePasse: { sel: string; hash: string }
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

/** La réponse de l'établissement (ou de l'auto-école) à un avis. */
export type ReponseAvis = { texte: string; le: string }

export type AvisEtablissement = Avis & { etablissementId: string; reponse?: ReponseAvis; /** Le compte qui l'a écrit (Mon espace › Mes avis). */ compteId?: string }

export type AvisAutoEcole = {
  id: string
  autoEcoleId: string
  /** Le compte qui l'a écrit (Mon espace › Mes avis). */
  compteId?: string
  /** Notes par critère (dans l'ordre de la table `criteresAvis`), quand l'auteur les a données. */
  criteres?: number[]
  reponse?: ReponseAvis
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
  /** Le fichier joint (table `fichiers`), pour l'aperçu et le téléchargement. */
  fichierId?: string
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
  /** Le compte connecté qui l'a envoyée (absent : visiteur). */
  compteId?: string
  formationId: string
  etablissementId: string
  /** Date d'envoi (ISO). */
  envoyeeLe: string
  statut: 'Envoyée' | 'Annulée'
  /** Date d'annulation par le candidat (ISO). */
  annuleeLe?: string
  /** Les champs saisis, tels quels. */
  donnees: Record<string, string>
}

/** Une inscription à un permis, envoyée à une auto-école. */
export type InscriptionAutoEcole = {
  id: string
  /** Le compte connecté qui l'a envoyée (absent : visiteur). */
  compteId?: string
  autoEcoleId: string
  permis: PermisCode
  envoyeeLe: string
  statut: 'Envoyée' | 'Annulée'
  /** Date d'annulation par le candidat (ISO). */
  annuleeLe?: string
  donnees: InscriptionDraft
}

/** Réglages de l'espace pro d'un établissement (Paramètres). */
export type ParametresEtablissement = {
  /** Identifiant de l'établissement. */
  id: string
  valeurs: Record<string, string | boolean>
}

/* --- Données de référence (tables de la base, lues par les écrans) -------- */

/** Chiffres d'un type d'école (annuaire IPES, CFP, Autres). */
export type TypeEcoleInfo = { id: TypeSlug; type: TypeEcole; count: number; filieres: number; diplomes: number; /** « Autre diplôme » de la liste des niveaux. */ autresDiplomes?: number }
/** Nombre affiché sur une tuile de l'annuaire École (`toutes`, `IPES`, `CFP`, `Auto-école`, `Autre`). */
export type TuileAnnuaire = { id: string; count: number }
export type Domaine = { id: string; typeSlug: TypeSlug; nom: string; count: number; ecoles: number; formations: number }
export type FiliereCarte = { id: string; typeSlug: TypeSlug; nom: string; ecoles: number; formations: number }
export type DiplomeType = { id: string; typeSlug: TypeSlug; nom: string; count: number }
export type Region = { id: string; nom: string; ipes: number; chef: string; image: string }
export type VilleRegion = { id: string; region: string; nom: string; ipes: number }
export type Ville = { id: string; nom: string; region: string; ipes: number; image: string }
export type Quartier = { id: string; nom: string }
export type RepartitionNote = { id: string; cible: 'etablissement' | 'auto-ecole'; etoiles: number; pct: number }
export type Album = { id: string; nom: string; count: number; image: string }
export type SemestreProgramme = { id: string; annee: string; semestre: string; ue: string[]; heures: number }
export type PermisInfo = Permis & { id: PermisCode }
export type CritereAvis = { id: string; nom: string; note: number }
export type RolePro = { id: string; nom: string; description: string }
export type NotificationPro = { id: string; /** L'établissement destinataire (absent : tous, comme celles de la maquette). */ etablissementId?: string; type: string; titre: string; texte: string; date: string; lu: boolean }
export type PointVisites = { id: string; label: string; value: number }
export type SourceVisites = { id: string; name: string; value: number; color: string }
export type SessionActive = { id: string; appareil: string; lieu: string; date: string; actuelle: boolean }
export type ActiviteSecurite = { id: string; evenement: string; lieu: string; date: string; ok: boolean }
/** Un chiffre et sa progression (en %). */
export type ChiffreTendance = { valeur: number; tendance: number }
/** Les chiffres de l'espace pro d'un établissement (`id` = établissement, '*' pour tous). */
export type Indicateurs = {
  id: string
  medias: number
  completude: number
  vues: ChiffreTendance
  candidatures: ChiffreTendance
  telechargements: ChiffreTendance
  /** Vues des formations les plus consultées, dans l'ordre. */
  vuesFormations: number[]
  activites: { id: 'applications' | 'downloads' | 'reviews'; count: number; jour: 'today' | 'yesterday'; heure: string }[]
}
export type MediaEtablissement = { id: string; etablissementId: string; src: string; video: boolean }
export type FormationPopulaire = { id: string; typeSlug: TypeSlug; titre: string; diplome: string; image: string; formationId: string }
export type TrancheFrais = { id: 'lt250' | 'from250to500' | 'from500to750' | 'from750to1000' | 'gt1000'; count: number }
export type CategorieGalerie = { id: 'all' | 'centre' | 'vehicles' | 'classes' | 'exams'; count: number }
export type PhotoAutoEcole = { id: string; autoEcoleId: string; usage: 'apercu' | 'galerie'; image: string }

/* --- Accueil de l'utilisateur connecté (copie de l'accueil de yibolo-client) --- */

/** Un domaine d'expertise (colonne de gauche, filtre du fil). `id` = slug (« conseil-juridique »). */
export type DomaineExpertise = { id: string; nom: string }

/** Un expert (consultant) qui publie sur le fil de l'accueil. */
export type Expert = { id: string; nom: string; photo: string; domaineId: string; ville: string }

/** Une publication du fil : écrite par un expert (table `experts`) ou par un compte (table `comptes`). */
export type Publication = {
  id: string
  auteurType: 'expert' | 'compte'
  auteurId: string
  /** Facultatif : sans titre, la première phrase du texte en tient lieu. */
  titre?: string
  texte: string
  /** Identifiants de `domainesExpertise`. */
  domaines: string[]
  /** Sujets libres (« ohada », « pme »), sans le #. */
  sujets: string[]
  image?: string
  /** Date de publication (ISO). */
  publieeLe: string
  /** Chiffres de départ ; les j'aime des comptes s'ajoutent (table `jaimes`). */
  jaimes: number
  commentaires: number
  lectures: number
  /** Un brouillon n'est vu que par son auteur. */
  statut: 'publiee' | 'brouillon'
}

export type TypeDeContrat = 'Cdi' | 'Cdd' | 'Stage' | 'Alternance' | 'Mission' | 'Freelance'
export type ModeDeTravail = 'SurSite' | 'Hybride' | 'ADistance'

/** Une offre d'emploi du fil et de « Offres d'emploi populaires ». */
export type OffreEmploi = {
  id: string
  titre: string
  lieu: string
  typeDeContrat: TypeDeContrat
  modeDeTravail: ModeDeTravail
  remuneration: { affichage: 'Montants' | 'Negociable' | 'Masquee'; minimum?: number; maximum?: number }
  publieurType: 'ecole' | 'entreprise'
  publieurNom: string
  /** L'établissement qui recrute (fiche publique), pour une école. */
  etablissementId?: string
  publieeLe: string
  clotureeLe: string
  /** Le poste et le profil recherché (fiche de l'offre). */
  description?: string
}

/** Une candidature d'un compte à une offre d'emploi (« Postuler »). */
export type Candidature = { id: string; compteId: string; offreId: string; message: string; le: string }

/** Un texte de la base écrit en français et en anglais. */
export type TexteTraduit = { fr: string; en: string }

/** Un bandeau du carrousel de l'accueil connecté. `cible` : où mène son bouton. */
export type BandeauAccueil = { id: string; titre: TexteTraduit; texte: TexteTraduit; action: TexteTraduit; cible: 'ecoles' | 'offres' | 'conseils'; image: string }

/** Une publication mise de côté par un compte (« Mes enregistrés »). */
export type Enregistrement = { id: string; compteId: string; publicationId: string; le: string }

/** Un « J'aime » d'un compte sur une publication. */
export type Jaime = { id: string; compteId: string; publicationId: string }

export type MotifDeSignalement = 'spam' | 'proposHaineux' | 'contenuTrompeur' | 'horsSujet'

/** Un signalement envoyé à la modération. */
export type Signalement = { id: string; compteId: string; publicationId: string; motif: MotifDeSignalement; precision: string; le: string }

export type CleDeTache = 'paiementsAReprendre' | 'reportsATrancher' | 'propositionsAExaminer' | 'rapportsAValider'

/** Ce qui attend un geste du compte (fenêtre « À faire » à l'arrivée sur l'accueil). */
export type TacheAccueil = { id: string; compteId: string; cle: CleDeTache; nombre: number }

/* --- Fichiers, vidéos, notifications, assistance, signalements, commentaires -- */

/** Un fichier joint par un testeur, enregistré dans la base (data URL). */
export type Fichier = { id: string; nom: string; type: string; taille: number; dataUrl: string }
/** Une pièce officielle d'un établissement (Profil › Documents officiels). `cle` : pièce attendue ; `nom` : fichier envoyé. */
export type PieceEtablissement = { id: string; etablissementId: string; cle?: 'authorisation' | 'statutes' | 'niu'; nom: string; taille: string; statut: 'Validé' | 'En vérification'; fichierId?: string }
/** Une vidéo (présentation ou galerie) d'un établissement ou d'une auto-école ; `cibleId` '*' : pour tous. */
export type Video = { id: string; cible: 'etablissement' | 'auto-ecole'; cibleId: string; usage: 'presentation' | 'galerie'; titre: string; poster: string; src: string }
/** Une notification de la cloche pour un compte. */
export type NotificationCompte = { id: string; compteId: string; type: 'preRegistration' | 'session' | 'message' | 'review' | 'info'; titre: string; texte: string; quand: string; lu: boolean }
/** Une demande envoyée au support (« Assistance YIBOLO »). */
export type DemandeAssistance = { id: string; compteId: string; sujet: string; message: string; envoyeeLe: string; statut: 'Envoyée' }
/** Le signalement d'un avis. */
export type SignalementAvis = { id: string; avisId: string; cible: 'etablissement' | 'auto-ecole'; compteId?: string; motif: string; le: string }
/** Un commentaire sous une publication de l'accueil. */
export type Commentaire = { id: string; publicationId: string; compteId: string; auteur: string; avatar: string; texte: string; le: string }
