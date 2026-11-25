import { data } from '@/data'
import type { AvisAutoEcole, AvisEtablissement, InscriptionAutoEcole, Preinscription } from '@/shared/types'

/**
 * Les démarches d'une personne physique depuis « Mon espace ». Chaque action
 * tient les chiffres à jour (candidatures, places, nombre d'avis, moyenne),
 * comme le reste de l'application : chiffre de départ + ajouts − retraits.
 */

const maintenant = () => new Date().toISOString()

/** Annule une préinscription : l'établissement est prévenu. */
export async function annulerPreinscription(p: Preinscription, notification: { titre: string; texte: string; date: string }) {
  await data.update('preinscriptions', p.id, { statut: 'Annulée', annuleeLe: maintenant() })
  await data.create('notifications', { etablissementId: p.etablissementId, type: 'candidature', ...notification, lu: false }, 'notification')
}

/** Annule une inscription en auto-école : la place revient à la session. */
export async function annulerInscription(i: InscriptionAutoEcole) {
  await data.update('inscriptionsAutoEcole', i.id, { statut: 'Annulée', annuleeLe: maintenant() })
  const session = (await data.list('sessions')).find((s) => s.permis === i.permis && s.debut === i.donnees.session)
  if (session) await data.update('sessions', session.id, { places: session.places + 1 })
}

type Cible = { genre: 'etablissement'; avis: AvisEtablissement } | { genre: 'auto-ecole'; avis: AvisAutoEcole }

/** Modifie la note et le commentaire d'un avis ; la moyenne de la fiche, calculée, suit seule. */
export async function modifierAvis(c: Cible, note: number, texte: string) {
  if (c.genre === 'etablissement') await data.update('avisEtablissements', c.avis.id, { note, texte })
  else await data.update('avisAutoEcoles', c.avis.id, { note, texte })
}

/** Supprime un avis ; le nombre d'avis et la moyenne de la fiche, calculés, suivent seuls. */
export async function supprimerAvis(c: Cible) {
  await data.remove(c.genre === 'etablissement' ? 'avisEtablissements' : 'avisAutoEcoles', c.avis.id)
}

/** Part du profil remplie (Aperçu) : les champs de « Mon profil ». */
export function completude(c: { name: string; telephone: string; identifiant: string; avatar: string; civilite?: string; naissance?: string; region?: string; ville?: string; quartier?: string }) {
  const champs = [c.name, c.telephone, c.identifiant, c.avatar, c.civilite, c.naissance, c.region, c.ville, c.quartier]
  return Math.round((champs.filter((x) => !!x).length / champs.length) * 100)
}
