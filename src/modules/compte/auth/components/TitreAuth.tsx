import { cn } from '@/shared/utils/cn'

const TAILLES = {
  connexion: 'text-[30px] lg:text-4xl',
  inscription: 'text-[26px] sm:text-[32px]',
  motDePasse: 'text-[26px] sm:text-[30px]',
} as const

/**
 * Le titre d'un écran de connexion, d'inscription ou de mot de passe oublié
 * (canevas) : surtitre bleu en capitales facultatif, titre (800), texte d'appoint.
 */
export function TitreAuth({ titre, texte, surtitre, taille = 'connexion' }: { titre: string; texte: string; surtitre?: string; taille?: keyof typeof TAILLES }) {
  return (
    <div className={cn('flex flex-col', taille === 'connexion' ? 'gap-2' : 'gap-1.5')}>
      {surtitre && <span className="text-meta font-extrabold tracking-[0.06em] text-primary uppercase">{surtitre}</span>}
      <h1 className={cn('leading-[1.15] font-extrabold tracking-[-0.02em] text-foreground', TAILLES[taille])}>{titre}</h1>
      <p className="text-ui leading-relaxed text-muted-foreground">{texte}</p>
    </div>
  )
}
