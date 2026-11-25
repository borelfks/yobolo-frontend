/**
 * Vérification du téléphone par code (OTP), comme dans yibolo-client. Sans
 * serveur, le code ne peut pas partir par SMS ni WhatsApp : il est tiré au
 * hasard dans le navigateur et affiché à l'écran (démonstration).
 */

/** Longueur du code et délai avant de pouvoir en redemander un. */
export const LONGUEUR_CODE = 6
export const DELAI_RENVOI = 60

/** Un code à 6 chiffres, au hasard. */
export function nouveauCode() {
  return String((crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % 10 ** LONGUEUR_CODE).padStart(LONGUEUR_CODE, '0')
}

/** Les 9 chiffres d'un numéro camerounais saisi (« 6 90 12 34 56 », « +237690123456 » → « 690123456 »). */
export function chiffresDuNumero(saisie: string) {
  return saisie.replace(/\D/g, '').replace(/^237(?=\d{9}$)/, '')
}

/** Un numéro camerounais : 9 chiffres, sans 0 devant (6…, 2…). */
export const numeroValide = (saisie: string) => /^[2-9]\d{8}$/.test(chiffresDuNumero(saisie))

/** Le numéro au format des comptes : « +237 6 90 12 34 56 ». */
export function formaterNumero(saisie: string) {
  const c = chiffresDuNumero(saisie)
  return `+237 ${c.slice(0, 1)} ${c.slice(1, 3)} ${c.slice(3, 5)} ${c.slice(5, 7)} ${c.slice(7, 9)}`
}

/** « +237 6 90 12 34 56 » → « +237 6 •• •• •• 56 » : reconnaissable sans être affiché en entier. */
export function masquerNumero(telephone: string) {
  const c = chiffresDuNumero(telephone)
  if (c.length !== 9) return telephone
  // Espaces insécables : le numéro ne se coupe pas en fin de ligne.
  return `+237 ${c.slice(0, 1)} •• •• •• ${c.slice(7, 9)}`.replace(/ /g, ' ')
}
