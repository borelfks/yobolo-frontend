import { Suspense, useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'
import { Briefcase, GraduationCap, Home, Mail, MapPin, Menu, Phone, UserRound, X } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { NotificationsBell, UserMenu } from '@/components/layout/UserMenu'
import { Button } from '@/components/ui/Button'
import { useSession } from '@/hooks/useSession'
import { cn } from '@/lib/utils'
import { PageLoader } from '@/components/layout/PageLoader'

const links = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/ecoles', label: 'École', icon: GraduationCap },
  { to: '/consultation', label: 'Consultation', icon: UserRound },
  { to: '/emploi', label: 'Emploi', icon: Briefcase },
]

export function PublicLayout() {
  const { account } = useSession()
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollRestoration />
      <header className="sticky top-0 z-30 border-b border-line/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-4 px-5">
          <Logo />
          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {links.map((l) => (
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
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {account ? (
              <>
                <NotificationsBell />
                <span className="hidden h-8 w-px bg-line sm:block" />
                <UserMenu />
              </>
            ) : (
              <>
                <Button to="/connexion" variant="ghost" size="sm">
                  Se connecter
                </Button>
                <Button to="/inscription" size="sm">
                  Créer un compte
                </Button>
              </>
            )}
            <button type="button" aria-label="Menu" onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full hover:bg-brand-50 lg:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-line bg-white p-3 lg:hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-4 py-3 font-semibold', isActive ? 'bg-navy-800 text-white' : 'text-navy-800')}
              >
                <l.icon className="size-5" />
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function Footer() {
  const cols = [
    { title: 'École', items: [['IPES', '/ecoles/ipes'], ['Auto-écoles', '/ecoles/auto-ecoles'], ['Mes favoris', '/favoris']] },
    { title: 'Établissements', items: [['Espace professionnel IPES', '/pro/ecole'], ['Référencer mon école', '/inscription'], ['Toutes les écoles', '/ecoles']] },
    { title: 'Mon compte', items: [['Se connecter', '/connexion'], ['Créer un compte', '/inscription'], ['Mes favoris', '/favoris']] },
  ]
  return (
    <footer className="bg-navy-gradient mt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70">La plateforme de formation, d’expertise et d’emploi en Afrique centrale.</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            <p className="flex items-center gap-2"><Phone className="size-4" /> +237 6 00 00 00 00</p>
            <p className="flex items-center gap-2"><Mail className="size-4" /> contact@yibolo.cm</p>
            <p className="flex items-center gap-2"><MapPin className="size-4" /> Yaoundé, Cameroun</p>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-bold">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {c.items.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">© 2026 YIBOLO — Démonstration · Données fictives</p>
    </footer>
  )
}
