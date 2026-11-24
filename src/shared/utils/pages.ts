/** Découpe une liste en pages : le nombre de pages et la tranche de la page demandée (ramenée dans les bornes). */
export function pageDe<T>(liste: T[], page: number, parPage: number) {
  const pages = Math.max(1, Math.ceil(liste.length / parPage))
  const courante = Math.min(Math.max(1, page), pages)
  return { pages, page: courante, elements: liste.slice((courante - 1) * parPage, courante * parPage) }
}
