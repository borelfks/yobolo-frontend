import { Fragment, useId, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreHorizontal, type LucideIcon } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/shadcn/breadcrumb'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import { Input } from '@/shared/shadcn/input'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { tabTriggerClasses } from '@/shared/shadcn/tabs'
import { SkeletonText, SkeletonZone } from '@/shared/blocs/Squelettes'
import { Lien } from '@/shared/ui/Lien'
import { LienActif } from '@/shared/ui/LienActif'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/*
 * Les blocs de l'espace professionnel (canevas « Espace professionnel ») :
 * sur ordinateur, des cartes bordées et arrondies, séparées de 8 px ; sur
 * téléphone, des bandes blanches de toute la largeur, bordées en haut et en bas.
 */

const carte = 'border-y border-border bg-card lg:rounded-lg lg:border'

/** Une carte de l'espace pro : titre (18 px, 16 px si `serree`), description, action à droite, contenu. */
export function CartePro({
  titre,
  description,
  action,
  serree = false,
  titreMasque = false,
  className,
  children,
}: {
  titre?: ReactNode
  description?: ReactNode
  action?: ReactNode
  serree?: boolean
  /** Titre lu par les lecteurs d'écran seulement. */
  titreMasque?: boolean
  className?: string
  children?: ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={titre ? id : undefined} className={cn(carte, 'flex min-w-0 flex-col', serree ? 'gap-3 p-4' : 'gap-3.5 p-5', className)}>
      {titre && (
        <div className={cn('flex flex-wrap items-center justify-between gap-2.5', titreMasque && 'sr-only')}>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 id={id} className={cn('font-extrabold text-foreground', serree ? 'text-base' : 'text-lg')}>
              {titre}
            </h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export type Miette = { label: string; to?: string }
export type OngletPro = { label: string; to: string; end?: boolean }

/**
 * L'en-tête d'une page de l'espace pro : fil d'Ariane (« Espace pro › … »),
 * titre, sous-titre, boutons, puis les onglets soulignés (dans l'adresse).
 * `haut` : ce qui se pose au-dessus (bannière et logo du profil).
 */
export function EntetePro({ miettes, titre, sousTitre, actions, onglets, haut }: { miettes: Miette[]; titre: string; sousTitre: string; actions?: ReactNode; onglets?: OngletPro[]; haut?: ReactNode }) {
  const { t } = useTranslation('pro')
  const fil: Miette[] = [{ label: t('commun.espacePro'), to: ROUTES.pro.root }, ...miettes]
  return (
    <section className={cn(carte, 'overflow-hidden')}>
      {haut}
      <div className={cn('flex flex-col gap-2.5 px-5 pt-4', onglets ? 'pb-0' : 'pb-[18px]')}>
        <Breadcrumb>
          <BreadcrumbList>
            {fil.map((m, i) => (
              <Fragment key={`${m.label}-${i}`}>
                <BreadcrumbItem>
                  {i < fil.length - 1 && m.to ? (
                    <BreadcrumbLink asChild>
                      <Lien to={m.to}>{m.label}</Lien>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-bold">{m.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i < fil.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-1">
            <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-foreground lg:text-2xl">{titre}</h1>
            <p className="text-sm text-muted-foreground">{sousTitre}</p>
          </div>
          {actions && <div className="flex flex-wrap gap-2 max-lg:w-full max-lg:*:w-full">{actions}</div>}
        </div>
        {onglets && (
          <nav aria-label={t('commun.onglets')} className="mt-1 flex flex-wrap gap-x-[18px] border-t border-border lg:gap-x-6">
            {onglets.map((o) => (
              <LienActif key={o.to} to={o.to} end={o.end ?? true} className={tabTriggerClasses}>
                {o.label}
              </LienActif>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}

/**
 * Le pied d'un formulaire (Annuler · Enregistrer…) : aligné à droite sur
 * ordinateur ; sur téléphone, une bande blanche, boutons pleine largeur, le
 * principal en haut.
 */
export function PiedFormulaire({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col-reverse gap-2 border-y border-border bg-card p-4 *:w-full lg:flex-row lg:flex-wrap lg:justify-end lg:border-0 lg:bg-transparent lg:px-0 lg:py-1 lg:*:w-auto', className)}>
      {children}
    </div>
  )
}

/** Un conseil (fond bleu pâle) : « Conseil » en gras, puis le texte. */
export function Conseil({ titre, children }: { titre?: string; children: ReactNode }) {
  const { t } = useTranslation('pro')
  return (
    <p className="flex flex-wrap gap-x-2.5 gap-y-1.5 rounded-md bg-primary-soft px-3.5 py-3 text-sm text-primary-strong">
      <b>{titre ?? t('commun.conseil')}</b>
      <span>{children}</span>
    </p>
  )
}

/** Une ligne de réglage : titre, aide, et à droite un interrupteur, un badge ou un bouton. */
export function LigneReglage({ titre, aide, children, id }: { titre: ReactNode; aide?: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-border py-3">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <b id={id} className="text-ui text-foreground">
          {titre}
        </b>
        {aide && <span className="text-xs font-medium text-muted-foreground">{aide}</span>}
      </span>
      {children}
    </div>
  )
}

export type Chiffre = { nom: string; valeur: ReactNode; detail?: ReactNode; ton?: 'hausse' | 'baisse'; to?: string; onClick?: () => void; actif?: boolean }

/**
 * Une bande de chiffres séparés par un filet (tableau de bord, formations,
 * statistiques, utilisateurs). `colonnes` : sur ordinateur ; `colonnesMobile` :
 * 1 (empilés) ou 2 (grille de deux).
 */
export function BandeauChiffres({ chiffres, colonnes, colonnesMobile = 1, bordure = 'haut' }: { chiffres: Chiffre[]; colonnes: 3 | 4; colonnesMobile?: 1 | 2 | 3; bordure?: 'haut' | 'bas' }) {
  const grille = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }[colonnes]
  const mobile = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }[colonnesMobile]
  return (
    <div className={cn('grid border-border', bordure === 'haut' ? 'border-t pt-3.5' : 'border-b pb-3.5', mobile, grille)}>
      {chiffres.map((c, i) => {
        const place = cn(
          'flex min-w-0 flex-col gap-0.5 text-left text-foreground no-underline',
          // Ordinateur : un filet à gauche de chaque chiffre sauf le premier.
          'lg:border-t-0 lg:px-4 lg:py-1 lg:first:pl-0',
          i > 0 && 'lg:border-l lg:border-border',
          colonnesMobile === 1 && cn('py-2.5', i > 0 && 'border-t border-border'),
          colonnesMobile === 2 && cn('py-3', i % 2 === 1 && 'border-l border-border pl-3.5', i > 1 && 'border-t border-border'),
          colonnesMobile === 3 && cn('py-1', i > 0 && 'border-l border-border px-3'),
        )
        const contenu = (
          <>
            <span className="text-meta font-semibold text-muted-foreground">{c.nom}</span>
            <b className={cn('text-[26px] leading-tight font-extrabold tracking-[-0.02em]', c.actif && 'text-primary')}>{c.valeur}</b>
            {c.detail && <span className={cn('text-xs', c.ton === 'hausse' ? 'font-bold text-success' : c.ton === 'baisse' ? 'font-bold text-destructive-hover' : 'text-muted-foreground')}>{c.detail}</span>}
          </>
        )
        if (c.to)
          return (
            <Lien key={c.nom} to={c.to} className={cn(place, 'hover:[&_b]:text-primary')}>
              {contenu}
            </Lien>
          )
        if (c.onClick)
          return (
            <Button key={c.nom} variant="ghost" aria-pressed={c.actif} onClick={c.onClick} className={cn('h-auto gap-0.5 px-0 text-base', place, 'items-start justify-start rounded-none font-normal whitespace-normal hover:bg-transparent hover:text-foreground hover:[&_b]:text-primary')}>
              {contenu}
            </Button>
          )
        return (
          <div key={c.nom} className={place}>
            {contenu}
          </div>
        )
      })}
    </div>
  )
}

const TONS = {
  bleu: 'bg-primary-tint text-primary',
  ambre: 'bg-warning-soft text-warning-strong',
  gris: 'bg-secondary text-foreground-soft',
  violet: 'bg-tone-violet-soft text-tone-violet',
  vert: 'bg-success-soft text-success',
  rouge: 'bg-destructive-soft text-destructive-hover',
  orange: 'bg-tone-orange-soft text-tone-orange',
} as const
export type TonPastille = keyof typeof TONS

/** Une pastille ronde de 40 px avec une icône (ou carrée de 36 px si `carree`). */
export function Pastille({ icone: Icone, ton, carree = false }: { icone: LucideIcon; ton: TonPastille; carree?: boolean }) {
  return (
    <span className={cn('grid shrink-0 place-items-center', carree ? 'size-9 rounded-lg' : 'size-10 rounded-full', TONS[ton])}>
      <Icone className={carree ? 'size-[18px]' : 'size-5'} aria-hidden />
    </span>
  )
}

const STATUTS = {
  Publiée: { cle: 'publiee', ton: 'green' },
  Publié: { cle: 'publie', ton: 'green' },
  Brouillon: { cle: 'brouillon', ton: 'gray' },
  Actif: { cle: 'actif', ton: 'green' },
  Inactif: { cle: 'inactif', ton: 'gray' },
  'En attente': { cle: 'enAttente', ton: 'amber' },
} as const
const estStatut = (s: string): s is keyof typeof STATUTS => s in STATUTS

/** Le statut d'une donnée (« Publiée », « Brouillon », « Actif »…), traduit, dans un badge de sa couleur. */
export function StatutBadge({ statut }: { statut: string }) {
  const { t } = useTranslation('pro')
  if (!estStatut(statut)) return <Badge variant="gray">{statut}</Badge>
  const s = STATUTS[statut]
  return <Badge variant={s.ton}>{t(`commun.statuts.${s.cle}`)}</Badge>
}

/** Le format d'un fichier dans une tuile de 44 px (« PDF », « DOCX »). */
export function VignetteFichier({ format }: { format: string }) {
  return <span className="grid size-11 shrink-0 place-items-center rounded-md bg-destructive-soft text-[11px] font-extrabold text-destructive-hover">{format.slice(0, 4).toUpperCase()}</span>
}

export type ActionMenu = { label: string; onSelect: () => void; danger?: boolean; masque?: boolean }

/** Le bouton « … » et son menu d'actions. */
export function MenuPlus({ label, actions, className }: { label: string; actions: ActionMenu[]; className?: string }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} className={className}>
          <MoreHorizontal className="size-[18px]" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        {actions
          .filter((a) => !a.masque)
          .map((a) => (
            <DropdownMenuItem key={a.label} variant={a.danger ? 'destructive' : 'default'} onSelect={a.onSelect}>
              {a.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Squelette d'une page de l'espace pro : l'en-tête puis des cartes de la même forme. */
export function SquelettePro({ cartes = 2, onglets = false, colonne = false, entete = true }: { cartes?: number; onglets?: boolean; colonne?: boolean; /** Faux quand l'en-tête de la page est déjà affiché. */ entete?: boolean }) {
  const bloc = (k: number) => (
    <div key={k} className={cn(carte, 'flex flex-col gap-3.5 p-5')}>
      <Skeleton className="h-5 w-56 max-w-full" />
      <SkeletonText lines={4} />
    </div>
  )
  return (
    <SkeletonZone className="gap-2">
      {entete && (
        <div className={cn(carte, 'flex flex-col gap-2.5 px-5 py-4')}>
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-7 w-72 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
          {onglets && <Skeleton className="mt-2 h-8 w-full" />}
        </div>
      )}
      {colonne ? (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-4">
          <div className="flex flex-col gap-2">{Array.from({ length: cartes }, (_, k) => bloc(k))}</div>
          <div className="flex flex-col gap-2">{bloc(99)}</div>
        </div>
      ) : (
        Array.from({ length: cartes }, (_, k) => bloc(k))
      )}
    </SkeletonZone>
  )
}

/** Un numéro camerounais en 44 px : « +237 » dans sa case, puis le numéro. */
export function ChampIndicatif(props: Omit<ComponentProps<typeof Input>, 'type'>) {
  return (
    <div className="flex gap-2">
      <span className="grid h-11 shrink-0 place-items-center rounded-sm border border-input bg-muted px-3 text-ui font-bold text-foreground">+237</span>
      <Input type="tel" inputMode="tel" {...props} />
    </div>
  )
}
