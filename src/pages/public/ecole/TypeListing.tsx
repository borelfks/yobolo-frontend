import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import {
  Database,
  Funnel,
  Coins,
  Clock3,
  Map as MapIcon,
  CircleCheck,
  HardHat,
  FileCheck2,
  ChevronRight,
  Award,
  CalendarDays,
  FileBadge,
  Building2,
  Flame,
  GraduationCap,
  Heart,
  Layers,
  LayoutGrid,
  MapPin,
  Moon,
  Repeat,
  Sun,
} from 'lucide-react'
import { EcoleCard, FormationRow, Hero, ResultsHeader, SearchPanel } from '@/components/domain/ecole'
import { ArrowDot, IconCountList, InlineSearch, SidePanel } from '@/components/domain/listing'
import { domaineIcon, tilePalette } from '@/lib/domaines'
import { Card } from '@/components/ui/Card'
import { Img, Pagination } from '@/components/ui/Feedback'
import { LinkTabs } from '@/components/ui/Tabs'
import {
  diplomesParType,
  domainesParType,
  filieresCartes,
  etablissementById,
  etablissementsOfType,
  formations,
  isTypeSlug,
  regions,
  typeConfig,
  villes,
  villesParRegion,
  type TypeSlug,
} from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const heroImages: Record<string, string> = {
  '': '/maquette/ipes-hero.jpg',
  filieres: '/maquette/hero-filieres.jpg',
  diplomes: '/maquette/hero-diplomes.jpg',
  regions: '/maquette/hero-regions.jpg',
  villes: '/maquette/hero-villes.jpg',
  frais: '/maquette/ipes-hero.jpg',
  cours: '/maquette/ipes-hero.jpg',
}

export default function TypeListing() {
  const { type, tab = '' } = useParams()
  if (!isTypeSlug(type)) return <Navigate to="/ecoles" replace />
  const cfg = typeConfig[type]
  const base = `/ecoles/${type}`
  const tabs = [
    { value: '', label: `${cfg.court} (${cfg.count})`, icon: <GraduationCap /> },
    { value: 'filieres', label: 'Filières', icon: <Layers /> },
    { value: 'diplomes', label: 'Diplômes', icon: <FileBadge /> },
    { value: 'regions', label: 'Régions', icon: <MapPin /> },
    { value: 'villes', label: 'Villes', icon: <Building2 /> },
    { value: 'frais', label: 'Frais', icon: <Coins /> },
    { value: 'cours', label: 'Cours (Jour/Soir)', icon: <CalendarDays /> },
  ]
  const titles: Record<string, [string, string | undefined, string]> = {
    '': [cfg.court, cfg.long, 'Formations professionnelles et diplômantes pour booster votre carrière.'],
    filieres: [`Filières des ${cfg.pluriel}`, undefined, `Découvrez toutes les filières de formation proposées par les ${cfg.long}.`],
    diplomes: [`Diplômes des ${cfg.pluriel}`, undefined, 'Explorez les formations par niveau de diplôme et trouvez le programme qui correspond à votre projet.'],
    regions: [`${cfg.court} par Région`, undefined, `Recherchez les ${cfg.pluriel} et leurs formations dans toutes les régions du Cameroun.`],
    villes: [`${cfg.court} par Villes`, undefined, `Trouvez les ${cfg.pluriel} et leurs formations dans toutes les villes du Cameroun.`],
    frais: [`Frais de formation (${cfg.court})`, undefined, `Comparez les coûts des formations dans les ${cfg.long} du Cameroun.`],
    cours: [`${cfg.court} – Cours (Jour/Soir)`, undefined, 'Trouvez les formations selon votre disponibilité : cours de jour, cours du soir ou les deux.'],
  }
  const [title, title2, subtitle] = titles[tab] ?? titles['']
  const tabIcon = tabs.find((t) => t.value === tab)?.icon
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Hero
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: cfg.court, to: base }, ...(tab ? [{ label: tabs.find((t) => t.value === tab)?.label as string }] : [])]}
        icon={tab === 'frais' ? <Database /> : tabIcon}
        image={heroImages[tab] ?? '/maquette/ipes-hero.jpg'}
        title={title}
        title2={title2}
        subtitle={subtitle}
      />
      <LinkTabs items={tabs} base={base} variant="block" />
      {tab === '' && <ListeTab type={type} />}
      {tab === 'filieres' && <FilieresTab type={type} />}
      {tab === 'diplomes' && <DiplomesTab type={type} />}
      {tab === 'regions' && <RegionsTab type={type} />}
      {tab === 'villes' && <VillesTab type={type} />}
      {tab === 'frais' && <FormationsTab type={type} mode="frais" />}
      {tab === 'cours' && <FormationsTab type={type} mode="cours" />}
    </div>
  )
}

const formationsOfType = (type: TypeSlug) => formations.filter((f) => f.statut === 'Publiée' && etablissementById(f.etablissementId).type === typeConfig[type].type)

function ListeTab({ type }: { type: TypeSlug }) {
  const cfg = typeConfig[type]
  const [q, setQ] = useState('')
  const list = etablissementsOfType(cfg.type).filter((e) => (e.nom + e.filieres.join(' ')).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-5">
      <SearchPanel
        placeholder={`Rechercher un ${cfg.court === 'Autres' ? 'établissement' : cfg.court}, une formation…`}
        fields={[
          { placeholder: 'Région', options: regions.map((r) => r.nom), icon: <MapPin /> },
          { placeholder: 'Ville', options: villes.map((v) => v.nom), icon: <Building2 /> },
          { placeholder: 'Filière', options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
          { placeholder: 'Niveau / Diplôme', hint: 'Tous', options: diplomesParType[type].map((d) => d.nom), icon: <Layers /> },
        ]}
        onSearch={setQ}
      />
      <ResultsHeader title={`${q ? list.length : cfg.count} ${cfg.pluriel} trouvés`} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((e) => (
          <EcoleCard key={e.id} e={e} />
        ))}
      </div>
      {list.length === 0 && <Card className="p-8 text-center text-sm text-muted">Aucun établissement ne correspond à « {q} ».</Card>}
      <Pagination label={`Affichage de 1 à ${list.length} sur ${cfg.count}`} pages={4} />
    </div>
  )
}

function FilieresTab({ type }: { type: TypeSlug }) {
  const doms = domainesParType[type]
  const cfg = typeConfig[type]
  const [sel, setSel] = useState('Toutes les filières')
  const [q, setQ] = useState('')
  const base = filieresCartes[type].length
    ? filieresCartes[type]
    : doms.filter((d) => !d.nom.startsWith('Autres')).map((d) => ({ nom: d.nom, ecoles: d.ecoles, formations: d.formations }))
  const cartes = base.filter((c) => c.nom.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="grid gap-5 lg:grid-cols-[296px_1fr]">
      <SidePanel title="Domaines de formation" icon={<LayoutGrid />}>
        <IconCountList
          value={sel}
          onChange={setSel}
          items={[{ label: 'Toutes les filières', count: cfg.filieres }, ...doms].map((d) => ({ label: 'label' in d ? d.label : d.nom, count: d.count, icon: domaineIcon('label' in d ? d.label : d.nom) }))}
        />
      </SidePanel>
      <div className="space-y-3">
        <InlineSearch placeholder="Rechercher une filière (ex. : Comptabilité, Informatique, Santé...)" onSearch={setQ} />
        <ResultsHeader title={`${q ? cartes.length : cfg.filieres} filières disponibles`} sort={['Popularité', 'Nom', 'Nombre de formations']} />
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {cartes.map((c, i) => {
            const Icon = domaineIcon(c.nom)
            const [l1, l2] = c.nom.includes(' & ') ? [c.nom.split(' & ')[0], '& ' + c.nom.split(' & ').slice(1).join(' & ')] : [c.nom, '']
            return (
              <Link key={c.nom} to={`/ecoles/${type}/cours`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-3 shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <span className={cn('grid size-14 shrink-0 place-items-center rounded-xl', tilePalette[i % tilePalette.length])}>
                  <Icon className="size-8" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] leading-tight font-bold whitespace-nowrap text-navy-950">
                    {l1}
                    {l2 && <span className="block">{l2}</span>}
                  </p>
                  <p className="mt-1.5 text-[12px] whitespace-nowrap text-ink/80">
                    {c.ecoles} {cfg.pluriel} • {c.formations.toLocaleString('fr-FR')} formations
                  </p>
                </div>
                <ArrowDot />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const diplomeTiles = [
  { bg: 'bg-[#eaf2ff]', icon: GraduationCap, color: 'text-brand-600' },
  { bg: 'bg-[#f2ecff]', icon: FileBadge, color: 'text-violet-600' },
  { bg: 'bg-[#e8f7ee]', icon: Award, color: 'text-emerald-600' },
  { bg: 'bg-[#fff6e3]', icon: HardHat, color: 'text-amber-500' },
  { bg: 'bg-[#e6f6fb]', icon: FileCheck2, color: 'text-cyan-600' },
  { bg: 'bg-[#f2ecff]', icon: GraduationCap, color: 'text-violet-600' },
]

/** Les 4 formations populaires de la maquette (img27). */
const populairesIpes = [
  { titre: 'BTS Comptabilité & Gestion', diplome: 'BTS', image: '/maquette/form-bts-compta.jpg', id: 'f-cg-ipc' },
  { titre: 'Licence Informatique', diplome: 'Licence', image: '/maquette/form-licence-info.jpg', id: 'f-info-ipc' },
  { titre: 'Licence Santé Publique', diplome: 'Licence', image: '/maquette/form-licence-sante.jpg', id: 'f-lab-ims' },
  { titre: 'Master Génie Civil', diplome: 'Master', image: '/maquette/form-master-genie.jpg', id: 'f-audit-ipc' },
]

function DiplomesTab({ type }: { type: TypeSlug }) {
  const dips = diplomesParType[type]
  const cfg = typeConfig[type]
  const [checked, setChecked] = useState<string[]>([])
  const populaires =
    type === 'ipes'
      ? populairesIpes
      : formationsOfType(type)
          .slice(0, 4)
          .map((f) => ({ titre: f.nom, diplome: f.diplome, image: f.image, id: f.id }))
  const listeGauche = type === 'ipes' ? [...dips, { nom: 'Autre diplôme', count: 230 }] : dips
  return (
    <div className="space-y-4">
      <SearchPanel
        placeholder="Rechercher un diplôme ou une formation..."
        fields={[
          { placeholder: 'Filière', options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
          { placeholder: 'Ville', options: villes.map((v) => v.nom), icon: <MapPin /> },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[256px_1fr]">
        <SidePanel title="Niveau de diplôme" icon={<Layers />}>
          <ul className="space-y-0.5">
            <li>
              <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-[14px]', checked.length === 0 && 'bg-[#e6eeff] font-semibold')}>
                <input type="checkbox" checked={checked.length === 0} onChange={() => setChecked([])} className="size-[18px] accent-brand-600" />
                <span className="flex-1">Tous les diplômes</span>
                <span className="text-[13px]">({cfg.diplomes.toLocaleString('fr-FR')})</span>
              </label>
            </li>
            {listeGauche.map((d) => (
              <li key={d.nom}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-[14px] hover:bg-brand-50">
                  <input
                    type="checkbox"
                    checked={checked.includes(d.nom)}
                    onChange={(e) => setChecked(e.target.checked ? [...checked, d.nom] : checked.filter((x) => x !== d.nom))}
                    className="size-[18px] accent-brand-600"
                  />
                  <span className="flex-1">{d.nom}</span>
                  <span className="text-[13px]">({d.count.toLocaleString('fr-FR')})</span>
                </label>
              </li>
            ))}
          </ul>
        </SidePanel>
        <div className="space-y-3">
          <h2 className="text-[19px] font-bold text-navy-950">Diplômes disponibles ({cfg.diplomes.toLocaleString('fr-FR')})</h2>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
            {dips
              .filter((d) => checked.length === 0 || checked.includes(d.nom))
              .map((d, i) => {
                const t = diplomeTiles[i % diplomeTiles.length]
                return (
                  <Link key={d.nom} to={`/ecoles/${type}/frais`} className={cn('group flex items-center gap-4 rounded-2xl border border-line/60 px-4 py-3.5 shadow-[0_2px_8px_rgba(15,29,61,0.05)] transition-shadow hover:shadow-lg', t.bg)}>
                    <span className={cn('grid size-12 shrink-0 place-items-center rounded-xl bg-white/70', t.color)}>
                      <t.icon className="size-7" />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="block text-[19px] font-bold text-navy-950">{d.nom}</span>
                      <span className="text-[15px] text-navy-900">
                        <b>{d.count.toLocaleString('fr-FR')}</b> formations
                      </span>
                    </span>
                    <ArrowDot />
                  </Link>
                )
              })}
          </div>
          <div className="flex items-center justify-between pt-2">
            <h3 className="flex items-center gap-2 text-[20px] font-bold text-navy-950">
              <Flame className="size-6 fill-orange-500 text-orange-500" /> Formations populaires
            </h3>
            <Link to={`/ecoles/${type}/frais`} className="text-[15px] font-semibold text-brand-600 underline underline-offset-4">
              Voir toutes les formations →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {populaires.map((p) => (
              <Link key={p.titre} to={`/ecoles/formations/${p.id}`} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <Img src={p.image} alt={p.titre} className="h-[74px] w-full" />
                <div className="px-3.5 py-2.5">
                  <p className="truncate text-[14px] font-bold text-navy-950">{p.titre}</p>
                  <p className="mt-1 flex items-center gap-2 text-[14px] text-navy-900">
                    <GraduationCap className="size-4" />
                    <span className="flex-1">{p.diplome}</span>
                    <ChevronRight className="size-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Barre de recherche commune aux onglets IPES, Régions et Villes (img25, img28). */
function ListSearch({ type, onSearch }: { type: TypeSlug; onSearch?: (q: string) => void }) {
  const cfg = typeConfig[type]
  return (
    <SearchPanel
      placeholder={`Rechercher un ${cfg.court === 'Autres' ? 'établissement' : cfg.court}, une formation...`}
      fields={[
        { placeholder: 'Région', options: regions.map((r) => r.nom), icon: <MapPin /> },
        { placeholder: 'Ville', options: villes.map((v) => v.nom), icon: <Building2 /> },
        { placeholder: 'Filière', options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
        { placeholder: 'Niveau / Diplôme', hint: 'Tous', options: diplomesParType[type].map((d) => d.nom), icon: <Layers /> },
      ]}
      onSearch={onSearch}
    />
  )
}

function RegionsTab({ type }: { type: TypeSlug }) {
  const cfg = typeConfig[type]
  const ratio = cfg.count / 532
  const n = (x: number) => Math.max(1, Math.round(x * ratio))
  const [sel, setSel] = useState('Toutes les régions')
  const shown = sel === 'Toutes les régions' ? regions : regions.filter((r) => r.nom === sel)
  return (
    <div className="space-y-4">
      <ListSearch type={type} />
      <div className="grid gap-5 lg:grid-cols-[236px_1fr]">
        <SidePanel title="Régions du Cameroun (10)" icon={<MapIcon />} className="[&>p]:text-[16px]">
          <ul className="space-y-0.5">
            {[{ nom: 'Toutes les régions', ipes: 532 }, ...regions].map((r, i) => (
              <li key={r.nom}>
                <button
                  type="button"
                  onClick={() => setSel(r.nom)}
                  className={cn('flex w-full items-center gap-2.5 rounded-lg px-2 py-[5px] text-left text-[14px]', sel === r.nom ? 'bg-[#e6eeff] font-semibold text-brand-700' : 'hover:bg-brand-50')}
                >
                  {i === 0 ? <CircleCheck className="size-[18px] fill-brand-600 text-white" /> : <MapPin className="size-[18px] text-navy-800" />}
                  <span className="flex-1">{r.nom}</span>
                  <span className="text-[13px]">({n(r.ipes)})</span>
                </button>
              </li>
            ))}
          </ul>
        </SidePanel>
        <div className="space-y-3">
          <ResultsHeader title={`${cfg.count} ${cfg.pluriel} trouvés`} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {shown.map((r) => (
              <Link key={r.nom} to={`/ecoles/${type}`} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <Img src={r.image} alt={`Région ${r.nom}`} className="h-[74px] w-full" />
                <div className="px-3 pt-2 pb-2.5 text-center">
                  <p className="text-[17px] font-bold text-navy-950">{r.nom}</p>
                  <p className="mt-1 flex items-center justify-center gap-2 text-[14px] text-navy-900">
                    <GraduationCap className="size-4" />
                    <span className="flex-1 text-left">{n(r.ipes)} {cfg.court}</span>
                    <span className="grid size-6 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <ChevronRight className="size-4" />
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VillesTab({ type }: { type: TypeSlug }) {
  const cfg = typeConfig[type]
  const ratio = cfg.count / 532
  const n = (x: number) => Math.max(1, Math.round(x * ratio))
  const [openRegion, setOpenRegion] = useState('Centre')
  const [checked, setChecked] = useState<string[]>(['Yaoundé'])
  const regionCount = (r: string) => regions.find((x) => x.nom === r)?.ipes ?? 0
  const arbre = [...Object.keys(villesParRegion).map((r) => ({ nom: r, count: regionCount(r) })), { nom: 'Autres régions', count: 170 }]
  return (
    <div className="space-y-4">
      <ListSearch type={type} />
      <div className="grid gap-5 lg:grid-cols-[246px_1fr]">
        <SidePanel title="Villes par Région" icon={<MapPin />}>
          <ul className="space-y-0.5">
            {arbre.map((r) => {
              const open = openRegion === r.nom
              const vs = villesParRegion[r.nom]
              return (
                <li key={r.nom} className="border-b border-line/70 last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenRegion(open ? '' : r.nom)}
                    className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[15px] font-bold', open ? 'bg-[#e6eeff] text-brand-700' : 'text-navy-900 hover:bg-brand-50')}
                  >
                    <ChevronRight className={cn('size-4 transition-transform', open && 'rotate-90')} />
                    <span className="flex-1">{r.nom}</span>
                    <span className="text-[13px] font-normal text-ink">({n(r.count)})</span>
                  </button>
                  {open && vs && (
                    <ul className="space-y-0.5 py-1.5 pl-6">
                      {vs.map((v) => (
                        <li key={v.nom}>
                          <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[13px]">
                            <input
                              type="checkbox"
                              checked={checked.includes(v.nom)}
                              onChange={(e) => setChecked(e.target.checked ? [...checked, v.nom] : checked.filter((x) => x !== v.nom))}
                              className="size-4 accent-brand-600"
                            />
                            <span className="flex-1">{v.nom}</span>
                            <span>({n(v.ipes)})</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </SidePanel>
        <div className="space-y-3">
          <ResultsHeader title={`Villes – ${cfg.court} (${cfg.count})`} sort={[`Nombre d’${cfg.court}`, 'Nom']} />
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {villes.map((v) => (
              <Link key={v.nom} to={`/ecoles/${type}`} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <div className="relative">
                  <Img src={v.image} alt={v.nom} className="h-[86px] w-full" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy-800 px-2.5 py-0.5 text-[12px] font-semibold text-white">
                    <MapPin className="size-3.5" />
                    {v.region}
                  </span>
                  <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white shadow">
                    <Heart className="size-4 text-navy-900" />
                  </span>
                </div>
                <div className="px-3 pt-2 pb-2.5">
                  <p className="text-[18px] font-bold text-navy-950">{v.nom}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-[15px] text-navy-900">
                    <GraduationCap className="size-4" />
                    <span className="flex-1">
                      <b>{n(v.ipes)}</b> {cfg.court}
                    </span>
                    <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <ChevronRight className="size-4" />
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const tranches = [
  { label: 'Moins de 250 000 FCFA', count: 86 },
  { label: '250 000 – 500 000 FCFA', count: 198 },
  { label: '500 000 – 750 000 FCFA', count: 142 },
  { label: '750 000 – 1 000 000 FCFA', count: 72 },
  { label: 'Plus de 1 000 000 FCFA', count: 34 },
]
const inTranche = (frais: number, i: number) => [frais < 250000, frais >= 250000 && frais < 500000, frais >= 500000 && frais < 750000, frais >= 750000 && frais < 1000000, frais >= 1000000][i]

function CheckRow({ label, count, checked, onChange, icon, highlight }: { label: string; count: number; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] whitespace-nowrap', highlight && checked && 'bg-[#e6eeff] font-semibold text-brand-700')}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-[18px] accent-brand-600" />
      {icon}
      <span className="flex-1">{label}</span>
      <span className="text-[13px] text-ink">({count})</span>
    </label>
  )
}

function FormationsTab({ type, mode }: { type: TypeSlug; mode: 'frais' | 'cours' }) {
  const cfg = typeConfig[type]
  const all = formationsOfType(type)
  const [tr, setTr] = useState<number[]>([])
  const [modes, setModes] = useState<string[]>([])
  const toggle = <T,>(list: T[], v: T, on: boolean) => (on ? [...list, v] : list.filter((x) => x !== v))
  const list = all.filter((f) => (tr.length === 0 || tr.some((i) => inTranche(f.fraisAn, i))) && (modes.length === 0 || modes.includes(f.mode)))
  const filtered = tr.length > 0 || modes.length > 0
  return (
    <div className="space-y-4">
      <SearchPanel
        placeholder={`Rechercher une formation, un ${cfg.court === 'Autres' ? 'établissement' : cfg.court}...`}
        fields={[
          { placeholder: 'Région', options: regions.map((r) => r.nom), icon: <MapPin /> },
          { placeholder: 'Ville', options: villes.map((v) => v.nom), icon: <Building2 /> },
          { placeholder: 'Filière', options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
          { placeholder: 'Niveau / Diplôme', hint: 'Tous', options: diplomesParType[type].map((d) => d.nom), icon: <Layers /> },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[262px_1fr]">
        {mode === 'frais' ? (
          <SidePanel title="Filtrer les frais" icon={<Funnel />} className="[&>p]:text-[17px]">
            <p className="mb-1 border-t border-line pt-3 text-[15px] font-bold text-navy-950">Tranche de frais (par an)</p>
            {tranches.map((t, i) => (
              <CheckRow key={t.label} label={t.label} count={t.count} checked={tr.includes(i)} onChange={(on) => setTr(toggle(tr, i, on))} />
            ))}
            <p className="mt-3 mb-1 border-t border-line pt-3 text-[15px] font-bold text-navy-950">Type de cours</p>
            {[
              ['Jour', 320],
              ['Soir', 168],
              ['Jour & Soir', 44],
            ].map(([m, c]) => (
              <CheckRow key={m} label={m as string} count={c as number} checked={modes.includes(m as string)} onChange={(on) => setModes(toggle(modes, m as string, on))} />
            ))}
          </SidePanel>
        ) : (
          <SidePanel title="Mode de cours" icon={<Clock3 />}>
            <div className="space-y-1">
              <CheckRow label="Tous les cours" count={cfg.count} checked={modes.length === 0} onChange={() => setModes([])} highlight />
              <CheckRow label="Cours de jour" count={326} icon={<Sun className="size-5 fill-amber-400 text-amber-500" />} checked={modes.includes('Jour')} onChange={(on) => setModes(toggle(modes, 'Jour', on))} />
              <CheckRow label="Cours du soir" count={164} icon={<Moon className="size-5 fill-navy-800 text-navy-800" />} checked={modes.includes('Soir')} onChange={(on) => setModes(toggle(modes, 'Soir', on))} />
              <CheckRow label="Jour & soir" count={42} icon={<Repeat className="size-5 text-brand-600" />} checked={modes.includes('Jour & Soir')} onChange={(on) => setModes(toggle(modes, 'Jour & Soir', on))} />
            </div>
          </SidePanel>
        )}
        <div className="space-y-3">
          <ResultsHeader
            title={mode === 'frais' ? `Formations et frais (${filtered ? list.length : cfg.count} résultats)` : `${filtered ? list.length : cfg.count} formations disponibles`}
            sort={mode === 'frais' ? ['Frais croissant', 'Frais décroissant', 'Pertinence'] : ['Pertinence', 'Frais croissant']}
          />
          {list.map((f) => (
            <FormationRow key={f.id} f={f} chips={mode} />
          ))}
          {list.length === 0 && <Card className="p-8 text-center text-sm text-muted">Aucune formation dans cette sélection.</Card>}
          <Pagination label={`${list.length} formations affichées`} pages={2} />
        </div>
      </div>
    </div>
  )
}
