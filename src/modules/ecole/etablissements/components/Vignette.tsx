import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { SkeletonZone } from '@/shared/blocs/Squelettes'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { initials } from '@/shared/utils/format'
import { CoeurFavori, MentionVerifie, NoteCourte } from '@/modules/ecole/etablissements/components/Bases'
import { resumeFilieres, type EcoleResumee } from '@/modules/ecole/etablissements/schoolListing'
import { demoDate } from '@/shared/utils/dates'

/** Le logo d'une école : son image, sinon ses initiales sur fond bleu pâle. */
export function LogoEcole({ src, nom, alt, className }: { src?: string; nom: string; /** Texte de remplacement (décoratif s'il est absent). */ alt?: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt ?? ''} className={cn('bg-card object-cover', className)} />
  ) : (
    <span role={alt ? 'img' : undefined} aria-label={alt} aria-hidden={alt ? undefined : true} className={cn('grid place-items-center bg-primary-tint font-extrabold text-primary-strong', className)}>
      {initials(nom)}
    </span>
  )
}

/**
 * La vignette d'une école (page École, listes, auto-écoles) : photo, cœur des
 * favoris, logo, nom, lieu, « Établissement vérifié », note, filières, puis
 * le nombre de formations et la rentrée (ou les permis et l'année de création).
 * Toute la carte mène à la fiche.
 */
export function VignetteEcole({ ecole: e }: { ecole: EcoleResumee }) {
  const { t } = useTranslation('schools')
  const auto = e.genre === 'auto'
  const rentree = /^chaque/i.test(e.rentree) ? t('vignette.rentreeChaqueMois') : t('vignette.rentreeLe', { date: demoDate(e.rentree) })
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-card-hover max-sm:h-[330px] motion-reduce:transition-none">
      <img src={e.image} alt="" className="h-[110px] w-full bg-border object-cover" />
      <CoeurFavori id={e.id} kind={e.favori} className="absolute top-2 right-2 z-10" />
      <LogoEcole src={e.logo} nom={e.nom} className="-mt-7 ml-3.5 size-14 rounded-md border-2 border-card text-base shadow-raised" />
      <div className="flex flex-1 flex-col gap-1 px-3.5 pt-2 pb-3.5">
        <h3 className="text-ui leading-[1.3] font-bold max-sm:line-clamp-2">
          {/* Le lien couvre toute la carte ; le cœur reste au-dessus. */}
          <Lien to={e.href} className="text-foreground no-underline group-hover:text-primary group-hover:underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring">
            {e.nom}
          </Lien>
        </h3>
        <span className="text-meta text-muted-foreground">
          {e.ville}, {e.quartier}
        </span>
        {e.verifie && <MentionVerifie />}
        <NoteCourte note={e.note} nbAvis={e.nbAvis} className="text-meta" />
        {!auto && <span className="text-meta text-muted-foreground max-sm:truncate">{resumeFilieres(e.filieres).join(' · ')}</span>}
        <span className="mt-auto border-t border-secondary pt-2 text-meta text-muted-foreground">
          <b className="text-foreground">{auto ? t('vignette.permis', { codes: e.permis.join(', ') }) : t('vignette.formations', { count: e.formations.length })}</b>
          {' · '}
          {auto ? t('vignette.depuis', { annee: e.creation }) : rentree}
        </span>
      </div>
    </article>
  )
}

/** La grille des vignettes : 4 colonnes sur ordinateur, une seule sur téléphone. */
export function GrilleVignettes({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-2.5 px-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:px-0 lg:grid-cols-4', className)}>{children}</div>
}

/** Squelette d'une grille de vignettes (même forme). */
export function SqueletteVignettes({ nombre = 4 }: { nombre?: number }) {
  return (
    <GrilleVignettes>
      {Array.from({ length: nombre }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border bg-card max-sm:h-[330px]">
          <Skeleton className="h-[110px] w-full rounded-none" />
          <Skeleton className="-mt-7 ml-3.5 size-14 rounded-md border-2 border-card bg-border" />
          <div className="flex flex-col gap-2 px-3.5 pt-2 pb-3.5">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="mt-3 h-3 w-2/3" />
          </div>
        </div>
      ))}
    </GrilleVignettes>
  )
}

/** Squelette d'une page de liste : en-tête puis vignettes. */
export function SquelettePageListe() {
  return (
    <SkeletonZone className="gap-3">
      <div className="flex flex-col gap-3 border-y border-border bg-card px-4 py-4 sm:rounded-lg sm:border">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <SqueletteVignettes />
    </SkeletonZone>
  )
}
