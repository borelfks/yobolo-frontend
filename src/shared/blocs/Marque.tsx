import { cn } from '@/shared/utils/cn'

/**
 * Le symbole YIBOLO du canevas : carré arrondi, « Y » en coche. Bleu à « Y »
 * blanc ; `clair` (pied de page) : carré blanc à « Y » bleu.
 */
export function SymboleYibolo({ taille = 38, clair = false, className }: { taille?: number; clair?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={taille} height={taille} aria-hidden="true" className={cn('flex-none', className)}>
      <rect width="64" height="64" rx={clair ? 16 : 14} className={clair ? 'fill-card' : 'fill-primary'} />
      <path
        d="M16.5 20.5 30.5 32.5 47.5 16.5M30.5 32.5v15"
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clair ? 'stroke-primary' : 'stroke-primary-foreground'}
      />
    </svg>
  )
}

/**
 * Symbole et nom « YIBOLO » (barre du haut, connexion). `clair` : sur le pied
 * de page bleu nuit (nom en blanc), avec la `devise` dessous.
 * `classeSymbole` : taille du symbole selon l'écran (ex. 32 px sur téléphone).
 */
export function MarqueYibolo({
  taille = 38,
  clair = false,
  devise,
  classeSymbole,
  classeNom,
  className,
}: {
  taille?: number
  clair?: boolean
  devise?: string
  classeSymbole?: string
  classeNom?: string
  className?: string
}) {
  return (
    <span className={cn('flex items-center text-foreground', clair ? 'gap-3' : 'gap-2', className)}>
      <SymboleYibolo taille={taille} clair={clair} className={classeSymbole} />
      <span className="flex flex-col gap-0.5">
        <span className={cn('font-extrabold tracking-[0.02em]', taille < 36 ? 'text-lg' : 'text-xl', clair && 'text-white', classeNom)}>YIBOLO</span>
        {devise && <span className={cn('text-meta', clair ? 'text-footer-foreground' : 'text-muted-foreground')}>{devise}</span>}
      </span>
    </span>
  )
}
