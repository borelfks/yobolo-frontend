import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Bell, CalendarCheck, ChevronDown, FileCheck2, Heart, LayoutDashboard, LogOut, MessageSquare, Repeat, Star } from 'lucide-react'
import { Avatar } from '@/components/ui/Feedback'
import { useSession } from '@/hooks/useSession'
import { cn } from '@/lib/utils'

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

const notifications = [
  { icon: FileCheck2, tone: 'bg-emerald-100 text-emerald-600', title: 'Préinscription reçue', text: 'L’IPC a bien reçu votre dossier BTS Comptabilité.', when: 'Il y a 2 h' },
  { icon: CalendarCheck, tone: 'bg-brand-100 text-brand-600', title: 'Session confirmée', text: 'Permis B – début le 15 nov. 2026.', when: 'Hier' },
  { icon: MessageSquare, tone: 'bg-violet-100 text-violet-600', title: 'Nouveau message', text: 'Me Alain Tchana vous a répondu.', when: 'Il y a 2 jours' },
]

export function NotificationsBell({ count = 3, light, href }: { count?: number; light?: boolean; href?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useOutside(() => setOpen(false))
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications (${count} non lues)`}
        onClick={() => setOpen(!open)}
        className={cn('relative grid size-10 place-items-center rounded-full', light ? 'text-white hover:bg-white/10' : 'text-navy-800 hover:bg-brand-50')}
      >
        <Bell className="size-5" />
        {count > 0 && <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{count}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-line bg-white p-2 shadow-xl">
          <p className="px-3 py-2 text-sm font-bold text-navy-900">Notifications</p>
          {notifications.map((n) => (
            <div key={n.title} className="flex gap-3 rounded-xl p-3 hover:bg-slate-50">
              <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', n.tone)}>
                <n.icon className="size-4" />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-navy-900">{n.title}</p>
                <p className="text-muted">{n.text}</p>
                <p className="mt-0.5 text-xs text-slate-400">{n.when}</p>
              </div>
            </div>
          ))}
          {href && (
            <Link to={href} onClick={() => setOpen(false)} className="block rounded-xl p-2 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50">
              Voir toutes les notifications
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export function UserMenu() {
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
          <span className="block text-sm font-bold text-navy-900">{account.name}</span>
          <span className="block text-xs text-muted">{account.subtitle}</span>
        </span>
        <ChevronDown className="size-4 text-muted" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-line bg-white p-2 shadow-xl">
          {account.role !== 'utilisateur' && (
            <Link to={account.home} onClick={close} className={item}>
              <LayoutDashboard />
              Mon espace professionnel
            </Link>
          )}
          <Link to="/favoris" onClick={close} className={item}>
            <Heart />
            Mes favoris
          </Link>
          {account.role === 'utilisateur' && (
            <Link to="/ecoles/auto-ecoles/conduite-plus/avis/nouveau" onClick={close} className={item}>
              <Star />
              Donner un avis
            </Link>
          )}
          <Link to="/connexion" onClick={close} className={item}>
            <Repeat />
            Changer de compte de démo
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut()
              close()
              navigate('/connexion')
            }}
            className={cn(item, 'w-full text-rose-600 [&_svg]:text-rose-500')}
          >
            <LogOut />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}
