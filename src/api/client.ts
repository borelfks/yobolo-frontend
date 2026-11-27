import axios, { type AxiosRequestConfig } from 'axios'

/**
 * Client HTTP de l'API de yibolo-backend, utilisé par le code généré par Orval
 * (`npm run api:generate`, voir orval.config.ts). Pas encore branché : les
 * écrans lisent les fausses données de src/data.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

/** Appel utilisé par chaque hook généré : renvoie directement les données de la réponse. */
export async function appelApi<T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.request<T>({ ...config, ...options })
  return data
}
