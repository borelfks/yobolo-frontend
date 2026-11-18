import { portrait } from '@/lib/utils'

export const actualites = [
  { id: 'rentree-2026', titre: 'Rentrée académique 2026 – Inscriptions ouvertes', date: '06 oct. 2026', statut: 'Publiée' as const, categorie: 'Rentrée / Admission', vues: 428, partages: 52, image: '/maquette/actu-rentree.jpg' },
  { id: 'ceremonie', titre: 'Cérémonie de remise des diplômes – Promo 2025', date: '20 sept. 2026', statut: 'Publiée' as const, categorie: 'Événement', vues: 312, partages: 31, image: '/maquette/actu-ceremonie.jpg' },
  { id: 'maintenance', titre: 'Nouvelle filière : Maintenance Industrielle', date: '01 sept. 2026', statut: 'Brouillon' as const, categorie: 'Formation', vues: 0, partages: 0, image: '/maquette/actu-filiere.jpg' },
]

export const actualiteById = (id?: string) => actualites.find((a) => a.id === id) ?? actualites[0]

export const documentsPro = [
  { nom: 'Brochure 2026 – 2027', type: 'PDF', categorie: 'Brochure', taille: '2,4 Mo', date: '05 nov. 2026', statut: 'Publié' },
  { nom: 'Conditions d’admission', type: 'PDF', categorie: 'Admission', taille: '480 Ko', date: '02 nov. 2026', statut: 'Publié' },
  { nom: 'Liste des pièces à fournir', type: 'DOCX', categorie: 'Admission', taille: '120 Ko', date: '02 nov. 2026', statut: 'Publié' },
  { nom: 'Règlement intérieur', type: 'PDF', categorie: 'Règlement', taille: '860 Ko', date: '20 oct. 2026', statut: 'Publié' },
  { nom: 'Calendrier académique', type: 'XLSX', categorie: 'Calendrier', taille: '95 Ko', date: '18 oct. 2026', statut: 'Brouillon' },
]

export const faq = [
  { q: 'Quelles sont les conditions d’admission en BTS ?', r: 'Être titulaire du baccalauréat (toutes séries) ou d’un diplôme équivalent. L’admission se fait sur étude du dossier et entretien.', categorie: 'Admission' },
  { q: 'Peut-on s’inscrire en cours du soir en travaillant ?', r: 'Oui, les cours du soir ont lieu du lundi au vendredi de 17 h 30 à 20 h 30, et le samedi matin.', categorie: 'Formation' },
  { q: 'Les frais peuvent-ils être payés en plusieurs fois ?', r: 'Oui : en 1 fois (–5 %), en 2 tranches ou mensuellement. Paiement par Mobile Money accepté.', categorie: 'Frais et paiement' },
  { q: 'Le diplôme est-il reconnu par l’État ?', r: 'Oui, nos BTS et licences sont délivrés sous la tutelle du MINESUP.', categorie: 'Diplômes' },
  { q: 'Quand a lieu la rentrée ?', r: 'La rentrée principale a lieu début octobre ; une rentrée décalée est possible en janvier pour certaines filières.', categorie: 'Admission' },
  { q: 'Les stages sont-ils obligatoires ?', r: 'Oui, un stage de 2 à 3 mois est obligatoire en fin de première et de deuxième année.', categorie: 'Formation' },
]

export const utilisateurs = [
  { nom: 'Paul Mbarga', role: 'Administrateur', telephone: '+237 6 77 12 34 56', email: 'p.mbarga@ipc.cm', statut: 'Actif', connexion: 'Aujourd’hui, 09:12', avatar: portrait(45), vous: true },
  { nom: 'Claire Ndongo', role: 'Responsable pédagogique', telephone: '+237 6 99 21 43 65', email: 'c.ndongo@ipc.cm', statut: 'Actif', connexion: 'Hier, 17:40', avatar: portrait(38, 'women') },
  { nom: 'Eric Talla', role: 'Communication', telephone: '+237 6 55 44 33 22', email: 'e.talla@ipc.cm', statut: 'Actif', connexion: '12 nov. 2026', avatar: portrait(19) },
  { nom: 'Mireille Owona', role: 'Secrétariat', telephone: '+237 6 70 80 90 10', email: 'm.owona@ipc.cm', statut: 'Actif', connexion: '10 nov. 2026', avatar: portrait(57, 'women') },
  { nom: 'Bruno Essomba', role: 'Consultation', telephone: '+237 6 91 82 73 64', email: 'b.essomba@ipc.cm', statut: 'Inactif', connexion: '02 oct. 2026', avatar: portrait(61) },
]

export const roles = [
  { nom: 'Administrateur', description: 'Accès complet à l’espace et aux paramètres' },
  { nom: 'Responsable pédagogique', description: 'Formations, programmes, candidatures' },
  { nom: 'Communication', description: 'Actualités, événements, médias' },
  { nom: 'Secrétariat', description: 'Préinscriptions, dossiers des apprenants' },
  { nom: 'Consultation', description: 'Lecture seule' },
]

export const notificationsPro = [
  { type: 'candidature', titre: 'Nouvelle candidature', texte: 'Grâce Mballa s’est préinscrite en BTS Comptabilité et Gestion.', date: 'Il y a 15 min', lu: false },
  { type: 'document', titre: 'Document téléchargé', texte: 'La brochure 2026 – 2027 a été téléchargée 12 fois aujourd’hui.', date: 'Il y a 2 h', lu: false },
  { type: 'avis', titre: 'Nouvel avis', texte: 'Paul N. a laissé un avis 5★ sur votre établissement.', date: 'Il y a 5 h', lu: false },
  { type: 'rappel', titre: 'Rappel – Rentrée académique', texte: 'La rentrée a lieu dans 15 jours : pensez à mettre à jour le calendrier.', date: 'Hier', lu: true },
  { type: 'validation', titre: 'Formation validée', texte: 'Votre formation « Marketing et Communication » a été validée par YIBOLO.', date: '12 nov. 2026', lu: true },
]

export const visitesSerie = [
  { label: '10 oct.', value: 100 },
  { label: '12 oct.', value: 135 },
  { label: '15 oct.', value: 130 },
  { label: '18 oct.', value: 210 },
  { label: '20 oct.', value: 205 },
  { label: '23 oct.', value: 285 },
  { label: '25 oct.', value: 245 },
  { label: '30 oct.', value: 305 },
  { label: '05 nov.', value: 425 },
  { label: '07 nov.', value: 360 },
  { label: '09 nov.', value: 390 },
]

export const sourcesVisites = [
  { name: 'Recherche YIBOLO', value: 45, color: '#1f55e6' },
  { name: 'Lien direct', value: 24, color: '#22c55e' },
  { name: 'Réseaux sociaux', value: 18, color: '#fbbf24' },
  { name: 'Autres', value: 13, color: '#8b5cf6' },
]

export const sessionsActives = [
  { appareil: 'Windows – Chrome', lieu: 'Yaoundé', date: 'Session actuelle', actuelle: true },
  { appareil: 'Android – Application', lieu: 'Douala', date: 'Il y a 2 jours', actuelle: false },
]

export const activiteSecurite = [
  { evenement: 'Connexion réussie', lieu: 'Yaoundé', date: 'Aujourd’hui, 09:12', ok: true },
  { evenement: 'Tentative échouée', lieu: 'Douala', date: '12 nov. 2026, 22:41', ok: false },
  { evenement: 'Mot de passe modifié', lieu: 'Yaoundé', date: '02 nov. 2026', ok: true },
]

/** Formations de l'espace pro de l'IPC, telles que sur la maquette (img11). */
export const formationsPro = [
  { id: 'f-cg-ipc', nom: 'BTS Comptabilité & Gestion', code: 'BTS-CG', filiere: 'Comptabilté & Gestion', ton: 'blue', diplome: 'BTS', duree: '24 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-rh-ipc', nom: 'BTS Ressources Humaines', code: 'BTS-RH', filiere: 'Ressources Humaines', ton: 'violet', diplome: 'BTS', duree: '24 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-info-ipc', nom: 'BTS Informatique', code: 'BTS-INF', filiere: 'Informatique', ton: 'sky', diplome: 'BTS', duree: '24 mois', rentree: '05 oct. 2026', statut: 'En attente' },
  { id: 'f-mkt-ipc', nom: 'Bac+3 Gestion d’Entreprise', code: 'L3-GE', filiere: 'Gestion', ton: 'green', diplome: 'Licence', duree: '12 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-banque-ipc', nom: 'BTS Froid et Climatisation', code: 'BTS-FC', filiere: 'Maintenance', ton: 'violet', diplome: 'BTS', duree: '24 mois', rentree: '—', statut: 'Brouillon' },
  { id: 'f-log-ipc', nom: 'BTS Logistique et Transport', code: 'BTS-LT', filiere: 'Logistique', ton: 'sky', diplome: 'BTS', duree: '24 mois', rentree: '05 oct. 2026', statut: 'En attente' },
  { id: 'f-audit-ipc', nom: 'Master Audit et Contrôle de Gestion', code: 'MST-ACG', filiere: 'Comptabilté & Gestion', ton: 'blue', diplome: 'Master', duree: '24 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-mkt2-ipc', nom: 'Licence Marketing et Communication', code: 'LIC-MC', filiere: 'Marketing', ton: 'pink', diplome: 'Licence', duree: '36 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-banque2-ipc', nom: 'Licence Banque et Finance', code: 'LIC-BF', filiere: 'Finance', ton: 'orange', diplome: 'Licence', duree: '36 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-info2-ipc', nom: 'Licence Informatique', code: 'LIC-IN', filiere: 'Informatique', ton: 'sky', diplome: 'Licence', duree: '36 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-sec-ipc', nom: 'BTS Secrétariat de Direction', code: 'BTS-SD', filiere: 'Gestion', ton: 'green', diplome: 'BTS', duree: '24 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
  { id: 'f-trans-ipc', nom: 'BTS Transit et Douane', code: 'BTS-TD', filiere: 'Logistique', ton: 'sky', diplome: 'BTS', duree: '24 mois', rentree: '05 oct. 2026', statut: 'Publiée' },
] as const
