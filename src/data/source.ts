import type { CollectionName, Collections } from './collections'

/**
 * Le contrat de stockage. TOUT passe par lui : les écrans ne savent pas où
 * sont les données. Pour changer de stockage (fichiers Netlify, Firebase,
 * vrai backend…), on écrit une nouvelle source qui respecte ce contrat et on
 * la choisit dans `src/data/index.ts` ; aucun écran ne change.
 *
 * Toutes les méthodes sont asynchrones, comme le serait un appel réseau.
 */
export interface DataSource {
  /** Nom affiché dans le panneau « Données de test » (ex. « SQLite (navigateur) »). */
  readonly label: string
  /** Ouvre le stockage ; le remplit avec ses données de départ s'il est vide ou trop ancien. */
  init(): Promise<void>
  /** Tous les éléments d'une collection, dans l'ordre d'affichage (les plus récents d'abord parmi les ajouts). */
  list<K extends CollectionName>(collection: K): Promise<Collections[K][]>
  /** Ajoute ou remplace un élément (selon son `id`). */
  put<K extends CollectionName>(collection: K, item: Collections[K]): Promise<void>
  /** Supprime un élément. */
  remove(collection: CollectionName, id: string): Promise<void>
  /** Efface tout et remet les données de départ. */
  reset(): Promise<void>
  /** Facultatif : télécharger toutes les données dans un fichier. */
  exportFile?(): Promise<{ blob: Blob; fileName: string }>
  /** Facultatif : remplacer toutes les données par celles d'un fichier exporté. */
  importFile?(file: File): Promise<void>
}
