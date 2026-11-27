import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Lien } from '@/shared/ui/Lien'
import { useTranslation } from 'react-i18next'
import { Bell, CalendarCheck, CheckCircle2, ChevronDown, FileCheck2, FileText, Heart, House, LayoutDashboard, LogOut, MessageSquare, Settings, Star, UserRound, type LucideIcon } from 'lucide-react'
import { Avatar } from '@/shared/ui/Avatar'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { POUR_TOUS, data, useCollectionWhenReady } from '@/data'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

function useOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onOutside])
  return ref
}

/** Icône et couleur de chaque type de notification (le type vient de la base). */
const APPARENCE: Record<string, { icon: LucideIcon; tone: string }> = {
  preRegistration: { icon: FileCheck2, tone: 'bg-emerald-100 text-emerald-600' },
  candidature: { icon: FileCheck2, tone: 'bg-emerald-100 text-emerald-600' },
  session: { icon: CalendarCheck, tone: 'bg-brand-100 text-brand-600' },
  rappel: { icon: CalendarCheck, tone: 'bg-brand-100 text-brand-600' },
  message: { icon: MessageSquare, tone: 'bg-violet-100 text-violet-600' },
  avis: { icon: Star, tone: 'bg-amber-100 text-amber-600' },
  review: { icon: Star, tone: 'bg-amber-100 text-amber-600' },
  document: { icon: FileText, tone: 'bg-sky-100 text-sky-600' },
  validation: { icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-600' },
}
const PAR_DEFAUT = { icon: Bell, tone: 'bg-slate-100 text-slate-600' }

/**
 * La cloche : les notifications du compte connecté, lues dans la base
 * (espace pro : table `notifications` ; utilisateur : `notificationsCompte`).
 * Le nombre affiché est celui des non lues ; un clic marque comme lu.
 */
export function NotificationsBell({ light, href }: { light?: boolean; href?: string }) {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useOutside(() => setOpen(false))
  const pro = useCollectionWhenReady('notifications')
  const perso = useCollectionWhenReady('notificationsCompte')
  const collection = account?.ecoleId ? ('notifications' as const) : ('notificationsCompte' as const)
  const items = account?.ecoleId
    ? pro.filter((n) => !n.etablissementId || n.etablissementId === account.ecoleId).map((n) => ({ id: n.id, type: n.type, titre: n.titre, texte: n.texte, quand: n.date, lu: n.lu }))
    : perso.filter((n) => (n.compteId === account?.id || n.compteId === POUR_TOUS) && n.type !== 'preRegistration' && n.type !== 'session').map((n) => ({ id: n.id, type: n.type, titre: n.titre, texte: n.texte, quand: n.quand, lu: n.lu }))
  const count = items.filter((n) => !n.lu).length
  const lire = (ids: string[]) => Promise.all(ids.map((id) => data.update(collection, id, { lu: true })))
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t('notifications.aria', { count })}
        onClick={() => setOpen(!open)}
        className={cn('relative grid size-10 place-items-center rounded-full', light ? 'text-white hover:bg-white/10' : 'text-navy-800 hover:bg-brand-50')}
      >
        <Bell className="size-5" />
        {count > 0 && <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{count}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-2 shadow-xl max-sm:fixed max-sm:inset-x-3 max-sm:top-[72px] max-sm:right-3 max-sm:mt-0 max-sm:w-auto max-sm:max-w-none">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-bold text-navy-900">{t('notifications.title')}</p>
            {count > 0 && (
              <button type="button" onClick={() => void lire(items.filter((n) => !n.lu).map((n) => n.id))} className="inline-flex min-h-9 items-center rounded-lg px-2 text-xs font-semibold text-brand-600 hover:bg-brand-50">
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.map((n) => {
              const a = APPARENCE[n.type] ?? PAR_DEFAUT
              return (
                <button key={n.id} type="button" onClick={() => void lire([n.id])} className={cn('flex w-full gap-3 rounded-xl p-3 text-left hover:bg-slate-50', !n.lu && 'bg-brand-50/60')}>
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', a.tone)}>
                    <a.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-semibold text-navy-900">{n.titre}</span>
                    <span className="block text-muted-foreground">{n.texte}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{n.quand}</span>
                  </span>
                  {!n.lu && <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-600" aria-label={t('notifications.unread')} />}
                </button>
              )
            })}
            {items.length === 0 && <p className="px-3 py-4 text-center text-sm text-muted-foreground">{t('notifications.empty')}</p>}
          </div>
          {href && (
            <Lien to={href} onClick={() => setOpen(false)} className="block rounded-xl p-2 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50">
              {t('notifications.seeAll')}
            </Lien>
          )}
        </div>
      )}
    </div>
  )
}

export function UserMenu() {
  const { t } = useTranslation('layout')
  const { account, signOut } = useSession()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useOutside(() => setOpen(false))
  if (!account) return null
  const close = () => setOpen(false)
  const item = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-900 hover:bg-brand-50 [&_svg]:size-4 [&_svg]:text-brand-600'
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 hover:bg-brand-50">
        <Avatar src={account.avatar} name={account.name} size={40} />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block max-w-[10rem] truncate text-sm font-bold whitespace-nowrap text-navy-900">{account.name}</span>
          <span className="block text-xs text-muted-foreground">{t(`roles.${account.role}`)}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-line bg-white p-2 shadow-xl">
          {account.role !== 'utilisateur' && (
            <>
              <Lien to={ROUTES.accueil} onClick={close} className={item}>
                <House />
                {t('userMenu.home')}
              </Lien>
              <Lien to={ROUTES.pro.root} onClick={close} className={item}>
                <LayoutDashboard />
                {t('userMenu.proSpace')}
              </Lien>
            </>
          )}
          {account.role === 'utilisateur' && (
            <>
              {/* Mon espace masqué pour la personne physique (demande du porteur du projet, 2026-11-25) :
              <Lien to={ROUTES.espace()} onClick={close} className={item}>
                <LayoutDashboard />
                {t('userMenu.mySpace')}
              </Lien>
              */}
              <Lien to={ROUTES.profil} onClick={close} className={item}>
                <UserRound />
                {t('userMenu.profile')}
              </Lien>
            </>
          )}
          {/* « Mes favoris » : pour les personnes physiques seulement (décision du 2026-11-25). */}
          {account.role === 'utilisateur' && (
            <Lien to={ROUTES.favorites} onClick={close} className={item}>
              <Heart />
              {t('userMenu.favorites')}
            </Lien>
          )}
          <Lien to={account.role === 'utilisateur' ? ROUTES.parametres() : ROUTES.pro.settings()} onClick={close} className={item}>
            <Settings />
            {t('userMenu.settings')}
          </Lien>
          <div className="my-1 border-t border-line" />
          <button
            type="button"
            onClick={() => {
              signOut()
              close()
              navigate({ href: ROUTES.signIn })
            }}
            className={cn(item, 'w-full text-rose-600 [&_svg]:text-rose-500')}
          >
            <LogOut />
            {t('userMenu.signOut')}
          </button>
        </div>
      )}
    </div>
  )
}
