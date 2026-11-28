import type { ReactNode } from 'react'
import { Lock, RefreshCw, SearchX, TriangleAlert, WifiOff, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/shadcn/button'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

type TypeMessage = '404' | 'erreur' | 'horsligne' | 'acces'

const ICONES: Record<Exclude<TypeMessage, '404'>, { icone: LucideIcon; ton: string }> = {
  erreur: { icone: TriangleAlert, ton: 'bg-destructive-soft text-destructive' },
  horsligne: { icone: WifiOff, ton: 'bg-secondary text-muted-foreground' },
  acces: { icone: Lock, ton: 'bg-primary-soft text-primary' },
}

/**
 * La page « message » du canevas (planches Page introuvable, Une erreur est
 * survenue, Pas de connexion internet) : centrée, sans carte, icône ronde de
 * 64 px (ou « 404 » en grand), titre, texte, boutons. `acces` : accès refusé.
 */
export function MessagePage({ type, className }: { type: TypeMessage; className?: string }) {
  const { t } = useTranslation()
  const recharger = () => window.location.reload()
  const textes = {
    '404': { titre: t('errors.notFound.title'), texte: t('errors.notFound.text') },
    erreur: { titre: t('errors.generic.title'), texte: t('errors.generic.text') },
    horsligne: { titre: t('errors.offline.title'), texte: t('errors.offline.text') },
    acces: { titre: t('errors.forbidden.title'), texte: t('errors.forbidden.text') },
  }[type]
  const accueil = (
    <Button asChild variant={type === '404' || type === 'acces' ? 'default' : 'secondary'}>
      <a href={ROUTES.home}>{t('errors.backHome')}</a>
    </Button>
  )
  return (
    <main className={cn('flex flex-1 items-center justify-center px-4 py-10 sm:py-16', className)}>
      <section className="flex w-full max-w-[480px] flex-col items-center gap-2.5 text-center">
        {type === '404' ? (
          <p className="text-chiffre-xl leading-none font-extrabold tracking-[-0.03em] text-primary">404</p>
        ) : (
          <IconeRonde {...ICONES[type]} />
        )}
        <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-foreground sm:text-titre">{textes.titre}</h1>
        <p className="text-ui leading-relaxed text-muted-foreground">{textes.texte}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2.5">
          {type === 'erreur' && <Button onClick={recharger}>{t('errors.reload')}</Button>}
          {type === 'horsligne' ? <Button onClick={recharger}>{t('errors.retry')}</Button> : accueil}
        </div>
      </section>
    </main>
  )
}

function IconeRonde({ icone: Icone, ton }: { icone: LucideIcon; ton: string }) {
  return (
    <span className={cn('grid size-16 place-items-center rounded-full', ton)}>
      <Icone className="size-7" aria-hidden />
    </span>
  )
}

/** Liste ou recherche sans résultat : pastille, titre, texte, action (ex. « Réinitialiser les filtres »). */
export function EmptyState({
  icone: Icone = SearchX,
  titre,
  texte,
  action,
  className,
}: {
  icone?: LucideIcon
  titre: string
  texte?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-6 py-10 text-center', className)}>
      <span className="mb-1 grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icone className="size-6" aria-hidden />
      </span>
      <p className="text-base font-bold text-foreground">{titre}</p>
      {texte && <p className="max-w-prose text-sm text-muted-foreground">{texte}</p>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

/** Un bloc de données n'a pas pu se charger : message et « Réessayer », sans casser le reste de la page. */
export function ErrorState({ onRetry, titre, texte, className }: { onRetry?: () => void; titre?: string; texte?: string; className?: string }) {
  const { t } = useTranslation()
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-2 rounded-lg border border-destructive-line bg-destructive-wash px-6 py-8 text-center', className)}>
      <span className="mb-1 grid size-12 place-items-center rounded-full bg-destructive-soft text-destructive">
        <TriangleAlert className="size-6" aria-hidden />
      </span>
      <p className="text-base font-bold text-foreground">{titre ?? t('errors.load.title')}</p>
      <p className="max-w-prose text-sm text-muted-foreground">{texte ?? t('errors.load.text')}</p>
      {onRetry && (
        <Button variant="secondary" size="md" className="mt-2" onClick={onRetry}>
          <RefreshCw />
          {t('errors.retry')}
        </Button>
      )}
    </div>
  )
}
