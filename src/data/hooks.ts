import type { Indicateurs, PermisCode, TypeSlug } from '@/shared/types'
import { dateDeCreation, POUR_TOUS, useCollection } from './index'

/**
 * Lectures par sujet, pour les écrans : toutes les données viennent de la
 * base (aucune n'est écrite dans le code). Elles se mettent à jour seules
 * après une écriture (`data.create / update / remove`).
 *
 * Comme avant, un identifiant inconnu renvoie le premier élément (la démo
 * n'a pas d'écran « introuvable »).
 */

const pourCet = (cible: string) => (x: { etablissementId: string }) => x.etablissementId === cible || x.etablissementId === POUR_TOUS

/* --- Écoles --------------------------------------------------------------- */

/** Les établissements visibles du public : pas ceux qu'un compte vient d'inscrire et que YIBOLO n'a pas encore validés. */
export function useEtablissements() {
  return useCollection('etablissements').filter((e) => !e.enVerification)
}

export function useEtablissement(id?: string) {
  const all = useCollection('etablissements')
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

/** Les préinscriptions reçues par un établissement (pas celles que le candidat a annulées). */
export function usePreinscriptionsRecues(etablissementId: string) {
  return useCollection('preinscriptions').filter((p) => p.etablissementId === etablissementId && p.statut !== 'Annulée')
}

/* --- Comptes ---------------------------------------------------------------- */

export function useComptes() {
  return useCollection('comptes')
}

/* --- Données de référence ------------------------------------------------- */

/** Les chiffres de tous les types d'école. */
export function useTypesEcole() {
  return useCollection('typesEcole')
}

/** Chiffres d'un type d'école (IPES, CFP, Autres). */
export function useTypeEcole(slug: TypeSlug) {
  return useCollection('typesEcole').find((t) => t.id === slug)!
}

/** Nombres des tuiles de l'annuaire École, par clé (`toutes`, `IPES`…). */
export function useTuilesAnnuaire() {
  return useCollection('tuilesAnnuaire')
}

export function useDomaines(slug: TypeSlug) {
  return useCollection('domaines').filter((d) => d.typeSlug === slug)
}

export function useFilieresCartes(slug: TypeSlug) {
  return useCollection('filieresCartes').filter((f) => f.typeSlug === slug)
}

export function useDiplomes(slug: TypeSlug) {
  return useCollection('diplomes').filter((d) => d.typeSlug === slug)
}

export function useRegions() {
  return useCollection('regions')
}

/** Villes d'une région (onglet Villes), avec leur nombre d'établissements. */
export function useVillesRegion() {
  return useCollection('villesRegion')
}

export function useVilles() {
  return useCollection('villes')
}

export function useQuartiers() {
  return useCollection('quartiers')
}

/** Le découpage officiel : départements et arrondissements (sélection géographique). */
export function useDecoupage() {
  return { regions: useCollection('regions'), departements: useCollection('departements'), arrondissements: useCollection('arrondissements') }
}

export function useRepartitionNotes(cible: 'etablissement' | 'auto-ecole') {
  return useCollection('repartitionNotes').filter((r) => r.cible === cible)
}

export function useAlbums() {
  return useCollection('albums')
}

export function useProgramme() {
  return useCollection('programme')
}

/** Les permis (A à E), dans l'ordre de la base. */
export function usePermisListe() {
  return useCollection('permis')
}

/** Les permis indexés par code (`permis.B`…). */
export function usePermisCatalogue() {
  return Object.fromEntries(usePermisListe().map((p) => [p.code, p])) as Record<PermisCode, (ReturnType<typeof usePermisListe>)[number]>
}

export function useCriteresAvis() {
  return useCollection('criteresAvis')
}

export function useRoles() {
  return useCollection('roles')
}

export function useNotifications() {
  return useCollection('notifications')
}

export function useVisites() {
  return useCollection('visites')
}

export function useSourcesVisites() {
  return useCollection('sourcesVisites')
}

export function useSessionsActives() {
  return useCollection('sessionsActives')
}

export function useActiviteSecurite() {
  return useCollection('activiteSecurite')
}

/** Les chiffres de l'espace pro d'un établissement (ceux de la maquette s'il n'en a pas). */
/** Chiffres d'un établissement qui vient d'être créé : tout part de zéro. */
const INDICATEURS_VIDES: Omit<Indicateurs, 'id'> = {
  medias: 0,
  completude: 0,
  vues: { valeur: 0, tendance: 0 },
  candidatures: { valeur: 0, tendance: 0 },
  telechargements: { valeur: 0, tendance: 0 },
  vuesFormations: [],
  activites: [],
}

/**
 * Les chiffres d'un établissement : sa ligne s'il en a une, sinon ceux de la
 * maquette (ligne `*`) ; un établissement créé par un testeur part de zéro.
 */
export function indicateursDe(all: Indicateurs[], etablissementId: string): Indicateurs {
  const propre = all.find((i) => i.id === etablissementId)
  if (propre) return propre
  if (dateDeCreation(etablissementId)) return { id: etablissementId, ...INDICATEURS_VIDES }
  return all.find((i) => i.id === POUR_TOUS)!
}

export function useIndicateurs(etablissementId: string) {
  return indicateursDe(useCollection('indicateurs'), etablissementId)
}

export function useMedias(etablissementId: string) {
  return useCollection('medias').filter(pourCet(etablissementId))
}

export function useFormationsPopulaires(slug: TypeSlug) {
  return useCollection('formationsPopulaires').filter((f) => f.typeSlug === slug)
}

export function useTranchesFrais() {
  return useCollection('tranchesFrais')
}

export function useCategoriesGalerie() {
  return useCollection('categoriesGalerie')
}

export function usePhotosAutoEcole(autoEcoleId: string, usage: 'apercu' | 'galerie') {
  return useCollection('photosAutoEcole').filter((p) => p.usage === usage && (p.autoEcoleId === autoEcoleId || p.autoEcoleId === POUR_TOUS))
}

/* --- Accueil de l'utilisateur connecté ------------------------------------- */

export function useDomainesExpertise() {
  return useCollection('domainesExpertise')
}

export function useExperts() {
  return useCollection('experts')
}

/** Les publications du fil (sans les brouillons). */
export function usePublications() {
  return useCollection('publications').filter((p) => p.statut === 'publiee')
}

/** Ce qu'un compte a mis de côté, du plus récemment enregistré au plus ancien. */
export function useEnregistrements(compteId?: string) {
  return useCollection('enregistrements')
    .filter((e) => e.compteId === compteId)
    .toSorted((a, b) => b.le.localeCompare(a.le))
}

export function useJaimes() {
  return useCollection('jaimes')
}

/* --- Fichiers, pièces, vidéos, notifications, commentaires ------------------ */

export function useFichiers() {
  return useCollection('fichiers')
}

export function usePiecesEtablissement(etablissementId: string) {
  return useCollection('piecesEtablissement').filter((p) => p.etablissementId === etablissementId)
}

/** Les vidéos d'un établissement ou d'une auto-école (celles « pour tous » comprises). */
export function useVideos(cible: 'etablissement' | 'auto-ecole', cibleId: string, usage?: 'presentation' | 'galerie') {
  return useCollection('videos').filter((v) => v.cible === cible && (v.cibleId === cibleId || v.cibleId === POUR_TOUS) && (!usage || v.usage === usage))
}

export function useNotificationsCompte(compteId: string | undefined) {
  return useCollection('notificationsCompte').filter((n) => n.compteId === compteId || n.compteId === POUR_TOUS)
}

/** Les libellés des sujets de publication. */
export function useSujetsPublication() {
  return useCollection('sujetsPublication')
}

/** Les vues des publications (une par compte et par publication). */
export function useLectures() {
  return useCollection('lectures')
}

export function useCommentaires(publicationId: string) {
  return useCollection('commentaires').filter((c) => c.publicationId === publicationId)
}

/* --- Accueil connecté : carrousel ------------------------------------------- */

export function useBandeauxAccueil() {
  return useCollection('bandeauxAccueil')
}


/** Les avis écrits par un compte (Mon espace › Mes avis). */
export function useMesAvis(compteId?: string) {
  return {
    etablissements: useCollection('avisEtablissements').filter((a) => !!compteId && a.compteId === compteId),
    autoEcoles: useCollection('avisAutoEcoles').filter((a) => !!compteId && a.compteId === compteId),
  }
}

/** Les préinscriptions et inscriptions en auto-école envoyées par un compte (« Mes formations »). */
export function useMesInscriptions(compteId?: string) {
  return {
    preinscriptions: useCollection('preinscriptions').filter((p) => p.compteId === compteId),
    inscriptionsAutoEcole: useCollection('inscriptionsAutoEcole').filter((i) => i.compteId === compteId),
  }
}
