import { lazy } from 'react'

/**
 * Les pages, chargées à la demande (un fichier téléchargé seulement quand on
 * ouvre la page). Le chargement et les erreurs sont gérés dans chaque cadre
 * (RouteOutlet) et par le routeur (pendingComponent, errorComponent).
 */
const page = <M extends Record<string, unknown>, K extends keyof M>(charger: () => Promise<M>, nom: K) =>
  lazy(() => charger().then((m) => ({ default: m[nom] as React.ComponentType })))

/* Pages publiques */
export const Home = page(() => import('@/modules/landing/pages/Home'), 'Home')
export const HorsPerimetre = page(() => import('@/modules/landing/pages/HorsPerimetre'), 'HorsPerimetre')
export const Accueil = page(() => import('@/modules/communaute/accueil/pages/Accueil'), 'Accueil')
export const PublicationLue = page(() => import('@/modules/communaute/accueil/pages/PublicationLue'), 'PublicationLue')
export const NotFound = page(() => import('@/app/NotFound'), 'NotFound')
export const Aide = page(() => import('@/modules/pages/pages/Aide'), 'Aide')
export const Conditions = page(() => import('@/modules/pages/pages/Conditions'), 'Conditions')

/* Authentification */
export const Connexion = page(() => import('@/modules/compte/auth/pages/Connexion'), 'Connexion')
export const Inscription = page(() => import('@/modules/compte/auth/pages/Inscription'), 'Inscription')
export const MotDePasseOublie = page(() => import('@/modules/compte/auth/pages/MotDePasseOublie'), 'MotDePasseOublie')

/* École : IPES, CFP, Autres */
export const EcolesHub = page(() => import('@/modules/ecole/etablissements/pages/EcolesHub'), 'EcolesHub')
export const TypeListing = page(() => import('@/modules/ecole/etablissements/pages/TypeListing'), 'TypeListing')
export const EcoleProfil = page(() => import('@/modules/ecole/etablissements/pages/EcoleProfil'), 'EcoleProfil')
export const FormationDetail = page(() => import('@/modules/ecole/etablissements/pages/FormationDetail'), 'FormationDetail')

/* École : auto-écoles */
export const AutoEcoles = page(() => import('@/modules/ecole/auto-ecoles/pages/AutoEcoles'), 'AutoEcoles')
export const AutoEcoleProfil = page(() => import('@/modules/ecole/auto-ecoles/pages/AutoEcoleProfil'), 'AutoEcoleProfil')
export const PermisDetail = page(() => import('@/modules/ecole/auto-ecoles/pages/PermisDetail'), 'PermisDetail')

/* Compte de la personne physique */
export const Favoris = page(() => import('@/modules/compte/favoris/pages/Favoris'), 'Favoris')
export const MesNotifications = page(() => import('@/modules/compte/mon-espace/pages/MesNotifications'), 'MesNotifications')
export const MonProfil = page(() => import('@/modules/compte/mon-espace/pages/MonProfil'), 'MonProfil')
export const MesParametres = page(() => import('@/modules/compte/mon-espace/pages/MesParametres'), 'MesParametres')

/* Espace professionnel École */
export const Dashboard = page(() => import('@/modules/ecole/espace-pro/pages/Dashboard'), 'Dashboard')
export const Profil = page(() => import('@/modules/ecole/espace-pro/pages/Profil'), 'Profil')
export const Formations = page(() => import('@/modules/ecole/espace-pro/pages/Formations'), 'Formations')
export const CreerFormation = page(() => import('@/modules/ecole/espace-pro/pages/CreerFormation'), 'CreerFormation')
export const Contenus = page(() => import('@/modules/ecole/espace-pro/pages/Contenus'), 'Contenus')
export const Publication = page(() => import('@/modules/ecole/espace-pro/pages/Publication'), 'Publication')
export const Statistiques = page(() => import('@/modules/ecole/espace-pro/pages/Statistiques'), 'Statistiques')
export const Parametres = page(() => import('@/modules/ecole/espace-pro/pages/Parametres'), 'Parametres')
export const InviterUtilisateur = page(() => import('@/modules/ecole/espace-pro/pages/InviterUtilisateur'), 'InviterUtilisateur')

/*
 * Pages masquées (demande du porteur du projet, 2026-11-25), gardées dans le
 * code mais sans adresse : Preinscription, InscriptionAutoEcole,
 * ModifierInscription, DonnerAvis (remplacée par la fenêtre ModaleAvis),
 * MonEspace, DossierPreinscription, DossierInscription.
 */
