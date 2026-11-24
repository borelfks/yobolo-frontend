/**
 * Liens vers des services extérieurs (plan, WhatsApp) et partage : de vraies
 * actions, sans clé ni compte (simples adresses web).
 */

/** Le plan Google Maps d'une adresse (au Cameroun). */
export function lienCarte(...parties: (string | undefined)[]) {
  const adresse = [...parties.filter(Boolean), 'Cameroun'].join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`
}

/** Une conversation WhatsApp avec un numéro camerounais (« +237 6 90 12 34 56 » → wa.me/237690123456). */
export function lienWhatsApp(telephone: string, message?: string) {
  const chiffres = telephone.replace(/\D/g, '')
  const numero = chiffres.length === 9 ? `237${chiffres}` : chiffres
  return `https://wa.me/${numero}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

/** Un appel téléphonique. */
export function lienTelephone(telephone: string) {
  return `tel:${telephone.replace(/[^\d+]/g, '')}`
}

/** Ouvre un lien extérieur dans un nouvel onglet. */
export function ouvrir(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Partage une page : la feuille de partage du téléphone si elle existe,
 * sinon le lien est copié. Renvoie « partage » ou « copie » (pour le message).
 */
export async function partager(titre: string, url = window.location.href): Promise<'partage' | 'copie'> {
  if (navigator.share) {
    try {
      await navigator.share({ title: titre, url })
      return 'partage'
    } catch {
      // Partage annulé ou refusé : on copie le lien.
    }
  }
  await navigator.clipboard.writeText(url)
  return 'copie'
}
