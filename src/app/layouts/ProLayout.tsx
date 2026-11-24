import { useState } from 'react'
import { Link, Navigate, NavLink, ScrollRestoration, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BadgeCheck, Building2, ChevronDown, CircleHelp, Headphones, Menu, X } from 'lucide-react'
import { Logo } from '@/shared/components/ui/Logo'
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher'
import { NotificationsBell, UserMenu } from '@/app/layouts/AccountMenu'
import { proNav } from '@/app/layouts/navConfig'
import { RouteOutlet } from '@/app/routes/RouteOutlet'
import { Img } from '@/shared/components/ui/Img'
import { useMonEcole, useSession } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation('layout')
  const { pathname } = useLocation()
  const { ecole } = useMonEcole()
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto bg-[linear-gradient(180deg,#0f2c7a_0%,#0b2366_45%,#0a1f5c_100%)] px-3 py-5 text-white">
      <Link to={ROUTES.pro.profile()} onClick={onNavigate} className="flex items-center gap-2.5 px-1">
        <Img src={ecole.id === 'ipc' ? '/images/maquette/ipc-carte.jpg' : ecole.image} alt="" className="size-[60px] rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-tight font-semibold">{ecole.nom}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
            <BadgeCheck className="size-4 fill-white text-emerald-600" />
            {t('pro.verified')}
          </span>
        </div>
        <ChevronDown className="size-4 text-white/80" />
      </Link>
      <nav className="flex flex-col gap-1">
        {proNav.map((item) => {
          const inSection = item.children ? pathname.startsWith(item.to) : false
          const open = !!item.children && (inSection || item.to === ROUTES.pro.trainings || pathname === ROUTES.pro.root)
          return (
            <div key={item.labelKey}>
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
                <span className="flex-1">{t(item.labelKey)}</span>
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
                        {t(c.labelKey)}
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
        onClick={() => toast(t('pro.support.title'), { description: t('pro.support.text') })}
        className="mx-2 mt-auto flex h-12 items-center justify-center gap-2.5 rounded-full border border-white/50 text-[15px] font-semibold hover:bg-white/10"
      >
        <Headphones className="size-6" />
        {t('pro.support.button')}
      </button>
    </div>
  )
}

export function ProLayout() {
  const { t } = useTranslation('layout')
  const [open, setOpen] = useState(false)
  const { ecole } = useMonEcole()
  const { account } = useSession()
  // Un compte = un espace : seul un compte école entre ici.
  if (!account?.ecoleId) return <Navigate to={ROUTES.signInSchool} replace />
  return (
    <div className="app-cadre min-h-dvh bg-page">
      <ScrollRestoration />
      <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b border-line bg-white/95 pr-2 backdrop-blur sm:gap-3 sm:pr-4">
        <button type="button" aria-label={t('nav.menu')} onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-brand-50 lg:hidden">
          <Menu className="size-5" />
        </button>
        <div className="shrink-0 lg:w-[250px] lg:pl-4 [&_svg]:size-9">
          <Logo to={ROUTES.pro.root} compact />
        </div>
        <div className="ml-8 hidden items-center gap-3 rounded-full bg-[#eaf0fb] px-5 py-2 text-navy-800 lg:flex">
          <Building2 className="size-7 text-brand-600" />
          <span className="text-[17px] font-bold">{t('pro.space', { type: t(`schoolType.${ecole.type}`) })}</span>
        </div>
        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <LanguageSwitcher className="sm:mr-1" />
          <NotificationsBell href={ROUTES.pro.settings('notifications')} />
          <Link to={ROUTES.pro.settings('a-propos')} aria-label={t('nav.help')} className="grid size-10 place-items-center rounded-full text-navy-800 hover:bg-brand-50">
            <CircleHelp className="size-5" />
          </Link>
          <span className="mx-1 hidden h-8 w-px bg-line sm:block" />
          <UserMenu withTestData />
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[250px] shrink-0 lg:block">
          <Sidebar />
        </aside>
        {open && (
          <div className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" onClick={() => setOpen(false)}>
            <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
              <button type="button" aria-label={t('nav.closeMenu')} onClick={() => setOpen(false)} className="absolute top-4 left-74 grid size-10 place-items-center rounded-full bg-white">
                <X className="size-5" />
              </button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1 px-4 py-3 md:px-5">
          <RouteOutlet />
        </main>
      </div>
    </div>
  )
}
