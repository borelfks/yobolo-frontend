import { data, dateDeCreation } from '@/data'
import type { Compte } from '@/shared/types'

/**
 * La vérification d'une école par YIBOLO (24 à 48 heures, annoncées sur
 * l'écran d'attente) est faite quand l'école revient se connecter : le compte
 * passe « Validé » et l'établissement devient visible (et compté).
 */
export async function validerCompteEcole(compte: Compte) {
  const valide = (await data.update('comptes', compte.id, { statut: 'Validé' })) ?? compte
  const e = compte.ecoleId ? (await data.list('etablissements')).find((x) => x.id === compte.ecoleId) : undefined
  // Visible du public : l'annuaire le compte de lui-même (chiffres calculés).
  if (e?.enVerification) await data.update('etablissements', e.id, { enVerification: false })
  return valide
}

/**
 * Les formations envoyées pour validation (« En attente ») sont vérifiées par
 * YIBOLO entre deux visites : à la connexion de l'établissement, elles sont
 * publiées. Renvoie le nombre de formations publiées.
 */
export async function publierFormationsVerifiees(ecoleId: string) {
  // Seulement celles créées par l'établissement : celles de la maquette gardent leur statut.
  const enAttente = (await data.list('formationsPro')).filter((f) => f.etablissementId === ecoleId && f.statut === 'En attente' && dateDeCreation(f.id))
  const fiches = await data.list('formations')
  const le = new Date().toISOString()
  for (const f of enAttente) {
    await data.update('formationsPro', f.id, { statut: 'Publiée' })
    const fiche = fiches.find((x) => x.id === f.id)
    // Publiée pour la première fois : elle prend place dans le fil à cette date.
    if (fiche) await data.update('formations', f.id, fiche.publieeLe ? { statut: 'Publiée' } : { statut: 'Publiée', publieeLe: le })
  }
  return enAttente.length
}
