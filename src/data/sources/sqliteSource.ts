import type { Database, SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { COLLECTIONS, type CollectionName, type Collections } from '../collections'
import type { DataSource } from '../source'
import { readFile, writeFile } from './indexedDbFile'

/**
 * Stockage SQLite DANS LE NAVIGATEUR (sql.js). Chaque testeur a sa propre
 * base, gardée dans l'IndexedDB de son navigateur : elle reste après un
 * rechargement ou la fermeture du navigateur. Exportable en vrai fichier
 * `.sqlite` (lisible avec DB Browser for SQLite) et réimportable.
 *
 * Une table par collection :
 *   id TEXT (clé), ordre REAL (ordre d'affichage), donnees TEXT (JSON de l'élément),
 *   cree_le TEXT, modifie_le TEXT (dates ISO)
 * et une table `meta` (version du schéma et des données de départ).
 *
 * Les données de départ sont dans `src/data/depart/yibolo.sql` : la base est
 * créée à partir de ce fichier au premier lancement et à chaque « Réinitialiser ».
 * Si le navigateur ne peut pas l'enregistrer (navigation privée stricte), la
 * base marche quand même, en mémoire, le temps de la visite.
 */

/** À augmenter quand les données de départ (src/mocks) ou le schéma changent : les bases des testeurs sont alors refaites. */
export const VERSION_DONNEES = '5'
const CLE_FICHIER = 'base-sqlite'
const EXTENSION = 'sqlite'

const nowIso = () => new Date().toISOString()

export function createSqliteSource(): DataSource {
  let SQL: SqlJsStatic
  let db: Database
  let saveTimer: number | undefined
  /** Faux si le navigateur refuse d'enregistrer : la base reste alors en mémoire. */
  let enregistrable = true

  /** Écrit la base dans le navigateur ; un refus ne casse pas la démo. */
  const save = async () => {
    if (!enregistrable) return
    try {
      await writeFile(CLE_FICHIER, db.export())
    } catch {
      enregistrable = false
    }
  }
  /** Enregistre la base dans le navigateur, regroupé (une écriture toutes les 150 ms au plus). */
  const persist = () => {
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => void save(), 150)
  }
  const flush = () => {
    if (saveTimer === undefined) return
    window.clearTimeout(saveTimer)
    saveTimer = undefined
    void save()
  }

  const createSchema = (base: Database) => {
    base.run('CREATE TABLE IF NOT EXISTS meta (cle TEXT PRIMARY KEY, valeur TEXT NOT NULL)')
    for (const c of COLLECTIONS) {
      base.run(
        `CREATE TABLE IF NOT EXISTS "${c}" (id TEXT PRIMARY KEY, ordre REAL NOT NULL, donnees TEXT NOT NULL, cree_le TEXT NOT NULL, modifie_le TEXT NOT NULL)`,
      )
    }
  }

  /** Une base neuve, remplie avec le fichier des données de départ. */
  const nouvelleBase = async () => {
    const { default: depart } = await import('../depart/yibolo.sql?raw')
    const base = new SQL.Database()
    base.exec(depart)
    createSchema(base)
    base.run('INSERT OR REPLACE INTO meta (cle, valeur) VALUES (?, ?)', ['version_donnees', VERSION_DONNEES])
    return base
  }

  const versionOf = (base: Database) => {
    try {
      return base.exec("SELECT valeur FROM meta WHERE cle = 'version_donnees'")[0]?.values[0]?.[0]
    } catch {
      return undefined
    }
  }

  return {
    label: 'SQLite (navigateur)',

    async init() {
      const { default: initSqlJs } = await import('sql.js')
      SQL = await initSqlJs({ locateFile: () => wasmUrl, useOldExtensionFunctions: true })
      const saved = await readFile(CLE_FICHIER).catch(() => {
        enregistrable = false
        return undefined
      })
      db = saved ? new SQL.Database(saved) : new SQL.Database()
      if (versionOf(db) !== VERSION_DONNEES) {
        db.close()
        db = await nouvelleBase()
        await save()
      }
      // Ne rien perdre si l'onglet se ferme juste après une modification.
      window.addEventListener('pagehide', flush)
    },

    async list<K extends CollectionName>(collection: K) {
      const result = db.exec(`SELECT donnees FROM "${collection}" ORDER BY ordre`)[0]
      return (result?.values ?? []).map(([json]) => JSON.parse(String(json))) as Collections[K][]
    },

    async put(collection, item) {
      const exists = db.exec(`SELECT 1 FROM "${collection}" WHERE id = ?`, [item.id]).length > 0
      if (exists) {
        db.run(`UPDATE "${collection}" SET donnees = ?, modifie_le = ? WHERE id = ?`, [JSON.stringify(item), nowIso(), item.id])
      } else {
        // Un ajout passe avant les données de départ (ordre négatif, de plus en plus petit).
        db.run(`INSERT INTO "${collection}" (id, ordre, donnees, cree_le, modifie_le) VALUES (?, ?, ?, ?, ?)`, [
          item.id,
          -Date.now(),
          JSON.stringify(item),
          nowIso(),
          nowIso(),
        ])
      }
      persist()
    },

    async remove(collection, id) {
      db.run(`DELETE FROM "${collection}" WHERE id = ?`, [id])
      persist()
    },

    async reset() {
      db.close()
      db = await nouvelleBase()
      await save()
    },

    async exportFile() {
      flush()
      const bytes = db.export()
      const jour = new Date().toISOString().slice(0, 10)
      return { blob: new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/vnd.sqlite3' }), fileName: `yibolo-donnees-${jour}.${EXTENSION}` }
    },

    async importFile(file) {
      const candidate = new SQL.Database(new Uint8Array(await file.arrayBuffer()))
      if (versionOf(candidate) !== VERSION_DONNEES) {
        candidate.close()
        throw new Error('fichier-invalide')
      }
      createSchema(candidate)
      db.close()
      db = candidate
      await save()
    },
  }
}
