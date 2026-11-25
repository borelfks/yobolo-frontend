import { useState } from 'react'
import { correspond, instant, TAILLE_DU_FIL } from '@/features/accueil/accueilFil'
import type { FiltresDuFil } from '@/features/accueil/hooks/useFiltresDuFil'
import { useSession } from '@/features/auth/hooks/useSession'
import { useDomainesExpertise, useEnregistrements, useExperts, useLectures, usePublications, useSujetsPublication } from '@/data/hooks'
import type { Publication } from '@/shared/types'

/**
 * Le fil de l'accueil : les publications des experts, de la plus récente à la
 * plus ancienne (ou les plus lues) — ou ce que le compte a mis de côté. Rien
 * des écoles (ni leurs formations, ni leurs actualités, ni leurs
 * publications), ni offres d'emploi (décisions du 2026-11-24). Tout vient de
 * la base (tables `publications`, `enregistrements`). Le fil se montre par
 * tranches (« Voir plus »).
 */
export function useFilDAccueil({ tri, enregistres, domaines, sujet, recherche }: FiltresDuFil) {
  const { account } = useSession()
  const toutes = usePublications()
  const lesEnregistres = useEnregistrements(account?.id)
  const experts = useExperts()
  const domainesExpertise = useDomainesExpertise()
  const sujets = useSujetsPublication()
  const lectures = useLectures()

  // Une nouvelle recherche repart de la première tranche.
  const cle = JSON.stringify([tri, enregistres, domaines, sujet, recherche])
  const [tranche, setTranche] = useState({ cle, combien: TAILLE_DU_FIL })
  const combien = tranche.cle === cle ? tranche.combien : TAILLE_DU_FIL

  // Seules les publications des experts entrent dans le fil.
  const autres = (p: Publication) => {
    const expert = experts.find((e) => e.id === p.auteurId)
    return [expert?.nom, expert?.ville, ...p.domaines.map((d) => domainesExpertise.find((x) => x.id === d)?.nom), ...p.sujets.map((s) => sujets.find((x) => x.id === s)?.nom ?? s)]
  }
  // « Les plus lues » : les vues de départ plus celles des comptes (table `lectures`), comme sur les cartes.
  const vues = (p: Publication) => p.lectures + lectures.filter((l) => l.publicationId === p.id).length
  const garder = (p: Publication) => p.auteurType === 'expert' && p.statut === 'publiee' && correspond(p, { domaines, sujet, recherche }, autres(p))

  const publications = enregistres
    ? lesEnregistres.map((enregistrement) => toutes.find((p) => p.id === enregistrement.publicationId)).filter((p): p is Publication => p !== undefined && garder(p))
    : toutes.filter(garder).toSorted((a, b) => (tri === 'lues' ? vues(b) - vues(a) : instant(b.publieeLe) - instant(a.publieeLe)))

  return {
    entrees: publications.slice(0, combien),
    publications,
    resteAVoir: publications.length > combien,
    voirPlus: () => setTranche({ cle, combien: combien + TAILLE_DU_FIL }),
  }
}
