/**
 * Une adresse de ROUTES (« /accueil?sujet=droit », « /parametres#securite »)
 * découpée pour TanStack Router, qui veut le chemin, la recherche et l'ancre à
 * part : `<Link {...cible(url)}>`. Pour naviguer : `navigate({ href: url })`.
 */
export function cible(url: string): { to: string; search?: Record<string, string | string[]>; hash?: string } {
  const [avantAncre, hash] = url.split('#', 2)
  const [to, requete] = (avantAncre ?? '').split('?', 2)
  const resultat: { to: string; search?: Record<string, string | string[]>; hash?: string } = { to: to || '/' }
  if (requete) resultat.search = lireRecherche(requete)
  if (hash) resultat.hash = hash
  return resultat
}

/** « a=1&b=2&b=3 » → { a: '1', b: ['2', '3'] } (texte simple, sans conversion). */
export function lireRecherche(requete: string): Record<string, string | string[]> {
  const p = new URLSearchParams(requete)
  const objet: Record<string, string | string[]> = {}
  for (const cle of new Set(p.keys())) {
    const valeurs = p.getAll(cle)
    objet[cle] = valeurs.length > 1 ? valeurs : (valeurs[0] ?? '')
  }
  return objet
}

/** L'inverse : { a: '1', b: ['2', '3'] } → « ?a=1&b=2&b=3 » (vide s'il n'y a rien). */
export function ecrireRecherche(objet: Record<string, unknown>): string {
  const p = new URLSearchParams()
  for (const [cle, valeur] of Object.entries(objet)) {
    if (valeur === undefined || valeur === null || valeur === '') continue
    if (Array.isArray(valeur)) valeur.forEach((v) => p.append(cle, String(v)))
    else p.set(cle, String(valeur))
  }
  const texte = p.toString()
  return texte ? `?${texte}` : ''
}
