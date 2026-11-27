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
  /** Site web (Profil › Coordonnées) ; absent : l’établissement n’en a pas. */
  siteWeb?: string
  /** Numéro de contribuable (Profil › Agrément & documents). Les accords d'ouverture sont dans la table `accordsEtablissement`. */
  niu?: string
  /** Rang parmi les premières cartes de l'annuaire École (absent : après). */
  vedette?: number
  id: string
  nom: string
  sigle: string
  type: TypeEcole
  region: string
  /** Département et arrondissement du découpage officiel (sélection géographique). */
  departement?: string
  arrondissement?: string
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
  rentree: string
  /** Spécialité et option de la nomenclature (table `nomenclatureFormations`) ; le nom est composé à partir d'elles. */
  specialiteId?: string
  optionId?: string
  /** Date limite d'inscription (AAAA-MM-JJ). */
  dateLimite?: string
  statut: 'Publiée' | 'Brouillon'
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
  /** Département du découpage officiel. */
  departement?: string
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
  region?: string
  departement?: string
  arrondissement?: string
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
  /** Toujours « Validé » : un compte est actif dès son inscription (décision du 2026-11-27 : pas de validation par YIBOLO). */
  statut: 'Validé'
  /** Profil d'une personne physique (Mon espace › Mon profil), comme dans yibolo-client. */
  civilite?: 'Monsieur' | 'Madame' | 'Mademoiselle'
  prenom?: string
  nom?: string
  nationalite?: string
  naissance?: string
  region?: string
  departement?: string
  arrondissement?: string
  /** La ville, déduite de l'arrondissement. */
  ville?: string
  quartier?: string
  /** Le numéro de téléphone est aussi le numéro WhatsApp. */
  whatsapp?: boolean
  /** Le numéro a été confirmé par le code (OTP) reçu à l'inscription. */
  telephoneVerifie?: boolean
  /** Mot de passe haché : sha256(sel + ':' + mot de passe), en hexadécimal. */
  motDePasse: { sel: string; hash: string }
  /** Comment être prévenu, par sujet (Mon espace › Paramètres). */
  preferencesNotifications?: Partial<Record<SujetNotification, PreferenceNotification>>
}

/* --- Données enregistrées dans la base de test (src/data) ----------------- */
/*
 * Les enregistrements qui portent `etablissementId: '*'` (ou `autoEcoleId: '*'`)
 * sont ceux de la maquette : ils s'affichent pour tous les établissements,
 * comme avant. Ceux créés par les testeurs portent le vrai identifiant.
 */

export type StatutPublication = 'Publiée' | 'Brouillon'

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
  /** Date limite d'inscription (AAAA-MM-JJ), pour les formations créées avec le nouveau formulaire. */
  dateLimite?: string
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
export type DiplomeType = { id: string; typeSlug: TypeSlug; nom: string; count: number }
export type Region = { id: string; nom: string; chef: string; image: string }
export type Ville = { id: string; nom: string; region: string; image: string }
export type Quartier = { id: string; nom: string }
/** Le découpage officiel du Cameroun (repris de yibolo-backend) : région → département → arrondissement. */
export type Departement = { id: string; region: string; nom: string; chefLieu: string }
/** `ville` : la ville de l'arrondissement (« Douala III » → « Douala »). */
export type Arrondissement = { id: string; departement: string; nom: string; ville: string }
/** Un lieu saisi avec la sélection géographique ; la ville se déduit de l'arrondissement. */
export type Lieu = { region: string; departement: string; arrondissement: string; quartier: string }
/** Un album de la galerie d'un établissement (une photo). */
export type Album = { id: string; etablissementId: string; nom: string; image: string }
/** Un semestre du programme d'une formation. */
export type SemestreProgramme = { id: string; formationId: string; annee: string; semestre: string; ue: string[]; heures: number }
export type PermisInfo = Permis & { id: PermisCode }
/** Un critère d'avis d'auto-école ; sa note est la moyenne de celles des avis (calculée). */
export type CritereAvis = { id: string; nom: string }
export type RolePro = { id: string; nom: string; description: string }
export type NotificationPro = { id: string; /** L'établissement destinataire (absent : tous, comme celles de la maquette). */ etablissementId?: string; type: string; titre: string; texte: string; date: string; lu: boolean }
/** Un événement de sécurité d'un compte (connexion, tentative échouée, mot de passe changé). */
export type ActiviteSecurite = { id: string; compteId: string; evenement: 'connexion' | 'echec' | 'motDePasse'; le: string; appareil: string; ok: boolean }

/** D'où vient le visiteur d'une fiche (page précédente dans YIBOLO, sinon lien direct). */
export type ProvenanceVisite = 'annuaire' | 'recherche' | 'favoris' | 'accueil' | 'direct'

/**
 * Ce qui se passe réellement sur les pages publiques d'un établissement, pour
 * ses statistiques : une vue de sa fiche ou d'une formation, un téléchargement
 * de document (décision du 2026-11-25 : vraies données).
 */
export type Evenement = {
  id: string
  etablissementId: string
  type: 'vue' | 'vueFormation' | 'telechargement'
  formationId?: string
  documentId?: string
  provenance?: ProvenanceVisite
  /** Quand (ISO). */
  le: string
}
export type MediaEtablissement = { id: string; etablissementId: string; src: string; video: boolean }
export type FormationPopulaire = { id: string; typeSlug: TypeSlug; titre: string; diplome: string; image: string; formationId: string }
export type CategorieGalerie = { id: 'all' | 'centre' | 'vehicles' | 'classes' | 'exams' }
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

/** Un texte de la base écrit en français et en anglais. */
export type TexteTraduit = { fr: string; en: string }

/** Un bandeau du carrousel de l'accueil connecté. `cible` : où mène son bouton. */
export type BandeauAccueil = { id: string; titre: TexteTraduit; texte: TexteTraduit; action: TexteTraduit; cible: 'ecoles' | 'conseils'; image: string }

/** Une publication mise de côté par un compte (« Mes enregistrés »). */
export type Enregistrement = { id: string; compteId: string; publicationId: string; le: string }

/** Un « J'aime » d'un compte sur une publication. */
export type Jaime = { id: string; compteId: string; publicationId: string }

export type MotifDeSignalement = 'spam' | 'proposHaineux' | 'contenuTrompeur' | 'horsSujet'

/** Un signalement envoyé à la modération. */
export type Signalement = { id: string; compteId: string; publicationId: string; /** Un commentaire signalé (sinon : la publication). */ commentaireId?: string; motif: MotifDeSignalement; precision: string; le: string }

/* --- Fichiers, vidéos, notifications, assistance, signalements, commentaires -- */

/** Un fichier joint par un testeur, enregistré dans la base (data URL). */
export type Fichier = { id: string; nom: string; type: string; taille: number; dataUrl: string }
/** Une pièce officielle d'un établissement : aujourd'hui le certificat du NIU (Profil › Agrément & documents). `nom` : fichier envoyé. */
export type PieceEtablissement = { id: string; etablissementId: string; cle?: 'niu'; nom: string; taille: string; statut: 'Validé'; fichierId?: string }
/**
 * Un accord d'un établissement : de création (`nature` « creation ») ou d'ouverture (« ouverture »).
 * Il peut en avoir plusieurs de chaque, délivrés par des autorités différentes (MINESUP, MINEFOP…),
 * chacun avec son document.
 * `autorite` : un sigle de AUTORITES (`shared/utils/accords.ts`) ou le nom saisi pour « Autre ».
 * Dates au format AAAA-MM-JJ ; sans `expireLe`, l'accord n'expire pas.
 */
export type NatureAccord = 'creation' | 'ouverture'
/** Un élément de la nomenclature des formations : secteur › domaine › filière › spécialité › option. */
export type NiveauNomenclature = 'secteur' | 'domaine' | 'filiere' | 'specialite' | 'option'
export type ElementNomenclature = { id: string; niveau: NiveauNomenclature; nom: string; parentId?: string }

export type AccordEtablissement = { id: string; etablissementId: string; nature: NatureAccord; autorite: string; numero: string; delivreLe: string; expireLe?: string; fichierId?: string; nomFichier?: string; taille?: string }
/** Une vidéo (présentation ou galerie) d'un établissement ou d'une auto-école ; `cibleId` '*' : pour tous. */
export type Video = { id: string; cible: 'etablissement' | 'auto-ecole'; cibleId: string; usage: 'presentation' | 'galerie'; titre: string; poster: string; src: string }
/** Une notification de la cloche pour un compte. */
export type NotificationCompte = { id: string; compteId: string; type: SujetNotification; titre: string; texte: string; quand: string; lu: boolean; /** La page qu'elle ouvre (sinon : celle de son sujet). */ vers?: string }

/** Le sujet d'une notification : préinscription, permis, réponse à un avis, réponse à un commentaire, nouveauté YIBOLO. */
export type SujetNotification = 'preRegistration' | 'session' | 'review' | 'message' | 'info'

/** Les canaux choisis pour un sujet (Paramètres › Notifications). */
export type PreferenceNotification = { app: boolean; sms: boolean; email: boolean }
/** Une demande envoyée au support (« Assistance YIBOLO »). */
export type DemandeAssistance = { id: string; compteId: string; sujet: string; message: string; envoyeeLe: string; statut: 'Envoyée' }
/** Le signalement d'un avis. */
export type SignalementAvis = { id: string; avisId: string; cible: 'etablissement' | 'auto-ecole'; compteId?: string; motif: string; le: string }
/** Un commentaire sous une publication de l'accueil. */
export type Commentaire = {
  id: string
  publicationId: string
  /** Une réponse : le commentaire auquel elle répond (un seul niveau, comme yibolo-client). */
  parentId?: string
  compteId: string
  auteur: string
  avatar: string
  texte: string
  le: string
  /** Date de la dernière modification (ISO) : « Modifié ». */
  modifieLe?: string
  /** Supprimé par son auteur alors qu'il avait des réponses : « Ce commentaire a été supprimé ». */
  supprime?: boolean
}
/** Le libellé d'un sujet de publication (« creation-entreprise » → « Création d’entreprise »). */
export type SujetPublication = { id: string; nom: string }
/** Une publication ouverte par un compte : une vue, comptée une seule fois par compte. */
export type Lecture = { id: string; compteId: string; publicationId: string; le: string }
