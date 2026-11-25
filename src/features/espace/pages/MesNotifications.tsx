import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Bell, CalendarCheck, CheckCheck, FileCheck2, Mail, MailOpen, MessageSquare, Settings, Sparkles, Star, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { data, dateDeCreation, POUR_TOUS } from '@/data'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { Card } from '@/shared/components/ui/Card'
import { MenuActions } from '@/shared/components/ui/MenuActions'
import type { NotificationCompte, SujetNotification } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Le rond de chaque sujet, avec sa petite pastille (comme l'avatar et le badge de Facebook). */
const APPARENCE: Record<SujetNotification, { icone: LucideIcon; rond: string; pastille: string }> = {
  preRegistration: { icone: FileCheck2, rond: 'bg-emerald-100 text-emerald-600', pastille: 'bg-emerald-600' },
  session: { icone: CalendarCheck, rond: 'bg-brand-100 text-brand-600', pastille: 'bg-brand-600' },
  review: { icone: Star, rond: 'bg-amber-100 text-amber-600', pastille: 'bg-amber-500' },
  message: { icone: MessageSquare, rond: 'bg-violet-100 text-violet-600', pastille: 'bg-violet-600' },
  info: { icone: Sparkles, rond: 'bg-slate-100 text-slate-600', pastille: 'bg-navy-800' },
}

/** La page qu'ouvre une notification : la sienne, sinon celle de son sujet. */
function versDe(n: NotificationCompte) {
  if (n.vers) return n.vers
  // Mon espace masqué pour la personne physique (demande du porteur du projet, 2026-11-25) : plus de page par défaut dans Mon espace.
  return undefined
}

/** Les plus récentes d'abord : celles créées par l'application, puis celles de départ. */
const rang = (n: NotificationCompte) => dateDeCreation(n.id)?.getTime() ?? 0

/**
 * « Notifications » : une page à elles, à la manière de Facebook (demande du
 * porteur du projet, 2026-11-25). « Toutes » / « Non lues » ; « Nouvelles »
 * (non lues, point bleu, heure en bleu) puis « Plus tôt » ; un clic ouvre la
 * notification et la marque lue ; « … » : marquer lue / non lue, supprimer.
 * Le « … » du titre : tout marquer comme lu, paramètres des notifications.
 */
export function MesNotifications() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const toutes = useNotificationsCompte(account?.id).toSorted((a, b) => rang(b) - rang(a))
  const [seulementNonLues, setSeulementNonLues] = useState(false)
  const navigate = useNavigate()

  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />

  const nonLues = toutes.filter((n) => !n.lu)
  const groupes = seulementNonLues
    ? [{ cle: 'nouvelles' as const, items: nonLues }]
    : [
        { cle: 'nouvelles' as const, items: nonLues },
        { cle: 'plusTot' as const, items: toutes.filter((n) => n.lu) },
      ].filter((g) => g.items.length > 0)

  const marquer = (n: NotificationCompte, lu: boolean) => void data.update('notificationsCompte', n.id, { lu })
  const toutLire = async () => {
    await Promise.all(nonLues.map((n) => data.update('notificationsCompte', n.id, { lu: true })))
    toast.success(t('notifications.toutesLues'))
  }
  const supprimer = async (n: NotificationCompte) => {
    await data.remove('notificationsCompte', n.id)
    toast.success(t('notifications.supprimee'))
  }
  const vide = seulementNonLues ? nonLues.length === 0 : toutes.length === 0

  return (
    <div className="mx-auto max-w-[720px] space-y-3 px-5 py-4">
      <Breadcrumb items={[{ label: t('crumbs.accueil'), to: account.home }, { label: t('notifications.titre') }]} className="-mt-1" />
      <Card className="p-2 sm:p-3">
        <div className="flex items-center justify-between gap-3 px-2 pt-1">
          <h1 className="text-[24px] font-bold text-navy-900">{t('notifications.titre')}</h1>
          <MenuActions
            label={t('notifications.options')}
            className="rounded-full bg-transparent hover:bg-page"
            actions={[
              { label: t('notifications.toutLire'), icon: <CheckCheck />, hidden: nonLues.length === 0, onClick: toutLire },
              { label: t('notifications.preferences'), icon: <Settings />, onClick: () => navigate(ROUTES.parametres('notifications')) },
            ]}
          />
        </div>

        <div role="tablist" aria-label={t('notifications.titre')} className="mt-2 flex gap-2 px-2">
          {[false, true].map((nl) => (
            <button
              key={String(nl)}
              type="button"
              role="tab"
              aria-selected={seulementNonLues === nl}
              onClick={() => setSeulementNonLues(nl)}
              className={cn(
                'h-9 rounded-full px-3.5 text-[15px] font-semibold transition-colors',
                seulementNonLues === nl ? 'bg-brand-50 text-brand-700' : 'text-navy-900 hover:bg-page',
              )}
            >
              {nl ? t('notifications.filtres.nonLues') : t('notifications.filtres.toutes')}
            </button>
          ))}
        </div>

        {vide ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Bell className="size-7" aria-hidden="true" />
            </span>
            <p className="font-semibold text-navy-900">{seulementNonLues ? t('notifications.aucuneNonLue') : t('notifications.aucune')}</p>
          </div>
        ) : (
          groupes.map((g) => (
            <section key={g.cle} aria-labelledby={`groupe-${g.cle}`} className="mt-3">
              <h2 id={`groupe-${g.cle}`} className="px-2 pb-1 text-[17px] font-bold text-navy-900">
                {t(`notifications.groupes.${g.cle}`)}
              </h2>
              <ul>
                {g.items.map((n) => (
                  <LigneNotification key={n.id} n={n} marquer={marquer} supprimer={supprimer} />
                ))}
              </ul>
            </section>
          ))
        )}
      </Card>
    </div>
  )
}

function LigneNotification({
  n,
  marquer,
  supprimer,
}: {
  n: NotificationCompte
  marquer: (n: NotificationCompte, lu: boolean) => void
  supprimer: (n: NotificationCompte) => Promise<void>
}) {
  const { t } = useTranslation('espace')
  const { icone: Icone, rond, pastille } = APPARENCE[n.type]
  const vers = versDe(n)
  const corps = (
    <>
      <span className="relative shrink-0">
        <span className={cn('grid size-14 place-items-center rounded-full', rond)}>
          <Icone className="size-6" aria-hidden="true" />
        </span>
        <span className={cn('absolute -right-0.5 -bottom-0.5 grid size-6 place-items-center rounded-full text-white ring-2 ring-white', pastille)}>
          <Icone className="size-3.5" aria-hidden="true" />
        </span>
      </span>
      <span className="min-w-0 flex-1 pr-14 text-[15px] leading-snug">
        <span className="line-clamp-3 text-navy-900">
          <b className="font-semibold">{n.titre}</b> · {n.texte}
        </span>
        <span className={cn('mt-0.5 block text-[13px]', n.lu ? 'text-muted' : 'font-semibold text-brand-600')}>{n.quand}</span>
      </span>
    </>
  )
  const classes = 'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-page'
  return (
    <li className="group relative">
      {vers ? (
        <Link to={vers} onClick={() => !n.lu && marquer(n, true)} className={classes}>
          {corps}
        </Link>
      ) : (
        <button type="button" onClick={() => !n.lu && marquer(n, true)} className={classes}>
          {corps}
        </button>
      )}
      {!n.lu && <span className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 rounded-full bg-brand-600" aria-label={t('notifications.nonLue')} />}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <MenuActions
          label={t('notifications.actions')}
          className="rounded-full bg-white shadow ring-1 ring-line hover:bg-page"
          actions={[
            n.lu
              ? { label: t('notifications.marquerNonLue'), icon: <Mail />, onClick: () => marquer(n, false) }
              : { label: t('notifications.marquerLue'), icon: <MailOpen />, onClick: () => marquer(n, true) },
            { label: t('notifications.supprimer'), icon: <Trash2 />, danger: true, hidden: n.compteId === POUR_TOUS, onClick: () => supprimer(n) },
          ]}
        />
      </div>
    </li>
  )
}
