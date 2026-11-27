import type { Etablissement } from '@/shared/types'

/** Les étapes du profil, dans l'ordre du tableau de bord. */
export const ETAPES_PROFIL = ['profile', 'trainings', 'info', 'gallery', 'optimisation'] as const
export type EtapeProfil = (typeof ETAPES_PROFIL)[number]

/** Les informations à gérer du tableau de bord. */
export const INFOS_A_GERER = ['presentation', 'admission', 'calendar', 'careers', 'contact'] as const
export type InfoAGerer = (typeof INFOS_A_GERER)[number]

type Contenu = { ecole: Etablissement; medias: number; documents: number; faq: number }

const rempli = (x?: string) => !!x && x.trim() !== ''

/**
 * Ce que l'établissement a réellement rempli (décision du 2026-11-25 : pas
 * de fausses données) : chaque étape du profil et chaque information à gérer
 * est faite ou non selon sa fiche, ses formations, ses contenus et ses photos.
 */
export function etatDuProfil({ ecole, medias, documents, faq }: Contenu) {
  const contact = rempli(ecole.telephone) && rempli(ecole.email) && (rempli(ecole.adresse) || rempli(ecole.quartier))
  const etapes: Record<EtapeProfil, boolean> = {
    profile: rempli(ecole.description) && contact,
    trainings: ecole.formations > 0,
    info: documents + faq > 0,
    gallery: medias > 0,
    optimisation: rempli(ecole.logo) && (rempli(ecole.couverture) || rempli(ecole.photoFiche)),
  }
  const infos: Record<InfoAGerer, boolean> = {
    presentation: rempli(ecole.description),
    admission: faq > 0,
    calendar: rempli(ecole.rentree) || documents > 0,
    careers: ecole.formations > 0,
    contact,
  }
  const faites = ETAPES_PROFIL.filter((e) => etapes[e]).length
  const prochaine = ETAPES_PROFIL.find((e) => !etapes[e])
  return { etapes, infos, completude: Math.round((faites / ETAPES_PROFIL.length) * 100), restantes: ETAPES_PROFIL.length - faites, prochaine }
}
