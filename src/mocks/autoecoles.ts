
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

export const permisCatalogue: Record<PermisCode, Permis> = {
  A: { code: 'A', nom: 'Motocyclette', vehicule: 'Moto', duree: '≈ 1 à 2 mois', prix: 250000, image: '/maquette/vehicule-A.jpg', tarifImage: '/maquette/tarif-A.jpg', sous: 'Conduite d’une moto (≥ 125 cm³)', description: 'Apprenez à conduire une moto en toute sécurité, de la théorie jusqu’à l’examen.', ageMin: 18 },
  B: { code: 'B', nom: 'Véhicule léger', vehicule: 'Voiture', duree: '≈ 2 à 3 mois', prix: 300000, image: '/maquette/vehicule-B.jpg', tarifImage: '/maquette/tarif-B.jpg', sous: 'Conduite d’un véhicule de tourisme', description: 'Le permis le plus demandé : voiture particulière, code et conduite.', ageMin: 18 },
  C: { code: 'C', nom: 'Poids lourd', vehicule: 'Camion', duree: '≈ 3 à 4 mois', prix: 450000, image: '/maquette/vehicule-C.jpg', tarifImage: '/maquette/tarif-C.jpg', sous: 'Conduite de camions et véhicules lourds', description: 'Conduite des véhicules de transport de marchandises de plus de 3,5 tonnes.', ageMin: 21, prerequis: 'Titulaire du Permis B' },
  D: { code: 'D', nom: 'Transport en commun', vehicule: 'Bus', duree: '≈ 2 à 3 mois', prix: 550000, image: '/maquette/vehicule-D.jpg', tarifImage: '/maquette/tarif-D.jpg', sous: 'Conduite de bus, car ou minibus', description: 'Transport de personnes : bus, cars et minibus.', ageMin: 21, prerequis: 'Titulaire du Permis B' },
  E: { code: 'E', nom: 'Remorque', vehicule: 'Remorque', duree: '≈ 1 mois', prix: 200000, image: '/maquette/vehicule-C.jpg', tarifImage: '/maquette/tarif-C.jpg', sous: 'Conduite avec remorque lourde', description: 'Conduite avec remorque lourde.', ageMin: 21, prerequis: 'Titulaire du Permis B ou C' },
}

export const permisList = Object.values(permisCatalogue)

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

export const autoEcoles: AutoEcole[] = [
  { id: 'conduite-plus', nom: 'Auto-École Conduite Plus', region: 'Centre', ville: 'Yaoundé', quartier: 'Bastos', note: 4.7, avis: 286, formes: 1250, image: '/maquette/ae-conduite-plus.jpg', permis: ['B', 'C', 'A', 'D'], creation: 2014, telephone: '+237 6 70 12 34 56', email: 'contact@conduiteplus.cm', site: 'www.conduiteplus.cm', adresse: 'Carrefour Bastos, face Pharmacie Centrale', logo: '/maquette/ae-logo-conduite-plus.jpg' },
  { id: 'cameroun-driving', nom: 'Auto-École Cameroun Driving', region: 'Centre', ville: 'Yaoundé', quartier: 'Mvan', note: 4.5, avis: 198, formes: 980, image: '/maquette/ae-cameroun-driving.jpg', permis: ['B', 'C', 'D'], creation: 2009, telephone: '+237 6 99 11 22 33', email: 'info@camerourdriving.cm', site: 'www.camerourdriving.cm' },
  { id: 'union-conduite', nom: 'Auto-École Union Conduite', region: 'Centre', ville: 'Yaoundé', quartier: 'Omnisports', note: 4.4, avis: 162, formes: 720, image: '/maquette/ae-union-conduite.jpg', permis: ['A', 'B'], creation: 2015, telephone: '+237 6 55 44 33 22', email: 'union@conduite.cm', site: 'www.unionconduite.cm' },
  { id: 'conduite-sure', nom: 'Auto-École La Conduite Sûre', region: 'Centre', ville: 'Yaoundé', quartier: 'Centre', note: 4.8, avis: 96, formes: 1430, image: '/maquette/ecole-ae-conduite-sure.jpg', permis: ['A', 'B', 'C'], creation: 2006, telephone: '+237 6 70 70 70 70', email: 'conduitesure@gmail.com', site: 'www.conduitesure.cm' },
  { id: 'nord-conduite', nom: 'Auto-École Nord Conduite', region: 'Nord', ville: 'Garoua', quartier: 'Centre', note: 4.4, avis: 58, formes: 320, image: '/maquette/ae-cameroun-driving.jpg', permis: ['A', 'B', 'C', 'D'], creation: 2018, telephone: '+237 6 90 12 12 12', email: 'nordconduite@ae.cm', site: '—' },
  { id: 'securite-routiere', nom: 'Auto-École Sécurité Routière', region: 'Littoral', ville: 'Douala', quartier: 'Bonapriso', note: 4.5, avis: 77, formes: 450, image: '/maquette/ae-union-conduite.jpg', permis: ['B', 'C', 'E'], creation: 2014, telephone: '+237 6 81 23 45 67', email: 'securite@ae.cm', site: '—' },
]

export const autoEcoleById = (id?: string) => autoEcoles.find((a) => a.id === id) ?? autoEcoles[0]

export const sessions = [
  { permis: 'B' as PermisCode, debut: '15 nov. 2026', horaires: ['Lun – Ven', '08h – 12h'], duree: '≈ 2 mois', places: 12 },
  { permis: 'A' as PermisCode, debut: '15 nov. 2026', horaires: ['Lun – Ven', '14h – 17h'], duree: '≈ 1 mois', places: 8 },
  { permis: 'C' as PermisCode, debut: '01 déc. 2026', horaires: ['Lun – Ven', '08h – 12h'], duree: '≈ 3 mois', places: 10 },
  { permis: 'D' as PermisCode, debut: '01 déc. 2026', horaires: ['Lun – Ven', '14h – 18h'], duree: '≈ 3 mois', places: 8 },
]

export const pourquoiNousChoisir = [
  'Auto-école agréée',
  'Moniteurs certifiés et expérimentés',
  'Véhicules récents et sécurisés',
  'Taux de réussite élevé (≈ 85 %)',
  'Horaires flexibles (jour / soir / week-end)',
  'Accompagnement jusqu’à l’examen',
]

export const criteresAvis = [
  { nom: 'Qualité de la formation', note: 4.8 },
  { nom: 'Compétence des moniteurs', note: 4.7 },
  { nom: 'Organisation & planning', note: 4.6 },
  { nom: 'Infrastructures & véhicules', note: 4.6 },
  { nom: 'Accueil & accompagnement', note: 4.7 },
]

export const repartitionAutoEcole = [
  { etoiles: 5, pct: 72 },
  { etoiles: 4, pct: 20 },
  { etoiles: 3, pct: 5 },
  { etoiles: 2, pct: 2 },
  { etoiles: 1, pct: 1 },
]

export const avisAutoEcole = [
  { id: 'r1', nom: 'Pauline MBONG', date: 'Il y a 3 jours', note: 5, texte: 'Excellente auto-école ! Moniteurs patients et très professionnels. J’ai obtenu mon permis B en 2 mois. Je recommande vivement.', avatar: '/maquette/aeav-pauline.jpg' },
  { id: 'r2', nom: 'Franck ESSOMBA', date: 'Il y a 1 semaine', note: 4, texte: 'Bonne formation, cours bien structurés et véhicules en bon état. L’organisation est sérieuse.', avatar: '/maquette/aeav-franck.jpg' },
  { id: 'r3', nom: 'Aline NGONO', date: 'Il y a 2 semaines', note: 5, texte: 'Très bonne expérience. L’accompagnement jusqu’à l’examen est réel. Merci à toute l’équipe !', avatar: '/maquette/aeav-aline.jpg' },
  { id: 'r4', nom: 'Samuel TCHOUPO', date: 'Il y a 3 semaines', note: 4, texte: 'Auto-école fiable et bien équipée. Les horaires sont flexibles, ce qui m’a permis de suivre la formation sans perturber mon travail.', avatar: '/maquette/aeav-samuel.jpg' },
]

export const galerieCategories = [
  { nom: 'Toutes', count: 24 },
  { nom: 'Centre', count: 6 },
  { nom: 'Véhicules', count: 8 },
  { nom: 'Cours', count: 5 },
  { nom: 'Examens', count: 5 },
]
