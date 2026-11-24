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
