import type { ReactNode } from 'react'
import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { cn } from '@/shared/utils/cn'

/** Durée d'un message : courte (3 s), le temps de lire une phrase. */
const DUREE = 3000

/** L'icône d'un message, dans une pastille de sa couleur. */
function Pastille({ className, children }: { className: string; children: ReactNode }) {
  return <span className={cn('grid size-8 shrink-0 place-items-center rounded-full [&_svg]:size-[18px]', className)}>{children}</span>
}

/**
 * Les messages éphémères (bibliothèque sonner), dans le style des cartes du
 * canevas : carte blanche bordée et arrondie, ombre « floating », icône dans
 * une pastille de couleur (vert, rouge, ambre, bleu), titre en gras, croix à
 * droite. En haut à droite, sous la barre du haut (en haut sur téléphone).
 * Ils restent 3 s (le décompte s'arrête au survol) et se ferment avec la
 * croix ou d'un glissement. Appeler `toast.success(…)`, `toast.error(…)`,
 * `toast.warning(…)`, `toast(…)` ou `toast.promise(…)`.
 */
function Toaster(props: ToasterProps) {
  const { t } = useTranslation()
  return (
    <Sonner
      position="top-right"
      offset={{ top: 80, right: 24 }}
      mobileOffset={{ top: 64, left: 12, right: 12 }}
      gap={8}
      visibleToasts={3}
      duration={DUREE}
      closeButton
      icons={{
        success: (
          <Pastille className="bg-success-soft text-success">
            <CircleCheck />
          </Pastille>
        ),
        info: (
          <Pastille className="bg-primary-soft text-primary">
            <Info />
          </Pastille>
        ),
        warning: (
          <Pastille className="bg-warning-soft text-warning-strong">
            <TriangleAlert />
          </Pastille>
        ),
        error: (
          <Pastille className="bg-destructive-soft text-destructive">
            <OctagonX />
          </Pastille>
        ),
        loading: (
          <Pastille className="bg-primary-soft text-primary">
            <Loader2 className="animate-spin motion-reduce:animate-none" />
          </Pastille>
        ),
      }}
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: t('toast.close'),
        classNames: {
          toast: 'group/toast relative flex w-full items-center gap-3 rounded-lg border border-border bg-card py-3 pr-11 pl-3 font-sans text-foreground shadow-floating sm:w-[var(--width)]',
          error: 'border-destructive-line',
          icon: 'flex size-8 shrink-0 items-center justify-center',
          content: 'flex min-w-0 flex-1 flex-col gap-0.5',
          title: 'text-sm leading-snug font-bold text-foreground',
          description: 'text-meta text-muted-foreground',
          closeButton:
            'absolute top-1/2 right-2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none [&_svg]:size-4',
          actionButton: 'h-8 shrink-0 rounded-full bg-primary px-3 text-meta font-bold text-primary-foreground hover:bg-primary-hover',
          cancelButton: 'h-8 shrink-0 rounded-full px-3 text-meta font-bold text-muted-foreground hover:bg-accent',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
