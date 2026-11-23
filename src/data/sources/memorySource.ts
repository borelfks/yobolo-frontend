import { COLLECTIONS, type CollectionName, type Collections, type Seed } from '../collections'
import type { DataSource } from '../source'

/**
 * Stockage en mémoire : rien n'est gardé après un rechargement. Sert de
 * secours si SQLite ne peut pas s'ouvrir (navigateur trop ancien, stockage
 * bloqué), et d'exemple minimal d'une source.
 */
export function createMemorySource(): DataSource {
  let tables = new Map<CollectionName, Map<string, unknown>>()

  const fill = (seed: Seed) => {
    tables = new Map(COLLECTIONS.map((c) => [c, new Map(seed[c].map((item) => [item.id, structuredClone(item)]))]))
  }

  return {
    label: 'Mémoire (non enregistré)',
    async init(seed) {
      fill(seed)
    },
    async list<K extends CollectionName>(collection: K) {
      return [...(tables.get(collection)?.values() ?? [])].map((x) => structuredClone(x)) as Collections[K][]
    },
    async put(collection, item) {
      const table = tables.get(collection)
      if (!table) return
      // Un nouvel élément passe en tête, comme dans SQLite.
      if (table.has(item.id)) table.set(item.id, structuredClone(item))
      else tables.set(collection, new Map([[item.id, structuredClone(item)], ...table]))
    },
    async remove(collection, id) {
      tables.get(collection)?.delete(id)
    },
    async reset(seed) {
      fill(seed)
    },
  }
}
