import { COLLECTIONS, type CollectionName, type Collections } from '../collections'
import type { DataSource } from '../source'
import { effacerValeur, ecrireValeur, lireValeur } from './indexedDb'

/**
 * FAUSSES DONNÉES, en attendant l'API de yibolo-backend (décision du 2026-11-27).
 *
 * Les données de départ sont les fichiers JSON de `src/data/fausses-donnees/`
 * (un fichier par table, une liste d'éléments dans l'ordre d'affichage).
 * Ce que le testeur ajoute ou modifie est gardé dans l'IndexedDB de son
 * navigateur : il le retrouve après un rechargement. Si le navigateur refuse
 * (navigation privée stricte), tout marche en mémoire le temps de la visite.
 *
 * Le jour où l'API existe, on écrit une source qui l'appelle (ou on passe
 * aux hooks générés par Orval) : les écrans ne changent pas.
 */

/** À augmenter quand les fausses données ou leur forme changent : les copies des testeurs sont alors refaites. */
export const VERSION_DONNEES = '24'
const CLE = 'fausses-donnees'
const ANCIENNE_CLE_SQLITE = 'base-sqlite'

type Tables = { [K in CollectionName]?: Collections[K][] }
type Copie = { version: string; tables: Tables }

/** Les fichiers JSON, chargés à la demande (ils ne pèsent pas sur la première page). */
const FICHIERS = import.meta.glob<unknown[]>('../fausses-donnees/*.json', { import: 'default' })

async function donneesDeDepart(): Promise<Tables> {
  const tables: Record<string, unknown[]> = {}
  await Promise.all(
    COLLECTIONS.map(async (c) => {
      const charger = FICHIERS[`../fausses-donnees/${c}.json`]
      tables[c] = charger ? await charger() : []
    }),
  )
  return tables as Tables
}

export function createFauxSource(): DataSource {
  let tables: Tables = {}
  let timer: number | undefined
  /** Faux si le navigateur refuse d'enregistrer : les données restent alors en mémoire. */
  let enregistrable = true

  const save = async () => {
    if (!enregistrable) return
    try {
      await ecrireValeur(CLE, { version: VERSION_DONNEES, tables } satisfies Copie)
    } catch {
      enregistrable = false
    }
  }
  /** Enregistre, regroupé (une écriture toutes les 150 ms au plus). */
  const persist = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => void save(), 150)
  }
  const flush = () => {
    if (timer === undefined) return
    window.clearTimeout(timer)
    timer = undefined
    void save()
  }
  const table = <K extends CollectionName>(c: K): Collections[K][] => (tables[c] ?? []) as Collections[K][]

  return {
    label: 'Fausses données',

    async init() {
      const copie = await lireValeur<Copie>(CLE).catch(() => {
        enregistrable = false
        return undefined
      })
      if (copie?.version === VERSION_DONNEES) {
        tables = copie.tables
      } else {
        tables = await donneesDeDepart()
        await save()
      }
      // L'ancienne base SQLite ne sert plus.
      void effacerValeur(ANCIENNE_CLE_SQLITE).catch(() => {})
      // Ne rien perdre si l'onglet se ferme juste après une modification.
      window.addEventListener('pagehide', flush)
    },

    async list(collection) {
      return [...table(collection)]
    },

    async put(collection, item) {
      const liste = table(collection)
      const i = liste.findIndex((x) => x.id === item.id)
      // Un ajout passe avant les données de départ.
      ;(tables as Record<string, unknown[]>)[collection] = i >= 0 ? liste.map((x, k) => (k === i ? item : x)) : [item, ...liste]
      persist()
    },

    async remove(collection, id) {
      ;(tables as Record<string, unknown[]>)[collection] = table(collection).filter((x) => x.id !== id)
      persist()
    },

    async reset() {
      tables = await donneesDeDepart()
      await save()
    },
  }
}
