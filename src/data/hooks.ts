import { POUR_TOUS, useCollection } from './index'

/**
 * Lectures par sujet, pour les écrans. Elles remplacent les fonctions de
 * src/mocks (etablissementById, formationsOf…) et se mettent à jour seules
 * après une écriture (`data.create / update / remove`).
 *
 * Comme avant, un identifiant inconnu renvoie le premier élément (la démo
 * n'a pas d'écran « introuvable »).
 */

const pourCet = (cible: string) => (x: { etablissementId: string }) => x.etablissementId === cible || x.etablissementId === POUR_TOUS

/* --- Écoles --------------------------------------------------------------- */

export function useEtablissements() {
  return useCollection('etablissements')
}

export function useEtablissement(id?: string) {
  const all = useEtablissements()
  return all.find((e) => e.id === id) ?? all[0]!
}

export function useFormations() {
  return useCollection('formations')
}

export function useFormation(id?: string) {
  const all = useFormations()
  return all.find((f) => f.id === id) ?? all[0]!
}

export function useFormationsOf(etablissementId: string) {
  return useFormations().filter((f) => f.etablissementId === etablissementId)
}

export function useAvisEtablissement(etablissementId: string) {
  return useCollection('avisEtablissements').filter(pourCet(etablissementId))
}

/* --- Auto-écoles ---------------------------------------------------------- */

export function useAutoEcoles() {
  return useCollection('autoEcoles')
}

export function useAutoEcole(id?: string) {
  const all = useAutoEcoles()
  return all.find((a) => a.id === id) ?? all[0]!
}

export function useSessions() {
  return useCollection('sessions')
}

export function useAvisAutoEcole(autoEcoleId: string) {
  return useCollection('avisAutoEcoles').filter((a) => a.autoEcoleId === autoEcoleId || a.autoEcoleId === POUR_TOUS)
}

/* --- Espace pro ------------------------------------------------------------ */

export function useFormationsPro(etablissementId: string) {
  return useCollection('formationsPro').filter(pourCet(etablissementId))
}

export function useActualites(etablissementId: string) {
  return useCollection('actualites').filter(pourCet(etablissementId))
}

export function useActualite(id?: string) {
  const all = useCollection('actualites')
  return all.find((a) => a.id === id) ?? all[0]!
}

export function useDocuments(etablissementId: string) {
  return useCollection('documents').filter(pourCet(etablissementId))
}

export function useFaq(etablissementId: string) {
  return useCollection('faq').filter(pourCet(etablissementId))
}

export function useUtilisateurs(etablissementId: string) {
  return useCollection('utilisateurs').filter(pourCet(etablissementId))
}

export function useParametres(etablissementId: string) {
  return useCollection('parametres').find((p) => p.id === etablissementId)?.valeurs ?? {}
}

export function usePreinscriptionsRecues(etablissementId: string) {
  return useCollection('preinscriptions').filter((p) => p.etablissementId === etablissementId)
}
