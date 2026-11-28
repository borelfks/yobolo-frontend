import { Fragment, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, ShieldCheck } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/shadcn/breadcrumb'
import { Button } from '@/shared/shadcn/button'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { Lien } from '@/shared/ui/Lien'
import type { FavoriteKind } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'

/*
 * Les petits éléments des écrans de l'univers École (canevas) : fil d'Ariane,
 * carte de section, favoris, note courte, puces de choix. Ils servent aux
 * établissements comme aux auto-écoles.
 */

/** Le fil d'Ariane du canevas : liens gris en gras, page courante en bleu nuit. */
export function Ariane({ items, className }: { items: { label: string; to?: string }[]; className?: string }) {
  return (
    <Breadcrumb className={cn('px-4 pt-3 sm:px-0 sm:pt-0', className)}>
      <BreadcrumbList>
        {items.map((x, i) => (
          <Fragment key={`${x.label}-${i}`}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {x.to && i < items.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Lien to={x.to}>{x.label}</Lien>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-bold">{x.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/**
 * Une carte de page : blanche, bordée et arrondie sur ordinateur ; sur
 * téléphone, sur toute la largeur avec un filet en haut et en bas (canevas).
 */
export function Carte({ children, className, as: Balise = 'section', ...props }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'aside'; id?: string; 'aria-labelledby'?: string; 'aria-label'?: string }) {
  return (
    <Balise className={cn('flex flex-col gap-3 border-y border-border bg-card p-5 sm:rounded-lg sm:border', className)} {...props}>
      {children}
    </Balise>
  )
}

/** Titre d'une carte (18 px, en gras). */
export function TitreCarte({ children, className, id, niveau = 2 }: { children: ReactNode; className?: string; id?: string; niveau?: 2 | 3 }) {
  const Balise = niveau === 2 ? 'h2' : 'h3'
  return (
    <Balise id={id} className={cn(niveau === 2 ? 'text-lg font-bold' : 'text-base font-bold', 'text-foreground', className)}>
      {children}
    </Balise>
  )
}

/** Le dossier où ranger un favori. */
const dossier = (kind: FavoriteKind) => (kind === 'formation' || kind === 'permis' ? 'Mes formations' : 'Mes établissements')

/** Le cœur rond posé sur la photo d'une vignette : ajoute ou retire des favoris. */
export function CoeurFavori({ id, kind, className }: { id: string; kind: FavoriteKind; className?: string }) {
  const { t } = useTranslation()
  const { isFavorite, toggle } = useFavorites()
  const on = isFavorite(id)
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-pressed={on}
      aria-label={on ? t('favorites.remove') : t('favorites.add')}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id, kind, dossier(kind))
      }}
      className={cn('bg-card shadow-thumb hover:bg-accent', on ? 'text-destructive hover:text-destructive' : 'text-muted-foreground', className)}
    >
      <Heart className="size-[18px]" fill={on ? 'currentColor' : 'none'} aria-hidden />
    </Button>
  )
}

/** Le bouton « Ajouter aux favoris » / « Dans mes favoris » des fiches (pilule bordée, rouge une fois ajouté). */
export function BoutonFavori({ id, kind, className }: { id: string; kind: FavoriteKind; className?: string }) {
  const { t } = useTranslation('schools')
  const { isFavorite, toggle } = useFavorites()
  const on = isFavorite(id)
  return (
    <Button variant="secondary" aria-pressed={on} onClick={() => toggle(id, kind, dossier(kind))} className={cn(on && 'border-destructive text-destructive hover:bg-destructive-soft', className)}>
      <Heart className="size-[18px]" fill={on ? 'currentColor' : 'none'} aria-hidden />
      {on ? t('ui.favori.dans') : t('ui.favori.ajouter')}
    </Button>
  )
}

/** La note d'une école : « ★ 4,7 (3 avis) » en gras, ou « Pas encore d’avis » en gris. */
export function NoteCourte({ note, nbAvis, className }: { note: number; nbAvis: number; className?: string }) {
  const { t } = useTranslation()
  if (!nbAvis) return <span className={cn('text-subtle-foreground', className)}>{t('rating.aucun')}</span>
  return (
    <span className={cn('font-bold text-foreground', className)}>
      <span aria-hidden>★ </span>
      {num(note)} {t('rating.reviews', { count: nbAvis, n: nbAvis })}
    </span>
  )
}

/** « Établissement vérifié » : bouclier vert (vignettes) ou badge (fiches). */
export function MentionVerifie({ className }: { className?: string }) {
  const { t } = useTranslation('schools')
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-bold text-success', className)}>
      <ShieldCheck className="size-3.5" strokeWidth={2.4} aria-hidden />
      {t('ui.verifie')}
    </span>
  )
}

/**
 * Une rangée de puces à choix unique (diplôme, cours, profil d'avis, permis) :
 * pilules bordées, la puce choisie en bleu nuit. Sur téléphone, la rangée
 * défile de côté. `libelle` : le nom de la rangée, à gauche.
 */
export function RangeePuces<V extends string>({
  libelle,
  valeur,
  options,
  onChange,
  className,
  largeurLibelle,
}: {
  libelle?: string
  valeur: V
  options: { valeur: V; libelle: string }[]
  onChange: (v: V) => void
  className?: string
  /** Largeur fixe du libellé (les rangées alignées du canevas). */
  largeurLibelle?: string
}) {
  return (
    <div className={cn('flex [scrollbar-width:none] items-center gap-2 max-sm:-mx-5 max-sm:overflow-x-auto max-sm:px-5 sm:flex-wrap', className)}>
      {libelle && <span className={cn('flex-none text-meta font-bold text-muted-foreground', largeurLibelle)}>{libelle}</span>}
      <ToggleGroup
        type="single"
        variant="outline"
        spacing={2}
        value={valeur}
        onValueChange={(v) => v && onChange(v as V)}
        aria-label={libelle}
        className="flex-none sm:flex-wrap"
      >
        {options.map((o) => (
          <ToggleGroupItem key={o.valeur} value={o.valeur} className="px-3.5 data-[state=on]:border-foreground data-[state=on]:bg-foreground">
            {o.libelle}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
