import type {
  SujetPublication,
  Lecture,
  Arrondissement,
  Departement,
  Commentaire,
  DemandeAssistance,
  Fichier,
  NotificationCompte,
  PieceEtablissement,
  SignalementAvis,
  Video,
  ActiviteSecurite,
  CategorieGalerie,
  FormationPopulaire,
  Indicateurs,
  MediaEtablissement,
  PhotoAutoEcole,
  TrancheFrais,
  Actualite,
  Album,
  Compte,
  CritereAvis,
  DiplomeType,
  Domaine,
  FiliereCarte,
  NotificationPro,
  PermisInfo,
  PointVisites,
  Quartier,
  Region,
  RepartitionNote,
  RolePro,
  SemestreProgramme,
  SessionActive,
  SourceVisites,
  TuileAnnuaire,
  TypeEcoleInfo,
  Ville,
  VilleRegion,
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
  DomaineExpertise,
  Enregistrement,
  Expert,
  Jaime,
  Publication,
  Signalement,
  BandeauAccueil,
} from '@/shared/types'

/**
 * Les collections (tables) de la base et le type de leurs éléments : toutes
 * les données de l'application, modifiables ou de référence. Une collection =
 * une table SQLite aujourd'hui, un point d'API ou une collection Firestore
 * demain. Chaque élément a un `id` texte. Données de départ : depart/yibolo.sql.
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
  comptes: Compte
  typesEcole: TypeEcoleInfo
  tuilesAnnuaire: TuileAnnuaire
  domaines: Domaine
  filieresCartes: FiliereCarte
  diplomes: DiplomeType
  regions: Region
  villesRegion: VilleRegion
  villes: Ville
  quartiers: Quartier
  departements: Departement
  arrondissements: Arrondissement
  repartitionNotes: RepartitionNote
  albums: Album
  programme: SemestreProgramme
  permis: PermisInfo
  criteresAvis: CritereAvis
  roles: RolePro
  notifications: NotificationPro
  visites: PointVisites
  sourcesVisites: SourceVisites
  sessionsActives: SessionActive
  activiteSecurite: ActiviteSecurite
  indicateurs: Indicateurs
  medias: MediaEtablissement
  formationsPopulaires: FormationPopulaire
  tranchesFrais: TrancheFrais
  categoriesGalerie: CategorieGalerie
  photosAutoEcole: PhotoAutoEcole
  // Accueil de l'utilisateur connecté
  domainesExpertise: DomaineExpertise
  experts: Expert
  publications: Publication
  enregistrements: Enregistrement
  jaimes: Jaime
  signalements: Signalement
  fichiers: Fichier
  piecesEtablissement: PieceEtablissement
  videos: Video
  notificationsCompte: NotificationCompte
  demandesAssistance: DemandeAssistance
  signalementsAvis: SignalementAvis
  commentaires: Commentaire
  lectures: Lecture
  sujetsPublication: SujetPublication
  // Accueil connecté : carrousel
  bandeauxAccueil: BandeauAccueil
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
  'comptes',
  'typesEcole',
  'tuilesAnnuaire',
  'domaines',
  'filieresCartes',
  'diplomes',
  'regions',
  'villesRegion',
  'villes',
  'quartiers',
  'departements',
  'arrondissements',
  'repartitionNotes',
  'albums',
  'programme',
  'permis',
  'criteresAvis',
  'roles',
  'notifications',
  'visites',
  'sourcesVisites',
  'sessionsActives',
  'activiteSecurite',
  'indicateurs',
  'medias',
  'formationsPopulaires',
  'tranchesFrais',
  'categoriesGalerie',
  'photosAutoEcole',
  'domainesExpertise',
  'experts',
  'publications',
  'enregistrements',
  'jaimes',
  'signalements',
  'fichiers',
  'piecesEtablissement',
  'videos',
  'notificationsCompte',
  'demandesAssistance',
  'signalementsAvis',
  'commentaires',
  'lectures',
  'sujetsPublication',
  'bandeauxAccueil',
] as const satisfies readonly CollectionName[]

/** Identifiant des enregistrements de la maquette, visibles pour tous les établissements. */
export const POUR_TOUS = '*'
