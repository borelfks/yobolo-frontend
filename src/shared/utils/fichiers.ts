/**
 * Fichiers choisis par l'utilisateur (photos, logos, documents) : sans serveur,
 * ils sont enregistrés dans la base sous forme de « data URL » (le fichier
 * encodé dans un texte). On limite donc leur poids.
 */

/** Poids maximal d'une photo (avatar, logo, bannière, média). */
export const TAILLE_MAX_PHOTO = 2 * 1024 * 1024

/** Poids maximal d'un document joint. */
export const TAILLE_MAX_DOCUMENT = 3 * 1024 * 1024

/** Le contenu d'un fichier, en data URL. */
export function lireFichier(fichier: File): Promise<string> {
  return new Promise((ok, erreur) => {
    const lecteur = new FileReader()
    lecteur.onload = () => ok(String(lecteur.result))
    lecteur.onerror = () => erreur(lecteur.error)
    lecteur.readAsDataURL(fichier)
  })
}

/** Une image, en data URL (même chose que lireFichier, nom plus parlant à l'appel). */
export const lireImage = lireFichier

/** Télécharge un fichier enregistré (data URL) sous son nom. */
export function telecharger(dataUrl: string, nom: string) {
  const lien = Object.assign(document.createElement('a'), { href: dataUrl, download: nom })
  lien.click()
}

/** Taille d'un fichier au format des données : « 480 Ko », « 2,4 Mo ». */
export function tailleFichier(octets: number) {
  if (octets < 1024 * 1024) return `${Math.max(1, Math.round(octets / 1024))} Ko`
  return `${(octets / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
}
