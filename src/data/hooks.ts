import type { AutoEcole, AvisAutoEcole, AvisEtablissement, Etablissement, Formation, Indicateurs, InscriptionAutoEcole, PermisCode, TypeSlug } from '@/shared/types'
import { dateDeCreation, POUR_TOUS, useCollection } from './index'

/**
 * Lectures par sujet, pour les écrans : toutes les données viennent de la
 * base (aucune n'est écrite dans le code). Elles se mettent à jour seules
 * après une écriture (`data.create / update / remove`).
 *
 * Comme avant, un identifiant inconnu renvoie le premier élément (la démo
 * n'a pas d'écran « introuvable »).
 *
 * Les chiffres (notes, nombres d'avis, de formations, d'établissements…) sont
 * **calculés** à partir des lignes de la base, jamais recopiés (décision du
 * 2026-11-25 : « je veux les vraies données »).
 */

/* --- Calculs ------------------------------------------------------------- */

/** Moyenne arrondie au dixième (0 sans note). */
function moyenne(notes: number[]) {
  return notes.length ? Math.round((notes.reduce((s, n) => s + n, 0) / notes.length) * 10) / 10 : 0
}

const publiee = (f: Formation) => f.statut === 'Publiée'

/** Un établissement avec ses vrais chiffres : note et nombre d'avis, formations publiées. */
function avecChiffres(e: Etablissement, avis: AvisEtablissement[], formations: Formation[]): Etablissement {
  const siens = avis.filter((a) => a.etablissementId === e.id)
  return { ...e, note: moyenne(siens.map((a) => a.note)), avis: siens.length, formations: formations.filter((f) => f.etablissementId === e.id && publiee(f)).length }
}

/** Une auto-école avec ses vrais chiffres : note et nombre d'avis, candidats inscrits (« formés »). */
function avecChiffresAE(a: AutoEcole, avis: AvisAutoEcole[], inscriptions: InscriptionAutoEcole[]): AutoEcole {
  const siens = avis.filter((x) => x.autoEcoleId === a.id)
  return { ...a, note: moyenne(siens.map((x) => x.note)), avis: siens.length, formes: inscriptions.filter((i) => i.autoEcoleId === a.id && i.statut !== 'Annulée').length }
}

/** Répartition des notes (5 → 1 étoiles), en pourcentage des avis. */
function repartition(notes: number[]) {
  return [5, 4, 3, 2, 1].map((etoiles) => ({ etoiles, pct: notes.length ? Math.round((notes.filter((n) => Math.round(n) === etoiles).length / notes.length) * 100) : 0 }))
}

const pourCet = (cible: string) => (x: { etablissementId: string }) => x.etablissementId === cible || x.etablissementId === POUR_TOUS

/* --- Écoles --------------------------------------------------------------- */

/** Les établissements visibles du public : pas ceux qu'un compte vient d'inscrire et que YIBOLO n'a pas encore validés. */
export function useEtablissements() {
  const avis = useCollection('avisEtablissements')
  const formations = useCollection('formations')
  return useCollection('etablissements')
    .filter((e) => !e.enVerification)
    .map((e) => avecChiffres(e, avis, formations))
}

export function useEtablissement(id?: string) {
  const avis = useCollection('avisEtablissements')
  const formations = useCollection('formations')
  const all = useCollection('etablissements')
  return avecChiffres(all.find((e) => e.id === id) ?? all[0]!, avis, formations)
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

/** Les avis d'un établissement (les siens seulement : ses chiffres en sont tirés). */
export function useAvisEtablissement(etablissementId: string) {
  return useCollection('avisEtablissements').filter((a) => a.etablissementId === etablissementId)
}

/** Répartition des notes d'un établissement, tirée de ses avis. */
export function useRepartitionEtablissement(etablissementId: string) {
  return repartition(useAvisEtablissement(etablissementId).map((a) => a.note))
}

/* --- Auto-écoles ---------------------------------------------------------- */

export function useAutoEcoles() {
  const avis = useCollection('avisAutoEcoles')
  const inscriptions = useCollection('inscriptionsAutoEcole')
  return useCollection('autoEcoles').map((a) => avecChiffresAE(a, avis, inscriptions))
}

export function useAutoEcole(id?: string) {
  const all = useAutoEcoles()
  return all.find((a) => a.id === id) ?? all[0]!
}

export function useSessions() {
  return useCollection('sessions')
}

/** Les avis d'une auto-école (les siens seulement : ses chiffres en sont tirés). */
export function useAvisAutoEcole(autoEcoleId: string) {
  return useCollection('avisAutoEcoles').filter((a) => a.autoEcoleId === autoEcoleId)
}

/** Répartition des notes d'une auto-école, tirée de ses avis. */
export function useRepartitionAutoEcole(autoEcoleId: string) {
  return repartition(useAvisAutoEcole(autoEcoleId).map((a) => a.note))
}

/** Les critères d'une auto-école : la moyenne des notes que ses avis leur ont données. */
export function useCriteresAutoEcole(autoEcoleId: string) {
  const avis = useAvisAutoEcole(autoEcoleId)
  return useCollection('criteresAvis').map((c, i) => ({ ...c, note: moyenne(avis.flatMap((a) => (a.criteres?.[i] ? [a.criteres[i]] : []))) }))
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

/** Les établissements visibles d'un type et leurs formations publiées. */
function useDuType(slug: TypeSlug) {
  const type = useCollection('typesEcole').find((t) => t.id === slug)?.type
  const etablissements = useEtablissements().filter((e) => e.type === type)
  const ids = new Set(etablissements.map((e) => e.id))
  const formations = useFormations().filter((f) => ids.has(f.etablissementId) && publiee(f))
  return { etablissements, formations }
}

/** Les chiffres de tous les types d'école, calculés. */
export function useTypesEcole() {
  const etablissements = useEtablissements()
  const formations = useFormations().filter(publiee)
  const diplomes = useCollection('diplomes')
  return useCollection('typesEcole').map((t) => {
    const ids = new Set(etablissements.filter((e) => e.type === t.type).map((e) => e.id))
    const siennes = formations.filter((f) => ids.has(f.etablissementId))
    const connus = diplomes.filter((d) => d.typeSlug === t.id).map((d) => d.nom)
    const autres = siennes.filter((f) => !connus.includes(f.diplome)).length
    return { ...t, count: ids.size, filieres: new Set(siennes.map((f) => f.filiere)).size, diplomes: siennes.length, autresDiplomes: autres || undefined }
  })
}

/** Chiffres d'un type d'école (IPES, CFP, Autres), calculés. */
export function useTypeEcole(slug: TypeSlug) {
  return useTypesEcole().find((t) => t.id === slug)!
}

/** Nombres des tuiles de l'annuaire École (`toutes`, `IPES`, `CFP`, `Auto-école`, `Autre`), calculés. */
export function useTuilesAnnuaire() {
  const etablissements = useEtablissements()
  const autoEcoles = useCollection('autoEcoles').length
  const parType = (type: string) => (type === 'Auto-école' ? autoEcoles : etablissements.filter((e) => e.type === type).length)
  return useCollection('tuilesAnnuaire').map((tuile) => ({ ...tuile, count: tuile.id === 'toutes' ? etablissements.length + autoEcoles : parType(tuile.id) }))
}

/** Les domaines d'un type qui ont au moins une formation publiée : filières, établissements, formations. */
export function useDomaines(slug: TypeSlug) {
  const { formations } = useDuType(slug)
  return useCollection('domaines')
    .filter((d) => d.typeSlug === slug)
    .map((d) => {
      const siennes = formations.filter((f) => f.domaine === d.nom)
      return { ...d, count: new Set(siennes.map((f) => f.filiere)).size, ecoles: new Set(siennes.map((f) => f.etablissementId)).size, formations: siennes.length }
    })
    .filter((d) => d.formations > 0)
}

/** Les diplômes d'un type, avec le nombre de formations publiées qui y mènent. */
export function useDiplomes(slug: TypeSlug) {
  const { formations } = useDuType(slug)
  return useCollection('diplomes')
    .filter((d) => d.typeSlug === slug)
    .map((d) => ({ ...d, count: formations.filter((f) => f.diplome === d.nom).length }))
}

/** Nombre d'établissements visibles d'un type, par région et par ville. */
export function useEtablissementsParLieu(slug: TypeSlug) {
  const { etablissements } = useDuType(slug)
  const parRegion: Record<string, number> = {}
  const parVille: Record<string, number> = {}
  for (const e of etablissements) {
    parRegion[e.region] = (parRegion[e.region] ?? 0) + 1
    parVille[e.ville] = (parVille[e.ville] ?? 0) + 1
  }
  return { total: etablissements.length, parRegion, parVille }
}

export function useRegions() {
  return useCollection('regions')
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

/** Les albums de la galerie d'un établissement : une photo chacun (celle qui s'affiche). */
export function useAlbums() {
  return useCollection('albums').map((a) => ({ ...a, count: 1 }))
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
  // Préinscription masquée (demande du porteur du projet, 2026-11-25) : ses notifications ne s'affichent plus.
  return useCollection('notificationsCompte').filter((n) => (n.compteId === compteId || n.compteId === POUR_TOUS) && n.type !== 'preRegistration' && n.type !== 'session')
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
