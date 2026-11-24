import { data, dateDeCreation } from '@/data'
import { indicateursDe } from '@/data/hooks'
import type { Etablissement, Indicateurs } from '@/shared/types'

/**
 * Compteurs cohérents. Les chiffres de départ sont ceux de la maquette (ils
 * ne se recalculent pas) ; chaque action d'un testeur les fait varier
 * d'autant : chiffre de la maquette + ajouts − retraits.
 */

/** Heure actuelle « 10:24 » (activités récentes de l'espace pro). */
const heure = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

type Activite = Indicateurs['activites'][number]['id']

/**
 * Fait varier les chiffres d'un établissement (Tableau de bord, Statistiques).
 * La première fois, l'établissement reçoit sa propre ligne, copiée de celle
 * qu'il affichait (maquette, ou zéro pour un établissement créé).
 */
export async function ajusterIndicateurs(
  etablissementId: string,
  changement: { medias?: number; candidatures?: number; telechargements?: number; activite?: Activite },
) {
  const actuel = indicateursDe(await data.list('indicateurs'), etablissementId)
  const plus = (c: Indicateurs['vues'], n = 0) => ({ ...c, valeur: Math.max(0, c.valeur + n) })
  let activites = actuel.activites
  const { activite } = changement
  if (activite) {
    activites = activites.some((a) => a.id === activite)
      ? activites.map((a) => (a.id === activite ? { ...a, count: a.count + 1, jour: 'today' as const, heure: heure() } : a))
      : [...activites, { id: activite, count: 1, jour: 'today', heure: heure() }]
  }
  await data.put('indicateurs', {
    ...actuel,
    id: etablissementId,
    medias: Math.max(0, actuel.medias + (changement.medias ?? 0)),
    candidatures: plus(actuel.candidatures, changement.candidatures),
    telechargements: plus(actuel.telechargements, changement.telechargements),
    activites,
  })
}

/** Nombre de formations annoncé par l'établissement (fiche, tableau de bord) : + 1 ou − 1. */
export async function ajusterNombreFormations(etablissementId: string, n: number) {
  const ecole = (await data.list('etablissements')).find((e) => e.id === etablissementId)
  if (ecole) await data.update('etablissements', ecole.id, { formations: Math.max(0, ecole.formations + n) })
}

const SLUG_DU_TYPE: Partial<Record<Etablissement['type'], string>> = { IPES: 'ipes', CFP: 'cfp', Autre: 'autres' }

/**
 * Compte (n = 1) ou décompte (n = −1) un établissement dans l'annuaire :
 * tuiles, total de son type, et, pour un IPES, sa région et sa ville.
 * Appelé quand YIBOLO valide une inscription, et quand le profil change de
 * type, de région ou de ville.
 */
export async function compterDansLAnnuaire(e: Pick<Etablissement, 'type' | 'region' | 'ville'>, n: 1 | -1) {
  const plus = (x: number) => Math.max(0, x + n)
  for (const tuile of await data.list('tuilesAnnuaire')) {
    if (tuile.id === 'toutes' || tuile.id === e.type) await data.update('tuilesAnnuaire', tuile.id, { count: plus(tuile.count) })
  }
  const slug = SLUG_DU_TYPE[e.type]
  const type = (await data.list('typesEcole')).find((x) => x.id === slug)
  if (type) await data.update('typesEcole', type.id, { count: plus(type.count) })
  // Les régions et les villes de l'annuaire comptent les IPES.
  if (e.type !== 'IPES') return
  const region = (await data.list('regions')).find((r) => r.nom === e.region)
  if (region) await data.update('regions', region.id, { ipes: plus(region.ipes) })
  const villes = await data.list('villesRegion')
  const ville = villes.find((v) => v.region === e.region && v.nom === e.ville) ?? villes.find((v) => v.region === e.region && v.nom === 'Autres villes')
  if (ville) await data.update('villesRegion', ville.id, { ipes: plus(ville.ipes) })
  const grande = (await data.list('villes')).find((v) => v.nom === e.ville)
  if (grande) await data.update('villes', grande.id, { ipes: plus(grande.ipes) })
}

/** Les éléments ajoutés par les testeurs (pas ceux de la maquette). */
export const ajoutes = <T extends { id: string }>(liste: T[]) => liste.filter((x) => dateDeCreation(x.id))

/**
 * Répartition des notes (en %) d'un établissement ou d'une auto-école :
 * celle de la maquette pour ses avis de départ, plus les avis ajoutés.
 * `total` = nombre d'avis affiché (maquette + ajouts).
 */
export function repartitionAJour<R extends { etoiles: number; pct: number }>(repartition: R[], total: number, notesAjoutees: number[]): R[] {
  if (notesAjoutees.length === 0 || total <= 0) return repartition
  const depart = Math.max(0, total - notesAjoutees.length)
  return repartition.map((r) => {
    const n = (r.pct * depart) / 100 + notesAjoutees.filter((note) => Math.round(note) === r.etoiles).length
    return { ...r, pct: Math.round((n / total) * 100) }
  })
}

/** Note d'un critère : celle de la maquette pour les avis de départ, plus les notes ajoutées (arrondie au dixième). */
export function critereAJour(note: number, total: number, notesAjoutees: number[]) {
  if (notesAjoutees.length === 0 || total <= 0) return note
  const depart = Math.max(0, total - notesAjoutees.length)
  return Math.round(((note * depart + notesAjoutees.reduce((s, n) => s + n, 0)) / (depart + notesAjoutees.length)) * 10) / 10
}
