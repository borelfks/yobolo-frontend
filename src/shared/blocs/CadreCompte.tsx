import type { ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { Button } from '@/shared/shadcn/button'
import { toggleVariants } from '@/shared/shadcn/variants'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'

export type LienCompte = { cle: string; vers: string; libelle: string; actif: boolean; /** Pastille rouge (notifications non lues). */ badge?: number }

/**
 * Le cadre des pages « Mon compte » d'une personne (canevas : Mes favoris,
 * Notifications, Mon profil, Paramètres). Sur ordinateur, une carte de 240 px
 * à gauche (photo, nom, rôle, menu au filet bleu) et la page à droite ; sur
 * téléphone, le menu devient une rangée de puces qui défile. Il ne connaît ni
 * la session ni les textes : la page lui donne le compte, les liens et
 * « Se déconnecter ».
 */
export function CadreCompte({
  compte,
  titreMenu,
  liens,
  sortie,
  children,
}: {
  compte: { nom: string; photo?: string; role: string }
  titreMenu: string
  liens: LienCompte[]
  sortie: { libelle: string; onClick: () => void }
  children: ReactNode
}) {
  const initiales = compte.nom
    .split(/\s+/)
    .map((m) => m[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="flex flex-col gap-2 pb-4 lg:mx-auto lg:grid lg:w-full lg:max-w-page lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:px-4 lg:pt-6 lg:pb-10">
      <aside className="border-b border-border bg-card lg:sticky lg:top-4 lg:overflow-hidden lg:rounded-lg lg:border">
        <div className="hidden items-center gap-2.5 border-b border-border p-4 lg:flex">
          <Avatar className="size-12">
            {compte.photo && <AvatarImage src={compte.photo} alt="" className="object-cover" />}
            <AvatarFallback>{initiales}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col gap-0.5">
            <b className="text-ui">{compte.nom}</b>
            <span className="text-xs text-muted-foreground">{compte.role}</span>
          </span>
        </div>
        <nav aria-label={titreMenu} className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:py-2">
          {liens.map((l) => (
            <Lien
              key={l.cle}
              to={l.vers}
              aria-current={l.actif ? 'page' : undefined}
              data-state={l.actif ? 'on' : 'off'}
              className={cn(
                toggleVariants({ variant: 'outline' }),
                'shrink-0 no-underline',
                'lg:h-auto lg:w-full lg:justify-start lg:gap-2.5 lg:rounded-none lg:border-0 lg:border-l-3 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2.5 lg:text-sm lg:hover:bg-background lg:hover:text-foreground',
                'lg:data-[state=on]:border-primary lg:data-[state=on]:bg-primary-soft lg:data-[state=on]:text-primary-strong',
              )}
            >
              {l.libelle}
              {!!l.badge && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-caption3 font-extrabold text-white lg:ml-auto">{l.badge}</span>
              )}
            </Lien>
          ))}
          <Button
            variant="ghost"
            onClick={sortie.onClick}
            className={cn(
              toggleVariants({ variant: 'outline' }),
              'shrink-0',
              'lg:h-auto lg:w-full lg:justify-start lg:rounded-none lg:border-0 lg:border-l-3 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2.5 lg:text-sm lg:hover:bg-background lg:hover:text-foreground',
            )}
          >
            {sortie.libelle}
          </Button>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col gap-2">{children}</div>
    </div>
  )
}

/** Une carte de page « Mon compte » : blanche, bordée, 20 px de marge ; sur téléphone, sur toute la largeur. `danger` : bordure rouge pâle. */
export function CarteCompte({ children, className, danger = false, ...props }: { children: ReactNode; className?: string; danger?: boolean; id?: string; 'aria-labelledby'?: string }) {
  return (
    <section
      className={cn('flex scroll-mt-24 flex-col gap-3.5 border-y bg-card p-5 lg:rounded-lg lg:border', danger ? 'gap-3 border-destructive-line' : 'border-border', className)}
      {...props}
    >
      {children}
    </section>
  )
}

/** L'en-tête d'une page « Mon compte » : titre (24 px, 22 sur téléphone), phrase d'appoint, action à droite (« Tout supprimer », « Tout marquer comme lu »). */
export function EnTeteCompte({ titre, texte, action }: { titre: string; texte?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-extrabold tracking-[-0.01em] lg:text-2xl">{titre}</h1>
        {texte && <p className="text-sm text-muted-foreground">{texte}</p>}
      </div>
      {action}
    </div>
  )
}

/** Les puces d'une page « Mon compte » (filtres, ancres) : des liens, celle de la page en cours en vert. Elles défilent sur téléphone. */
export function PucesCompte({ puces, titre }: { puces: { cle: string; vers: string; libelle: string; actif?: boolean }[]; titre: string }) {
  return (
    <nav aria-label={titre} className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-wrap lg:overflow-visible">
      {puces.map((p) => (
        <Lien
          key={p.cle}
          to={p.vers}
          aria-current={p.actif ? 'page' : undefined}
          data-state={p.actif ? 'on' : 'off'}
          className={cn(toggleVariants({ variant: 'outline' }), 'shrink-0 no-underline')}
        >
          {p.libelle}
        </Lien>
      ))}
    </nav>
  )
}
