/** Lecture et écriture locales tolérantes : navigation privée, stockage bloqué… */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`yibolo:${key}`)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(`yibolo:${key}`, JSON.stringify(value))
  } catch {
    /* sans stockage, la démo continue en mémoire */
  }
}
