import { useSyncExternalStore } from 'react'
import { QueryClient, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { COLLECTIONS, type CollectionName, type Collections } from './collections'
import type { DataSource } from './source'
import { createFauxSource } from './sources/fauxSource'

/**
 * POINT D'ENTRÉE UNIQUE DES DONNÉES.
 *
 * Les écrans lisent avec les hooks (`useCollection`, et ceux de ./hooks) et
 * écrivent avec `data.create / update / remove`. Ils ne savent pas d'où
 * viennent les données : aujourd'hui de fausses données (./sources/fauxSource),
 * demain l'API de yibolo-backend.
 *
 * Les lectures passent par TanStack Query (une requête par table, clé
 * `['donnees', table]`) : le jour où l'API existe, les hooks générés par
 * Orval prennent le relais avec le même client.
 */
const SOURCES: Record<string, () => DataSource> = {
  faux: createFauxSource,
}

/** Le client TanStack Query de l'application (fourni dans main.tsx). */
export const queryClient = new QueryClient({
  defaultOptions: {
    // Les fausses données ne changent que par nos écritures : pas de rechargement automatique.
    queries: { staleTime: Infinity, gcTime: Infinity, refetchOnWindowFocus: false, retry: false },
  },
})

let source: DataSource
let ready: Promise<void> | undefined
let pret = false
const listeners = new Set<() => void>()
const EMPTY: never[] = []

const notify = () => listeners.forEach((l) => l())
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const cle = (collection: CollectionName) => ['donnees', collection] as const

async function refresh(collection: CollectionName) {
  queryClient.setQueryData(cle(collection), await source.list(collection))
}

async function loadAll() {
  await Promise.all(COLLECTIONS.map(refresh))
}

/**
 * Démarre les données (appelé une fois, dans main.tsx, avant l'affichage).
 * Le chargement continue en arrière-plan : les pages qui ont besoin des
 * données attendent (PageLoader), les autres s'affichent tout de suite.
 */
export function startData() {
  ready ??= (async () => {
    const wanted = import.meta.env.VITE_DATA_SOURCE ?? 'faux'
    source = (SOURCES[wanted] ?? createFauxSource)()
    await source.init()
    await loadAll()
    pret = true
    notify()
  })()
  return ready
}

/** Vrai quand les données sont chargées (pour un cadre qui ne doit pas attendre, comme la garde de l'espace pro). */
export function useDataReady() {
  return useSyncExternalStore(subscribe, () => pret)
}

function readyOrThrow() {
  if (!ready) throw new Error('startData() doit être appelé dans main.tsx avant l’affichage.')
  return ready
}

function lire<K extends CollectionName>(collection: K) {
  return {
    queryKey: cle(collection),
    queryFn: async () => {
      await readyOrThrow()
      return (await source.list(collection)) as Collections[K][]
    },
  }
}

function enCache<K extends CollectionName>(collection: K) {
  return (queryClient.getQueryData<Collections[K][]>(cle(collection)) ?? EMPTY) as Collections[K][]
}

/** Tous les éléments d'une collection. Attend que les données soient prêtes (Suspense → PageLoader). */
export function useCollection<K extends CollectionName>(collection: K): Collections[K][] {
  return useSuspenseQuery(lire(collection)).data
}

/** Comme useCollection, sans attendre : liste vide tant que les données ne sont pas prêtes (pour les cadres et fournisseurs). */
export function useCollectionWhenReady<K extends CollectionName>(collection: K): Collections[K][] {
  return useQuery(lire(collection)).data ?? EMPTY
}

/** Identifiant pour un nouvel élément : préfixe lisible + horodatage + hasard. */
export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Date à laquelle un testeur a ajouté un élément, lue dans son identifiant
 * (`newId` : préfixe + horodatage). `null` pour un élément des données de
 * départ (identifiants écrits à la main : « ipc », « f-cg-ipc », « a1 »…).
 * Sert aux compteurs : ce que les testeurs ont ajouté.
 */
export function dateDeCreation(id: string): Date | null {
  const m = /-([0-9a-z]{8})[0-9a-z]{0,4}$/.exec(id)
  if (!m?.[1]) return null
  const ms = parseInt(m[1], 36)
  // Entre 2023 et 2049 : un horodatage plausible, pas un mot.
  return ms > 1.7e12 && ms < 2.5e12 ? new Date(ms) : null
}

type NewItem<K extends CollectionName> = Omit<Collections[K], 'id'> & { id?: string }

/** Les écritures. Toutes asynchrones (comme le serait un appel réseau) ; les écrans se mettent à jour seuls. */
export const data = {
  async create<K extends CollectionName>(collection: K, item: NewItem<K>, idPrefix: string = collection): Promise<Collections[K]> {
    await readyOrThrow()
    const full = { ...item, id: item.id ?? newId(idPrefix) } as Collections[K]
    await source.put(collection, full)
    await refresh(collection)
    return full
  },

  /** Les éléments d'une table, lus hors d'un écran (pour une écriture qui dépend de l'existant, comme un compteur). */
  async list<K extends CollectionName>(collection: K): Promise<Collections[K][]> {
    await readyOrThrow()
    return enCache(collection)
  },

  async update<K extends CollectionName>(collection: K, id: string, patch: Partial<Collections[K]>): Promise<Collections[K] | undefined> {
    await readyOrThrow()
    const current = enCache(collection).find((x) => x.id === id)
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
    await source.reset()
    await loadAll()
  },
}

export type { CollectionName, Collections } from './collections'
export { POUR_TOUS } from './collections'
