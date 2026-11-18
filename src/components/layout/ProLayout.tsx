import { Suspense, useState, type ComponentType } from 'react'
import { Link, Navigate, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { toast } from 'sonner'
import {
  BadgeCheck,
  BarChart3,
  Building2,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  Headphones,
  Home,
  Layers,
  Menu,
  Settings,
  X,
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { NotificationsBell, UserMenu } from '@/components/layout/UserMenu'
import { PageLoader } from '@/components/layout/PageLoader'
import { Img } from '@/components/ui/Feedback'
import { useMonEcole, useSession } from '@/hooks/useSession'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
  children?: { label: string; to: string }[]
}

const nav: NavItem[] = [
  { label: 'Tableau de bord', to: '/pro/ecole', icon: Home, end: true },
  { label: 'Profil de l’établissement', to: '/pro/ecole/profil', icon: Building2 },
  {
    label: 'Formations',
    to: '/pro/ecole/formations',
    icon: GraduationCap,
    children: [
      { label: 'Gérer les formations', to: '/pro/ecole/formations' },
      { label: 'Créer une formation', to: '/pro/ecole/formations/nouvelle' },
    ],
  },
  {
    label: 'Contenus et informations',
    to: '/pro/ecole/contenus',
    icon: Layers,
    children: [
      { label: 'Contenus & actualités', to: '/pro/ecole/contenus' },
      { label: 'Documents à télécharger', to: '/pro/ecole/contenus/documents' },
      { label: 'FAQ (Questions fréquentes)', to: '/pro/ecole/contenus/faq' },
    ],
  },
  { label: 'Statistiques', to: '/pro/ecole/statistiques', icon: BarChart3 },
  { label: 'Paramètres', to: '/pro/ecole/parametres', icon: Settings },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const { ecole } = useMonEcole()
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto bg-[linear-gradient(180deg,#0f2c7a_0%,#0b2366_45%,#0a1f5c_100%)] px-3 py-5 text-white">
      <Link to="/pro/ecole/profil" onClick={onNavigate} className="flex items-center gap-2.5 px-1">
        <Img src={ecole.id === 'ipc' ? '/maquette/ipc-carte.jpg' : ecole.image} alt="" className="size-[60px] rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-tight font-semibold">{ecole.nom}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
            <BadgeCheck className="size-4 fill-white text-emerald-600" />
            Établissement vérifié
          </span>
        </div>
        <ChevronDown className="size-4 text-white/80" />
      </Link>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const inSection = item.children ? pathname.startsWith(item.to) : false
          const open = !!item.children && (inSection || item.to === '/pro/ecole/formations' || pathname === '/pro/ecole')
          return (
            <div key={item.label}>
              <NavLink
                to={item.to}
                end={item.end || !!item.children}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[14.5px] font-medium whitespace-nowrap transition-colors',
                    isActive || (item.children && inSection) ? 'bg-brand-600 font-semibold shadow-lg shadow-brand-900/40' : 'text-white hover:bg-white/10',
                  )
                }
              >
                <item.icon className="size-[22px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.children && <ChevronDown className="size-4" />}
              </NavLink>
              {item.children && open && (
                <ul className="mt-1 mb-1.5 ml-7 space-y-0.5">
                  {item.children.map((c) => (
                    <li key={c.to}>
                      <NavLink
                        to={c.to}
                        end
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn('flex items-center gap-2 rounded-md px-2 py-1 text-[13.5px]', isActive && inSection ? 'bg-[#e6eeff] font-semibold text-navy-900' : 'text-white/90 hover:text-white')
                        }
                      >
                        <span className="size-1 rounded-full bg-current" />
                        {c.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
      <button
        type="button"
        onClick={() => toast('Assistance YIBOLO', { description: 'Un conseiller vous répond du lundi au samedi, de 8 h à 18 h.' })}
        className="mx-2 mt-auto flex h-12 items-center justify-center gap-2.5 rounded-full border border-white/50 text-[15px] font-semibold hover:bg-white/10"
      >
        <Headphones className="size-6" />
        Assistance YIBOLO
      </button>
    </div>
  )
}

export function ProLayout() {
  const [open, setOpen] = useState(false)
  const { ecole } = useMonEcole()
  const { account } = useSession()
  // Un compte = un espace : seul un compte école entre ici.
  if (!account?.ecoleId) return <Navigate to="/connexion?espace=ecole" replace />
  return (
    <div className="min-h-dvh bg-page">
      <ScrollRestoration />
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/95 pr-4 backdrop-blur">
        <button type="button" aria-label="Menu" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-brand-50 lg:hidden">
          <Menu className="size-5" />
        </button>
        <div className="w-[250px] shrink-0 pl-4 max-sm:w-auto [&_svg]:size-9">
          <Logo to="/pro/ecole" />
        </div>
        <div className="ml-8 hidden items-center gap-3 rounded-full bg-[#eaf0fb] px-5 py-2 text-navy-800 md:flex">
          <Building2 className="size-7 text-brand-600" />
          <span className="text-[17px] font-bold">Espace professionnel – {ecole.type}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <NotificationsBell href="/pro/ecole/parametres/notifications" />
          <Link to="/pro/ecole/parametres/a-propos" aria-label="Aide" className="grid size-10 place-items-center rounded-full text-navy-800 hover:bg-brand-50">
            <CircleHelp className="size-5" />
          </Link>
          <span className="mx-1 hidden h-8 w-px bg-line sm:block" />
          <UserMenu />
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[250px] shrink-0 lg:block">
          <Sidebar />
        </aside>
        {open && (
          <div className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" onClick={() => setOpen(false)}>
            <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
              <button type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} className="absolute top-4 left-74 grid size-10 place-items-center rounded-full bg-white">
                <X className="size-5" />
              </button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1 px-4 py-3 md:px-5">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
