import { defineConfig } from 'orval'

/**
 * Orval : fabrique les appels à l'API de yibolo-backend et leurs hooks
 * TanStack Query à partir de sa description OpenAPI.
 *
 * Pas encore utilisé : yibolo-backend ne publie pas encore sa description
 * (springdoc à ajouter côté backend). En attendant, les écrans lisent les
 * fausses données de src/data.
 *
 *   npm run api:generate
 */
export default defineConfig({
  yibolo: {
    input: { target: process.env.OPENAPI_URL ?? 'http://localhost:8080/v3/api-docs' },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      schemas: 'src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      override: {
        mutator: { path: 'src/api/client.ts', name: 'appelApi' },
        query: { useQuery: true, useSuspenseQuery: true },
      },
    },
  },
})
