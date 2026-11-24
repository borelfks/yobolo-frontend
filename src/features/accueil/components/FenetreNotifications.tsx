import { Bell, CalendarCheck, FileCheck2, Info, MessageSquare, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import type { NotificationCompte } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

const ICONES: Record<NotificationCompte['type'], { icone: LucideIcon; ton: string }> = {
  preRegistration: { icone: FileCheck2, ton: 'bg-emerald-100 text-emerald-600' },
  session: { icone: CalendarCheck, ton: 'bg-brand-100 text-brand-600' },
  message: { icone: MessageSquare, ton: 'bg-violet-100 text-violet-600' },
  review: { icone: Star, ton: 'bg-amber-100 text-amber-700' },
  info: { icone: Info, ton: 'bg-slate-100 text-slate-600' },
}

/**
 * « Mes notifications » : celles du compte (table `notificationsCompte`), les
 * non lues en tête de couleur. En toucher une la marque comme lue ; « Tout
 * marquer comme lu » les marque toutes.
 */
export function FenetreNotifications({ onFermer }: { onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const notifications = useNotificationsCompte(account?.id)
  const nonLues = notifications.filter((n) => !n.lu)

  const lire = (id: string) => void data.update('notificationsCompte', id, { lu: true })
  const toutLire = async () => {
    await Promise.all(nonLues.map((n) => data.update('notificationsCompte', n.id, { lu: true })))
    toast.success(t('notifications.toutesLues'))
  }

  return createPortal(
    <Modal
      open
      onClose={onFermer}
      icon={<Bell className="mt-1 size-5 text-brand-600" aria-hidden="true" />}
      title={t('notifications.titre')}
      footer={
        nonLues.length > 0 ? (
          <Button variant="neutral" onClick={() => void toutLire()}>
            {t('notifications.toutLire')}
          </Button>
        ) : undefined
      }
    >
      <p className="-mt-2 text-sm text-muted">{t('notifications.resume', { count: nonLues.length })}</p>
      {notifications.length === 0 ? (
        <p className="mt-4 rounded-xl bg-page p-4 text-sm text-muted">{t('notifications.aucune')}</p>
      ) : (
        <ul className="mt-4 flex max-h-[55dvh] flex-col gap-2 overflow-y-auto">
          {notifications.map((n) => {
            const { icone: Icone, ton } = ICONES[n.type]
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => lire(n.id)}
                  aria-label={n.lu ? undefined : t('notifications.marquerLue', { titre: n.titre })}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                    n.lu ? 'border-line bg-white hover:bg-page' : 'border-brand-200 bg-brand-50 hover:bg-brand-100',
                  )}
                >
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', ton)}>
                    <Icone className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="flex items-center gap-2 font-semibold text-navy-900">
                      {n.titre}
                      {!n.lu && <span className="size-2 rounded-full bg-rose-500" aria-hidden="true" />}
                    </span>
                    <span className="block text-muted">{n.texte}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {n.quand}
                      {!n.lu && ` · ${t('notifications.nonLue')}`}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Modal>,
    document.body,
  )
}
