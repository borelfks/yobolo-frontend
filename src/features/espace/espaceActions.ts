import { data } from '@/data'
import type { AvisAutoEcole, AvisEtablissement, InscriptionAutoEcole, Preinscription } from '@/shared/types'
import { ajusterIndicateurs } from '@/shared/utils/compteurs'

/**
 * Les démarches d'une personne physique depuis « Mon espace ». Chaque action
 * tient les chiffres à jour (candidatures, places, nombre d'avis, moyenne),
 * comme le reste de l'application : chiffre de départ + ajouts − retraits.
 */

const maintenant = () => new Date().toISOString()

/** Annule une préinscription : l'établissement est prévenu, ses candidatures baissent d'une. */
export async function annulerPreinscription(p: Preinscription, notification: { titre: string; texte: string; date: string }) {
  await data.update('preinscriptions', p.id, { statut: 'Annulée', annuleeLe: maintenant() })
  await ajusterIndicateurs(p.etablissementId, { candidatures: -1 })
  await data.create('notifications', { etablissementId: p.etablissementId, type: 'candidature', ...notification, lu: false }, 'notification')
}

/** Annule une inscription en auto-école : la place revient à la session. */
export async function annulerInscription(i: InscriptionAutoEcole) {
  await data.update('inscriptionsAutoEcole', i.id, { statut: 'Annulée', annuleeLe: maintenant() })
  const session = (await data.list('sessions')).find((s) => s.permis === i.permis && s.debut === i.donnees.session)
  if (session) await data.update('sessions', session.id, { places: session.places + 1 })
}

/** Moyenne arrondie au dixième, comme les notes de la maquette. */
const arrondi = (n: number) => Math.round(n * 10) / 10

type Cible = { genre: 'etablissement'; avis: AvisEtablissement } | { genre: 'auto-ecole'; avis: AvisAutoEcole }

/** La fiche notée (établissement ou auto-école) : son nombre d'avis et sa note. */
async function fiche(c: Cible) {
  if (c.genre === 'etablissement') {
    const e = (await data.list('etablissements')).find((x) => x.id === c.avis.etablissementId)
    return e && { maj: (patch: { avis: number; note: number }) => data.update('etablissements', e.id, patch), avis: e.avis, note: e.note }
  }
  const a = (await data.list('autoEcoles')).find((x) => x.id === c.avis.autoEcoleId)
  return a && { maj: (patch: { avis: number; note: number }) => data.update('autoEcoles', a.id, patch), avis: a.avis, note: a.note }
}

/** Modifie la note et le commentaire d'un avis ; la moyenne de la fiche suit. */
export async function modifierAvis(c: Cible, note: number, texte: string) {
  const f = await fiche(c)
  if (c.genre === 'etablissement') await data.update('avisEtablissements', c.avis.id, { note, texte })
  else await data.update('avisAutoEcoles', c.avis.id, { note, texte })
  if (f && f.avis > 0) await f.maj({ avis: f.avis, note: arrondi((f.note * f.avis - c.avis.note + note) / f.avis) })
}

/** Supprime un avis ; la fiche compte un avis de moins et sa moyenne suit. */
export async function supprimerAvis(c: Cible) {
  const f = await fiche(c)
  await data.remove(c.genre === 'etablissement' ? 'avisEtablissements' : 'avisAutoEcoles', c.avis.id)
  if (f) {
    const reste = Math.max(0, f.avis - 1)
    await f.maj({ avis: reste, note: reste > 0 ? arrondi((f.note * f.avis - c.avis.note) / reste) : 0 })
  }
}

/** Part du profil remplie (Aperçu) : les champs de « Mon profil ». */
export function completude(c: { name: string; telephone: string; identifiant: string; avatar: string; civilite?: string; naissance?: string; region?: string; ville?: string; quartier?: string }) {
  const champs = [c.name, c.telephone, c.identifiant, c.avatar, c.civilite, c.naissance, c.region, c.ville, c.quartier]
  return Math.round((champs.filter((x) => !!x).length / champs.length) * 100)
}
