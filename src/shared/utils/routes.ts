/**
 * Toutes les adresses de l'application, à un seul endroit.
 *
 * Chaque lien et chaque bouton de l'interface pointe vers une entrée de ce
 * fichier : il n'y a donc jamais de lien mort, et renommer une adresse se fait
 * en une seule modification. Les adresses restent en français (elles font
 * partie de la maquette) quelle que soit la langue choisie.
 */

/** Ajoute un segment final facultatif (onglet, section) à une adresse. */
const withTab = (base: string, tab?: string) => (tab ? `${base}/${tab}` : base)

export const ROUTES = {
  // -- Pages publiques ------------------------------------------------------
  home: '/',
  consultation: '/consultation',
  emploi: '/emploi',
  favorites: '/favoris',

  // -- Univers École : IPES, CFP, Autres -------------------------------------
  schools: '/ecoles',
  /** Annuaire d'un type d'école (« ipes », « cfp », « autres »), avec son onglet. */
  schoolType: (type: string, tab?: string) => withTab(`/ecoles/${type}`, tab),
  /** Fiche publique d'un établissement, avec son onglet. */
  school: (type: string, id: string, tab?: string) => withTab(`/ecoles/${type}/etablissement/${id}`, tab),
  schoolReview: (type: string, id: string) => `/ecoles/${type}/etablissement/${id}/avis/nouveau`,
  /** Détail d'une formation, avec son onglet. */
  training: (id: string, tab?: string) => withTab(`/ecoles/formations/${id}`, tab),
  preRegistration: (id: string) => `/ecoles/formations/${id}/preinscription`,

  // -- Univers École : auto-écoles -------------------------------------------
  drivingSchools: '/ecoles/auto-ecoles',
  drivingSchool: (id: string, tab?: string) => withTab(`/ecoles/auto-ecoles/${id}`, tab),
  drivingSchoolReview: (id: string) => `/ecoles/auto-ecoles/${id}/avis/nouveau`,
  /** Fiche d'un permis dans une auto-école, avec son onglet. */
  license: (id: string, code: string, tab?: string) => withTab(`/ecoles/auto-ecoles/${id}/permis/${code}`, tab),
  enrollment: (id: string, code: string) => `/ecoles/auto-ecoles/${id}/permis/${code}/inscription`,
  editEnrollment: (id: string, code: string, section: string) => `/ecoles/auto-ecoles/${id}/permis/${code}/inscription/modifier/${section}`,

  // -- Authentification -----------------------------------------------------
  signIn: '/connexion',
  /** Connexion qui présélectionne un compte école. */
  signInSchool: '/connexion?espace=ecole',
  signUp: '/inscription',

  // -- Espace professionnel École (IPES, CFP, Autres) -------------------------
  pro: {
    root: '/pro/ecole',
    profile: (tab?: string) => withTab('/pro/ecole/profil', tab),
    trainings: '/pro/ecole/formations',
    newTraining: '/pro/ecole/formations/nouvelle',
    editTraining: (id: string) => `/pro/ecole/formations/${id}/modifier`,
    contents: (tab?: string) => withTab('/pro/ecole/contenus', tab),
    publication: (id: string) => `/pro/ecole/contenus/actualites/${id}`,
    statistics: '/pro/ecole/statistiques',
    settings: (section?: string) => withTab('/pro/ecole/parametres', section),
    inviteUser: '/pro/ecole/parametres/utilisateurs/inviter',
  },
} as const

/** Motifs utilisés par la table des routes (src/app/routes/index.tsx). */
export const ROUTE_PATTERNS = {
  schoolType: 'ecoles/:type/:tab?',
  school: 'ecoles/:type/etablissement/:id/:tab?',
  schoolReview: 'ecoles/:type/etablissement/:id/avis/nouveau',
  training: 'ecoles/formations/:id/:tab?',
  preRegistration: 'ecoles/formations/:id/preinscription',
  drivingSchools: 'ecoles/auto-ecoles',
  drivingSchool: 'ecoles/auto-ecoles/:id/:tab?',
  drivingSchoolReview: 'ecoles/auto-ecoles/:id/avis/nouveau',
  license: 'ecoles/auto-ecoles/:id/permis/:code/:tab?',
  enrollment: 'ecoles/auto-ecoles/:id/permis/:code/inscription',
  editEnrollment: 'ecoles/auto-ecoles/:id/permis/:code/inscription/modifier/:section',
  pro: {
    root: '/pro/ecole',
    profile: 'profil/:tab?',
    trainings: 'formations',
    newTraining: 'formations/nouvelle',
    editTraining: 'formations/:id/modifier',
    publication: 'contenus/actualites/:id',
    contents: 'contenus/:tab?',
    statistics: 'statistiques',
    inviteUser: 'parametres/utilisateurs/inviter',
    settings: 'parametres/:section?',
  },
} as const
