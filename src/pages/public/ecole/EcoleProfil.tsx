import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CircleCheck,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  Info,
  Layers,
  LayoutGrid,
  List,
  Mail,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Monitor,
  PencilLine,
  Phone,
  Search,
  Star,
  Sun,
  Target,
  ThumbsUp,
  Trophy,
  Users,
  Wallet,
  ArrowRight,
  ChevronDown,
  Megaphone,
  Calculator,
  Laptop,
} from 'lucide-react'
import { FavoriteButton } from '@/components/domain/ecole'
import { SearchField } from '@/components/domain/SearchField'
import { Breadcrumb, Img, Stars } from '@/components/ui/Feedback'
import { Select } from '@/components/ui/Form'
import { LinkTabs } from '@/components/ui/Tabs'
import { useFavorites } from '@/hooks/useFavorites'
import { formationUrl } from '@/lib/ecole-links'
import { albums, avisIpc, etablissementById, formationsOf, isTypeSlug, repartitionNotes, slugOfType, typeConfig, type Formation } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

export default function EcoleProfil() {
  const { id, tab = '' } = useParams()
  const e = etablissementById(id)
  const slug = slugOfType(e.type)
  const base = `/ecoles/${slug}/etablissement/${e.id}`
  const typeLabel = isTypeSlug(slug) ? typeConfig[slug].court : 'École'
  const tabs = [
    { value: '', label: 'Aperçu', icon: <List /> },
    { value: 'formations', label: `Formations (${e.formations})`, icon: <GraduationCap /> },
    { value: 'informations', label: 'Informations', icon: <FileText /> },
    { value: 'avis', label: `Avis (${e.avis})`, icon: <Star /> },
    { value: 'galerie', label: 'Galerie', icon: <ImageIcon /> },
  ]
  const current = tabs.find((t) => t.value === tab) ?? tabs[0]
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Breadcrumb items={[{ label: 'École', to: '/ecoles' }, { label: typeLabel, to: `/ecoles/${slug}` }, { label: e.nom, to: base }, { label: current.label.replace(/ \(\d+\)$/, '') }]} className="-mt-1" />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white">
        <Img src="/maquette/fiche-hero.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[32%] object-left md:block" />
        <div className="relative flex flex-col gap-5 p-2.5 md:flex-row md:items-center">
          <Img src={e.photoFiche ?? e.image} alt={e.nom} className="h-[86px] w-full rounded-xl md:w-[210px]" />
          <div className="space-y-3 pb-2 md:pb-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[22px] font-bold md:text-[27px]">{e.nom}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[12.5px] font-semibold">
                <CircleCheck className="size-4 fill-white text-emerald-600" />
                Établissement vérifié
              </span>
            </div>
            <p className="flex flex-wrap items-center gap-x-4 text-[16px]">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <b>{e.note.toLocaleString('fr-FR')}</b>/5 ({e.avis} avis)
              </span>
              <span className="h-5 w-px bg-white/40" />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-5 fill-white/90 text-navy-800" />
                {e.ville} – {e.quartier}
              </span>
            </p>
          </div>
        </div>
      </section>
      <LinkTabs items={tabs} base={base} variant="block" className="[&>a]:flex-none [&>a]:min-w-[166px] [&>a]:text-[15px] [&>a]:h-10" />
      {tab === '' && <Apercu id={e.id} base={base} />}
      {tab === 'formations' && <Formations id={e.id} />}
      {tab === 'informations' && <Informations id={e.id} />}
      {tab === 'avis' && <Avis id={e.id} base={base} />}
      {tab === 'galerie' && <Galerie id={e.id} />}
    </div>
  )
}

function principales(id: string) {
  const e = etablissementById(id)
  return e.principales ?? e.filieres.slice(0, 5)
}

function ActionButtons({ id }: { id: string }) {
  const e = etablissementById(id)
  const first = formationsOf(e.id).find((f) => f.statut === 'Publiée')
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(e.id)
  return (
    <div className="space-y-3">
      <Link
        to={first ? `/ecoles/formations/${first.id}/preinscription` : '/ecoles'}
        className="flex h-[50px] items-center justify-center gap-3 rounded-xl bg-brand-600 text-[17px] font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700"
      >
        <PencilLine className="size-5" />
        Préinscrire maintenant
        <ArrowRight className="size-5" />
      </Link>
      <button
        type="button"
        onClick={() => toggle(e.id, 'etablissement', 'Mes établissements')}
        className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/70 bg-white text-[16px] font-semibold text-navy-800 hover:bg-brand-50"
      >
        <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
        {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
      </button>
    </div>
  )
}

const filiereTiles = [
  { bg: 'bg-[#e8f0ff]', color: 'text-brand-600', icon: Calculator },
  { bg: 'bg-[#efe8ff]', color: 'text-violet-600', icon: Users },
  { bg: 'bg-[#e1f6ee]', color: 'text-emerald-600', icon: Laptop },
  { bg: 'bg-[#fff2df]', color: 'text-orange-500', icon: BarChart3 },
  { bg: 'bg-[#fde9f3]', color: 'text-pink-600', icon: Megaphone },
]

function Apercu({ id, base }: { id: string; base: string }) {
  const e = etablissementById(id)
  const list = formationsOf(id).filter((f) => f.statut === 'Publiée')
  const diplomes = [...new Set(list.map((f) => f.diplome))]
  const fil = principales(id)
  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 lg:grid-cols-[1.06fr_0.92fr_0.74fr]">
        <button type="button" onClick={() => toast('Lecture de la vidéo de présentation (démo)')} className="overflow-hidden rounded-2xl">
          <Img src="/maquette/ipc-video.jpg" alt={`Découvrir ${e.sigle} en 1 minute`} className="h-[244px] w-full" />
        </button>
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Info className="size-6 text-brand-600" /> Présentation
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">{e.description}</p>
          <ul className="mt-3 space-y-2.5">
            {['Formations professionnalisantes', 'Encadrement par des experts', 'Stages et insertion professionnelle'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[14.5px] text-navy-900">
                <CircleCheck className="size-6 fill-emerald-500 text-white" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Building2 className="size-6 text-brand-600" /> Informations clés
          </h2>
          <dl className="mt-2 divide-y divide-line text-[14.5px]">
            {[
              { icon: <GraduationCap />, k: 'Formations', v: e.formations },
              { icon: <Layers />, k: 'Filières', v: fil.length },
              { icon: <Award />, k: 'Diplômes', v: diplomes.join(', ') },
              { icon: <Sun className="fill-amber-400 text-amber-500" />, k: 'Cours', v: 'Jour & Soir' },
              { icon: <MapPin />, k: 'Localisation', v: `${e.ville} – ${e.quartier}` },
            ].map((r) => (
              <div key={r.k} className="flex items-center gap-3 py-2 [&_svg]:size-5 [&_svg]:text-navy-800">
                {r.icon}
                <dt className="font-bold text-navy-900">{r.k} :</dt>
                <dd className="text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.98fr_0.74fr]">
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Layers className="size-6 text-brand-600" /> Nos principales filières
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {fil.map((f, i) => {
              const t = filiereTiles[i % filiereTiles.length]
              const [l1, l2] = f.includes(' & ') ? [f.split(' & ')[0], '& ' + f.split(' & ')[1]] : f.split(' ').length > 1 ? [f.split(' ')[0], f.split(' ').slice(1).join(' ')] : [f, '']
              return (
                <Link key={f} to={`${base}/formations`} className={cn('flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center text-[14px] leading-tight font-bold text-navy-900 transition-shadow hover:shadow-md', t.bg)}>
                  <t.icon className={cn('size-7', t.color)} />
                  <span>
                    {l1}
                    {l2 && <span className="block">{l2}</span>}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <ActionButtons id={id} />
        </div>
      </div>
    </div>
  )
}

function FormationLine({ f }: { f: Formation }) {
  const pill = {
    Jour: { cls: 'bg-[#fff3cf]', icon: <Sun className="size-4 fill-amber-400 text-amber-500" />, label: 'Cours de jour' },
    Soir: { cls: 'bg-[#ece6ff]', icon: <MoonIcon />, label: 'Cours du soir' },
    'Jour & Soir': { cls: 'bg-[#fde7ef]', icon: <Sun className="size-4 fill-amber-400 text-amber-500" />, label: 'Jour & Soir' },
  }[f.mode]
  return (
    <div className={cn(card, 'relative flex flex-col gap-4 p-2.5 sm:flex-row sm:items-center')}>
      <Img src={f.image} alt={f.nom} className="h-32 w-full rounded-xl sm:h-[82px] sm:w-[162px]" />
      <div className="min-w-0 flex-1 space-y-2">
        <Link to={formationUrl(f)} className="text-[18px] font-bold text-navy-800 hover:text-brand-600">
          {f.nom}
        </Link>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-navy-900">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8efff] px-2.5 py-0.5">
            <GraduationCap className="size-4" />
            {f.diplome}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-4" />
            {f.filiere}
          </span>
        </p>
        <p className="flex items-center gap-4 text-[14px] text-navy-900">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {f.dureeMois} mois
          </span>
          <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-0.5 font-medium', pill.cls)}>
            {pill.icon}
            {pill.label}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4 border-line sm:min-w-[400px] sm:self-stretch sm:border-l sm:pl-7">
        <div>
          <p className="text-[14px] text-navy-900">Frais de formation</p>
          <p className="mt-1 rounded-full bg-[#e8efff] px-4 py-1.5 text-[18px] font-extrabold text-navy-800">
            {f.fraisAn.toLocaleString('fr-FR')} FCFA <span className="text-[15px] font-bold">/ an</span>
          </p>
        </div>
        <Link to={formationUrl(f)} className="mt-5 ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700">
          Voir les détails
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <FavoriteButton id={f.id} kind="formation" size="sm" className="absolute top-2.5 right-3 bg-transparent shadow-none ring-0" />
    </div>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-navy-800" aria-hidden>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  )
}

function Formations({ id }: { id: string }) {
  const e = etablissementById(id)
  const all = formationsOf(id).filter((f) => f.statut === 'Publiée')
  const [q, setQ] = useState('')
  const list = all.filter((f) => f.nom.toLowerCase().includes(q.toLowerCase()))
  const diplomes = [...new Set(all.map((f) => f.diplome))]
  const fil = principales(id)
  return (
    <div className="grid gap-4 lg:grid-cols-[258px_1fr]">
      <div className={cn(card, 'h-fit space-y-3 p-4')}>
        <h2 className="flex items-center gap-2 text-[18px] font-bold text-navy-900">
          <Info className="size-5 text-brand-600" /> À propos de l’{e.sigle}
        </h2>
        <ul className="space-y-1.5 text-[14px] text-navy-900 [&_svg]:size-[18px]">
          <li className="flex items-center gap-2.5"><GraduationCap />{e.formations} formations</li>
          <li className="flex items-center gap-2.5"><Layers />{fil.length} filières</li>
          <li className="flex items-center gap-2.5"><Award />{diplomes.join(', ')}</li>
          <li className="flex items-center gap-2.5"><CalendarDays />Cours : Jour et Soir</li>
        </ul>
        <h3 className="flex items-center gap-2 border-t border-line pt-3 text-[17px] font-bold text-navy-900">
          <BarChart3 className="size-5 text-brand-600" /> Principales filières
        </h3>
        <div className="space-y-1.5">
          {fil.map((f) => (
            <span key={f} className="block rounded-full bg-[#e8efff] px-4 py-1 text-[14px] text-navy-900">{f}</span>
          ))}
        </div>
        <FavoriteWide id={id} />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 text-[24px] font-bold text-navy-900">
            <GraduationCap className="size-8" /> Nos formations ({e.formations})
          </h2>
          <span className="flex items-center gap-2 text-sm">
            Trier par :
            <span className="w-44"><Select aria-label="Trier par" options={['Pertinence', 'Frais croissants', 'Durée']} className="h-10" /></span>
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
            <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Rechercher une formation..." className="h-[46px] w-full rounded-full border border-line bg-white pr-4 pl-11 text-[14px] outline-none focus:ring-3 focus:ring-brand-100" />
          </label>
          <SearchField icon={<Layers />} label="Filière" hint="Toutes" options={fil} className="h-[46px] border border-line" />
          <SearchField icon={<Award />} label="Diplôme" hint="Tous" options={diplomes} className="h-[46px] border border-line" />
          <SearchField icon={<CalendarDays />} label="Cours" hint="Tous" options={['Jour', 'Soir', 'Jour & Soir']} className="h-[46px] border border-line" />
        </div>
        {list.map((f) => (
          <FormationLine key={f.id} f={f} />
        ))}
      </div>
    </div>
  )
}

function FavoriteWide({ id }: { id: string }) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(id)
  return (
    <button
      type="button"
      onClick={() => toggle(id, 'etablissement', 'Mes établissements')}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/70 text-[15px] font-semibold text-navy-800 hover:bg-brand-50"
    >
      <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
      {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
    </button>
  )
}

function Informations({ id }: { id: string }) {
  const e = etablissementById(id)
  const list = formationsOf(id).filter((f) => f.statut === 'Publiée')
  const [sec, setSec] = useState('Présentation')
  const sections = [
    { label: 'Présentation', icon: <Info /> },
    { label: 'Conditions d’admission', icon: <GraduationCap /> },
    { label: 'Frais & paiements', icon: <Wallet /> },
    { label: 'Calendrier académique', icon: <CalendarDays /> },
    { label: 'Contact & localisation', icon: <MapPin /> },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-[294px_1fr_336px]">
      <div className="space-y-4">
        <div className={cn(card, 'space-y-2 p-3')}>
          {sections.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSec(s.label)}
              className={cn('flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-[15.5px] font-semibold [&_svg]:size-6', sec === s.label ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
        <div className={cn(card, 'p-4')}>
          <ActionButtons id={id} />
        </div>
      </div>
      <div className={cn(card, 'p-5')}>
        {sec === 'Présentation' ? (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
              <Info className="size-6 text-brand-600" /> Présentation de l’établissement
            </h2>
            <p className="text-[15px] leading-relaxed text-ink">
              {e.nom} est un établissement de formation supérieure agréé, dédié à la formation de professionnels compétents et immédiatement opérationnels sur le marché du travail.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: <Trophy className="text-amber-500" />, t: ['Formation', 'de qualité'] },
                { icon: <Users className="text-brand-600" />, t: ['Enseignants', 'expérimentés'] },
                { icon: <Briefcase className="text-brand-600" />, t: ['Stages &', 'emploi'] },
              ].map((x) => (
                <div key={x.t[0]} className="flex items-center justify-center gap-3 rounded-xl bg-[#eef3fc] px-3 py-2.5 text-[14px] leading-tight font-semibold text-navy-900 [&_svg]:size-8">
                  {x.icon}
                  <span>
                    {x.t[0]}
                    <span className="block">{x.t[1]}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-3">
              <h3 className="flex items-center gap-2.5 text-[18px] font-bold text-navy-900">
                <Target className="size-6 text-brand-600" /> Notre mission
              </h3>
              <p className="mt-1 pl-9 text-[13.5px] text-ink">Former des professionnels qualifiés, dotés de compétences pratiques et adaptées aux besoins des entreprises.</p>
            </div>
            <div className="border-t border-line pt-3">
              <h3 className="flex items-center gap-2.5 text-[18px] font-bold text-navy-900">
                <Target className="size-6 text-brand-600" /> Nos atouts
              </h3>
              <ul className="mt-1.5 space-y-1 pl-2 text-[13.5px] text-navy-900">
                {['Formations professionnalisantes et certifiantes', 'Encadrement par des experts du métier', 'Partenariats avec des entreprises', 'Accompagnement vers l’insertion professionnelle'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <CheckMark />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <InfoSection sec={sec} id={id} />
        )}
      </div>
      <div className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Building2 className="size-6 text-brand-600" /> Informations générales
          </h2>
          <dl className="mt-2 divide-y divide-line text-[14.5px]">
            {[
              { icon: <Award />, k: 'Statut', v: 'Établissement agréé' },
              { icon: <Layers />, k: 'Diplômes', v: [...new Set(list.map((f) => f.diplome))].join(', ') },
              { icon: <Sun className="fill-amber-400 text-amber-500" />, k: 'Cours', v: 'Jour & Soir' },
              { icon: <CalendarDays />, k: 'Rentrée', v: e.rentree },
            ].map((r) => (
              <div key={r.k} className="grid grid-cols-[22px_74px_10px_1fr] items-center gap-1.5 py-2 [&_svg]:size-5 [&_svg]:text-navy-800">
                {r.icon}
                <dt className="font-bold text-navy-900">{r.k}</dt>
                <span>:</span>
                <dd className="text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <MapPin className="size-6 text-brand-600" /> Contact & localisation
          </h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold text-navy-900">
            <li className="flex items-center gap-3 rounded-lg bg-[#f5f8fd] px-3 py-1.5"><Phone className="size-5" />{e.telephone}</li>
            <li className="flex items-center gap-3 rounded-lg px-3 py-1.5 font-medium"><Mail className="size-5" />{e.email}</li>
            <li className="flex items-center gap-3 rounded-lg bg-[#f5f8fd] px-3 py-1.5 font-medium"><MapPin className="size-5" />{e.ville} – {e.quartier}</li>
          </ul>
          <button type="button" onClick={() => toast('Ouverture de la carte (démo)')} className="mt-3 flex h-11 w-full items-center justify-center gap-3 rounded-full border-2 border-brand-600/70 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
            <MapIcon className="size-5" />
            Voir sur la carte
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}

function InfoSection({ sec, id }: { sec: string; id: string }) {
  const e = etablissementById(id)
  const rows: Record<string, [string, string][]> = {
    'Conditions d’admission': [
      ['Niveau requis', 'Baccalauréat (toutes séries) ou équivalent'],
      ['Mode de sélection', 'Étude du dossier et/ou entretien'],
      ['Période de candidature', '01 juil. – 30 sept. 2026'],
      ['Pièces', 'Diplôme, relevés de notes, CNI, 4 photos'],
    ],
    'Frais & paiements': [
      ['Frais d’inscription', '50 000 FCFA'],
      ['Frais de scolarité', 'De 450 000 à 750 000 FCFA / an'],
      ['Modalités', '1 fois (–5 %), 2 tranches ou mensuel'],
      ['Paiement', 'Orange Money, MTN MoMo, Express Union'],
    ],
    'Calendrier académique': [
      ['Ouverture des candidatures', '01 juillet 2026'],
      ['Clôture des candidatures', '30 septembre 2026'],
      ['Rentrée académique', e.rentree],
      ['Examens du 1er semestre', 'Février 2027'],
    ],
    'Contact & localisation': [
      ['Téléphone', e.telephone],
      ['E-mail', e.email],
      ['Adresse', `${e.quartier}, ${e.ville}`],
      ['Horaires', 'Lun – Sam · 08h – 18h'],
    ],
  }
  return (
    <div className="space-y-3">
      <h2 className="text-[21px] font-bold text-navy-900">{sec}</h2>
      <dl className="divide-y divide-line">
        {(rows[sec] ?? []).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3 text-[14.5px]">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-semibold text-navy-900">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Laurel({ flip }: { flip?: boolean }) {
  const pt = (t: number) => {
    const x = (1 - t) * (1 - t) * 24 + 2 * (1 - t) * t * 2 + t * t * 24
    const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * 34 + t * t * 64
    return [x, y]
  }
  const leaves = [0.12, 0.26, 0.4, 0.54, 0.68, 0.82]
  return (
    <svg viewBox="0 0 34 70" className={cn('h-[70px] w-9 text-amber-400', flip && '-scale-x-100')} aria-hidden>
      <path d="M24 4 Q 2 34 24 64" stroke="currentColor" strokeWidth="2" fill="none" />
      {leaves.map((t) => {
        const [x, y] = pt(t)
        return (
          <g key={t} fill="currentColor">
            <ellipse cx={x - 4} cy={y} rx="2.6" ry="5.2" transform={`rotate(-35 ${x - 4} ${y})`} />
            <ellipse cx={x + 3.5} cy={y - 1} rx="2.6" ry="5.2" transform={`rotate(35 ${x + 3.5} ${y - 1})`} />
          </g>
        )
      })}
    </svg>
  )
}

function Avis({ id, base }: { id: string; base: string }) {
  const e = etablissementById(id)
  const [f, setF] = useState('tous')
  const list = f === 'tous' ? avisIpc : avisIpc.filter((a) => (f === 'etudiants' ? a.role.startsWith('Étudiant') : f === 'anciens' ? a.role.startsWith('Ancien') : a.role === 'Entreprise'))
  const filtres = [
    { value: 'tous', label: `Tous (${e.avis})`, icon: null },
    { value: 'etudiants', label: `Étudiants (${Math.round(e.avis * 0.734)})`, icon: <GraduationCap /> },
    { value: 'anciens', label: `Anciens étudiants (${Math.round(e.avis * 0.196)})`, icon: <Briefcase /> },
    { value: 'entreprises', label: `Entreprises (${Math.round(e.avis * 0.07)})`, icon: <Users /> },
  ]
  return (
    <div className="grid gap-5 lg:grid-cols-[324px_1fr]">
      <div className={cn(card, 'h-fit p-5')}>
        <p className="text-center text-[20px] font-bold text-navy-900">Note globale</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Laurel />
          <div className="text-center">
            <p className="flex items-baseline gap-1 text-[44px] leading-none font-extrabold text-navy-900">
              <Star className="mr-1 size-9 self-center fill-amber-400 text-amber-400" />
              {e.note.toLocaleString('fr-FR')}
              <span className="text-[24px] font-semibold">/5</span>
            </p>
            <p className="mt-1 text-[14px] text-ink">({e.avis} avis)</p>
          </div>
          <Laurel flip />
        </div>
        <ul className="mt-5 space-y-2.5 border-b border-line pb-5">
          {repartitionNotes.map((r) => (
            <li key={r.etoiles} className="flex items-center gap-2.5 text-[15px] text-navy-900">
              <span className="w-3">{r.etoiles}</span>
              <Star className="size-[18px] fill-amber-400 text-amber-400" />
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]">
                <span className="block h-full rounded-full bg-brand-600" style={{ width: `${r.pct}%` }} />
              </span>
              <span className="w-10 text-right">{r.pct} %</span>
            </li>
          ))}
        </ul>
        <Link to={`${base}/avis/nouveau`} className="mt-5 flex h-12 items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/70 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
          <PencilLine className="size-5" />
          Donner mon avis
        </Link>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[22px] font-bold text-navy-900">
            <MessageCircle className="size-7 fill-brand-600 text-white" /> Avis des apprenants ({e.avis})
          </h2>
          <span className="flex items-center gap-2 text-sm">
            Trier par :
            <span className="w-44"><Select aria-label="Trier par" options={['Les plus récents', 'Les mieux notés', 'Les plus utiles']} className="h-10" /></span>
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filtres.map((x) => (
            <button
              key={x.value}
              type="button"
              onClick={() => setF(x.value)}
              className={cn('inline-flex h-10 items-center gap-2 rounded-full px-5 text-[15px] font-semibold [&_svg]:size-5', f === x.value ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900 hover:bg-brand-50')}
            >
              {x.icon}
              {x.label}
            </button>
          ))}
        </div>
        {list.map((r) => (
          <AvisLine key={r.id} r={r} />
        ))}
        <div className="flex justify-center pt-1">
          <button type="button" onClick={() => toast('Chargement d’autres avis (démo)')} className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-brand-600/60 bg-white px-11 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
            Voir plus d’avis ({e.avis - 3})
            <ChevronDown className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AvisLine({ r }: { r: (typeof avisIpc)[number] }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className={cn(card, 'flex flex-col gap-3 p-3 sm:flex-row sm:items-center')}>
      <div className="flex items-center gap-3 sm:w-[310px]">
        <Img src={r.avatar} alt={r.nom} className="size-14 rounded-full" />
        <div>
          <p className="flex items-center gap-2 text-[16px] font-bold text-navy-900">
            {r.nom}
            <span className="rounded-md bg-[#e6eeff] px-2 py-0.5 text-[13px] font-medium text-navy-800">{r.role}</span>
          </p>
          <p className="mt-1 flex items-center gap-2 text-[14px] text-ink">
            <Stars value={r.note} size="sm" />· {r.date}
          </p>
        </div>
      </div>
      <p className="flex-1 border-line text-[14px] leading-snug text-navy-900 sm:border-l sm:pl-5">{r.texte}</p>
      <button type="button" onClick={() => setLiked(!liked)} className={cn('inline-flex items-center gap-2 px-3 text-[15px] font-semibold', liked ? 'text-brand-600' : 'text-navy-900')}>
        <ThumbsUp className={cn('size-5 text-brand-600', liked && 'fill-brand-600')} />
        {r.utile + (liked ? 1 : 0)}
      </button>
    </div>
  )
}

const albumIcons = { 'Campus & bâtiments': Building2, 'Salles de cours': Monitor, Laboratoires: FlaskConical, Bibliothèque: BookOpen, 'Vie étudiante': Users } as const

function Galerie({ id }: { id: string }) {
  const [cat, setCat] = useState('Toutes les photos')
  const total = albums.reduce((s, a) => s + a.count, 0)
  const shown = cat === 'Toutes les photos' ? albums : albums.filter((a) => a.nom === cat)
  return (
    <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
      <div className={cn(card, 'h-fit p-4')}>
        <h2 className="flex items-start gap-3 text-[21px] leading-tight font-bold text-navy-900">
          <ImageIcon className="size-11 shrink-0 text-brand-600" strokeWidth={1.6} />
          Galerie de l’établissement
        </h2>
        <p className="mt-3 text-[14.5px] text-ink">Découvrez en images notre campus, nos infrastructures et la vie étudiante.</p>
        <div className="mt-4 space-y-2">
          {[{ nom: 'Toutes les photos', count: total }, ...albums].map((a) => {
            const Icon = a.nom === 'Toutes les photos' ? LayoutGrid : albumIcons[a.nom as keyof typeof albumIcons]
            return (
              <button
                key={a.nom}
                type="button"
                onClick={() => setCat(a.nom)}
                className={cn('flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold', cat === a.nom ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}
              >
                <Icon className="size-5" />
                <span className="flex-1">{a.nom}</span>
                <span className="font-medium">({a.count})</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="flex items-center gap-2.5 text-[22px] font-bold text-navy-900">
          <ImageIcon className="size-7" /> {cat} ({cat === 'Toutes les photos' ? total : albums.find((a) => a.nom === cat)?.count})
        </h2>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
          {shown.map((a) => (
            <button key={a.nom} type="button" onClick={() => toast(`Album « ${a.nom} » (démo)`)} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
              <Img src={a.image} alt={a.nom} className="h-[162px] w-full" />
            </button>
          ))}
          {cat === 'Toutes les photos' && (
            <button type="button" onClick={() => toast(`Lecture de la vidéo de ${id.toUpperCase()} (démo)`)} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
              <Img src="/maquette/album-video.jpg" alt="Vidéo de présentation" className="h-[162px] w-full" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
