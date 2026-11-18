
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

export const typeTone: Record<TypeEcole, 'blue' | 'violet' | 'orange' | 'green'> = {
  IPES: 'blue',
  CFP: 'violet',
  'Auto-école': 'orange',
  Autre: 'green',
}

export const etablissements: Etablissement[] = [
  {
    id: 'ipc',
    nom: 'Institut Professionnel du Centre (IPC)',
    sigle: 'IPC',
    type: 'IPES',
    region: 'Centre',
    ville: 'Yaoundé',
    quartier: 'Bastos',
    note: 4.7,
    avis: 286,
    image: '/maquette/ecole-ipc.jpg',
    filieres: ['Comptabilité', 'RH', 'Informatique', 'Marketing', 'Logistique', 'Banque', 'Gestion', 'Commerce'],
    formations: 12,
    description:
      "L'Institut Professionnel du Centre (IPC) est un établissement de formation supérieure qui forme des professionnels opérationnels et compétitifs, adaptés aux besoins des entreprises.",
    telephone: '+237 6 90 12 34 56',
    email: 'contact@ipc.cm',
    rentree: '06 octobre 2026',
    photoFiche: '/maquette/ipc-batiment.jpg',
    principales: ['Comptabilité & Gestion', 'Ressources Humaines', 'Informatique & Numérique', 'Finance & Banques', 'Marketing & Commerce'],
  },
  {
    id: 'istp',
    nom: 'Institut Supérieur TechnoPro (ISTP)',
    sigle: 'ISTP',
    type: 'IPES',
    region: 'Centre',
    ville: 'Yaoundé',
    quartier: 'Nkolbisson',
    note: 4.6,
    avis: 132,
    image: '/maquette/ecole-istp.jpg',
    filieres: ['Informatique', 'Réseaux', 'Gestion', 'Génie logiciel', 'Télécoms', 'Data', 'Cybersécurité'],
    formations: 9,
    description: "L'ISTP forme aux métiers du numérique et de la gestion, avec des laboratoires équipés et des projets réels en entreprise.",
    telephone: '+237 6 99 45 12 00',
    email: 'info@istp.cm',
    rentree: '13 octobre 2026',
  },
  {
    id: 'ims',
    nom: 'Institut des Métiers de la Santé (IMS)',
    sigle: 'IMS',
    type: 'IPES',
    region: 'Littoral',
    ville: 'Douala',
    quartier: 'Akwa',
    note: 4.8,
    avis: 96,
    image: '/maquette/ecole-ims.jpg',
    filieres: ['Santé', 'Laboratoire', 'Paramédical', 'Soins infirmiers', 'Sage-femme', 'Pharmacie'],
    formations: 7,
    description: 'Formations paramédicales agréées, avec stages hospitaliers dès la première année.',
    telephone: '+237 6 55 31 77 80',
    email: 'admission@ims.cm',
    rentree: '20 octobre 2026',
  },
  {
    id: 'ihc',
    nom: 'Institut Hôtelier du Cameroun (IHC)',
    sigle: 'IHC',
    type: 'IPES',
    region: 'Centre',
    ville: 'Yaoundé',
    quartier: 'Mvog-Ada',
    note: 4.5,
    avis: 74,
    image: '/maquette/ecole-ihc.jpg',
    filieres: ['Hôtellerie', 'Restauration', 'Tourisme', 'Événementiel', 'Cuisine'],
    formations: 8,
    description: "L'IHC prépare aux métiers de l'hôtellerie, de la restauration et du tourisme, avec un restaurant d'application ouvert au public.",
    telephone: '+237 6 70 88 21 43',
    email: 'hello@ihc.cm',
    rentree: '06 octobre 2026',
  },
  {
    id: 'cfp-btp',
    nom: 'Centre de Formation Professionnelle (CFP) de Nkoabang',
    sigle: 'CFP Nkoabang',
    type: 'CFP',
    region: 'Centre',
    ville: 'Yaoundé',
    quartier: 'Nkoabang',
    note: 4.6,
    avis: 132,
    image: '/maquette/ecole-cfp-nkoabang.jpg',
    filieres: ['Mécanique', 'Électricité', 'Plomberie', 'Soudure', 'Froid & climatisation', 'Maçonnerie'],
    formations: 6,
    description: 'Formations qualifiantes aux métiers du bâtiment, encadrées par des professionnels du secteur.',
    telephone: '+237 6 94 20 10 11',
    email: 'cfp.btp@gmail.com',
    rentree: '03 novembre 2026',
  },
  {
    id: 'cfp-hotel',
    nom: 'École Hôtelière de Kribi',
    sigle: 'EHK',
    type: 'CFP',
    region: 'Sud',
    ville: 'Kribi',
    quartier: 'Centre',
    note: 4.6,
    avis: 64,
    image: '/maquette/ecole-ihc.jpg',
    filieres: ['Cuisine', 'Hébergement', 'Tourisme'],
    formations: 5,
    description: "Cuisine, service et hébergement, au cœur d'une ville touristique.",
    telephone: '+237 6 51 60 70 80',
    email: 'contact@ehk.cm',
    rentree: '10 novembre 2026',
  },
  {
    id: 'langues',
    nom: 'Centre de Langues Global',
    sigle: 'CLG',
    type: 'Autre',
    region: 'Centre',
    ville: 'Yaoundé',
    quartier: 'Mvog-Ada',
    note: 4.5,
    avis: 74,
    image: '/maquette/ecole-langues-global.jpg',
    filieres: ['Anglais', 'Français', 'Allemand', 'Espagnol', 'Chinois'],
    formations: 4,
    description: 'Cours de langues pour tous niveaux, préparation aux certifications internationales.',
    telephone: '+237 6 22 33 44 55',
    email: 'clp@langues.cm',
    rentree: 'Chaque mois',
  },
  {
    id: 'cfp-numerique',
    nom: 'Centre de Formation aux Métiers du Numérique',
    sigle: 'CFMN',
    type: 'CFP',
    region: 'Centre',
    ville: 'Yaoundé',
    quartier: 'Essos',
    note: 4.5,
    avis: 73,
    image: '/maquette/ecole-istp.jpg',
    filieres: ['Maintenance', 'Infographie', 'Bureautique'],
    formations: 5,
    description: 'Formations courtes et certifiantes aux métiers du numérique : maintenance, infographie, bureautique.',
    telephone: '+237 6 74 32 10 98',
    email: 'cfmn@formation.cm',
    rentree: '17 novembre 2026',
  },
  {
    id: 'cfp-mecanique',
    nom: 'CFP Mécanique Auto du Littoral',
    sigle: 'CFP-MAL',
    type: 'CFP',
    region: 'Littoral',
    ville: 'Douala',
    quartier: 'Ndokoti',
    note: 4.3,
    avis: 51,
    image: '/maquette/ecole-cfp-nkoabang.jpg',
    filieres: ['Mécanique auto', 'Électricité auto', 'Carrosserie'],
    formations: 4,
    description: 'Ateliers équipés et formateurs issus des garages de la place : un apprentissage par la pratique.',
    telephone: '+237 6 96 55 44 11',
    email: 'cfpmal@gmail.com',
    rentree: '01 décembre 2026',
  },
  {
    id: 'academie-info',
    nom: 'Académie Informatique de Bafoussam',
    sigle: 'AIB',
    type: 'Autre',
    region: 'Ouest',
    ville: 'Bafoussam',
    quartier: 'Djeleng',
    note: 4.4,
    avis: 38,
    image: '/maquette/ecole-istp.jpg',
    filieres: ['Bureautique', 'Développement web', 'Certification Cisco'],
    formations: 4,
    description: 'Cours d’informatique pour particuliers et entreprises, du débutant à la certification.',
    telephone: '+237 6 58 77 66 55',
    email: 'aib@academie.cm',
    rentree: 'Chaque mois',
  },
  {
    id: 'atelier-mode',
    nom: 'Atelier-École Mode & Couture',
    sigle: 'AEMC',
    type: 'Autre',
    region: 'Littoral',
    ville: 'Douala',
    quartier: 'Bonamoussadi',
    note: 4.6,
    avis: 29,
    image: '/maquette/ecole-langues-global.jpg',
    filieres: ['Couture', 'Stylisme', 'Broderie'],
    formations: 3,
    description: 'Apprenez la coupe, la couture et le stylisme auprès de créateurs reconnus.',
    telephone: '+237 6 99 10 20 30',
    email: 'aemc@mode.cm',
    rentree: '05 janvier 2027',
  },
]

export const etablissementById = (id?: string) => etablissements.find((e) => e.id === id) ?? etablissements[0]

/** Photos de formation reprises de la maquette (img27, img30). */
const formationImages: Record<string, string> = {
  'f-cg-ipc': '/maquette/form-compta.jpg',
  'f-info-istp': '/maquette/form-info.jpg',
  'f-inf-ims': '/maquette/form-sante.jpg',
  'f-info-ipc': '/maquette/form-ipc-info.jpg',
  'f-rh-ipc': '/maquette/form-ipc-rh.jpg',
  'f-lab-ims': '/maquette/form-licence-sante.jpg',
  'f-audit-ipc': '/maquette/form-master-genie.jpg',
}
const cycle = ['/maquette/form-bts-compta.jpg', '/maquette/form-licence-info.jpg', '/maquette/form-licence-sante.jpg', '/maquette/form-master-genie.jpg', '/maquette/form-compta.jpg', '/maquette/form-info.jpg']

const f = (
  id: string,
  etablissementId: string,
  nom: string,
  code: string,
  filiere: string,
  diplome: string,
  dureeMois: number,
  mode: ModeCours,
  fraisAn: number,
  statut: Formation['statut'] = 'Publiée',
  rentree = '06 oct. 2026',
): Formation => ({
  id,
  etablissementId,
  nom,
  code,
  filiere,
  diplome,
  niveau: diplome === 'Master' ? 'Licence' : 'Baccalauréat',
  dureeMois,
  mode,
  fraisInscription: 50000,
  fraisAn,
  rentree,
  statut,
  image: formationImages[id] ?? cycle[Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % cycle.length],
  description: `La formation ${nom} prépare à des métiers concrets et recherchés, avec des stages en entreprise et un encadrement de proximité.`,
})

export const formations: Formation[] = [
  f('f-cg-ipc', 'ipc', 'BTS Comptabilité & Gestion', 'BTS-CG', 'Comptabilité & Finance', 'BTS', 24, 'Jour & Soir', 450000),
  f('f-info-istp', 'istp', 'Licence Informatique', 'LIC-INFO', 'Informatique', 'Licence', 36, 'Jour', 750000),
  f('f-inf-ims', 'ims', 'BTS Santé & Paramédical', 'BTS-SP', 'Santé', 'BTS', 24, 'Jour', 600000),
  f('f-info-ipc', 'ipc', 'Licence Informatique', 'LIC-IN', 'Informatique & Numérique', 'Licence', 36, 'Jour', 750000),
  f('f-rh-ipc', 'ipc', 'BTS Ressources Humaines', 'BTS-GRH', 'Gestion des Ressources Humaines', 'BTS', 24, 'Soir', 450000),
  f('f-mkt-ipc', 'ipc', 'Marketing et Communication', 'LIC-MC', 'Marketing', 'Licence', 36, 'Jour', 550000),
  f('f-log-ipc', 'ipc', 'Logistique et Transport', 'BTS-LT', 'Logistique', 'BTS', 24, 'Jour & Soir', 430000, 'En attente'),
  f('f-audit-ipc', 'ipc', 'Audit et Contrôle de Gestion', 'MST-ACG', 'Comptabilité', 'Master', 24, 'Soir', 750000),
  f('f-banque-ipc', 'ipc', 'Banque et Finance', 'LIC-BF', 'Comptabilité', 'Licence', 36, 'Jour', 600000, 'Brouillon'),
  f('f-reseaux-istp', 'istp', 'Réseaux et Télécommunications', 'BTS-RT', 'Réseaux', 'BTS', 24, 'Jour', 480000),
  f('f-gestion-istp', 'istp', 'Gestion des Entreprises', 'LIC-GE', 'Gestion', 'Licence', 36, 'Soir', 520000),
  f('f-lab-ims', 'ims', 'Techniques de Laboratoire', 'LIC-TL', 'Laboratoire', 'Licence', 36, 'Jour', 700000),
  f('f-hotel-ihc', 'ihc', 'Hôtellerie et Restauration', 'BTS-HR', 'Hôtellerie', 'BTS', 24, 'Jour & Soir', 600000),
  f('f-tourisme-ihc', 'ihc', 'Tourisme et Événementiel', 'LIC-TE', 'Tourisme', 'Licence', 36, 'Soir', 650000),
  f('f-elec-btp', 'cfp-btp', 'Électricité Bâtiment', 'CQP-EB', 'Électricité', 'Certificat', 12, 'Jour', 250000),
  f('f-plomb-btp', 'cfp-btp', 'Plomberie Sanitaire', 'CQP-PS', 'Plomberie', 'CQP', 12, 'Jour & Soir', 220000),
  f('f-macon-btp', 'cfp-btp', 'Maçonnerie et Coffrage', 'DQP-MC', 'Maçonnerie', 'DQP', 18, 'Jour', 280000, 'En attente'),
  f('f-cuisine-ehk', 'cfp-hotel', 'Cuisine Professionnelle', 'CQP-CP', 'Cuisine', 'CQP', 12, 'Jour', 300000),
  f('f-heberg-ehk', 'cfp-hotel', 'Réception et Hébergement', 'DQP-RH', 'Hébergement', 'DQP', 18, 'Jour', 320000),
  f('f-maint-cfmn', 'cfp-numerique', 'Maintenance Informatique', 'CQP-MI', 'Maintenance', 'CQP', 9, 'Soir', 180000),
  f('f-infog-cfmn', 'cfp-numerique', 'Infographie et PAO', 'CQP-IP', 'Infographie', 'CQP', 9, 'Jour & Soir', 200000),
  f('f-meca-mal', 'cfp-mecanique', 'Mécanique Automobile', 'DQP-MA', 'Mécanique auto', 'DQP', 18, 'Jour', 260000),
  f('f-anglais-clp', 'langues', 'Anglais Général – Tous niveaux', 'ANG-G', 'Anglais', 'Attestation', 6, 'Soir', 150000),
  f('f-toefl-clp', 'langues', 'Préparation TOEFL / IELTS', 'ANG-T', 'Anglais', 'Certification', 3, 'Soir', 180000),
  f('f-bureau-aib', 'academie-info', 'Bureautique Professionnelle', 'BUR-P', 'Bureautique', 'Attestation', 3, 'Jour & Soir', 90000),
  f('f-web-aib', 'academie-info', 'Développement Web', 'WEB-1', 'Développement web', 'Certification', 6, 'Soir', 250000),
  f('f-couture-aemc', 'atelier-mode', 'Coupe et Couture', 'CC-1', 'Couture', 'Attestation', 12, 'Jour', 200000),
]

export const formationById = (id?: string) => formations.find((x) => x.id === id) ?? formations[0]
export const formationsOf = (etablissementId: string) => formations.filter((x) => x.etablissementId === etablissementId)

/** Les trois types d'école qui partagent le même gabarit (IPES, CFP, Autres). */
export type TypeSlug = 'ipes' | 'cfp' | 'autres'

export const typeConfig: Record<
  TypeSlug,
  { slug: TypeSlug; type: TypeEcole; court: string; long: string; pluriel: string; count: number; filieres: number; diplomes: number }
> = {
  ipes: { slug: 'ipes', type: 'IPES', court: 'IPES', long: 'Instituts Privés d’Enseignement Supérieur', pluriel: 'IPES', count: 532, filieres: 128, diplomes: 3426 },
  cfp: { slug: 'cfp', type: 'CFP', court: 'CFP', long: 'Centres de Formation Professionnelle', pluriel: 'CFP', count: 286, filieres: 74, diplomes: 1180 },
  autres: { slug: 'autres', type: 'Autre', court: 'Autres', long: 'Autres établissements (langues, informatique, arts…)', pluriel: 'établissements', count: 304, filieres: 52, diplomes: 860 },
}

export const slugOfType = (t: TypeEcole): TypeSlug | 'auto-ecoles' =>
  t === 'IPES' ? 'ipes' : t === 'CFP' ? 'cfp' : t === 'Autre' ? 'autres' : 'auto-ecoles'

export const isTypeSlug = (s?: string): s is TypeSlug => s === 'ipes' || s === 'cfp' || s === 'autres'

export const etablissementsOfType = (t: TypeEcole) => etablissements.filter((e) => e.type === t)

/** Tuiles de l'annuaire École (img3). */
export const typesEcole = [
  { key: 'toutes', label: 'Toutes les écoles', count: 1248, to: '/ecoles' },
  { key: 'IPES', label: 'IPES', count: 532, to: '/ecoles/ipes' },
  { key: 'CFP', label: 'CFP', count: 286, to: '/ecoles/cfp' },
  { key: 'Auto-école', label: 'Auto-écoles', count: 126, to: '/ecoles/auto-ecoles' },
  { key: 'Autre', label: 'Autres', count: 304, to: '/ecoles/autres' },
]

/** Domaines par type (onglet Filières). */
export const domainesParType: Record<TypeSlug, { nom: string; count: number; ecoles: number; formations: number }[]> = {
  ipes: [
    { nom: 'Gestion & Management', count: 24, ecoles: 86, formations: 1240 },
    { nom: 'Comptabilité & Finance', count: 12, ecoles: 74, formations: 960 },
    { nom: 'Informatique & Numérique', count: 18, ecoles: 62, formations: 820 },
    { nom: 'Santé & Paramédical', count: 16, ecoles: 48, formations: 540 },
    { nom: 'Génie & Techniques', count: 20, ecoles: 40, formations: 610 },
    { nom: 'Hôtellerie & Tourisme', count: 8, ecoles: 22, formations: 210 },
    { nom: 'Agriculture & Agroalimentaire', count: 6, ecoles: 18, formations: 160 },
    { nom: 'Droit & Sciences Sociales', count: 10, ecoles: 30, formations: 320 },
    { nom: 'Autres filières', count: 14, ecoles: 25, formations: 280 },
  ],
  cfp: [
    { nom: 'Bâtiment & Travaux publics', count: 14, ecoles: 58, formations: 310 },
    { nom: 'Électricité & Énergie', count: 9, ecoles: 44, formations: 220 },
    { nom: 'Mécanique & Automobile', count: 8, ecoles: 36, formations: 180 },
    { nom: 'Hôtellerie & Restauration', count: 10, ecoles: 40, formations: 190 },
    { nom: 'Numérique & Bureautique', count: 12, ecoles: 52, formations: 260 },
    { nom: 'Agriculture & Élevage', count: 7, ecoles: 21, formations: 90 },
    { nom: 'Beauté & Esthétique', count: 6, ecoles: 25, formations: 110 },
    { nom: 'Autres', count: 8, ecoles: 10, formations: 60 },
  ],
  autres: [
    { nom: 'Langues', count: 10, ecoles: 64, formations: 240 },
    { nom: 'Informatique', count: 12, ecoles: 72, formations: 280 },
    { nom: 'Arts & Mode', count: 8, ecoles: 38, formations: 120 },
    { nom: 'Musique & Culture', count: 6, ecoles: 22, formations: 70 },
    { nom: 'Soutien scolaire', count: 9, ecoles: 60, formations: 90 },
    { nom: 'Autres', count: 7, ecoles: 48, formations: 60 },
  ],
}

/** Les cartes de filières (onglet Filières, img26). */
export const filieresCartes: Record<TypeSlug, { nom: string; ecoles: number; formations: number }[]> = {
  ipes: [
    { nom: 'Comptabilité & Gestion', ecoles: 86, formations: 1240 },
    { nom: 'Informatique & Réseaux', ecoles: 72, formations: 980 },
    { nom: 'Santé & Paramédical', ecoles: 64, formations: 860 },
    { nom: 'Génie Civil & BTP', ecoles: 48, formations: 620 },
    { nom: 'Finance & Banque', ecoles: 46, formations: 560 },
    { nom: 'Ressources Humaines & Management', ecoles: 52, formations: 710 },
    { nom: 'Hôtellerie & Tourisme', ecoles: 38, formations: 420 },
    { nom: 'Agriculture & Agroalimentaire', ecoles: 29, formations: 310 },
    { nom: 'Droit & Sciences Sociales', ecoles: 41, formations: 490 },
  ],
  cfp: [],
  autres: [],
}

export const diplomesParType: Record<TypeSlug, { nom: string; count: number }[]> = {
  ipes: [
    { nom: 'BTS', count: 1240 },
    { nom: 'Licence', count: 980 },
    { nom: 'Master', count: 320 },
    { nom: 'Ingénieur', count: 180 },
    { nom: 'Certificat', count: 420 },
    { nom: 'Doctorat', count: 56 },
  ],
  cfp: [
    { nom: 'CQP', count: 520 },
    { nom: 'DQP', count: 340 },
    { nom: 'Certificat', count: 210 },
    { nom: 'Attestation', count: 110 },
  ],
  autres: [
    { nom: 'Attestation', count: 410 },
    { nom: 'Certification', count: 300 },
    { nom: 'Certificat', count: 150 },
  ],
}

export const regions = [
  { nom: 'Centre', ipes: 126, chef: 'Yaoundé', image: '/maquette/region-centre.jpg' },
  { nom: 'Littoral', ipes: 118, chef: 'Douala', image: '/maquette/region-littoral.jpg' },
  { nom: 'Ouest', ipes: 76, chef: 'Bafoussam', image: '/maquette/region-ouest.jpg' },
  { nom: 'Nord', ipes: 42, chef: 'Garoua', image: '/maquette/region-nord.jpg' },
  { nom: 'Extrême-Nord', ipes: 36, chef: 'Maroua', image: '/maquette/region-extreme-nord.jpg' },
  { nom: 'Sud', ipes: 34, chef: 'Ebolowa', image: '/maquette/region-sud.jpg' },
  { nom: 'Est', ipes: 30, chef: 'Bertoua', image: '/maquette/region-est.jpg' },
  { nom: 'Adamaoua', ipes: 28, chef: 'Ngaoundéré', image: '/maquette/region-adamaoua.jpg' },
  { nom: 'Nord-Ouest', ipes: 24, chef: 'Bamenda', image: '/maquette/region-nord-ouest.jpg' },
  { nom: 'Sud-Ouest', ipes: 18, chef: 'Buéa', image: '/maquette/region-sud-ouest.jpg' },
]

export const villesParRegion: Record<string, { nom: string; ipes: number }[]> = {
  Centre: [
    { nom: 'Yaoundé', ipes: 86 },
    { nom: 'Mbalmayo', ipes: 12 },
    { nom: 'Obala', ipes: 10 },
    { nom: 'Bafia', ipes: 8 },
    { nom: 'Nanga-Eboko', ipes: 6 },
    { nom: 'Autres villes', ipes: 4 },
  ],
  Littoral: [
    { nom: 'Douala', ipes: 68 },
    { nom: 'Nkongsamba', ipes: 22 },
    { nom: 'Edéa', ipes: 18 },
    { nom: 'Autres villes', ipes: 10 },
  ],
  Ouest: [
    { nom: 'Bafoussam', ipes: 34 },
    { nom: 'Dschang', ipes: 22 },
    { nom: 'Mbouda', ipes: 12 },
    { nom: 'Autres villes', ipes: 8 },
  ],
  Nord: [
    { nom: 'Garoua', ipes: 20 },
    { nom: 'Guider', ipes: 12 },
    { nom: 'Autres villes', ipes: 10 },
  ],
}

export const villes = [
  { nom: 'Yaoundé', region: 'Centre', ipes: 86, image: '/maquette/region-centre.jpg' },
  { nom: 'Douala', region: 'Littoral', ipes: 68, image: '/maquette/region-littoral.jpg' },
  { nom: 'Bafoussam', region: 'Ouest', ipes: 34, image: '/maquette/region-ouest.jpg' },
  { nom: 'Garoua', region: 'Nord', ipes: 20, image: '/maquette/region-nord.jpg' },
  { nom: 'Ebolowa', region: 'Sud', ipes: 12, image: '/maquette/region-sud.jpg' },
  { nom: 'Bertoua', region: 'Est', ipes: 14, image: '/maquette/region-est.jpg' },
  { nom: 'Bamenda', region: 'Nord-Ouest', ipes: 16, image: '/maquette/region-nord-ouest.jpg' },
  { nom: 'Buea', region: 'Sud-Ouest', ipes: 14, image: '/maquette/region-sud-ouest.jpg' },
]

export const quartiers = ['Bastos', 'Mvan', 'Ngoa-Ekellé', 'Essos', 'Akwa', 'Bonapriso', 'Bonabéri', 'Tamdja']

export type Avis = { id: string; nom: string; role: string; note: number; date: string; texte: string; utile: number; avatar: string }

export const avisIpc: Avis[] = [
  { id: 'a1', nom: 'Vanessa T.', role: 'Étudiante', note: 5, date: 'Il y a 3 jours', texte: 'Formation de qualité, enseignants disponibles et très professionnels. L’environnement est propice à la réussite. Je recommande !', utile: 42, avatar: '/maquette/avis-vanessa.jpg' },
  { id: 'a2', nom: 'Arnaud M.', role: 'Ancien étudiant', note: 4, date: 'Il y a 1 semaine', texte: 'Une formation pratique qui m’a permis de décrocher un emploi rapidement. Merci à toute l’équipe pédagogique.', utile: 28, avatar: '/maquette/avis-arnaud.jpg' },
  { id: 'a3', nom: 'Clarisse B.', role: 'Étudiante', note: 5, date: 'Il y a 2 semaines', texte: 'Très bonne organisation et suivi des étudiants. Les cours sont clairs et adaptés au marché du travail.', utile: 19, avatar: '/maquette/avis-clarisse.jpg' },
]

export const repartitionNotes = [
  { etoiles: 5, pct: 76 },
  { etoiles: 4, pct: 18 },
  { etoiles: 3, pct: 4 },
  { etoiles: 2, pct: 1 },
  { etoiles: 1, pct: 1 },
]

export const albums = [
  { nom: 'Campus & bâtiments', count: 12, image: '/maquette/album-campus.jpg' },
  { nom: 'Salles de cours', count: 10, image: '/maquette/album-salles.jpg' },
  { nom: 'Laboratoires', count: 8, image: '/maquette/album-labos.jpg' },
  { nom: 'Bibliothèque', count: 6, image: '/maquette/album-biblio.jpg' },
  { nom: 'Vie étudiante', count: 12, image: '/maquette/album-vie.jpg' },
]

/** Programme détaillé d'un BTS (onglet Programme). */
export const programme = {
  '1ère année (S1 – S2)': [
    { semestre: 'Semestre 1', ue: ['Comptabilité générale I', 'Mathématiques financières', 'Droit des affaires', 'Économie générale', 'Informatique bureautique'], heures: 300 },
    { semestre: 'Semestre 2', ue: ['Comptabilité générale II', 'Statistiques', 'Fiscalité I', 'Communication professionnelle', 'Anglais des affaires'], heures: 300 },
  ],
  '2ème année (S3 – S4)': [
    { semestre: 'Semestre 3', ue: ['Comptabilité analytique', 'Fiscalité II', 'Gestion financière', 'Audit I', 'Logiciels comptables (Sage)'], heures: 300 },
    { semestre: 'Semestre 4', ue: ['Contrôle de gestion', 'Projet tutoré', 'Stage en entreprise', 'Éthique professionnelle', 'Préparation au BTS'], heures: 300 },
  ],
}
