/**
 * Garde une valeur (les fausses données modifiées par le testeur) dans l'IndexedDB
 * du navigateur. IndexedDB plutôt que localStorage : il accepte plusieurs Mo
 * (les fichiers joints sont gardés en data URL).
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

export async function lireValeur<T>(key: string): Promise<T | undefined> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
    request.onsuccess = () => resolve(request.result as T | undefined)
    request.onerror = () => reject(request.error)
  })
}

export async function ecrireValeur(key: string, valeur: unknown): Promise<void> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(valeur, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function effacerValeur(key: string): Promise<void> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
