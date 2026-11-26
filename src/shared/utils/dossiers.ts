import { data } from '@/data'
import type { EchangeDossier, InscriptionAutoEcole, Preinscription, StatutDossier, SujetNotification } from '@/shared/types'
import type { Tone } from '@/shared/components/ui/Badge'
import { notifier } from '@/shared/utils/notifications'
import { lireFichier, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'

/**
 * La vie d'un dossier, commune à la préinscription (école) et à l'inscription
 * (auto-école) : le candidat l'envoie, l'établissement l'étudie, demande un
 * complément, l'accepte ou le refuse ; le candidat suit tout depuis Mon espace.
 */

/** Les statuts, dans l'ordre où un dossier les traverse. */
export const STATUTS_DOSSIER: StatutDossier[] = ['Envoyée', 'En étude', 'Complément demandé', 'Acceptée', 'Refusée', 'Annulée']

/** Couleur de chaque statut (le texte dit aussi le statut). */
export const TON_STATUT: Record<StatutDossier, Tone> = {
  Envoyée: 'blue',
  'En étude': 'sky',
  'Complément demandé': 'amber',
  Acceptée: 'green',
  Refusée: 'red',
  Annulée: 'gray',
}

/** Clé de traduction d'un statut (namespace common, `dossier.statuts.<clé>`). */
export const CLE_STATUT: Record<StatutDossier, 'envoyee' | 'enEtude' | 'complement' | 'acceptee' | 'refusee' | 'annulee'> = {
  Envoyée: 'envoyee',
  'En étude': 'enEtude',
  'Complément demandé': 'complement',
  Acceptée: 'acceptee',
  Refusée: 'refusee',
  Annulée: 'annulee',
}

/** Un dossier encore ouvert : ni tranché, ni annulé. Le candidat peut l'annuler, l'établissement le traiter. */
export const dossierOuvert = (statut: StatutDossier) => statut === 'Envoyée' || statut === 'En étude' || statut === 'Complément demandé'

/** Un dossier qui attend l'établissement (nouveau ou complété) : il est compté « à traiter ». */
export const dossierATraiter = (statut: StatutDossier) => statut === 'Envoyée'

/** Ce que l'établissement peut faire d'un dossier ouvert. */
export type DecisionDossier = 'En étude' | 'Complément demandé' | 'Acceptée' | 'Refusée'

export type Dossier = { genre: 'preinscription'; dossier: Preinscription } | { genre: 'inscription'; dossier: InscriptionAutoEcole }

const maintenant = () => new Date().toISOString()

/** Les sujets de notification du candidat : préinscription (école) ou permis (auto-école). */
const sujet = (d: Dossier): SujetNotification => (d.genre === 'preinscription' ? 'preRegistration' : 'session')

async function enregistrer(d: Dossier, statut: StatutDossier, echange: EchangeDossier) {
  const echanges = [...(d.dossier.echanges ?? []), echange]
  if (d.genre === 'preinscription') return data.update('preinscriptions', d.dossier.id, { statut, echanges })
  return data.update('inscriptionsAutoEcole', d.dossier.id, { statut, echanges })
}

/**
 * L'établissement décide : étude, complément demandé (avec ce qu'il faut
 * fournir), acceptation ou refus (avec le motif). Le candidat est prévenu.
 * Un refus d'inscription en auto-école rend la place à sa session.
 */
export async function deciderDossier(d: Dossier, decision: DecisionDossier, texte: string, notification: { titre: string; texte: string; quand: string; vers: string }) {
  await enregistrer(d, decision, { de: 'etablissement', texte: texte.trim(), le: maintenant(), statut: decision })
  if (d.genre === 'inscription' && decision === 'Refusée') {
    const session = (await data.list('sessions')).find((s) => s.permis === d.dossier.permis && s.debut === d.dossier.donnees.session && s.autoEcoleId === d.dossier.autoEcoleId)
    if (session) await data.update('sessions', session.id, { places: session.places + 1 })
  }
  if (d.dossier.compteId) await notifier(d.dossier.compteId, { type: sujet(d), ...notification })
}

/**
 * Le candidat répond à une demande de complément (un message et, s'il veut,
 * une pièce) : le dossier revient à l'établissement (« Envoyée »), qui est prévenu.
 * Renvoie `false` si la pièce est trop lourde.
 */
export async function completerDossier(d: Dossier, texte: string, fichier: File | null, notification: { titre: string; texte: string; date: string }) {
  if (fichier && fichier.size > TAILLE_MAX_DOCUMENT) return false
  const joint = fichier ? await data.create('fichiers', { nom: fichier.name, type: fichier.type, taille: fichier.size, dataUrl: await lireFichier(fichier) }, 'fichier') : null
  await enregistrer(d, 'Envoyée', { de: 'candidat', texte: texte.trim(), le: maintenant(), statut: 'Envoyée', ...(joint ? { fichierId: joint.id, fichierNom: joint.nom } : {}) })
  const etablissementId = d.genre === 'preinscription' ? d.dossier.etablissementId : d.dossier.autoEcoleId
  await data.create('notifications', { etablissementId, type: 'candidature', ...notification, lu: false }, 'notification')
  return true
}

/** Le dernier message de l'établissement (ce qu'il demande, ou le motif de sa décision). */
export const dernierMessage = (echanges?: EchangeDossier[]) => [...(echanges ?? [])].reverse().find((x) => x.de === 'etablissement')?.texte ?? ''
