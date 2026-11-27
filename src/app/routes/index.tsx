import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { LandingLayout } from '@/app/layouts/LandingLayout'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { ProLayout } from '@/app/layouts/ProLayout'
import { GardeAccueil } from '@/app/routes/GardeAccueil'
import { GardeListing } from '@/app/routes/GardeListing'
// Chargée d'emblée : elle sert d'écran de secours si une route plante.
import { ErrorPage } from '@/app/ErrorPage'
import { ROUTES, ROUTE_PATTERNS } from '@/shared/utils/routes'

/* --- Pages publiques ------------------------------------------------------ */
const Home = lazy(() => import('@/modules/landing/pages/Home').then((m) => ({ default: m.Home })))
const HorsPerimetre = lazy(() => import('@/modules/landing/pages/HorsPerimetre').then((m) => ({ default: m.HorsPerimetre })))
const Accueil = lazy(() => import('@/modules/communaute/accueil/pages/Accueil').then((m) => ({ default: m.Accueil })))
const PublicationLue = lazy(() => import('@/modules/communaute/accueil/pages/PublicationLue').then((m) => ({ default: m.PublicationLue })))
const NotFound = lazy(() => import('@/app/NotFound').then((m) => ({ default: m.NotFound })))

/* --- Authentification ----------------------------------------------------- */
const Connexion = lazy(() => import('@/modules/compte/auth/pages/Connexion').then((m) => ({ default: m.Connexion })))
const Inscription = lazy(() => import('@/modules/compte/auth/pages/Inscription').then((m) => ({ default: m.Inscription })))
const MotDePasseOublie = lazy(() => import('@/modules/compte/auth/pages/MotDePasseOublie').then((m) => ({ default: m.MotDePasseOublie })))

/* --- École : IPES, CFP, Autres -------------------------------------------- */
const EcolesHub = lazy(() => import('@/modules/ecole/etablissements/pages/EcolesHub').then((m) => ({ default: m.EcolesHub })))
const TypeListing = lazy(() => import('@/modules/ecole/etablissements/pages/TypeListing').then((m) => ({ default: m.TypeListing })))
const EcoleProfil = lazy(() => import('@/modules/ecole/etablissements/pages/EcoleProfil').then((m) => ({ default: m.EcoleProfil })))
const FormationDetail = lazy(() => import('@/modules/ecole/etablissements/pages/FormationDetail').then((m) => ({ default: m.FormationDetail })))
// Préinscription masquée (demande du porteur du projet, 2026-11-25) :
// const Preinscription = lazy(() => import('@/modules/ecole/etablissements/pages/Preinscription').then((m) => ({ default: m.Preinscription })))

/* --- École : auto-écoles ---------------------------------------------------- */
const AutoEcoles = lazy(() => import('@/modules/ecole/auto-ecoles/pages/AutoEcoles').then((m) => ({ default: m.AutoEcoles })))
const AutoEcoleProfil = lazy(() => import('@/modules/ecole/auto-ecoles/pages/AutoEcoleProfil').then((m) => ({ default: m.AutoEcoleProfil })))
const PermisDetail = lazy(() => import('@/modules/ecole/auto-ecoles/pages/PermisDetail').then((m) => ({ default: m.PermisDetail })))
// Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
// const InscriptionAutoEcole = lazy(() => import('@/modules/ecole/auto-ecoles/pages/InscriptionAutoEcole').then((m) => ({ default: m.InscriptionAutoEcole })))
// Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
// const ModifierInscription = lazy(() => import('@/modules/ecole/auto-ecoles/pages/ModifierInscription').then((m) => ({ default: m.ModifierInscription })))

/* --- Avis et favoris ------------------------------------------------------ */
// Donner mon avis : une fenêtre (ModaleAvis), plus une page (demande du porteur du projet, 2026-11-25) :
// const DonnerAvis = lazy(() => import('@/modules/ecole/avis/pages/DonnerAvis').then((m) => ({ default: m.DonnerAvis })))
const Favoris = lazy(() => import('@/modules/compte/favoris/pages/Favoris').then((m) => ({ default: m.Favoris })))

/* --- Mon espace (personne physique) ----------------------------------------- */
// Mon espace masqué pour la personne physique (demande du porteur du projet, 2026-11-25) :
// const MonEspace = lazy(() => import('@/modules/compte/mon-espace/pages/MonEspace').then((m) => ({ default: m.MonEspace })))
// Préinscription masquée (demande du porteur du projet, 2026-11-25) :
// const DossierPreinscription = lazy(() => import('@/modules/compte/mon-espace/pages/DossierPreinscription').then((m) => ({ default: m.DossierPreinscription })))
// Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
// const DossierInscription = lazy(() => import('@/modules/compte/mon-espace/pages/DossierInscription').then((m) => ({ default: m.DossierInscription })))
const MesNotifications = lazy(() => import('@/modules/compte/mon-espace/pages/MesNotifications').then((m) => ({ default: m.MesNotifications })))
const MonProfil = lazy(() => import('@/modules/compte/mon-espace/pages/MonProfil').then((m) => ({ default: m.MonProfil })))
const MesParametres = lazy(() => import('@/modules/compte/mon-espace/pages/MesParametres').then((m) => ({ default: m.MesParametres })))

/* --- Espace professionnel École ------------------------------------------- */
const Dashboard = lazy(() => import('@/modules/ecole/espace-pro/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Profil = lazy(() => import('@/modules/ecole/espace-pro/pages/Profil').then((m) => ({ default: m.Profil })))
const Formations = lazy(() => import('@/modules/ecole/espace-pro/pages/Formations').then((m) => ({ default: m.Formations })))
const CreerFormation = lazy(() => import('@/modules/ecole/espace-pro/pages/CreerFormation').then((m) => ({ default: m.CreerFormation })))
const Contenus = lazy(() => import('@/modules/ecole/espace-pro/pages/Contenus').then((m) => ({ default: m.Contenus })))
const Publication = lazy(() => import('@/modules/ecole/espace-pro/pages/Publication').then((m) => ({ default: m.Publication })))
const Statistiques = lazy(() => import('@/modules/ecole/espace-pro/pages/Statistiques').then((m) => ({ default: m.Statistiques })))
const Parametres = lazy(() => import('@/modules/ecole/espace-pro/pages/Parametres').then((m) => ({ default: m.Parametres })))
const InviterUtilisateur = lazy(() => import('@/modules/ecole/espace-pro/pages/InviterUtilisateur').then((m) => ({ default: m.InviterUtilisateur })))

const P = ROUTE_PATTERNS

/**
 * Table des routes. Les adresses viennent de ROUTES / ROUTE_PATTERNS
 * (src/shared/utils/routes.ts). Les pages sont chargées à la demande ; le
 * chargement et les erreurs sont gérés dans chaque cadre (RouteOutlet).
 */
export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: ROUTES.signIn, element: <Connexion /> },
      { path: ROUTES.signUp, element: <Inscription /> },
      { path: ROUTES.forgotPassword, element: <MotDePasseOublie /> },
      // La landing, copiée de yibolo-client : son propre cadre (en-tête flottant, pied de page).
      // Réservée aux visiteurs : un compte connecté est mené à sa page d'arrivée (GardeAccueil).
      {
        element: (
          <GardeAccueil>
            <LandingLayout />
          </GardeAccueil>
        ),
        children: [{ index: true, element: <Home /> }],
      },
      {
        element: <PublicLayout />,
        children: [
          { path: P.accueil, element: <Accueil /> },
          { path: P.publication, element: <PublicationLue /> },
          { path: ROUTES.schools, element: <GardeListing><EcolesHub /></GardeListing> },
          { path: ROUTES.favorites, element: <Favoris /> },
          // Préinscription masquée (demande du porteur du projet, 2026-11-25) :
          // { path: P.espacePreinscription, element: <DossierPreinscription /> },
          // Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
          // { path: P.espaceInscription, element: <DossierInscription /> },
          // Mon espace masqué pour la personne physique (demande du porteur du projet, 2026-11-25) :
          // { path: P.espace, element: <MonEspace /> },
          { path: P.notifications, element: <MesNotifications /> },
          { path: P.profil, element: <MonProfil /> },
          { path: P.parametres, element: <MesParametres /> },
          // Préinscription masquée (demande du porteur du projet, 2026-11-25) :
          // { path: P.preRegistration, element: <Preinscription /> },
          { path: P.training, element: <FormationDetail /> },
          { path: P.drivingSchools, element: <GardeListing><AutoEcoles /></GardeListing> },
          // Donner mon avis : une fenêtre (ModaleAvis), plus une page (demande du porteur du projet, 2026-11-25) :
          // { path: P.drivingSchoolReview, element: <DonnerAvis /> },
          // Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
          // { path: P.enrollment, element: <InscriptionAutoEcole /> },
          // Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
          // { path: P.editEnrollment, element: <ModifierInscription /> },
          { path: P.license, element: <PermisDetail /> },
          { path: P.drivingSchool, element: <AutoEcoleProfil /> },
          // Donner mon avis : une fenêtre (ModaleAvis), plus une page (demande du porteur du projet, 2026-11-25) :
          // { path: P.schoolReview, element: <DonnerAvis /> },
          { path: P.school, element: <EcoleProfil /> },
          { path: P.schoolType, element: <GardeListing><TypeListing /></GardeListing> },
          { path: ROUTES.consultation, element: <HorsPerimetre /> },
          { path: ROUTES.emploi, element: <HorsPerimetre /> },
          { path: ROUTES.courses, element: <HorsPerimetre /> },
          { path: ROUTES.library, element: <HorsPerimetre /> },
          { path: ROUTES.help, element: <HorsPerimetre /> },
          { path: ROUTES.terms, element: <HorsPerimetre /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        path: P.pro.root,
        element: <ProLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: P.pro.profile, element: <Profil /> },
          { path: P.pro.trainings, element: <Formations /> },
          { path: P.pro.newTraining, element: <CreerFormation /> },
          { path: P.pro.editTraining, element: <CreerFormation /> },
          { path: P.pro.publication, element: <Publication /> },
          { path: P.pro.contents, element: <Contenus /> },
          { path: P.pro.statistics, element: <Statistiques /> },
          { path: P.pro.inviteUser, element: <InviterUtilisateur /> },
          { path: P.pro.settings, element: <Parametres /> },
        ],
      },
    ],
  },
])
