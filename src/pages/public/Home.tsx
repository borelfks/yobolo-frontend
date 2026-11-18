import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, BarChart3, Briefcase, ChevronRight, GraduationCap, LayoutGrid, MapPin, Search, ShieldCheck, Star, UserRound, Users, Wrench } from 'lucide-react'
import { Img } from '@/components/ui/Feedback'
import { SearchField } from '@/components/domain/SearchField'
import { regions } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const univers = [
  { title: 'École', text: 'Trouvez une formation qualifiante et reconnue', icon: GraduationCap, to: '/ecoles', card: 'bg-[#eef3ff] border-[#dbe5fb]', circle: 'bg-[#dbe6ff] text-navy-800', chevron: 'text-brand-600' },
  { title: 'Consultant', text: 'Consultez des experts par domaine', icon: Users, to: '/consultation', card: 'bg-[#f5efff] border-[#e9ddfb]', circle: 'bg-[#ebdfff] text-violet-700', chevron: 'text-violet-600' },
  { title: 'Métiers', text: 'Découvrez les métiers et les compétences clés', icon: Wrench, to: '/emploi', card: 'bg-[#fff5ec] border-[#fbe6d3]', circle: 'bg-[#ffe6d1] text-orange-600', chevron: 'text-orange-500' },
  { title: 'Emploi', text: 'Accédez aux offres d’emploi, de stage et d’apprentissage', icon: Briefcase, to: '/emploi', card: 'bg-[#effaf3] border-[#d8f1e1]', circle: 'bg-[#d7f3e2] text-emerald-700', chevron: 'text-emerald-600' },
]

const tabs = ['Écoles', 'Consultants', 'Métiers', 'Emplois']

export default function Home() {
  const [tab, setTab] = useState('Écoles')
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-[1320px] space-y-5 px-5 py-4">
      {/* Bandeau */}
      <section className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_55%,#1a47c4_100%)] text-white">
        <Img src="/maquette/accueil-hero.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[51.5%] object-left md:block" />
        <div className="relative px-7 py-7 md:w-[54%] md:px-11 md:py-8">
          <h1 className="text-[26px] leading-[1.12] font-extrabold tracking-[-0.01em] md:text-[33px]">
            Formez-vous, trouvez un expert,
            <br />
            développez{' '}
            <span className="relative whitespace-nowrap text-sun-400">
              votre carrière !
              <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden className="absolute -bottom-2 left-0 h-2.5 w-[62%]">
                <path d="M2 9 C 60 2, 140 2, 198 7" stroke="#fcd34d" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-4 max-w-[470px] text-[16px] leading-snug text-white/90">
            Écoles professionnelles, consultants, métiers et opportunités d’emploi réunis sur une seule plateforme.
          </p>
          <ul className="mt-5 flex flex-wrap items-center gap-y-2 text-[13.5px] font-medium">
            <li className="flex items-center gap-2 pr-4"><ShieldCheck className="size-5 fill-white text-navy-800" /> Établissements vérifiés</li>
            <li className="flex items-center gap-2 border-l border-white/30 px-4"><Star className="size-5 fill-white text-white" /> Experts certifiés</li>
            <li className="flex items-center gap-2 border-l border-white/30 pl-4"><Users className="size-5 fill-white text-white" /> Opportunités réelles</li>
          </ul>
        </div>
      </section>

      {/* Univers */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {univers.map((u) => (
          <Link key={u.title} to={u.to} className={cn('group flex items-center gap-3 rounded-2xl border px-3.5 py-3 shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg', u.card)}>
            <span className={cn('grid size-[50px] shrink-0 place-items-center rounded-full', u.circle)}>
              <u.icon className="size-7" strokeWidth={2.2} />
            </span>
            <span className="flex-1">
              <span className="block text-[20px] leading-tight font-extrabold text-navy-950">{u.title}</span>
              <span className="block text-[13px] leading-snug text-ink/80">{u.text}</span>
            </span>
            <ChevronRight className={cn('size-6 transition-transform group-hover:translate-x-1', u.chevron)} strokeWidth={2.5} />
          </Link>
        ))}
      </section>

      {/* Recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/ecoles')
        }}
        className="rounded-2xl bg-navy-800 px-5 pt-3 pb-4 shadow-lg shadow-navy-900/20"
      >
        <p className="mb-3 flex items-center gap-2.5 text-lg font-bold text-white">
          <Search className="size-5" strokeWidth={2.6} /> Rechercher sur YIBOLO
        </p>
        <div className="grid gap-3 md:flex">
          <SearchField icon={<MapPin />} label="Localisation" hint="Région, ville, quartier" options={regions.map((r) => r.nom)} />
          <SearchField icon={<GraduationCap />} label="École" hint="Tous les établissements" options={['IPES', 'CFP', 'Auto-écoles', 'Autres']} />
          <SearchField icon={<UserRound />} label="Consultant" hint="Tous les domaines" options={['Finance & Fiscalité', 'RH & Management', 'Juridique', 'Digital & SI']} />
          <SearchField icon={<LayoutGrid />} label="Métiers" hint="Tous les métiers" options={['Mécanicien', 'Comptable', 'Infirmier', 'Électricien']} />
          <button type="submit" className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-xl bg-sun-400 px-8 text-[17px] font-bold text-navy-950 hover:bg-sun-500">
            <Search className="size-5" strokeWidth={2.6} />
            Rechercher
          </button>
        </div>
      </form>

      {/* Recommandations */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[26px] font-extrabold text-navy-950">Nos recommandations</h2>
          <div className="flex rounded-full border border-line bg-white p-1 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn('h-9 rounded-full px-5 text-[15px] font-semibold transition-colors', tab === t ? 'bg-navy-800 text-white' : 'text-navy-900 hover:bg-brand-50')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RecoCard to="/ecoles/ipes/etablissement/ipc" image="/maquette/reco-ipc.jpg" badge="École" badgeColor="text-brand-600" title="Institut Professionnel du Centre (IPC)">
            <p className="flex items-center gap-3 text-[14px] text-ink/80">
              <span className="inline-flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /><b className="text-navy-950">4,7</b> (286 avis)</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> Yaoundé – Bastos</span>
            </p>
            <div className="flex gap-1.5">
              {['Comptabilité', 'RH', 'Informatique'].map((c) => <Chip key={c}>{c}</Chip>)}
            </div>
          </RecoCard>
          <RecoCard to="/consultation" image="/maquette/reco-consultant.jpg" badge="Consultant" badgeColor="text-brand-600" title="Me Alain Tchana">
            <p className="flex items-center gap-3 text-[14px] text-ink/80">
              <span className="inline-flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /><b className="text-navy-950">4,9</b> (132 avis)</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> Management &amp; RH</span>
            </p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" /> Disponible
            </span>
          </RecoCard>
          <RecoCard to="/emploi" image="/maquette/reco-metier.jpg" badge="Métier" badgeColor="text-orange-600" title="Mécanicien automobile">
            <p className="text-[14px] text-ink/80">Entretien • Diagnostic • Réparation</p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[13px] font-semibold text-navy-800">
              <BarChart3 className="size-4" /> Forte demande
            </span>
          </RecoCard>
          <RecoCard to="/emploi" image="/maquette/reco-emploi.jpg" badge="Emploi" badgeColor="text-emerald-600" title="Moniteur(trice) de conduite">
            <p className="flex items-center gap-4 text-[14px] text-ink/80">
              <span className="inline-flex items-center gap-1"><Briefcase className="size-4" /> CDI</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> Yaoundé</span>
            </p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
              <Briefcase className="size-3.5" /> Nouveau
            </span>
          </RecoCard>
        </div>
      </section>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#e8efff] px-3 py-1 text-[13px] font-medium text-navy-800">{children}</span>
}

function RecoCard({ to, image, badge, badgeColor, title, children }: { to: string; image: string; badge: string; badgeColor: string; title: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group flex flex-col rounded-2xl border border-line bg-white p-2 shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
      <div className="relative overflow-hidden rounded-xl">
        <Img src={image} alt={title} className="h-[104px] w-full" />
        <span className={cn('absolute top-2.5 left-2.5 rounded-full bg-white px-3.5 py-1 text-[15px] font-bold shadow-sm', badgeColor)}>{badge}</span>
      </div>
      <div className="relative flex flex-1 flex-col gap-2 px-2 pt-3 pb-2">
        <p className="pr-2 text-[16px] font-bold text-navy-950">{title}</p>
        {children}
        <span className="absolute right-2 bottom-2 grid size-9 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors group-hover:bg-navy-800 group-hover:text-white">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
