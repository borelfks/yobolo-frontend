import type { Etablissement, Formation, TypeEcole } from '@/shared/types'

/**
 * Recherche et tri des annuaires (établissements, formations) : le texte
 * saisi et les critères de la barre de recherche (`SearchPanel`), le tri de
 * « Trier par » (`ResultsHeader`). Tout se calcule sur les données de la base.
 */

/** Critères de la barre de recherche ; une valeur vide = tous. */
export type Criteres = { region?: string; ville?: string; filiere?: string; niveau?: string; type?: TypeEcole | '' }

/** Ordre des tris par défaut de `ResultsHeader` : Pertinence, Mieux notés, Plus récents. */
export const TRIS = ['pertinence', 'bestRated', 'newest'] as const
export type Tri = (typeof TRIS)[number]

const contient = (texte: string, q: string) => texte.toLowerCase().includes(q.trim().toLowerCase())

/** Les formations publiées d'un établissement. */
const formationsDe = (e: Etablissement, formations: Formation[]) => formations.filter((f) => f.etablissementId === e.id && f.statut === 'Publiée')

export function filtrerEtablissements(liste: Etablissement[], q: string, c: Criteres, formations: Formation[]) {
  return liste.filter((e) => {
    const fs = formationsDe(e, formations)
    return (
      (!q.trim() || contient([e.nom, e.sigle, e.ville, e.quartier, ...e.filieres, ...fs.map((f) => f.nom)].join(' '), q)) &&
      (!c.region || e.region === c.region) &&
      (!c.ville || e.ville === c.ville) &&
      (!c.type || e.type === c.type) &&
      (!c.filiere || fs.some((f) => f.domaine === c.filiere)) &&
      (!c.niveau || fs.some((f) => f.diplome === c.niveau))
    )
  })
}

/** Trie sans modifier la liste. « Pertinence » et « Plus récents » gardent l'ordre de la base (les ajouts d'abord). */
export function trierEtablissements(liste: Etablissement[], tri: Tri) {
  const copie = [...liste]
  if (tri === 'bestRated') return copie.sort((a, b) => b.note - a.note || b.avis - a.avis)
  return copie
}

export function filtrerFormations(liste: Formation[], q: string, c: Criteres, etablissements: Etablissement[]) {
  return liste.filter((f) => {
    const e = etablissements.find((x) => x.id === f.etablissementId)
    return (
      (!q.trim() || contient([f.nom, f.filiere, f.diplome, e?.nom ?? ''].join(' '), q)) &&
      (!c.region || e?.region === c.region) &&
      (!c.ville || e?.ville === c.ville) &&
      (!c.filiere || f.domaine === c.filiere) &&
      (!c.niveau || f.diplome === c.niveau)
    )
  })
}
