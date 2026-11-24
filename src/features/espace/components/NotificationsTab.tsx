import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Bell, CalendarCheck, CheckCheck, FileCheck2, Info, MessageSquare, Star, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { data, POUR_TOUS } from '@/data'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { FilterPills } from '@/shared/components/ui/Tabs'
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
 * « Notifications » : celles du compte (table `notificationsCompte`), les non
 * lues en couleur. Un clic marque comme lue ; « Tout marquer comme lu » ; une
 * notification propre au compte peut être supprimée.
 */
export function NotificationsTab() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const toutes = useNotificationsCompte(account?.id)
  const nonLues = toutes.filter((n) => !n.lu)
  const [filtre, setFiltre] = useState<'toutes' | 'nonLues'>('toutes')
  const liste = filtre === 'nonLues' ? nonLues : toutes

  const lire = (id: string) => void data.update('notificationsCompte', id, { lu: true })
  const toutLire = async () => {
    await Promise.all(nonLues.map((n) => data.update('notificationsCompte', n.id, { lu: true })))
    toast.success(t('notifications.toutesLues'))
  }
  const supprimer = async (id: string) => {
    await data.remove('notificationsCompte', id)
    toast.success(t('notifications.supprimee'))
  }

  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[19px] font-bold text-navy-900">
          <Bell className="size-5 text-brand-600" aria-hidden="true" />
          {t('notifications.titre')}
        </h2>
        {nonLues.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => void toutLire()}>
            <CheckCheck aria-hidden="true" />
            {t('notifications.toutLire')}
          </Button>
        )}
      </div>
      <FilterPills
        items={[
          { value: 'toutes', label: t('notifications.filtres.toutes', { n: toutes.length }) },
          { value: 'nonLues', label: t('notifications.filtres.nonLues', { n: nonLues.length }) },
        ]}
        value={filtre}
        onChange={(v) => setFiltre(v === 'nonLues' ? 'nonLues' : 'toutes')}
      />
      {liste.length === 0 ? (
        <p className="rounded-xl bg-page p-4 text-sm text-muted">{filtre === 'nonLues' ? t('notifications.toutesLues') : t('notifications.aucune')}</p>
      ) : (
        <ul className="space-y-2">
          {liste.map((n) => {
            const { icone: Icone, ton } = ICONES[n.type]
            return (
              <li key={n.id} className={cn('flex items-start gap-3 rounded-xl border p-3', n.lu ? 'border-line bg-white' : 'border-brand-200 bg-brand-50')}>
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', ton)}>
                  <Icone className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-navy-900">
                    {n.titre}
                    {!n.lu && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">{t('notifications.nonLue')}</span>}
                  </p>
                  <p className="text-navy-900">{n.texte}</p>
                  <p className="mt-0.5 text-xs text-muted">{n.quand}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!n.lu && (
                    <Button variant="ghost" size="icon" aria-label={t('notifications.marquerLue')} title={t('notifications.marquerLue')} onClick={() => lire(n.id)}>
                      <CheckCheck aria-hidden="true" />
                    </Button>
                  )}
                  {n.compteId !== POUR_TOUS && (
                    <Button variant="ghost" size="icon" aria-label={t('notifications.supprimer')} title={t('notifications.supprimer')} onClick={() => void supprimer(n.id)}>
                      <Trash2 aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
