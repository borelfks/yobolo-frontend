import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Coins,
  CreditCard,
  Funnel,
  GraduationCap,
  Handshake,
  Heart,
  Home,
  Hourglass,
  Image as ImageIcon,
  Images,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PencilLine,
  Phone,
  PlayCircle,
  RefreshCw,
  Send,
  Star,
  UserRound,
  Users,
  Wallet,
  Globe,
  Medal,
  BadgeCheck,
  CircleGauge,
} from 'lucide-react'
import { AEHeader, FavoriteModal } from '@/components/domain/autoecole'
import { Img, Stars } from '@/components/ui/Feedback'
import { useFavorites } from '@/hooks/useFavorites'
import { permisIcon } from '@/lib/autoecole-helpers'
import { autoEcoleById, avisAutoEcole, criteresAvis, permisCatalogue, pourquoiNousChoisir, repartitionAutoEcole, sessions, type PermisCode } from '@/mocks/autoecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const soft = 'rounded-xl bg-[#f0f4fc]'

function Heading({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('flex items-center gap-2.5 text-[21px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600', className)}>
      {icon}
      {children}
    </h2>
  )
}

function GreenCheck({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-[13.5px] whitespace-nowrap text-navy-900">
      <CircleCheck className="size-5 shrink-0 fill-emerald-600 text-white" />
      {children}
    </li>
  )
}

export default function AutoEcoleProfil() {
  const { id, tab = '' } = useParams()
  const a = autoEcoleById(id)
  const base = `/ecoles/auto-ecoles/${a.id}`
  const tabs = [
    { value: '', label: 'Aperçu', icon: <Home /> },
    { value: 'formations', label: 'Formations & Permis', icon: <Car /> },
    { value: 'tarifs', label: 'Tarifs', icon: <Coins /> },
    { value: 'planning', label: 'Planning', icon: <CalendarDays /> },
    { value: 'galerie', label: 'Galerie', icon: <ImageIcon /> },
    { value: 'avis', label: `Avis (${a.avis})`, icon: <Star /> },
  ]
  const current = tabs.find((t) => t.value === tab) ?? tabs[0]
  const headers: Record<string, { title?: string; subtitle?: string; image?: string }> = {
    formations: { title: 'Formations & Permis', subtitle: 'Toutes nos formations à la conduite et catégories de permis.', image: '/maquette/ae-hero-formations.jpg' },
    planning: { title: 'Planning des formations', subtitle: 'Calendrier des prochaines sessions et horaires de cours.', image: '/maquette/ae-hero-formations.jpg' },
    galerie: { title: `Galerie – ${a.nom}`, subtitle: 'Découvrez notre cadre de formation, nos équipements et nos apprenants en action.', image: '/maquette/ae-hero-formations.jpg' },
    avis: { image: '/maquette/ae-hero-formations.jpg' },
  }
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: 'Auto-Écoles', to: '/ecoles/auto-ecoles' }, ...(tab ? [{ label: a.nom, to: base }, { label: current.label.replace(/ \(\d+\)$/, '') }] : [{ label: 'Profil' }])]}
        {...headers[tab]}
      />
      <nav className="flex flex-wrap gap-2.5">
        {tabs.map((t, i) => (
          <Link
            key={t.value}
            to={i === 0 ? base : `${base}/${t.value}`}
            className={cn(
              'inline-flex h-11 items-center justify-center gap-2.5 rounded-xl px-6 text-[15.5px] font-semibold whitespace-nowrap shadow-sm [&_svg]:size-5',
              tab === t.value ? 'bg-brand-600 text-white shadow-brand-600/30' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100',
            )}
          >
            {t.icon}
            {t.label}
          </Link>
        ))}
      </nav>
      {tab === '' && <Apercu id={a.id} />}
      {tab === 'formations' && <Formations id={a.id} />}
      {tab === 'tarifs' && <Tarifs id={a.id} />}
      {tab === 'planning' && <Planning id={a.id} />}
      {tab === 'galerie' && <Galerie id={a.id} />}
      {tab === 'avis' && <Avis id={a.id} />}
    </div>
  )
}

function inscrireHref(id: string, code?: string) {
  const a = autoEcoleById(id)
  return `/ecoles/auto-ecoles/${a.id}/permis/${code ?? (a.permis.includes('B') ? 'B' : a.permis[0])}/inscription`
}

function SideActions({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const { isFavorite, remove } = useFavorites()
  const [open, setOpen] = useState(false)
  const fav = isFavorite(a.id)
  return (
    <div className="space-y-3">
      <Link to={inscrireHref(id)} className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[18px] font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700">
        <Send className="size-6" />
        S’inscrire maintenant
      </Link>
      <button type="button" onClick={() => (fav ? remove(a.id) : setOpen(true))} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
        <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
        {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
      </button>
      <FavoriteModal open={open} onClose={() => setOpen(false)} aeId={a.id} />
    </div>
  )
}

function Apercu({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const [slide, setSlide] = useState(0)
  const photos = ['/maquette/ae-galerie-1.jpg', '/maquette/ae-galerie-2.jpg', '/maquette/ae-galerie-3.jpg', '/maquette/ae-galerie-4.jpg', '/maquette/aeg-6.jpg', '/maquette/aeg-7.jpg']
  const visible = [0, 1, 2, 3].map((i) => photos[(slide + i) % photos.length])
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[334px_1fr]">
          <div className="space-y-4">
            <div className={cn(card, 'p-4')}>
              <Heading icon={<Info />}>Présentation</Heading>
              <p className="mt-2 text-[15px] leading-snug text-navy-900">
                {a.nom} est un établissement agréé, spécialisé dans la formation à la conduite et la préparation aux différents permis ({a.permis.slice().sort().join(', ')}). Nous vous offrons un encadrement professionnel, des moniteurs expérimentés et des véhicules en bon état.
              </p>
            </div>
            <dl className={cn(card, 'divide-y divide-line px-4 py-1 text-[13.5px]')}>
              {[
                { icon: <CalendarDays />, k: 'Année de création', v: a.creation },
                { icon: <MapPin />, k: 'Localisation', v: `${a.ville} – ${a.quartier}` },
                { icon: <Clock />, k: 'Horaires', v: 'Lun – Sam : 08h – 18h' },
                { icon: <BadgeCheck />, k: 'Statut', v: <span className="rounded-full bg-emerald-600 px-3.5 py-0.5 font-semibold text-white">Agréée</span> },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[22px_1fr_auto] items-center gap-3 py-2 [&_svg]:size-5 [&_svg]:text-navy-800">
                  {r.icon}
                  <dt className="font-semibold text-navy-900">{r.k}</dt>
                  <dd className="text-navy-900">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-4">
            <div className={cn(card, 'p-4')}>
              <Heading icon={<Car />}>Permis proposés</Heading>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {(['A', 'B', 'C', 'D'] as PermisCode[])
                  .filter((c) => a.permis.includes(c))
                  .map((code) => {
                    const p = permisCatalogue[code]
                    const Icon = permisIcon[code]
                    return (
                      <Link key={code} to={`/ecoles/auto-ecoles/${a.id}/permis/${code}`} className={cn(soft, 'flex flex-col items-center gap-1.5 px-2 py-3 text-center transition-shadow hover:shadow-md')}>
                        <Icon className="size-9 text-brand-600" />
                        <span className="text-[16px] font-bold text-navy-900">Permis {code}</span>
                        <span className="text-[13px] leading-tight text-navy-900">{p.nom}</span>
                      </Link>
                    )
                  })}
              </div>
            </div>
            <div className={cn(card, 'p-4')}>
              <Heading icon={<Medal />}>Pourquoi nous choisir ?</Heading>
              <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {[pourquoiNousChoisir[0], pourquoiNousChoisir[3], pourquoiNousChoisir[1], pourquoiNousChoisir[4], pourquoiNousChoisir[2], pourquoiNousChoisir[5]].map((t) => (
                  <GreenCheck key={t}>{t}</GreenCheck>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={cn(card, 'p-4')}>
          <div className="flex items-center justify-between">
            <Heading icon={<Images />}>Galerie (12)</Heading>
            <Link to={`/ecoles/auto-ecoles/${a.id}/galerie`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-600 underline underline-offset-4">
              Voir la galerie <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="relative mt-3">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.25fr_1fr_1fr_1.05fr]">
              {visible.map((src, i) => (
                <Img key={src + i} src={src} alt="" className="h-[125px] w-full rounded-xl" />
              ))}
            </div>
            <button type="button" aria-label="Précédent" onClick={() => setSlide((slide + photos.length - 1) % photos.length)} className="absolute top-1/2 left-1 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow ring-1 ring-line">
              <ChevronLeft className="size-5 text-brand-600" />
            </button>
            <button type="button" aria-label="Suivant" onClick={() => setSlide((slide + 1) % photos.length)} className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow ring-1 ring-line">
              <ChevronRight className="size-5 text-brand-600" />
            </button>
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <SideActions id={id} />
        <div className={cn(card, 'p-4')}>
          <Heading icon={<UserRound />}>Contact & accès</Heading>
          <ul className="mt-3 space-y-2.5 text-[15px] text-navy-900 [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:fill-brand-600 [&_svg]:text-white">
            <li className="flex items-center gap-3"><Phone className="!fill-none !text-brand-600" />{a.telephone}</li>
            <li className="flex items-center gap-3"><Mail className="!fill-none !text-brand-600" />{a.email}</li>
            <li className="flex items-center gap-3"><Globe className="!fill-none !text-brand-600" />{a.site}</li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5" />
              <span>
                {a.ville} – {a.quartier}
                {a.adresse && <span className="block text-[12px]">({a.adresse})</span>}
              </span>
            </li>
          </ul>
          <div className="relative mt-3 overflow-hidden rounded-xl">
            <Img src="/maquette/ae-carte.jpg" alt="Plan d’accès" className="h-[190px] w-full" />
            <button type="button" onClick={() => toast('Ouverture de la carte (démo)')} className="absolute inset-x-0 bottom-0 h-14" aria-label="Voir sur la carte" />
          </div>
        </div>
      </aside>
    </div>
  )
}

function WhyCard() {
  return (
    <div className={cn(card, 'p-4')}>
      <Heading icon={<Medal />}>Pourquoi nous choisir ?</Heading>
      <ul className="mt-3 space-y-2.5">
        {pourquoiNousChoisir.map((t) => (
          <GreenCheck key={t}>{t}</GreenCheck>
        ))}
      </ul>
    </div>
  )
}

function FilterBox({ title, children, onReset }: { title: string; children: ReactNode; onReset: () => void }) {
  return (
    <aside className={cn(card, 'flex h-fit flex-col p-4 lg:min-h-[480px]')}>
      <p className="flex items-center gap-2.5 border-b border-line pb-3 text-[18px] font-bold text-navy-900">
        <Funnel className="size-6" /> {title}
      </p>
      <div className="flex-1">{children}</div>
      <button type="button" onClick={onReset} className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[#c9d4ea] bg-white text-[15px] font-semibold text-navy-900 hover:bg-brand-50">
        <RefreshCw className="size-5" />
        Réinitialiser
      </button>
    </aside>
  )
}

function CheckLine({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1 text-[14px] text-navy-900">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-[18px] accent-brand-600" />
      {label}
    </label>
  )
}

const permisLabels: Record<PermisCode, string> = { A: 'Permis A – Moto', B: 'Permis B – Véhicule léger', C: 'Permis C – Poids lourd', D: 'Permis D – Transport en commun', E: 'Permis E – Remorque' }

function Formations({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const [sel, setSel] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const codes = (['A', 'B', 'C', 'D', 'E'] as PermisCode[]).filter((c) => a.permis.includes(c))
  const list = codes.filter((c) => sel.length === 0 || sel.includes(c))
  return (
    <div className="grid gap-4 lg:grid-cols-[254px_1fr_316px]">
      <FilterBox
        title="Filtrer les formations"
        onReset={() => {
          setSel([])
          setTypes([])
        }}
      >
        <p className="mt-3 mb-1 text-[16px] font-bold text-navy-900">Catégorie de permis</p>
        {codes.map((c) => (
          <CheckLine key={c} label={permisLabels[c]} checked={sel.includes(c)} onChange={(on) => setSel(on ? [...sel, c] : sel.filter((x) => x !== c))} />
        ))}
        <p className="mt-3 mb-1 border-t border-line pt-3 text-[16px] font-bold text-navy-900">Type de formation</p>
        {['Formation initiale', 'Renforcement / Recyclage'].map((t) => (
          <CheckLine key={t} label={t} checked={types.includes(t)} onChange={(on) => setTypes(on ? [...types, t] : types.filter((x) => x !== t))} />
        ))}
      </FilterBox>
      <div className="space-y-3">
        <div className={cn(card, 'flex items-center justify-between px-4 py-3')}>
          <Heading icon={<GraduationCap />}>Nos formations et catégories de permis</Heading>
          <span className="text-[13px] text-navy-900">{list.length} formations</span>
        </div>
        {list.map((c) => {
          const p = permisCatalogue[c]
          return (
            <div key={c} className={cn(card, 'flex flex-col gap-4 p-2.5 sm:flex-row sm:items-center')}>
              <Img src={p.image} alt={p.vehicule} className="h-[82px] w-full rounded-lg sm:w-[150px]" />
              <div className="flex-1">
                <p className="text-[20px] font-bold text-navy-900">Permis {c} – {c === 'A' ? 'Moto' : p.nom}</p>
                <p className="text-[14.5px] text-navy-900">{p.sous}</p>
                <p className="mt-1 flex items-center gap-3 text-[15px] text-navy-900">
                  <span className="inline-flex items-center gap-1.5"><Clock className="size-5 text-brand-600" />{p.duree}</span>
                  <span className="h-5 w-px bg-line" />
                  <span className="inline-flex items-center gap-1.5 font-bold text-brand-600"><Coins className="size-5" />{p.prix.toLocaleString('fr-FR')} FCFA</span>
                </p>
              </div>
              <Link to={`/ecoles/auto-ecoles/${a.id}/permis/${c}`} className="mr-2 inline-flex h-10 items-center gap-2 rounded-xl border-2 border-brand-600/60 px-5 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                Voir les détails <ChevronRight className="size-4" />
              </Link>
            </div>
          )
        })}
      </div>
      <div className="space-y-4">
        <WhyCard />
        <Link to={inscrireHref(id)} className="flex items-center gap-4 rounded-2xl bg-[linear-gradient(120deg,#1f55e6,#2f6bff)] p-5 text-white shadow-lg shadow-brand-600/30">
          <span className="flex-1">
            <span className="flex items-center gap-2.5 text-[20px] font-bold"><CalendarDays className="size-7" />S’inscrire maintenant</span>
            <span className="mt-1 block text-[14.5px] text-white/90">Choisissez votre formation et démarrez votre inscription.</span>
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-white text-brand-600"><ArrowRight className="size-6" /></span>
        </Link>
      </div>
    </div>
  )
}

function Tarifs({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const codes = (['A', 'B', 'C', 'D', 'E'] as PermisCode[]).filter((c) => a.permis.includes(c))
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_338px]">
      <div className="space-y-4">
        <div className={cn(card, 'space-y-3 p-4')}>
          <Heading icon={<Coins />} className="text-[25px] [&_svg]:size-9">Nos tarifs de formation</Heading>
          {codes.map((c) => {
            const p = permisCatalogue[c]
            return (
              <div key={c} className="flex flex-col gap-4 rounded-xl border border-line p-2 sm:flex-row sm:items-center">
                <Img src={p.tarifImage} alt={p.vehicule} className="h-[74px] w-full rounded-lg sm:w-[158px]" />
                <div className="flex-1">
                  <p className="text-[20px] font-bold text-navy-900">Permis {c} – {p.nom}</p>
                  <p className="mt-1 flex items-center gap-3 text-[15px] text-navy-900">
                    <span className="inline-flex items-center gap-1.5"><Clock className="size-5 text-brand-600" />{p.duree}</span>
                    <span className="h-5 w-px bg-line" />
                    <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-5 text-brand-600" />Formation complète</span>
                  </p>
                </div>
                <span className="rounded-xl bg-[#e8efff] px-6 py-3 text-[24px] font-extrabold text-brand-700">{p.prix.toLocaleString('fr-FR')} FCFA</span>
                <Link to={inscrireHref(id, c)} className="mr-2 inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-7 text-[15px] font-semibold text-white hover:bg-brand-700">
                  S’inscrire <ArrowRight className="size-5" />
                </Link>
              </div>
            )
          })}
        </div>
        <div className={cn(card, 'flex items-center gap-3 px-4 py-3 text-[15px] text-navy-900')}>
          <Info className="size-6 text-brand-600" />
          <span>
            Les tarifs peuvent varier selon la session. Consultez le{' '}
            <Link to={`/ecoles/auto-ecoles/${a.id}/planning`} className="text-brand-600 underline">planning</Link> pour les prochaines dates de formation.
          </span>
        </div>
      </div>
      <aside className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CircleCheck />}>Ce que comprend le tarif</Heading>
          <ul className="mt-3 space-y-2">
            {['Cours de code (théorie)', 'Conduite pratique avec moniteur', 'Supports pédagogiques', 'Accompagnement à l’examen', 'Frais internes de formation'].map((t) => (
              <GreenCheck key={t}>{t}</GreenCheck>
            ))}
          </ul>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CreditCard />}>Modalités de paiement</Heading>
          <ul className="mt-3 space-y-3 text-[15px] text-navy-900">
            <li className="flex items-center gap-3"><Wallet className="size-6 text-brand-600" /><span className="flex-1">Paiement en une seule fois</span><span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[13px] font-bold text-white">– 5 %</span></li>
            <li className="flex items-start gap-3"><CalendarDays className="size-6 text-brand-600" /><span><b>Paiement en plusieurs échéances</b><span className="block text-[14px]">(conditions à l’inscription)</span></span></li>
          </ul>
        </div>
        <Link to={inscrireHref(id)} className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-brand-600 text-[20px] font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700">
          <Send className="size-6" />
          S’inscrire maintenant
        </Link>
      </aside>
    </div>
  )
}

function Planning({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const [sel, setSel] = useState<string[]>(['B'])
  const [session, setSession] = useState<string[]>(['Prochaines sessions'])
  const codes = (['A', 'B', 'C', 'D', 'E'] as PermisCode[]).filter((c) => a.permis.includes(c))
  const list = sessions.filter((s) => a.permis.includes(s.permis))
  const prochaine = sessions[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[222px_1fr_296px]">
      <FilterBox
        title="Filtrer le planning"
        onReset={() => {
          setSel([])
          setSession([])
        }}
      >
        <p className="mt-3 mb-1 text-[16px] font-bold text-navy-900">Catégorie de permis</p>
        {codes.map((c) => (
          <CheckLine key={c} label={permisLabels[c]} checked={sel.includes(c)} onChange={(on) => setSel(on ? [...sel, c] : sel.filter((x) => x !== c))} />
        ))}
        <p className="mt-3 mb-1 border-t border-line pt-3 text-[16px] font-bold text-navy-900">Session</p>
        {['Prochaines sessions', 'Sessions à venir'].map((t) => (
          <CheckLine key={t} label={t} checked={session.includes(t)} onChange={(on) => setSession(on ? [...session, t] : session.filter((x) => x !== t))} />
        ))}
      </FilterBox>
      <div className={cn(card, 'overflow-hidden')}>
        <div className="p-4">
          <Heading icon={<CalendarDays />}>Prochaines sessions de formation</Heading>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[14px] text-navy-900">
            <thead>
              <tr className="bg-[#eef3fc] text-left text-[14px] font-semibold">
                <th className="py-3 pl-4">Formation / Permis</th>
                <th>Date de début</th>
                <th>Horaires</th>
                <th>Durée</th>
                <th>Places</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const p = permisCatalogue[s.permis]
                return (
                  <tr key={s.permis + s.debut} className="border-b border-line last:border-0">
                    <td className="py-3 pl-4">
                      <span className="flex items-center gap-3">
                        <Img src={p.image} alt="" className="h-12 w-[76px] rounded-md" />
                        <span className="leading-tight">
                          <b className="block text-[15px]">Permis {s.permis}</b>
                          {s.permis === 'D' ? 'Transport commun' : s.permis === 'A' ? 'Moto' : p.nom}
                        </span>
                      </span>
                    </td>
                    <td><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-5 text-brand-600" />{s.debut}</span></td>
                    <td><span className="inline-flex items-center gap-1.5"><Clock className="size-5 text-brand-600" /><span className="leading-tight">{s.horaires[0]}<span className="block">{s.horaires[1]}</span></span></span></td>
                    <td><span className="inline-flex items-center gap-1.5"><Hourglass className="size-5 text-brand-600" />{s.duree}</span></td>
                    <td><span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{s.places} places</span></td>
                    <td className="pr-3 text-right">
                      <Link to={inscrireHref(id, s.permis)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-700">
                        S’inscrire <ArrowRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <aside className="space-y-4">
        <div className={cn(card, 'space-y-3 p-4')}>
          <Heading icon={<CalendarDays />}>Prochaine rentrée</Heading>
          <p className="rounded-xl bg-[#dcf5e4] py-3 text-center text-[24px] font-extrabold text-navy-900">15 novembre 2026</p>
          <p className="flex items-center gap-2.5 text-[15px] text-navy-900"><Car className="size-5 text-navy-800" />Permis {prochaine.permis} – {permisCatalogue[prochaine.permis].nom}</p>
          <p className="flex items-center gap-2.5 text-[15px] text-navy-900"><Clock className="size-5 text-navy-800" />{prochaine.horaires[0]} : {prochaine.horaires[1]}</p>
          <Link to={inscrireHref(id, prochaine.permis)} className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
            <Send className="size-5" />
            S’inscrire maintenant
          </Link>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Info />}>Bon à savoir</Heading>
          <ul className="mt-3 space-y-2.5">
            {['Cours de code : jour, soir et week-end', 'Planning flexible selon les sessions', 'Groupes à effectif limité', 'Inscription ouverte toute l’année'].map((t) => (
              <GreenCheck key={t}>{t}</GreenCheck>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

function Galerie({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const [cat, setCat] = useState('Toutes')
  const cats = [
    { nom: 'Toutes', count: 24, icon: null },
    { nom: 'Centre', count: 6, icon: <Building2 /> },
    { nom: 'Véhicules', count: 8, icon: <Car /> },
    { nom: 'Cours', count: 5, icon: <Users /> },
    { nom: 'Examens', count: 5, icon: <Award /> },
  ]
  const rows = [
    ['/maquette/aeg-1.jpg', '/maquette/aeg-2.jpg', '/maquette/aeg-3.jpg'],
    ['/maquette/aeg-4.jpg', '/maquette/aeg-5.jpg', '/maquette/aeg-6.jpg', '/maquette/aeg-7.jpg'],
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_286px]">
      <div className="space-y-3">
        <div className={cn(card, 'flex flex-wrap items-center gap-3 px-4 py-3')}>
          <span className="flex items-center gap-2.5 pr-3 text-[18px] font-bold text-navy-900"><ImageIcon className="size-7 text-brand-600" />Catégories</span>
          {cats.map((c) => (
            <button
              key={c.nom}
              type="button"
              onClick={() => setCat(c.nom)}
              className={cn('inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold [&_svg]:size-5', cat === c.nom ? 'bg-brand-600 text-white' : 'bg-[#eef3fc] text-navy-900 hover:bg-brand-100')}
            >
              {c.icon}
              {c.nom} ({c.count})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[1.12fr_0.97fr_1fr] gap-3">
          {rows[0].map((src) => (
            <button key={src} type="button" onClick={() => toast(`Photo de ${a.nom} (démo)`)} className="overflow-hidden rounded-xl">
              <Img src={src} alt="" className="h-[220px] w-full transition-transform hover:scale-[1.02]" />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {rows[1].map((src) => (
            <button key={src} type="button" onClick={() => toast(`Photo de ${a.nom} (démo)`)} className="overflow-hidden rounded-xl">
              <Img src={src} alt="" className="h-[170px] w-full transition-transform hover:scale-[1.02]" />
            </button>
          ))}
        </div>
      </div>
      <aside className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Images />}>Notre galerie</Heading>
          <ul className="mt-3 space-y-3.5 border-t border-line pt-3 text-[15px] text-navy-900 [&_svg]:size-6 [&_svg]:text-brand-600">
            <li className="flex items-center gap-3"><ImageIcon />24 photos</li>
            <li className="flex items-center gap-3"><PlayCircle />3 vidéos</li>
            <li className="flex items-center gap-3"><Building2 />Notre centre de formation</li>
            <li className="flex items-center gap-3"><Car />Nos véhicules d’apprentissage</li>
            <li className="flex items-center gap-3"><Users />Nos cours en salle</li>
            <li className="flex items-center gap-3"><Award />Nos examens pratiques</li>
          </ul>
        </div>
        <button type="button" onClick={() => toast('Lecture des vidéos (démo)')} className={cn(card, 'flex w-full items-center justify-center p-4')}>
          <span className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-brand-600 text-[18px] font-semibold text-white">
            <PlayCircle className="size-7" />
            Voir les vidéos
          </span>
        </button>
      </aside>
    </div>
  )
}

const critereIcons = [CircleGauge, Users, CalendarDays, Building2, Handshake]

function Avis({ id }: { id: string }) {
  const a = autoEcoleById(id)
  const colors = ['bg-emerald-600', 'bg-emerald-400', 'bg-amber-300', 'bg-orange-400', 'bg-rose-500']
  const starColors = ['fill-emerald-600 text-emerald-600', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400']
  return (
    <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
      <div className={cn(card, 'h-fit p-4')}>
        <Heading icon={<Star className="!fill-none" />}>Note globale</Heading>
        <div className="text-center">
          <p className="text-[44px] leading-tight font-extrabold text-navy-900">
            {a.note.toLocaleString('fr-FR')}
            <span className="text-[28px] font-semibold">/5</span>
          </p>
          <Stars value={a.note} size="lg" />
          <p className="mt-1 text-[15px] text-brand-700">Basée sur {a.avis} avis vérifiés</p>
        </div>
        <ul className="mt-3 space-y-1 border-b border-line pb-3">
          {repartitionAutoEcole.map((r, i) => (
            <li key={r.etoiles} className="flex items-center gap-2 text-[14px] font-semibold text-navy-900">
              <span className="w-3">{r.etoiles}</span>
              <Star className={cn('size-4', starColors[i])} />
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]">
                <span className={cn('block h-full rounded-full', colors[i])} style={{ width: `${r.pct}%` }} />
              </span>
              <span className="w-10 text-right font-normal">{r.pct} %</span>
            </li>
          ))}
        </ul>
        <ul className="divide-y divide-line">
          {criteresAvis.map((c, i) => {
            const Icon = critereIcons[i]
            return (
              <li key={c.nom} className="flex items-center gap-3 py-1.5 text-[14px] text-navy-900">
                <Icon className="size-5 text-brand-600" />
                <span className="flex-1">{c.nom}</span>
                <b>{c.note.toLocaleString('fr-FR')}</b>
              </li>
            )
          })}
        </ul>
        <Link to={`/ecoles/auto-ecoles/${a.id}/avis/nouveau`} className="mt-4 flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[19px] font-semibold text-white hover:bg-brand-700">
          <PencilLine className="size-6" />
          Donner mon avis
        </Link>
      </div>
      <div className={cn(card, 'space-y-3 p-4')}>
        <div className="flex items-center justify-between">
          <Heading icon={<MessageCircle />} className="text-[25px] [&_svg]:size-9">Avis des apprenants ({a.avis})</Heading>
          <label className="relative">
            <select aria-label="Trier" className="h-10 appearance-none rounded-xl border border-[#c9d4ea] bg-white pr-9 pl-3 text-[14px] text-navy-900">
              <option>Les plus récents</option>
              <option>Les mieux notés</option>
            </select>
            <ChevronRight className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 rotate-90" />
          </label>
        </div>
        {avisAutoEcole.map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row">
            <div className="flex items-center gap-3 sm:w-[270px]">
              <Img src={r.avatar} alt={r.nom} className="size-[62px] rounded-full" />
              <div>
                <p className="flex items-center gap-1.5 text-[16px] font-bold text-navy-900">
                  {r.nom}
                  <BadgeCheck className="size-5 fill-brand-600 text-white" />
                </p>
                <p className="text-[14.5px] text-navy-800">{r.date}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-2 text-[15px] font-semibold text-navy-900">
                <Stars value={r.note} size="md" />
                {r.note}/5
              </p>
              <p className="mt-1 text-[14px] text-navy-900">{r.texte}</p>
            </div>
            <button type="button" aria-label="Plus d'actions" onClick={() => toast('Signaler · Partager (démo)')} className="self-start p-1 text-navy-800">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
