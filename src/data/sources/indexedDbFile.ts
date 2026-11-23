/**
 * Garde un fichier binaire (la base SQLite) dans l'IndexedDB du navigateur.
 * IndexedDB plutôt que localStorage : il accepte des fichiers de plusieurs
 * Mo et des octets bruts.
 */
const DB_NAME = 'yibolo'
const STORE = 'fichiers'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function readFile(key: string): Promise<Uint8Array | undefined> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
    request.onsuccess = () => resolve(request.result instanceof Uint8Array ? request.result : undefined)
    request.onerror = () => reject(request.error)
  })
}

export async function writeFile(key: string, data: Uint8Array): Promise<void> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(data, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
