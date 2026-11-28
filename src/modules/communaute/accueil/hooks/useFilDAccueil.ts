import { useState } from 'react'
import { useCollection } from '@/data'
import { useEnregistrements, useExperts, usePublications } from '@/data/hooks'
import { contient, instant, TAILLE_DU_FIL } from '@/modules/communaute/accueil/accueilFil'
import type { FiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import type { Publication } from '@/shared/types'

/**
 * Les publications du fil : celles des experts, publiées (pas les brouillons),
 * et leur nombre de commentaires (celui de départ plus ceux de la table, sans
 * les supprimés). Lues une fois pour le fil, ses listes de choix et ses colonnes.
 */
export function usePublicationsDuFil() {
  const publications = usePublications().filter((p) => p.auteurType === 'expert')
  const commentaires = useCollection('commentaires')
  const nombreDeCommentaires = (p: Publication) => p.commentaires + commentaires.filter((c) => c.publicationId === p.id && !c.supprime).length
  return { publications, nombreDeCommentaires }
}

/**
 * Le fil de l'accueil (planche « Accueil ») : les publications qui répondent
 * aux filtres, des plus récentes aux plus anciennes (ou les plus commentées
 * d'abord), montrées par tranches de cinq. Tout vient de la base.
 */
export function useFilDAccueil({ tri, enregistrees, domaines, sujets, experts, recherche }: FiltresDuFil) {
  const { account } = useSession()
  const { publications, nombreDeCommentaires } = usePublicationsDuFil()
  const mesEnregistrees = useEnregistrements(account?.id)
  const lesExperts = useExperts()

  // Une nouvelle recherche repart de la première tranche.
  const cle = JSON.stringify([tri, enregistrees, domaines, sujets, experts, recherche])
  const [tranche, setTranche] = useState({ cle, combien: TAILLE_DU_FIL })
  const combien = tranche.cle === cle ? tranche.combien : TAILLE_DU_FIL

  const garder = (p: Publication) =>
    (!enregistrees || mesEnregistrees.some((e) => e.publicationId === p.id)) &&
    (domaines.length === 0 || p.domaines.some((d) => domaines.includes(d))) &&
    (sujets.length === 0 || p.sujets.some((s) => sujets.includes(s))) &&
    (experts.length === 0 || experts.includes(p.auteurId)) &&
    contient(p, recherche.trim(), lesExperts.find((e) => e.id === p.auteurId)?.nom)

  const liste = publications
    .filter(garder)
    .toSorted((a, b) => (tri === 'commentees' ? nombreDeCommentaires(b) - nombreDeCommentaires(a) : 0) || instant(b.publieeLe) - instant(a.publieeLe))

  return {
    entrees: liste.slice(0, combien),
    total: liste.length,
    affichees: Math.min(combien, liste.length),
    resteAVoir: liste.length > combien,
    voirPlus: () => setTranche({ cle, combien: combien + TAILLE_DU_FIL }),
  }
}
