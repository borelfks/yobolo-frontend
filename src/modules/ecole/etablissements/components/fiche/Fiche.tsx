import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Play, Send } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { tabTriggerClasses } from '@/shared/shadcn/tabs'
import { SkeletonText, SkeletonZone } from '@/shared/blocs/Squelettes'
import { LienActif } from '@/shared/ui/LienActif'
import { cn } from '@/shared/utils/cn'
import { partager } from '@/shared/utils/liens'
import { LogoEcole } from '@/modules/ecole/etablissements/components/Vignette'

/** Un onglet de fiche (un segment de l'adresse ; `fin` : actif sur son adresse exacte seulement). */
export type OngletFiche = { to: string; label: string; fin?: boolean }

/**
 * L'en-tête d'une fiche (établissement, auto-école) : photo de couverture,
 * logo qui la chevauche, nom, sous-titre, badges et chiffres, boutons, puis
 * les onglets (dans l'adresse), soulignés en bleu.
 */
export function EnteteFiche({ couverture, logo, logoAlt, nom, sousTitre, meta, actions, onglets }: { couverture: string; logo?: string; logoAlt: string; nom: string; sousTitre: string; meta: ReactNode; actions: ReactNode; onglets: OngletFiche[] }) {
  const { t } = useTranslation('schools')
  return (
    <section className="flex flex-col overflow-hidden border-y border-border bg-card sm:rounded-lg sm:border">
      <img src={couverture} alt="" className="h-[130px] w-full bg-border object-cover sm:h-[200px]" />
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 px-5">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2">
          <LogoEcole src={logo} nom={nom} alt={logoAlt} className="-mt-10 size-20 rounded-lg border-[3px] border-card text-2xl shadow-raised sm:-mt-14 sm:size-[104px]" />
          <h1 className="text-titre-sm leading-[1.2] font-extrabold tracking-[-0.01em] text-foreground sm:text-titre-md">{nom}</h1>
          <p className="text-sm text-muted-foreground">{sousTitre}</p>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-sm">{meta}</div>
        </div>
        <div className="flex flex-wrap gap-2 self-end">{actions}</div>
      </div>
      <nav aria-label={t('fiche.ongletsAria')} className="mt-3 flex gap-6 overflow-x-auto border-t border-border px-5 [scrollbar-width:none] sm:overflow-visible">
        {onglets.map((o) => (
          <LienActif key={o.to} to={o.to} end={o.fin} className={tabTriggerClasses}>
            {o.label}
          </LienActif>
        ))}
      </nav>
    </section>
  )
}

/** Le corps d'une fiche : le contenu de l'onglet à gauche, une colonne de 300 px à droite (en dessous sur téléphone). */
export function GrilleFiche({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
      <div className="flex min-w-0 flex-col gap-2">{children}</div>
      <aside className="flex min-w-0 flex-col gap-2">{aside}</aside>
    </div>
  )
}

/** « Partager » : la feuille de partage du téléphone, sinon le lien copié (« Lien copié »). */
export function BoutonPartager({ titre }: { titre: string }) {
  const { t } = useTranslation('schools')
  const [copie, setCopie] = useState(false)
  return (
    <Button
      variant="outline"
      onClick={() =>
        void partager(titre)
          .then((r) => {
            if (r === 'copie') {
              setCopie(true)
              toast.success(t('ui.lienCopie'))
            }
          })
          .catch(() => toast.error(t('ui.partageImpossible')))
      }
    >
      <Send aria-hidden />
      {copie ? t('ui.lienCopie') : t('ui.partager')}
    </Button>
  )
}

/** Une vidéo d'une galerie : son image, le bouton lecture au centre, son titre en bas à gauche. */
export function TuileVideo({ poster, titre, onClick, className, grand }: { poster: string; titre: string; onClick: () => void; className?: string; grand?: boolean }) {
  return (
    <Button variant="ghost" aria-label={titre} onClick={onClick} className={cn('relative block h-auto overflow-hidden rounded-md border-0 bg-foreground p-0 hover:bg-foreground', className)}>
      <img src={poster} alt="" className="block size-full object-cover opacity-85" />
      <span className="absolute inset-0 grid place-items-center">
        <span className={cn('grid place-items-center rounded-full bg-card text-primary', grand ? 'size-16' : 'size-12')}>
          <Play className={cn('fill-current', grand ? 'size-7' : 'size-5')} aria-hidden />
        </span>
      </span>
      <span className="absolute bottom-2 left-2 rounded-full bg-foreground/80 px-2 py-0.5 text-xs font-bold text-white">{titre}</span>
    </Button>
  )
}

/** Une photo d'une galerie, avec son nom en bas sur un dégradé (albums) ou sans ; `libelle` : ce que lit un lecteur d'écran quand il n'y a pas de nom. */
export function TuilePhoto({ src, nom, libelle, onClick, className }: { src: string; nom?: string; libelle?: string; onClick: () => void; className?: string }) {
  return (
    <Button variant="ghost" aria-label={nom ?? libelle} onClick={onClick} className={cn('relative block h-auto overflow-hidden rounded-md border-0 p-0 whitespace-normal', className)}>
      <img src={src} alt="" className="block size-full object-cover transition-transform hover:scale-[1.02] motion-reduce:transition-none" />
      {nom && <span className="absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-foreground/85 px-2.5 pt-[18px] pb-2 text-left text-meta font-bold text-white">{nom}</span>}
    </Button>
  )
}

/** Squelette d'une fiche : fil, en-tête, puis le contenu et la colonne de droite. */
export function SqueletteFiche() {
  return (
    <SkeletonZone className="gap-2 sm:gap-3">
      <Skeleton className="mx-4 h-3.5 w-40 sm:mx-0" />
      <div className="overflow-hidden border-y border-border bg-card sm:rounded-lg sm:border">
        <Skeleton className="h-[130px] w-full rounded-none sm:h-[200px]" />
        <div className="flex flex-col gap-2.5 px-5 pb-4">
          <Skeleton className="-mt-10 size-20 rounded-lg border-[3px] border-card bg-border sm:-mt-14 sm:size-[104px]" />
          <Skeleton className="h-7 w-96 max-w-full" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-6 border-t border-border px-5 py-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      <GrilleFiche
        aside={
          <div className="flex flex-col gap-3 border-y border-border bg-card p-4 sm:rounded-lg sm:border">
            <Skeleton className="h-4 w-40" />
            <SkeletonText lines={3} />
          </div>
        }
      >
        <div className="flex flex-col gap-3 border-y border-border bg-card p-5 sm:rounded-lg sm:border">
          <Skeleton className="h-5 w-48" />
          <SkeletonText lines={5} />
        </div>
      </GrilleFiche>
    </SkeletonZone>
  )
}
