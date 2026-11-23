import { use, useSyncExternalStore } from 'react'
import { COLLECTIONS, type CollectionName, type Collections, type Seed } from './collections'
import type { DataSource } from './source'
import { createMemorySource } from './sources/memorySource'
import { createSqliteSource } from './sources/sqliteSource'

/**
 * POINT D'ENTRÉE UNIQUE DES DONNÉES ENREGISTRÉES.
 *
 * Les écrans lisent avec les hooks (`useCollection`, et ceux de ./hooks) et
 * écrivent avec `data.create / update / remove`. Ils ne savent pas où sont les
 * données : c'est la source choisie ici.
 *
 * Changer de stockage plus tard :
 *   1. écrire `sources/<nouvelleSource>.ts` qui respecte `DataSource` (./source.ts) ;
 *   2. l'ajouter à `SOURCES` ci-dessous ;
 *   3. la choisir avec la variable d'environnement VITE_DATA_SOURCE.
 * Aucun écran ne change.
 */
const SOURCES: Record<string, () => DataSource> = {
  sqlite: createSqliteSource,
  memoire: createMemorySource,
}

let source: DataSource
let seedFactory: () => Seed
let ready: Promise<void> | undefined
const cache = new Map<CollectionName, unknown[]>()
const listeners = new Set<() => void>()
const EMPTY: never[] = []

const notify = () => listeners.forEach((l) => l())
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function loadAll() {
  await Promise.all(COLLECTIONS.map(async (c) => cache.set(c, await source.list(c))))
  notify()
}

async function refresh(collection: CollectionName) {
  cache.set(collection, await source.list(collection))
  notify()
}

/**
 * Démarre le stockage (appelé une fois, dans main.tsx, avant l'affichage).
 * Le chargement continue en arrière-plan : les pages qui ont besoin des
 * données attendent (PageLoader), les autres s'affichent tout de suite.
 */
export function startData(seed: () => Seed) {
  seedFactory = seed
  ready ??= (async () => {
    const wanted = import.meta.env.VITE_DATA_SOURCE ?? 'sqlite'
    try {
      source = (SOURCES[wanted] ?? createSqliteSource)()
      await source.init(seedFactory())
    } catch (error) {
      // Stockage indisponible (navigation privée stricte, navigateur ancien…) : la démo continue en mémoire.
      console.warn('Stockage des données indisponible, démo en mémoire.', error)
      source = createMemorySource()
      await source.init(seedFactory())
    }
    await loadAll()
  })()
  return ready
}

function readyOrThrow() {
  if (!ready) throw new Error('startData() doit être appelé dans main.tsx avant l’affichage.')
  return ready
}

/** Tous les éléments d'une collection. Attend que les données soient prêtes (Suspense → PageLoader). */
export function useCollection<K extends CollectionName>(collection: K): Collections[K][] {
  use(readyOrThrow())
  return useSyncExternalStore(subscribe, () => (cache.get(collection) ?? EMPTY) as Collections[K][])
}

/** Comme useCollection, sans attendre : liste vide tant que les données ne sont pas prêtes (pour les cadres et fournisseurs). */
export function useCollectionWhenReady<K extends CollectionName>(collection: K): Collections[K][] {
  return useSyncExternalStore(subscribe, () => (cache.get(collection) ?? EMPTY) as Collections[K][])
}

/** Identifiant pour un nouvel élément : préfixe lisible + horodatage + hasard. */
export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

type NewItem<K extends CollectionName> = Omit<Collections[K], 'id'> & { id?: string }

/** Les écritures. Toutes asynchrones (comme le serait un appel réseau) ; les écrans se mettent à jour seuls. */
export const data = {
  /** Nom du stockage utilisé (affiché dans le panneau « Données de test »). */
  get label() {
    return source?.label ?? '…'
  },

  async create<K extends CollectionName>(collection: K, item: NewItem<K>, idPrefix: string = collection): Promise<Collections[K]> {
    await readyOrThrow()
    const full = { ...item, id: item.id ?? newId(idPrefix) } as Collections[K]
    await source.put(collection, full)
    await refresh(collection)
    return full
  },

  async update<K extends CollectionName>(collection: K, id: string, patch: Partial<Collections[K]>): Promise<Collections[K] | undefined> {
    await readyOrThrow()
    const current = (cache.get(collection) as Collections[K][] | undefined)?.find((x) => x.id === id)
    if (!current) return undefined
    const next = { ...current, ...patch, id } as Collections[K]
    await source.put(collection, next)
    await refresh(collection)
    return next
  },

  /** Ajoute ou remplace (selon l'id). */
  async put<K extends CollectionName>(collection: K, item: Collections[K]) {
    await readyOrThrow()
    await source.put(collection, item)
    await refresh(collection)
  },

  async remove(collection: CollectionName, id: string) {
    await readyOrThrow()
    await source.remove(collection, id)
    await refresh(collection)
  },

  /** Remet les données de départ (efface tout ce que le testeur a fait). */
  async reset() {
    await readyOrThrow()
    await source.reset(seedFactory())
    await loadAll()
  },

  get canExport() {
    return Boolean(source?.exportFile)
  },

  /** Télécharge toutes les données dans un fichier. */
  async exportFile() {
    await readyOrThrow()
    if (!source.exportFile) return
    const { blob, fileName } = await source.exportFile()
    const url = URL.createObjectURL(blob)
    const link = Object.assign(document.createElement('a'), { href: url, download: fileName })
    link.click()
    URL.revokeObjectURL(url)
  },

  /** Remplace toutes les données par celles d'un fichier exporté. Lève une erreur si le fichier ne convient pas. */
  async importFile(file: File) {
    await readyOrThrow()
    if (!source.importFile) return
    await source.importFile(file)
    await loadAll()
  },
}

export type { CollectionName, Collections } from './collections'
export { POUR_TOUS } from './collections'
