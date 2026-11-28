import { data } from '@/data'
import type { Evenement, ProvenanceVisite } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Mesures réelles des pages publiques d'un établissement (vues, provenance,
 * téléchargements, actualités), pour ses statistiques (décision du
 * 2026-11-25 : « je ne veux pas de fausses stats »).
 */

/** Les deux dernières pages vues dans YIBOLO, notées par le cadre public à chaque changement de page. */
let pagePrecedente = ''
let pageCourante = ''

/** Le cadre public note la page affichée (la précédente est gardée). */
export function noterPage(chemin: string) {
  if (chemin === pageCourante) return
  pagePrecedente = pageCourante
  pageCourante = chemin
}

/**
 * D'où vient le visiteur de la page `ici` : l'annuaire, une recherche, ses
 * favoris, l'accueil, ou un lien direct. Une page chargée à la demande peut
 * être notée par le cadre avant de mesurer sa vue : on prend alors la page
 * d'avant.
 */
export function provenance(ici: string): ProvenanceVisite {
  const p = pageCourante === ici ? pagePrecedente : pageCourante
  if (p.startsWith(ROUTES.favorites)) return 'favoris'
  if (p.startsWith(ROUTES.accueil)) return 'accueil'
  if (p.startsWith(ROUTES.schools) && /[?&](q|ville|region|filiere|niveau)=/.test(p)) return 'recherche'
  if (p.startsWith(ROUTES.schools)) return 'annuaire'
  return 'direct'
}

/** Enregistre un événement (son heure est celle d'aujourd'hui). */
export function mesurer(evenement: Omit<Evenement, 'id' | 'le'>) {
  return data.create('evenements', { ...evenement, le: new Date().toISOString() }, 'evt')
}
