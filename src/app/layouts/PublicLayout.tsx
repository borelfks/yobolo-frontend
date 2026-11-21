import { useState } from 'react'
import { Link, NavLink, ScrollRestoration } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { Logo } from '@/shared/components/ui/Logo'
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher'
import { NotificationsBell, UserMenu } from '@/app/layouts/AccountMenu'
import { Button } from '@/shared/components/ui/Button'
import { useSession } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { RouteOutlet } from '@/app/routes/RouteOutlet'
import { footerColumns, publicNav } from '@/app/layouts/navConfig'
import { ROUTES } from '@/shared/utils/routes'

export function PublicLayout() {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollRestoration />
      <header className="sticky top-0 z-30 border-b border-line/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-4 px-5">
          <Logo />
          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {publicNav.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors',
                    isActive ? 'bg-navy-800 text-white shadow' : 'text-navy-800 hover:bg-brand-50',
                  )
                }
              >
                <l.icon className="size-5" />
                {t(l.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <LanguageSwitcher />
            {account ? (
              <>
                <NotificationsBell />
                <span className="hidden h-8 w-px bg-line sm:block" />
                <UserMenu />
              </>
            ) : (
              <>
                <Button to={ROUTES.signIn} variant="ghost" size="sm">
                  {t('account.signIn')}
                </Button>
                <Button to={ROUTES.signUp} size="sm">
                  {t('account.signUp')}
                </Button>
              </>
            )}
            <button type="button" aria-label={t('nav.menu')} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full hover:bg-brand-50 lg:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-line bg-white p-3 lg:hidden">
            {publicNav.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-4 py-3 font-semibold', isActive ? 'bg-navy-800 text-white' : 'text-navy-800')}
              >
                <l.icon className="size-5" />
                {t(l.labelKey)}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">
        <RouteOutlet />
      </main>
      <Footer />
    </div>
  )
}

function Footer() {
  const { t } = useTranslation('layout')
  return (
    <footer className="bg-navy-gradient mt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70">{t('footer.tagline')}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            <p className="flex items-center gap-2"><Phone className="size-4" /> +237 6 00 00 00 00</p>
            <p className="flex items-center gap-2"><Mail className="size-4" /> contact@yibolo.cm</p>
            <p className="flex items-center gap-2"><MapPin className="size-4" /> {t('footer.city')}</p>
          </div>
        </div>
        {footerColumns.map((c) => (
          <div key={c.titleKey}>
            <p className="font-bold">{t(c.titleKey)}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {c.items.map((item) => (
                <li key={item.labelKey}>
                  <Link to={item.to} className="hover:text-white">{t(item.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">{t('footer.copyright')}</p>
    </footer>
  )
}
