import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Bell, CalendarCheck, FileCheck2, GraduationCap, MessageCircle, type LucideIcon } from 'lucide-react'
import { data } from '@/data'
import { Button } from '@/shared/shadcn/button'
import type { NotificationCompte, SujetNotification } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

/** L'icône de chaque sujet sur son rond de couleur (canevas : réponse en violet, école en bleu, nouveauté en ambre). */
const APPARENCE: Record<SujetNotification, { icone: LucideIcon; rond: string }> = {
  message: { icone: MessageCircle, rond: 'bg-tone-violet-soft text-tone-violet' },
  review: { icone: GraduationCap, rond: 'bg-primary-tint text-primary' },
  info: { icone: Bell, rond: 'bg-warning-soft text-warning-strong' },
  preRegistration: { icone: FileCheck2, rond: 'bg-success-soft text-success' },
  session: { icone: CalendarCheck, rond: 'bg-primary-tint text-primary' },
}

/**
 * Une notification (canevas « Notifications ») : rond de son sujet, titre,
 * texte, date ; non lue, sur fond bleu pâle avec la date en bleu et un point.
 * Un clic la marque lue et ouvre la page qu'elle annonce, s'il y en a une.
 */
export function LigneNotification({ notification: n }: { notification: NotificationCompte }) {
  const { t } = useTranslation('espace')
  const navigate = useNavigate()
  const { icone: Icone, rond } = APPARENCE[n.type]
  const ouvrir = async () => {
    if (!n.lu) await data.update('notificationsCompte', n.id, { lu: true })
    if (n.vers) void navigate({ href: n.vers })
  }
  return (
    <article className={cn('-mx-3 flex items-start gap-3 border-t border-border px-3 py-3.5', !n.lu && 'bg-primary-wash')}>
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-full', rond)}>
        <Icone className="size-[22px]" aria-hidden />
      </span>
      <Button
        variant="ghost"
        onClick={() => void ouvrir()}
        className="h-auto min-w-0 flex-1 flex-col items-start gap-[3px] rounded-none p-0 text-left font-normal whitespace-normal text-foreground hover:bg-transparent hover:text-foreground"
      >
        <b className="text-ui">{n.titre}</b>
        <span className="text-sm text-foreground-soft">{n.texte}</span>
        <span className={cn('text-xs font-bold', n.lu ? 'text-subtle-foreground' : 'text-primary')}>{n.quand}</span>
      </Button>
      {!n.lu && <span aria-label={t('notifications.nonLue')} role="img" className="size-2.5 shrink-0 self-center rounded-full bg-primary" />}
    </article>
  )
}
