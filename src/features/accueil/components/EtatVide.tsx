import type { ReactNode } from 'react'

/** Le fil vide (EmptyState de yibolo-client) : une icône ronde, un titre, une explication, une action. */
export function EtatVide({ icone, titre, description, action }: { icone: ReactNode; titre: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-page text-navy-900">{icone}</div>
      <p className="text-base font-medium text-ink">{titre}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
