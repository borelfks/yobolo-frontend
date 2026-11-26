import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { LandingLayout } from '@/app/layouts/LandingLayout'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { ProLayout } from '@/app/layouts/ProLayout'
import { GardeAccueil } from '@/app/routes/GardeAccueil'
import { GardeListing } from '@/app/routes/GardeListing'
import { SelonEspace } from '@/app/routes/SelonEspace'
// Chargée d'emblée : elle sert d'écran de secours si une route plante.
import { ErrorPage } from '@/app/ErrorPage'
import { ROUTES, ROUTE_PATTERNS } from '@/shared/utils/routes'

/* --- Pages publiques ------------------------------------------------------ */
const Home = lazy(() => import('@/features/landing/pages/Home').then((m) => ({ default: m.Home })))
const HorsPerimetre = lazy(() => import('@/features/landing/pages/HorsPerimetre').then((m) => ({ default: m.HorsPerimetre })))
const Accueil = lazy(() => import('@/features/accueil/pages/Accueil').then((m) => ({ default: m.Accueil })))
const PublicationLue = lazy(() => import('@/features/accueil/pages/PublicationLue').then((m) => ({ default: m.PublicationLue })))
const NotFound = lazy(() => import('@/app/NotFound').then((m) => ({ default: m.NotFound })))

/* --- Authentification ----------------------------------------------------- */
const Connexion = lazy(() => import('@/features/auth/pages/Connexion').then((m) => ({ default: m.Connexion })))
const Inscription = lazy(() => import('@/features/auth/pages/Inscription').then((m) => ({ default: m.Inscription })))
const MotDePasseOublie = lazy(() => import('@/features/auth/pages/MotDePasseOublie').then((m) => ({ default: m.MotDePasseOublie })))

/* --- École : IPES, CFP, Autres -------------------------------------------- */
const EcolesHub = lazy(() => import('@/features/schools/pages/EcolesHub').then((m) => ({ default: m.EcolesHub })))
const TypeListing = lazy(() => import('@/features/schools/pages/TypeListing').then((m) => ({ default: m.TypeListing })))
const EcoleProfil = lazy(() => import('@/features/schools/pages/EcoleProfil').then((m) => ({ default: m.EcoleProfil })))
const FormationDetail = lazy(() => import('@/features/schools/pages/FormationDetail').then((m) => ({ default: m.FormationDetail })))
const Preinscription = lazy(() => import('@/features/schools/pages/Preinscription').then((m) => ({ default: m.Preinscription })))

/* --- École : auto-écoles ---------------------------------------------------- */
const AutoEcoles = lazy(() => import('@/features/driving-schools/pages/AutoEcoles').then((m) => ({ default: m.AutoEcoles })))
const AutoEcoleProfil = lazy(() => import('@/features/driving-schools/pages/AutoEcoleProfil').then((m) => ({ default: m.AutoEcoleProfil })))
const PermisDetail = lazy(() => import('@/features/driving-schools/pages/PermisDetail').then((m) => ({ default: m.PermisDetail })))
const InscriptionAutoEcole = lazy(() => import('@/features/driving-schools/pages/InscriptionAutoEcole').then((m) => ({ default: m.InscriptionAutoEcole })))
const ModifierInscription = lazy(() => import('@/features/driving-schools/pages/ModifierInscription').then((m) => ({ default: m.ModifierInscription })))

/* --- Avis et favoris ------------------------------------------------------ */
// Donner mon avis : une fenêtre (ModaleAvis), plus une page (demande du porteur du projet, 2026-11-25) :
// const DonnerAvis = lazy(() => import('@/features/reviews/pages/DonnerAvis').then((m) => ({ default: m.DonnerAvis })))
const Favoris = lazy(() => import('@/features/favorites/pages/Favoris').then((m) => ({ default: m.Favoris })))

/* --- Mon espace (personne physique) ----------------------------------------- */
const MonEspace = lazy(() => import('@/features/espace/pages/MonEspace').then((m) => ({ default: m.MonEspace })))
const DossierPreinscription = lazy(() => import('@/features/espace/pages/DossierPreinscription').then((m) => ({ default: m.DossierPreinscription })))
const DossierInscription = lazy(() => import('@/features/espace/pages/DossierInscription').then((m) => ({ default: m.DossierInscription })))
const MesNotifications = lazy(() => import('@/features/espace/pages/MesNotifications').then((m) => ({ default: m.MesNotifications })))
const MonProfil = lazy(() => import('@/features/espace/pages/MonProfil').then((m) => ({ default: m.MonProfil })))
const MesParametres = lazy(() => import('@/features/espace/pages/MesParametres').then((m) => ({ default: m.MesParametres })))

/* --- Espace professionnel École ------------------------------------------- */
const Dashboard = lazy(() => import('@/features/pro/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Profil = lazy(() => import('@/features/pro/pages/Profil').then((m) => ({ default: m.Profil })))
const Formations = lazy(() => import('@/features/pro/pages/Formations').then((m) => ({ default: m.Formations })))
const CreerFormation = lazy(() => import('@/features/pro/pages/CreerFormation').then((m) => ({ default: m.CreerFormation })))
const Contenus = lazy(() => import('@/features/pro/pages/Contenus').then((m) => ({ default: m.Contenus })))
const Publication = lazy(() => import('@/features/pro/pages/Publication').then((m) => ({ default: m.Publication })))
const Statistiques = lazy(() => import('@/features/pro/pages/Statistiques').then((m) => ({ default: m.Statistiques })))
const Parametres = lazy(() => import('@/features/pro/pages/Parametres').then((m) => ({ default: m.Parametres })))
const Preinscriptions = lazy(() => import('@/features/pro/pages/Preinscriptions').then((m) => ({ default: m.Preinscriptions })))
const PreinscriptionRecue = lazy(() => import('@/features/pro/pages/PreinscriptionRecue').then((m) => ({ default: m.PreinscriptionRecue })))
const DashboardAutoEcole = lazy(() => import('@/features/pro/pages/DashboardAutoEcole').then((m) => ({ default: m.DashboardAutoEcole })))
const ProfilAutoEcole = lazy(() => import('@/features/pro/pages/ProfilAutoEcole').then((m) => ({ default: m.ProfilAutoEcole })))
const PermisTarifs = lazy(() => import('@/features/pro/pages/PermisTarifs').then((m) => ({ default: m.PermisTarifs })))
const PlanningSessions = lazy(() => import('@/features/pro/pages/PlanningSessions').then((m) => ({ default: m.PlanningSessions })))
const Inscriptions = lazy(() => import('@/features/pro/pages/Inscriptions').then((m) => ({ default: m.Inscriptions })))
const InscriptionRecue = lazy(() => import('@/features/pro/pages/InscriptionRecue').then((m) => ({ default: m.InscriptionRecue })))
const InviterUtilisateur = lazy(() => import('@/features/pro/pages/InviterUtilisateur').then((m) => ({ default: m.InviterUtilisateur })))

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
          { path: P.espacePreinscription, element: <DossierPreinscription /> },
          { path: P.espaceInscription, element: <DossierInscription /> },
          { path: P.espace, element: <MonEspace /> },
          { path: P.notifications, element: <MesNotifications /> },
          { path: P.profil, element: <MonProfil /> },
          { path: P.parametres, element: <MesParametres /> },
          { path: P.preRegistration, element: <Preinscription /> },
          { path: P.training, element: <FormationDetail /> },
          { path: P.drivingSchools, element: <GardeListing><AutoEcoles /></GardeListing> },
          // Donner mon avis : une fenêtre (ModaleAvis), plus une page (demande du porteur du projet, 2026-11-25) :
          // { path: P.drivingSchoolReview, element: <DonnerAvis /> },
          { path: P.enrollment, element: <InscriptionAutoEcole /> },
          { path: P.editEnrollment, element: <ModifierInscription /> },
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
        // Un même espace pour l'école et l'auto-école : chacune voit ses pages (SelonEspace).
        children: [
          { index: true, element: <SelonEspace ecole={<Dashboard />} autoEcole={<DashboardAutoEcole />} /> },
          { path: P.pro.profile, element: <SelonEspace ecole={<Profil />} autoEcole={<ProfilAutoEcole />} /> },
          { path: P.pro.trainings, element: <SelonEspace ecole={<Formations />} /> },
          { path: P.pro.newTraining, element: <SelonEspace ecole={<CreerFormation />} /> },
          { path: P.pro.editTraining, element: <SelonEspace ecole={<CreerFormation />} /> },
          { path: P.pro.publication, element: <SelonEspace ecole={<Publication />} /> },
          { path: P.pro.contents, element: <SelonEspace ecole={<Contenus />} /> },
          { path: P.pro.preRegistrations, element: <SelonEspace ecole={<Preinscriptions />} /> },
          { path: P.pro.preRegistration, element: <SelonEspace ecole={<PreinscriptionRecue />} /> },
          { path: P.pro.licences, element: <SelonEspace autoEcole={<PermisTarifs />} /> },
          { path: P.pro.planning, element: <SelonEspace autoEcole={<PlanningSessions />} /> },
          { path: P.pro.enrollments, element: <SelonEspace autoEcole={<Inscriptions />} /> },
          { path: P.pro.enrollment, element: <SelonEspace autoEcole={<InscriptionRecue />} /> },
          { path: P.pro.statistics, element: <Statistiques /> },
          { path: P.pro.inviteUser, element: <InviterUtilisateur /> },
          { path: P.pro.settings, element: <Parametres /> },
        ],
      },
    ],
  },
])
