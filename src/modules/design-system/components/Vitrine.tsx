import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

/** Une section de la page « design system » : titre, explication, exemples. */
export function Section({ id, titre, texte, children }: { id: string; titre: string; texte?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titre`} className="flex scroll-mt-6 flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-titre`} className="text-lg font-extrabold text-foreground">
          {titre}
        </h2>
        {texte && <p className="text-sm text-muted-foreground">{texte}</p>}
      </div>
      {children}
    </section>
  )
}

/** Une rangée d'exemples avec son nom. */
export function Rangee({ nom, children, className }: { nom: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-bold tracking-[0.02em] text-subtle-foreground uppercase">{nom}</p>
      <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>
    </div>
  )
}

/** Une pastille de couleur avec son jeton. */
export function Couleur({ jeton, valeur }: { jeton: string; valeur: string }) {
  return (
    <div className="flex w-40 flex-col gap-1.5">
      <span className="h-12 rounded-md border border-border" style={{ background: `var(--color-${jeton})` }} />
      <span className="text-xs font-bold text-foreground">{jeton}</span>
      <span className="text-xs text-muted-foreground uppercase">{valeur}</span>
    </div>
  )
}
