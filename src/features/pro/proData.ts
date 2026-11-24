import type { Etablissement, ModeCours, TypeEcole } from '@/shared/types'

/**
 * Écritures de l'espace pro : mise en forme des valeurs enregistrées dans la
 * base de test. Elles restent en français, au même format que les données de
 * la maquette (les données ne se traduisent pas).
 */

/** Réglages de l'espace pro : valeurs simples rangées par clé (`profil.nom`, `compte.email`…). */
export type Valeurs = Record<string, string | boolean>

const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

/** Date du jour au format des données de démo : « 23 nov. 2026 ». */
export function dateDuJour(d = new Date()) {
  return `${String(d.getDate()).padStart(2, '0')} ${MOIS_COURTS[d.getMonth()]} ${d.getFullYear()}`
}

/** Taille d'un fichier au format des données : « 480 Ko », « 2,4 Mo ». */
export function tailleFichier(octets: number) {
  if (octets < 1024 * 1024) return `${Math.max(1, Math.round(octets / 1024))} Ko`
  return `${(octets / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
}

/** « Brochure.pdf » → { nom: « Brochure », type: « PDF » } (colonne « type » des documents). */
export function decoupeFichier(fichier: string) {
  const m = /^(.*)\.([a-z0-9]+)$/i.exec(fichier)
  return m ? { nom: m[1] || fichier, type: (m[2] ?? '').toUpperCase() } : { nom: fichier, type: '—' }
}

/** Valeur lue dans les réglages : texte enregistré, sinon la valeur de la maquette. */
export function texte(valeurs: Valeurs, cle: string, defaut: string) {
  const v = valeurs[cle]
  return typeof v === 'string' ? v : defaut
}

/** Interrupteur lu dans les réglages : valeur enregistrée, sinon celle de la maquette. */
export function oui(valeurs: Valeurs, cle: string, defaut: boolean) {
  const v = valeurs[cle]
  return typeof v === 'boolean' ? v : defaut
}

/** Ajoute un préfixe aux clés (`nom` → `profil.nom`). */
export function prefixer(prefixe: string, valeurs: Valeurs): Valeurs {
  return Object.fromEntries(Object.entries(valeurs).map(([k, v]) => [`${prefixe}.${k}`, v]))
}

/** Les valeurs d'un préfixe, sans le préfixe (`profil.nom` → `nom`). */
export function sousCles(prefixe: string, valeurs: Valeurs): Valeurs {
  const debut = `${prefixe}.`
  return Object.fromEntries(Object.entries(valeurs).filter(([k]) => k.startsWith(debut)).map(([k, v]) => [k.slice(debut.length), v]))
}

/* --- Profil de l'établissement -------------------------------------------- */

const TYPES: TypeEcole[] = ['IPES', 'CFP', 'Auto-école', 'Autre']

/**
 * Champs du formulaire « Profil » qui existent dans la fiche publique
 * (type Etablissement) : publiés, ils changent la fiche. Les autres
 * (année de création, lieu-dit, agrément…) restent dans les réglages.
 */
export function patchEtablissement(valeurs: Valeurs, agrementActuel?: Etablissement['agrement']): Partial<Etablissement> {
  const patch: Partial<Etablissement> = {}
  const s = (cle: string) => (typeof valeurs[cle] === 'string' ? (valeurs[cle] as string) : undefined)
  const champs = ['nom', 'sigle', 'description', 'region', 'ville', 'quartier', 'telephone', 'email', 'anneeCreation', 'lieuDit', 'adresse'] as const
  for (const champ of champs) {
    const v = s(champ)
    if (v !== undefined) patch[champ] = v
  }
  const type = TYPES.find((x) => x === s('type'))
  if (type) patch.type = type
  // Agrément : les six champs de l'onglet, rangés ensemble dans la fiche.
  const cles = { numero: 'agrement', date: 'agrementDate', autorite: 'agrementAutorite', expiration: 'agrementExpiration', niu: 'niu', rccm: 'rccm' } as const
  if (Object.values(cles).some((c) => s(c) !== undefined)) {
    patch.agrement = Object.fromEntries(Object.entries(cles).map(([k, c]) => [k, s(c) ?? agrementActuel?.[k as keyof typeof cles] ?? ''])) as NonNullable<Etablissement['agrement']>
  }
  return patch
}

/* --- Formations ------------------------------------------------------------ */

/** Niveau choisi (clé de la liste) → valeur enregistrée, comme dans les données (« Baccalauréat »). */
export const NIVEAUX = { none: 'Aucun', probatoire: 'Probatoire', bac: 'Baccalauréat', btsHnd: 'BTS / HND', licence: 'Licence' } as const

/** Modes cochés → mode de cours enregistré. « Alternance » seule n'existe pas dans les données : cours du jour. */
export function modeCours(modes: string[]): ModeCours {
  const jour = modes.includes('Jour')
  const soir = modes.includes('Soir')
  return jour && soir ? 'Jour & Soir' : soir ? 'Soir' : 'Jour'
}

/** « 450 000 » ou « 450,000 » → 450000. */
export function montant(saisie: string) {
  return Number(saisie.replace(/\D/g, '')) || 0
}

/** Code d'une nouvelle formation, sur le modèle de la maquette : « BTS Comptabilité & Gestion » → « BTS-CG ». */
export function codeFormation(intitule: string, diplome: string) {
  const mots = intitule.split(/\s+/).filter((m) => m.length > 2 && m.toLowerCase() !== diplome.toLowerCase())
  const initiales = mots.map((m) => m[0]?.toUpperCase() ?? '').join('').slice(0, 3)
  return `${diplome.slice(0, 3).toUpperCase()}-${initiales || 'F'}`
}

/** Préfixe des identifiants des formations créées dans l'espace pro (`newId` → « formation-… ») ; celles de la maquette commencent par « f- ». */
export const PREFIXE_FORMATION_CREEE = 'formation'

/** Photo d'une formation créée par un testeur : une photo de formation de la maquette. */
export const IMAGE_FORMATION = '/images/maquette/form-bts-compta.jpg'

/* --- Contenus --------------------------------------------------------------- */

/** Catégorie choisie (clé de la liste) → valeur enregistrée, comme dans les données. */
export const CATEGORIES_ACTUALITE = { admission: 'Rentrée / Admission', event: 'Événement', training: 'Formation', results: 'Résultats' } as const

/** Photo d'une actualité créée, selon sa catégorie (photos de la maquette). */
export const IMAGES_ACTUALITE = {
  admission: '/images/maquette/actu-rentree.jpg',
  event: '/images/maquette/actu-ceremonie.jpg',
  training: '/images/maquette/actu-filiere.jpg',
  results: '/images/maquette/actu-ceremonie.jpg',
} as const

/** Catégorie donnée aux documents ajoutés (le formulaire ne la demande pas). */
export const CATEGORIE_DOCUMENT = 'Brochure'
