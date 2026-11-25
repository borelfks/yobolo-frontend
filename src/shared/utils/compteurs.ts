import { data } from '@/data'
import { indicateursDe } from '@/data/hooks'
import type { Indicateurs } from '@/shared/types'

/**
 * Chiffres de l'espace pro (vues, candidatures, téléchargements, activités) :
 * ils partent de ceux de la maquette et suivent les actions. Les chiffres de
 * l'univers École (notes, avis, formations, établissements) ne sont plus des
 * compteurs : ils sont calculés à partir de la base (`src/data/hooks.ts`).
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
