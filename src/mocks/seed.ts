import { autoEcoles, avisAutoEcole, sessions } from '@/mocks/drivingSchools'
import { actualites, documentsPro, faq, formationsPro, utilisateurs } from '@/mocks/pro'
import { avisIpc, etablissements, formations } from '@/mocks/schools'
import { POUR_TOUS, type Seed } from '@/data/collections'

/** Favoris de départ (vignettes de la maquette). */
const favorisDeDepart: Seed['favoris'] = [
  { id: 'f-cg-ipc', kind: 'formation', folder: 'Mes formations' },
  { id: 'f-info-ipc', kind: 'formation', folder: 'Mes formations' },
  { id: 'ipc', kind: 'etablissement', folder: 'Mes établissements' },
]

/**
 * Les données de départ de la base de test : celles de la maquette
 * (src/mocks), avec un identifiant pour chaque élément. Les listes de la
 * maquette qui ne sont rattachées à aucun établissement précis portent
 * POUR_TOUS : elles s'affichent partout, comme avant.
 */
export function buildSeed(): Seed {
  return {
    etablissements: etablissements.map((e) => ({ ...e })),
    formations: formations.map((f) => ({ ...f })),
    formationsPro: formationsPro.map((f) => ({ ...f, etablissementId: POUR_TOUS })),
    autoEcoles: autoEcoles.map((a) => ({ ...a, permis: [...a.permis] })),
    sessions: sessions.map((s, i) => ({ ...s, id: `session-${i + 1}`, horaires: [...s.horaires] })),
    avisEtablissements: avisIpc.map((a) => ({ ...a, etablissementId: POUR_TOUS })),
    avisAutoEcoles: avisAutoEcole.map((a) => ({ ...a, autoEcoleId: POUR_TOUS })),
    actualites: actualites.map((a) => ({ ...a, etablissementId: POUR_TOUS })),
    documents: documentsPro.map((d, i) => ({ ...d, id: `document-${i + 1}`, etablissementId: POUR_TOUS })),
    faq: faq.map((q, i) => ({ ...q, id: `faq-${i + 1}`, etablissementId: POUR_TOUS })),
    utilisateurs: utilisateurs.map((u, i) => ({ ...u, id: `utilisateur-${i + 1}`, etablissementId: POUR_TOUS })),
    preinscriptions: [],
    inscriptionsAutoEcole: [],
    favoris: favorisDeDepart,
    parametres: [],
  }
}
