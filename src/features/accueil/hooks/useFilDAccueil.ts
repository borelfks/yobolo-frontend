import { useState } from 'react'
import { isoDesDonnees } from '@/features/accueil/accueilDates'
import { correspond, instant, TAILLE_DU_FIL, type EntreeDuFil } from '@/features/accueil/accueilFil'
import type { FiltresDuFil } from '@/features/accueil/hooks/useFiltresDuFil'
import { useSession } from '@/features/auth/hooks/useSession'
import {
  useActualitesPubliees,
  useComptes,
  useEnregistrements,
  useEtablissements,
  useExperts,
  useFormations,
  useOffresEmploi,
  usePublications,
  useVilles,
} from '@/data/hooks'
import type { Publication } from '@/shared/types'

const versEntree = (publication: Publication): EntreeDuFil => ({
  genre: 'publication',
  cle: `publication-${publication.id}`,
  date: publication.publieeLe,
  publication,
})

const contient = (recherche: string, ...textes: (string | undefined)[]) => {
  if (!recherche) return true
  const cherche = recherche.toLocaleLowerCase()
  return textes.some((texte) => texte?.toLocaleLowerCase().includes(cherche))
}

/**
 * Le fil de l'accueil : les publications, les actualités des établissements,
 * les offres d'emploi et les formations, mêlées du plus récent au plus ancien
 * — ou ce que le compte a mis de côté, ou ses propres publications. Tout vient
 * de la base (tables `publications`, `actualites`, `offresEmploi`,
 * `formations`, `enregistrements`).
 *
 * Comme dans yibolo-client : un domaine, un sujet ou « les plus lues » ne
 * gardent que les publications. « Conseils » = les publications des experts.
 * La ville garde ce qui a lieu dans cette ville : l'offre, l'établissement de
 * la formation ou de l'actualité, l'expert ou l'école qui publie. Le fil se
 * montre par tranches (« Voir plus »).
 */
export function useFilDAccueil({ genre, tri, enregistres, miennes, domaines, sujet, ville, recherche }: FiltresDuFil) {
  const { account } = useSession()
  const toutes = usePublications()
  const offres = useOffresEmploi()
  const formations = useFormations()
  const actualites = useActualitesPubliees()
  const lesEnregistres = useEnregistrements(account?.id)
  const etablissements = useEtablissements()
  const experts = useExperts()
  const comptes = useComptes()
  const villes = useVilles()

  // Une nouvelle recherche repart de la première tranche.
  const cle = JSON.stringify([genre, tri, enregistres, miennes, domaines, sujet, ville, recherche])
  const [tranche, setTranche] = useState({ cle, combien: TAILLE_DU_FIL })
  const combien = tranche.cle === cle ? tranche.combien : TAILLE_DU_FIL

  const nomVille = ville ? (villes.find((v) => v.id === ville)?.nom ?? ville) : undefined
  const dansLaVille = (lieu?: string) => !nomVille || lieu === nomVille
  const villeDeLEcole = (id?: string) => etablissements.find((e) => e.id === id)?.ville
  const villeDeLAuteur = (p: Publication) =>
    p.auteurType === 'expert' ? experts.find((e) => e.id === p.auteurId)?.ville : villeDeLEcole(comptes.find((c) => c.id === p.auteurId)?.ecoleId)
  const garder = (p: Publication) => correspond(p, { domaines, sujet, recherche }) && dansLaVille(villeDeLAuteur(p))

  let entrees: EntreeDuFil[]
  let publications: Publication[]

  if (enregistres) {
    publications = lesEnregistres
      .map((enregistrement) => toutes.find((p) => p.id === enregistrement.publicationId))
      .filter((p): p is Publication => p !== undefined && garder(p))
    entrees = publications.map(versEntree)
  } else if (miennes) {
    publications = toutes.filter((p) => p.auteurType === 'compte' && p.auteurId === account?.id && garder(p))
    entrees = publications.toSorted((a, b) => instant(b.publieeLe) - instant(a.publieeLe)).map(versEntree)
  } else {
    const seulementLesPublications = domaines.length > 0 || sujet !== undefined || tri === 'lues'
    const avecLesPublications = genre === 'tout' || genre === 'publication' || genre === 'conseil'
    const autre = (le: typeof genre) => (genre === 'tout' && !seulementLesPublications) || genre === le

    publications = avecLesPublications ? toutes.filter((p) => (genre !== 'conseil' || p.auteurType === 'expert') && garder(p)) : []
    const lesPublications = publications.map(versEntree)

    const autres: EntreeDuFil[] = [
      ...(autre('offre')
        ? offres
            .filter((offre) => dansLaVille(offre.lieu) && contient(recherche, offre.titre, offre.lieu, offre.publieurNom))
            .map((offre) => ({ genre: 'offre' as const, cle: `offre-${offre.id}`, date: offre.publieeLe, offre }))
        : []),
      ...(autre('formation')
        ? formations
            .filter(
              (formation) =>
                formation.statut === 'Publiée' &&
                dansLaVille(villeDeLEcole(formation.etablissementId)) &&
                contient(recherche, formation.nom, formation.filiere, formation.diplome),
            )
            .map((formation) => ({ genre: 'formation' as const, cle: `formation-${formation.id}`, date: formation.publieeLe ?? '', formation }))
        : []),
      ...(autre('actualite')
        ? actualites.flatMap((actualite) => {
            const etablissement = etablissements.find((e) => e.id === actualite.etablissementId)
            if (!etablissement || !dansLaVille(etablissement.ville) || !contient(recherche, actualite.titre, actualite.categorie, etablissement.nom)) return []
            return [{ genre: 'actualite' as const, cle: `actualite-${actualite.id}`, date: isoDesDonnees(actualite.date), actualite, etablissement }]
          })
        : []),
    ]

    entrees =
      tri === 'lues'
        ? publications.toSorted((a, b) => b.lectures - a.lectures).map(versEntree)
        : [...lesPublications, ...autres].sort((a, b) => instant(b.date) - instant(a.date))
  }

  return {
    entrees: entrees.slice(0, combien),
    publications,
    resteAVoir: entrees.length > combien,
    voirPlus: () => setTranche({ cle, combien: combien + TAILLE_DU_FIL }),
  }
}
