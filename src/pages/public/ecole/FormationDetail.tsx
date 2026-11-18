import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Clock,
  Coins,
  CreditCard,
  Factory,
  FileText,
  GraduationCap,
  Handshake,
  Heart,
  Info,
  Landmark,
  Layers,
  List,
  ClipboardCheck,
  MapPin,
  Network,
  PencilLine,
  Phone,
  ShoppingCart,
  Sun,
  Tag,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Monitor,
  AlertCircle,
  BookOpenText,
  ShieldCheck,
} from 'lucide-react'
import { Breadcrumb, Img } from '@/components/ui/Feedback'
import { useFavorites } from '@/hooks/useFavorites'
import { ecoleUrl } from '@/lib/ecole-links'
import { etablissementById, formationById, isTypeSlug, programme, slugOfType, typeConfig, type Formation } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const soft = 'rounded-xl bg-[#f0f4fc]'

/** Photo d'en-tête propre à certaines formations (maquette img39). */
const headerPhotos: Record<string, string> = { 'f-cg-ipc': '/maquette/formation-header-compta.jpg' }

export default function FormationDetail() {
  const { id, tab = '' } = useParams()
  const f = formationById(id)
  const e = etablissementById(f.etablissementId)
  const slug = slugOfType(e.type)
  const base = `/ecoles/formations/${f.id}`
  const tabs = [
    { value: '', label: 'Détails', icon: <List /> },
    { value: 'programme', label: 'Programme', icon: <GraduationCap /> },
    { value: 'admission', label: 'Conditions d’admission', icon: <CalendarDays /> },
    { value: 'frais', label: 'Frais & paiement', icon: <Coins /> },
    { value: 'debouches', label: 'Débouchés', icon: <Users /> },
  ]
  const current = tabs.find((t) => t.value === tab) ?? tabs[0]
  return (
    <div className="mx-auto max-w-[1320px] space-y-3.5 px-5 py-4">
      <Breadcrumb
        className="-mt-1"
        items={[
          { label: 'École', to: '/ecoles' },
          { label: isTypeSlug(slug) ? typeConfig[slug].court : 'École', to: `/ecoles/${slug}` },
          { label: e.nom, to: ecoleUrl(e) },
          { label: 'Formations', to: `${ecoleUrl(e)}/formations` },
          ...(tab ? [{ label: f.nom, to: base }] : []),
          { label: current.label },
        ]}
      />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white">
        <Img src="/maquette/formation-hero.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[33%] object-left md:block" />
        <div className="relative flex flex-col gap-6 p-2.5 md:flex-row md:items-center">
          <Img src={headerPhotos[f.id] ?? f.image} alt={f.nom} className="h-[115px] w-full rounded-xl md:w-[235px]" />
          <div className="space-y-2 pb-2 md:pb-0">
            <span className="inline-block rounded-full bg-brand-500 px-3.5 py-0.5 text-[15px] font-semibold">Formation</span>
            <h1 className="text-[26px] font-extrabold md:text-[32px]">{f.nom}</h1>
            <p className="flex flex-wrap items-center gap-x-5 text-[17px]">
              <span className="inline-flex items-center gap-2">
                <Landmark className="size-5" />
                {e.nom}
              </span>
              <span className="h-6 w-px bg-white/40" />
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-5 fill-white/90 text-navy-800" />
                {e.ville} – {e.quartier}
              </span>
            </p>
          </div>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
        <div className="min-w-0 space-y-3.5">
          <nav className="flex flex-wrap gap-2.5">
            {tabs.map((t, i) => (
              <Link
                key={t.value}
                to={i === 0 ? base : `${base}/${t.value}`}
                className={cn(
                  'inline-flex h-11 flex-1 items-center justify-center gap-2.5 rounded-xl px-4 text-[15px] font-semibold whitespace-nowrap [&_svg]:size-5',
                  tab === t.value ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100',
                )}
              >
                {t.icon}
                {t.label}
              </Link>
            ))}
          </nav>
          {tab === '' && <Details f={f} />}
          {tab === 'programme' && <Programme f={f} />}
          {tab === 'admission' && <Admission f={f} />}
          {tab === 'frais' && <Frais f={f} />}
          {tab === 'debouches' && <Debouches f={f} />}
        </div>
        <Aside f={f} showRentree={tab !== 'programme'} />
      </div>
    </div>
  )
}

function Aside({ f, showRentree }: { f: Formation; showRentree: boolean }) {
  const e = etablissementById(f.etablissementId)
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(f.id)
  const btn = 'flex h-[38px] w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/60 bg-white text-[15px] font-semibold text-navy-800 hover:bg-brand-50'
  return (
    <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
      <Link to={ecoleUrl(e)} className={cn(card, 'flex items-center gap-3 p-3')}>
        <Img src={e.id === 'ipc' ? '/maquette/ipc-carte.jpg' : e.image} alt={e.nom} className="size-[102px] rounded-xl" />
        <div className="space-y-1.5">
          <p className="text-[17px] leading-tight font-bold text-navy-900">{e.nom}</p>
          <p className="flex items-center gap-1.5 text-[14px] text-navy-900">
            <span className="text-amber-400">★</span>
            {e.note.toLocaleString('fr-FR')}/5 ({e.avis} avis)
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[13px] font-semibold text-white">
            <CircleCheck className="size-4 fill-white text-emerald-600" />
            Établissement vérifié
          </span>
        </div>
      </Link>
      <div className={cn(card, 'space-y-2.5 p-3')}>
        <Link to={`/ecoles/formations/${f.id}/preinscription`} className="flex h-10 items-center justify-center gap-2.5 rounded-full bg-sun-400 text-[16px] font-bold text-navy-950 hover:bg-sun-500">
          <PencilLine className="size-5" />
          Préinscrire maintenant
        </Link>
        <button type="button" onClick={() => toggle(f.id, 'formation')} className={btn}>
          <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
          {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
        </button>
        <button type="button" onClick={() => window.open(`https://wa.me/${e.telephone.replace(/\D/g, '')}`, '_blank', 'noopener')} className={btn}>
          <WhatsAppIcon />
          Contacter l’établissement
        </button>
        <a href={`tel:${e.telephone.replace(/\s/g, '')}`} className={cn(btn, 'text-[17px] font-bold')}>
          <Phone className="size-5" />
          {e.telephone}
        </a>
      </div>
      {showRentree && (
        <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-line bg-[#eef3fc] p-4">
          <CalendarDays className="size-8 text-brand-600" />
          <div>
            <p className="text-[14px] text-navy-900">Prochaine rentrée</p>
            <p className="text-[20px] font-bold text-navy-900">{e.rentree}</p>
          </div>
          <CalendarDays className="absolute right-3 size-14 text-brand-200" strokeWidth={1.4} />
        </div>
      )}
    </aside>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path fill="#fff" d="M16.7 13.9c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1 .1-1.1l-.3-.3Z" />
    </svg>
  )
}

function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] text-navy-900">
      <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12.5l5 5L20 6.5" />
      </svg>
      <span>{children}</span>
    </li>
  )
}

function Heading({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('flex items-center gap-2.5 text-[21px] font-bold text-navy-900 [&_svg]:size-6 [&_svg]:text-brand-600', className)}>
      {icon}
      {children}
    </h2>
  )
}

function Details({ f }: { f: Formation }) {
  const tiles = [
    { icon: <GraduationCap />, label: 'Diplôme', value: f.diplome },
    { icon: <Clock />, label: 'Durée', value: `${f.dureeMois} mois` },
    { icon: <Sun className="fill-amber-300 text-amber-500" />, label: 'Cours', value: <span className="rounded-full bg-[#f6e6f7] px-3 py-0.5">{f.mode}</span> },
    { icon: <Coins />, label: 'Frais de formation', value: `${f.fraisAn.toLocaleString('fr-FR')} FCFA / an` },
  ]
  return (
    <div className={cn(card, 'space-y-4 p-4')}>
      <div>
        <Heading icon={<Info />}>Présentation de la formation</Heading>
        <p className="mt-1.5 text-[15px] leading-relaxed text-navy-900">
          Le {f.nom} forme des techniciens supérieurs capables de gérer la comptabilité, les opérations financières et le contrôle de gestion d’une organisation.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-[0.95fr_0.75fr_0.9fr_1.2fr]">
        {tiles.map((t) => (
          <div key={t.label} className={cn(soft, 'flex items-center gap-4 px-4 py-3 [&_svg]:size-8 [&_svg]:shrink-0 [&_svg]:text-navy-800')}>
            {t.icon}
            <div>
              <p className="text-[14px] text-navy-900">{t.label}</p>
              <p className="text-[17px] font-bold whitespace-nowrap text-navy-900">{t.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cn(soft, 'p-4')}>
          <Heading icon={<Target />} className="text-[19px]">Objectifs</Heading>
          <ul className="mt-2.5 space-y-1.5">
            {['Tenir la comptabilité d’une organisation', 'Établir les états financiers', 'Assurer la gestion de la trésorerie', 'Contribuer au contrôle de gestion', 'Maîtriser les outils comptables et financiers (SAGE, Excel, etc.)'].map((t) => (
              <Check key={t}>{t}</Check>
            ))}
          </ul>
        </div>
        <div className={cn(soft, 'p-4')}>
          <Heading icon={<Briefcase />} className="text-[19px]">Débouchés professionnels</Heading>
          <ul className="mt-2.5 space-y-1.5">
            {['Comptable', 'Assistant(e) de gestion', 'Gestionnaire de trésorerie', 'Assistant(e) en contrôle de gestion', 'Collaborateur en cabinet comptable'].map((t) => (
              <Check key={t}>{t}</Check>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Programme({ f }: { f: Formation }) {
  const years = Object.keys(programme)
  const [year, setYear] = useState(years[0])
  const [open, setOpen] = useState<string>('Semestre 1')
  return (
    <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
      <div className={cn(card, 'h-fit space-y-3 p-4')}>
        <Heading icon={<BookOpenText />}>Aperçu du programme</Heading>
        <p className="border-b border-line pb-4 text-[15.5px] leading-snug text-navy-900">
          Un programme professionnalisant qui allie comptabilité, gestion, finance et outils numériques, avec des mises en situation réelles en entreprise.
        </p>
        {[
          { icon: <Clock />, k: 'Durée', v: `${f.dureeMois} mois` },
          { icon: <Sun className="fill-amber-300 text-amber-500" />, k: 'Cours', v: f.mode },
          { icon: <Layers />, k: 'Volume horaire', v: '~ 1 200 h' },
          { icon: <Briefcase />, k: 'Stage en entreprise', v: '2 à 3 mois' },
        ].map((r) => (
          <div key={r.k} className={cn(soft, 'flex items-center gap-3 px-3 py-2.5 text-[15.5px] text-navy-900 [&_svg]:size-6 [&_svg]:text-navy-800')}>
            {r.icon}
            <span>
              <b>{r.k} :</b> {r.v}
            </span>
          </div>
        ))}
      </div>
      <div className={cn(card, 'space-y-3 p-4')}>
        <Heading icon={<BookOpen />}>Programme détaillé</Heading>
        <div className="grid grid-cols-2 gap-1 rounded-full border border-line p-1">
          {years.map((y, i) => (
            <button key={y} type="button" onClick={() => setYear(y)} className={cn('h-10 rounded-full text-[16px] font-semibold', year === y ? 'bg-brand-600 text-white' : 'text-navy-900 hover:bg-brand-50')}>
              {i + 1}
              <sup>{i === 0 ? 'ère' : 'ème'}</sup> année ({i === 0 ? 'S1 – S2' : 'S3 – S4'})
            </button>
          ))}
        </div>
        {programme[year as keyof typeof programme].map((s) => {
          const isOpen = open === s.semestre
          return (
            <div key={s.semestre} className="rounded-xl border border-line">
              <button type="button" onClick={() => setOpen(isOpen ? '' : s.semestre)} className="flex h-11 w-full items-center justify-between rounded-xl bg-[#eef3fc] px-4 text-left text-[17px] font-bold text-navy-900">
                {s.semestre}
                {isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
              {isOpen && (
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  <ul className="flex-1 space-y-2 border-line sm:border-r">
                    {s.ue.map((u) => (
                      <li key={u} className="flex items-center gap-3 text-[14.5px] text-navy-900">
                        <span className="size-2 rounded-full bg-brand-600" />
                        {u}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-4 text-[15px] text-navy-900 sm:w-56">
                    <p className="flex items-center gap-2.5"><CalendarDays className="size-6 text-brand-600" />{s.ue.length} unités d’enseignement</p>
                    <p className="flex items-center gap-2.5 font-semibold"><Clock className="size-6 text-brand-600" />≈ {s.heures} heures</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Admission({ f }: { f: Formation }) {
  const pieces = ['Copie du baccalauréat', 'Relevés de notes du baccalauréat', 'Copie de la CNI ou acte de naissance', 'Photo d’identité récente']
  return (
    <div className={cn(card, 'space-y-4 p-5')}>
      <div>
        <Heading icon={<GraduationCap />} className="text-[24px] [&_svg]:size-8">Conditions d’admission</Heading>
        <p className="mt-2 max-w-sm text-[15.5px] text-navy-900">Les conditions ci-dessous s’appliquent à la formation {f.nom}.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 border-line md:border-r md:pr-5">
          {[
            { icon: <Award />, k: 'Niveau requis', v: 'Baccalauréat (toutes séries)' },
            { icon: <Users />, k: 'Mode de sélection', v: 'Étude du dossier et/ou entretien' },
            { icon: <CalendarDays />, k: 'Période de candidature', v: 'Du 01 juillet au 30 septembre 2026' },
          ].map((r) => (
            <div key={r.k} className={cn(soft, 'flex items-center gap-4 px-4 py-3 [&_svg]:size-8 [&_svg]:text-navy-800')}>
              {r.icon}
              <div>
                <p className="text-[17px] font-bold text-navy-900">{r.k}</p>
                <p className="text-[14.5px] text-navy-900">{r.v}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Heading icon={<FileText />} className="text-[20px]">Pièces à fournir</Heading>
          <ul className="mt-3 space-y-2.5">
            {pieces.map((p) => (
              <li key={p} className={cn(soft, 'flex items-center gap-3 px-3 py-2 text-[14.5px] text-navy-900')}>
                <CircleCheck className="size-5 fill-brand-600 text-white" />
                <span className="flex-1">{p}</span>
                <span className="rounded-md bg-rose-100 px-2.5 py-0.5 text-[13px] font-semibold text-rose-600">Obligatoire</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={cn(soft, 'flex items-center gap-4 px-4 py-3 text-[15px] text-navy-900')}>
        <AlertCircle className="size-6 text-navy-800" />
        <b className="text-[17px]">Bon à savoir</b>
        <span className="h-6 w-px bg-line" />
        Les dossiers incomplets ne sont pas recevables.
      </div>
    </div>
  )
}

function Frais({ f }: { f: Formation }) {
  const ans = Math.max(1, Math.round(f.dureeMois / 12))
  const [modalite, setModalite] = useState(0)
  const modalites = [
    { t: 'Paiement en 1 fois', d: <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700">Remise de 5 %</span> },
    { t: 'Paiement en 2 tranches', d: '50 % à l’inscription, 50 % en milieu d’année' },
    { t: 'Paiement mensuel', d: `12 mensualités de ${Math.round(f.fraisAn / 12).toLocaleString('fr-FR')} FCFA` },
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Coins />}>Frais de la formation</Heading>
          <div className={cn(soft, 'mt-3 divide-y divide-line px-4')}>
            <div className="flex items-center gap-3 py-3 text-[16px] text-navy-900">
              <Tag className="size-6 text-navy-800" />
              <span className="flex-1 font-semibold">Frais d’inscription</span>
              <b>{f.fraisInscription.toLocaleString('fr-FR')} FCFA</b>
            </div>
            <div className="flex items-center gap-3 py-3 text-[16px] text-navy-900">
              <GraduationCap className="size-6 text-navy-800" />
              <span className="flex-1 font-semibold leading-tight">
                Frais de scolarité <span className="block text-[14px] font-normal">(par an)</span>
              </span>
              <b>{f.fraisAn.toLocaleString('fr-FR')} FCFA</b>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#dfe8fb] px-4 py-3 text-navy-900">
            <Calculator className="size-7 text-navy-800" />
            <span className="flex-1 text-[16px] leading-tight font-semibold">
              Coût total de la formation <span className="block font-normal">({ans} an{ans > 1 ? 's' : ''})</span>
            </span>
            <span className="rounded-full bg-brand-600 px-5 py-2 text-[18px] font-extrabold text-white">{(f.fraisAn * ans).toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CreditCard />}>Modalités de paiement</Heading>
          <div className="mt-3 space-y-2">
            {modalites.map((m, i) => (
              <button key={m.t} type="button" onClick={() => setModalite(i)} className={cn(soft, 'flex w-full items-center gap-3 px-3 py-2.5 text-left')}>
                <CalendarDays className="size-7 text-navy-800" />
                <span className="flex-1">
                  <span className="block text-[15px] font-bold text-navy-900">{m.t}</span>
                  <span className="text-[13px] text-navy-900">{m.d}</span>
                </span>
                <CircleCheck className={cn('size-6', modalite === i ? 'fill-emerald-600 text-white' : 'fill-slate-300 text-white')} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CircleCheck />}>Ce que couvrent les frais</Heading>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { icon: <BookOpen />, t: ['Cours et', 'supports'] },
              { icon: <Monitor />, t: ['Travaux', 'pratiques'] },
              { icon: <Users />, t: ['Encadrement', 'pédagogique'] },
              { icon: <Briefcase />, t: ['Suivi de', 'stage'] },
            ].map((x) => (
              <div key={x.t[0]} className={cn(soft, 'flex flex-col items-center gap-2 px-2 py-3 text-center text-[14px] leading-tight text-navy-900 [&_svg]:size-8 [&_svg]:text-brand-600')}>
                {x.icon}
                <span>
                  {x.t[0]}
                  <span className="block">{x.t[1]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-[#fff8e6] p-4">
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <AlertCircle className="size-7 fill-amber-400 text-white" /> Bon à savoir
          </h2>
          <ul className="mt-3 space-y-3 text-[15px] text-navy-900">
            {['Les frais de scolarité peuvent être réglés par Mobile Money (Orange, MTN, Express Union).', 'Un reçu officiel est délivré après chaque paiement.'].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <CircleCheck className="mt-0.5 size-5 shrink-0 fill-amber-400 text-white" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Debouches({ f }: { f: Formation }) {
  const metiers = [
    { t: 'Comptable', icon: <Calculator />, c: 'bg-[#e3edff] text-brand-600' },
    { t: 'Assistant(e) de gestion', icon: <BarChart3 />, c: 'bg-[#fff0dc] text-orange-500' },
    { t: 'Gestionnaire de trésorerie', icon: <Coins />, c: 'bg-[#fff6d6] text-amber-500' },
    { t: 'Assistant(e) en contrôle de gestion', icon: <ClipboardCheck />, c: 'bg-[#efe6ff] text-violet-600' },
    { t: 'Collaborateur en cabinet comptable', icon: <Users />, c: 'bg-[#e3edff] text-brand-600' },
  ]
  const secteurs = [
    { icon: <Building2 />, t: ['Entreprises', '(privées et publiques)'] },
    { icon: <Landmark />, t: ['Banques &', 'assurances'] },
    { icon: <Handshake />, t: ['Cabinets', 'd’expertise comptable'] },
    { icon: <ShoppingCart />, t: ['Commerce &', 'distribution'] },
  ]
  const etapes = [
    { t: ['Comptable'], icon: <Briefcase />, c: 'bg-[#e8f0ff] text-brand-600', bar: 'bg-brand-500' },
    { t: ['Chef', 'comptable'], icon: <UserRound />, c: 'bg-[#f1e9ff] text-violet-600', bar: 'bg-violet-500' },
    { t: ['Contrôleur', 'de gestion'], icon: <Network />, c: 'bg-[#fff2df] text-orange-500', bar: 'bg-amber-400' },
    { t: ['Responsable', 'administratif', 'et financier (RAF)'], icon: <ShieldCheck />, c: 'bg-[#e4f7ea] text-emerald-600', bar: 'bg-emerald-500' },
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[350px_1fr]">
      <div className={cn(card, 'p-4')}>
        <Heading icon={<Briefcase />} className="text-[23px] [&_svg]:size-7">Métiers accessibles</Heading>
        <p className="mt-2 text-[14px] text-navy-900">Après un {f.nom}, vous pouvez exercer notamment comme :</p>
        <ul className="mt-3 space-y-2">
          {metiers.map((m) => (
            <li key={m.t} className={cn(soft, 'flex items-center gap-3 px-2 py-2 text-[14.5px] font-semibold text-navy-900')}>
              <span className={cn('grid size-10 place-items-center rounded-lg [&_svg]:size-6', m.c)}>{m.icon}</span>
              {m.t}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Factory />}>Secteurs qui recrutent</Heading>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {secteurs.map((s) => (
              <div key={s.t[0]} className={cn(soft, 'flex flex-col items-center gap-2 px-2 py-3 text-center text-[13.5px] leading-tight text-navy-900 [&_svg]:size-8 [&_svg]:text-brand-600')}>
                {s.icon}
                <span>
                  {s.t[0]}
                  <span className="block">{s.t[1]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<TrendingUp />} className="text-[22px]">Évolution de carrière</Heading>
          <p className="mt-1 text-[14px] text-navy-900">Des perspectives d’évolution vers des postes à responsabilités :</p>
          <ol className="mt-3 flex flex-wrap items-center gap-2">
            {etapes.map((e, i) => (
              <li key={e.t.join(' ')} className="flex flex-1 items-center gap-2">
                <div className={cn('flex min-h-[120px] min-w-[104px] flex-1 flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center text-[14px] leading-tight font-semibold text-navy-900 [&_svg]:size-7', e.c)}>
                  {e.icon}
                  <span>
                    {e.t.map((x) => (
                      <span key={x} className="block">{x}</span>
                    ))}
                  </span>
                  <span className={cn('mt-1 h-1 w-3/4 rounded-full', e.bar)} />
                </div>
                {i < etapes.length - 1 && <ChevronRight className="size-5 shrink-0 text-brand-600" />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
