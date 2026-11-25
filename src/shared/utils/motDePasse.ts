/**
 * Mots de passe des comptes de la base : jamais enregistrés en clair. On garde
 * un sel (hasard propre à chaque compte) et sha256(sel + ':' + mot de passe),
 * calculé par le navigateur (Web Crypto), sans bibliothèque.
 *
 * C'est une démo sans serveur : n'importe qui peut ouvrir sa propre base. Le
 * hachage évite seulement d'afficher les mots de passe dans un export.
 */

const hex = (bytes: ArrayBuffer | Uint8Array) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')

export async function hacherMotDePasse(sel: string, motDePasse: string) {
  const empreinte = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${sel}:${motDePasse}`))
  return hex(empreinte)
}

/** Un sel neuf (16 octets au hasard, en hexadécimal). */
export function nouveauSel() {
  return hex(crypto.getRandomValues(new Uint8Array(16)))
}

/** Mot de passe et sel → ce qu'on enregistre dans la base. */
export async function protegerMotDePasse(motDePasse: string) {
  const sel = nouveauSel()
  return { sel, hash: await hacherMotDePasse(sel, motDePasse) }
}

export async function verifierMotDePasse(enregistre: { sel: string; hash: string }, motDePasse: string) {
  return (await hacherMotDePasse(enregistre.sel, motDePasse)) === enregistre.hash
}

/** Pour comparer des identifiants : e-mail en minuscules, téléphone sans espaces ni indicatif +237. */
export function normaliserIdentifiant(valeur: string) {
  const v = valeur.trim().toLowerCase()
  if (v.includes('@')) return v
  return v.replace(/[\s.-]/g, '').replace(/^\+?237/, '')
}

/** Les quatre niveaux de solidité d'un mot de passe (libellés : common, `motDePasse.force.*`). */
export const NIVEAUX_FORCE = ['faible', 'moyen', 'bon', 'excellent'] as const

/**
 * La solidité d'un mot de passe, de 0 (vide) à 4, comme dans yibolo-client :
 * un point pour 8 caractères, un pour 12, un pour majuscules et minuscules,
 * un pour un chiffre, un pour un caractère spécial (entre 1 et 4).
 */
export function forceDuMotDePasse(motDePasse: string) {
  if (motDePasse.length === 0) return 0
  let points = 0
  if (motDePasse.length >= 8) points += 1
  if (motDePasse.length >= 12) points += 1
  if (/[a-z]/.test(motDePasse) && /[A-Z]/.test(motDePasse)) points += 1
  if (/\d/.test(motDePasse)) points += 1
  if (/[^A-Za-z0-9]/.test(motDePasse)) points += 1
  return Math.max(1, Math.min(4, points))
}
