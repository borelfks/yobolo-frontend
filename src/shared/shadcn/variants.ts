import { cva } from 'class-variance-authority'

// Variantes des composants shadcn, à part : un fichier de composant n'exporte que des composants.

/**
 * Le bouton du canevas : une pilule.
 * - `default` (« primaire ») : bleu plein ;
 * - `secondary` (« second ») : bordé de bleu ;
 * - `outline` (« neutre ») : bordé de gris, fonce au survol ;
 * - `destructive` (« danger ») : bordé de rouge ; `destructive-solid` : rouge plein ;
 * - `ghost` : sans fond, gris clair au survol (« retour », icônes) ;
 * - `link` : lien bleu en gras ; `link-muted` : lien gris qui devient bleu.
 * Tailles : `default` 40 px, `sm` 32 px (puces, « Suivre »), `md` 36 px, `lg` 44 px (recherche),
 * `icon` 40 px rond, `icon-sm` 36 px.
 */
export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-bold whitespace-nowrap no-underline transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'border border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover',
        secondary: 'border border-primary bg-card text-primary hover:bg-primary-soft',
        outline: 'border border-muted-foreground bg-card text-muted-foreground hover:border-foreground hover:bg-accent hover:text-foreground',
        destructive: 'border border-destructive bg-card text-destructive hover:bg-destructive-soft',
        'destructive-solid': 'border border-destructive bg-destructive text-white hover:border-destructive-hover hover:bg-destructive-hover',
        ghost: 'border border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        link: 'h-auto rounded-none border-0 bg-transparent p-0 text-primary hover:underline',
        'link-muted': 'h-auto rounded-none border-0 bg-transparent p-0 text-muted-foreground hover:text-primary hover:underline',
      },
      size: {
        default: 'h-10 px-[18px] text-ui',
        sm: 'h-8 px-3.5 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-[22px] text-ui',
        icon: 'size-10 p-0',
        'icon-sm': 'size-9 p-0',
      },
    },
    compoundVariants: [
      { variant: 'default', size: 'default', className: 'px-5' },
      { variant: ['link', 'link-muted'], className: 'h-auto px-0 text-sm' },
    ],
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

/** Le badge du canevas : pilule de 24 px, texte 12 px en gras, fond pâle et texte foncé de la même teinte. */
export const badgeVariants = cva(
  'inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-bold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5',
  {
    variants: {
      variant: {
        blue: 'bg-primary-tint text-primary-strong',
        green: 'bg-success-soft text-success',
        gray: 'bg-secondary text-foreground-soft',
        amber: 'bg-warning-soft text-warning-strong',
        red: 'bg-destructive-soft text-destructive-hover',
        violet: 'bg-tone-violet-soft text-tone-violet',
        solid: 'bg-primary text-primary-foreground',
        'solid-green': 'bg-success text-white',
        outline: 'border border-border bg-card text-foreground-soft',
      },
    },
    defaultVariants: { variant: 'blue' },
  },
)

/** La puce du canevas (filtre, choix) : pilule de 32 px, active en vert. */
export const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full text-meta font-semibold whitespace-nowrap text-foreground-soft transition-colors outline-none hover:bg-accent data-[state=on]:border-success data-[state=on]:bg-success data-[state=on]:text-white focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-transparent",
        outline:
          "border border-border-strong bg-card",
      },
      size: {
        default: "h-8 px-3.5",
        sm: "h-8 px-3",
        lg: "h-9 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
