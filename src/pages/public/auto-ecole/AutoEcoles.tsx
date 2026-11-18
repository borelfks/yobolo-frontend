import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Building2, Car, ChevronDown, ChevronUp, CircleCheck, Funnel, LayoutGrid, List, MapPin, RefreshCw, Search, Send, Star, Users } from 'lucide-react'
import { FavoriteModal } from '@/components/domain/autoecole'
import { FavoriteButton, Hero } from '@/components/domain/ecole'
import { Img, Pagination } from '@/components/ui/Feedback'
import { permisIcon } from '@/lib/autoecole-helpers'
import { autoEcoles, permisList, type PermisCode } from '@/mocks/autoecoles'
import { quartiers, regions, villes } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

function PillSelect({ icon, label, options, onChange }: { icon: ReactNode; label: string; options: string[]; onChange?: (v: string) => void }) {
  return (
    <label className="relative flex h-11 flex-1 items-center gap-2.5 rounded-full border border-[#c9d4ea] bg-white px-4 text-[15px] text-navy-900">
      <span className="text-navy-800 [&_svg]:size-5">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      <ChevronDown className="size-5" />
      <select aria-label={label} defaultValue="" onChange={(e) => onChange?.(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

function SmallSelect({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="relative flex h-9 flex-1 items-center rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] text-navy-900">
      <span className="flex-1 truncate">{value || label}</span>
      <ChevronDown className="size-4" />
      <select aria-label={label} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

export default function AutoEcoles() {
  const [permis, setPermis] = useState<PermisCode[]>([])
  const [region, setRegion] = useState('')
  const [q, setQ] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [fav, setFav] = useState<string | null>(null)
  const [openPermis, setOpenPermis] = useState(true)
  const [openLoc, setOpenLoc] = useState(true)
  const list = autoEcoles.filter(
    (a) => (permis.length === 0 || permis.some((p) => a.permis.includes(p))) && (!region || a.region === region) && a.nom.toLowerCase().includes(q.toLowerCase()),
  )
  const filtered = permis.length > 0 || !!region || !!q
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Hero
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: 'Auto-Écoles' }]}
        icon={<Car className="fill-navy-800" />}
        image="/maquette/ae-hero.jpg"
        title="Auto-Écoles du Cameroun"
        subtitle="Trouvez une auto-école agréée près de chez vous et préparez votre permis de conduire."
        className="[&_h1]:text-[28px] [&_img]:w-[59%]"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setQ(String(new FormData(e.currentTarget).get('q') ?? ''))
        }}
        className={cn(card, 'grid gap-3 p-3 md:flex md:items-center')}
      >
        <label className="relative flex-[1.4]">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
          <input name="q" placeholder="Raison sociale (nom de l’auto-école)" className="h-11 w-full rounded-full border border-[#c9d4ea] bg-white pr-4 pl-11 text-[15px] outline-none placeholder:text-ink/70 focus:ring-3 focus:ring-brand-100" />
        </label>
        <PillSelect icon={<Car />} label="Permis (tous)" options={permisList.map((p) => `Permis ${p.code}`)} onChange={(v) => setPermis(v ? [v.slice(-1) as PermisCode] : [])} />
        <PillSelect icon={<MapPin />} label="Région" options={regions.map((r) => r.nom)} onChange={setRegion} />
        <PillSelect icon={<Building2 />} label="Ville" options={villes.map((v) => v.nom)} />
        <PillSelect icon={<MapPin />} label="Quartier" options={quartiers} />
        <button type="submit" className="inline-flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-full bg-brand-600 px-8 text-[17px] font-semibold text-white hover:bg-brand-700">
          <Search className="size-5" strokeWidth={2.6} />
          Rechercher
        </button>
      </form>
      <div className="grid gap-5 lg:grid-cols-[268px_1fr]">
        <aside className={cn(card, 'h-fit p-4')}>
          <p className="flex items-center gap-2.5 border-b border-line pb-3 text-[19px] font-bold text-navy-900">
            <Funnel className="size-6" /> Affiner la recherche
          </p>
          <button type="button" onClick={() => setOpenPermis(!openPermis)} className="mt-3 flex w-full items-center gap-2.5 text-[16px] font-bold text-navy-900">
            <Car className="size-5" />
            <span className="flex-1 text-left">Type de permis</span>
            {openPermis ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
          {openPermis && (
            <div className="mt-2 space-y-1.5">
              <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-navy-900">
                <input type="checkbox" checked={permis.length === 0} onChange={() => setPermis([])} className="size-[18px] accent-brand-600" />
                Tous les permis
              </label>
              {permisList.map((p) => {
                const Icon = permisIcon[p.code]
                return (
                  <label key={p.code} className="flex cursor-pointer items-center gap-2.5 text-[13px] whitespace-nowrap text-navy-900">
                    <input
                      type="checkbox"
                      checked={permis.includes(p.code)}
                      onChange={(e) => setPermis(e.target.checked ? [...permis, p.code] : permis.filter((x) => x !== p.code))}
                      className="size-[18px] accent-brand-600"
                    />
                    <Icon className="size-5 text-navy-800" />
                    Permis {p.code} – {p.nom}
                  </label>
                )
              })}
            </div>
          )}
          <button type="button" onClick={() => setOpenLoc(!openLoc)} className="mt-4 flex w-full items-center gap-2.5 border-t border-line pt-3 text-[16px] font-bold text-navy-900">
            <MapPin className="size-5 fill-brand-600 text-white" />
            <span className="flex-1 text-left">Localisation</span>
            {openLoc ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
          {openLoc && (
            <div className="mt-2 space-y-2.5 text-[14px] text-navy-900">
              <div className="flex items-center gap-3"><span className="w-16">Région</span><SmallSelect label="Toutes les régions" options={regions.map((r) => r.nom)} value={region} onChange={setRegion} /></div>
              <div className="flex items-center gap-3"><span className="w-16">Ville</span><SmallSelect label="Toutes les villes" options={villes.map((v) => v.nom)} /></div>
              <div className="flex items-center gap-3"><span className="w-16">Quartier</span><SmallSelect label="Tous les quartiers" options={quartiers} /></div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setPermis([])
              setRegion('')
              setQ('')
            }}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-full bg-[#eaf0fb] text-[15px] font-semibold text-navy-900 hover:bg-brand-100"
          >
            <RefreshCw className="size-5" />
            Réinitialiser les filtres
          </button>
        </aside>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[22px] font-bold text-navy-900">Auto-Écoles trouvées : {filtered ? list.length : 42}</h2>
            <div className="flex items-center gap-3 text-[14px] text-navy-900">
              Trier par :
              <SmallSelect label="Les mieux notées" options={['Les mieux notées', 'Les moins chères', 'Les plus proches']} />
              <div className="flex overflow-hidden rounded-xl border border-line bg-white">
                {(['grid', 'list'] as const).map((v) => (
                  <button key={v} type="button" aria-label={v === 'grid' ? 'Vue grille' : 'Vue liste'} onClick={() => setView(v)} className={cn('grid h-9 w-12 place-items-center', view === v ? 'bg-brand-600 text-white' : 'text-navy-900')}>
                    {v === 'grid' ? <LayoutGrid className="size-5" /> : <List className="size-5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={cn('grid gap-4', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : '')}>
            {list.map((a) => (
              <div key={a.id} className={cn(card, 'flex overflow-hidden transition-shadow hover:shadow-lg', view === 'grid' ? 'flex-col' : 'flex-col sm:flex-row')}>
                <div className={cn('relative', view === 'list' && 'sm:w-80')}>
                  <Img src={a.image} alt={a.nom} className="h-[140px] w-full" />
                  <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[13px] font-semibold text-white">
                    <CircleCheck className="size-4 fill-white text-emerald-600" />
                    Agréée
                  </span>
                  <FavoriteButton id={a.id} kind="auto-ecole" className="absolute top-2.5 right-2.5 size-10" />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
                  <Link to={`/ecoles/auto-ecoles/${a.id}`} className="text-[18px] font-bold text-navy-900 hover:text-brand-600">{a.nom}</Link>
                  <p className="flex items-center gap-1.5 text-[14px] text-navy-900"><MapPin className="size-4" />{a.ville} – {a.quartier}</p>
                  <p className="flex items-center gap-3 border-b border-line pb-2.5 text-[14px] text-navy-900">
                    <span className="inline-flex items-center gap-1.5"><Star className="size-5 fill-amber-400 text-amber-400" /><b>{a.note.toLocaleString('fr-FR')}</b> ({a.avis} avis)</span>
                    <span className="h-5 w-px bg-line" />
                    <span className="inline-flex items-center gap-1.5"><Users className="size-5 text-brand-600" />{a.formes.toLocaleString('fr-FR')} formés</span>
                  </p>
                  <p className="pt-1 text-[13px] font-bold text-navy-900">Permis proposés</p>
                  <div className="flex flex-wrap gap-2">
                    {a.permis.slice(0, 3).map((p) => {
                      const Icon = permisIcon[p]
                      return (
                        <span key={p} className="inline-flex h-9 items-center gap-2 rounded-full bg-[#eef3fc] px-4 text-[16px] font-bold text-navy-900">
                          <Icon className="size-5 text-brand-600" />
                          {p}
                        </span>
                      )
                    })}
                  </div>
                  <div className="mt-auto flex gap-2.5 pt-3">
                    <Link to={`/ecoles/auto-ecoles/${a.id}`} className="inline-flex h-10 flex-1 items-center justify-center rounded-full border-2 border-brand-600/60 text-[15px] font-semibold text-navy-800 hover:bg-brand-50">
                      Voir le profil
                    </Link>
                    <Link
                      to={`/ecoles/auto-ecoles/${a.id}/permis/${a.permis.includes('B') ? 'B' : a.permis[0]}/inscription`}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 text-[15px] font-semibold text-white hover:bg-brand-700"
                    >
                      <Send className="size-4" />
                      S’inscrire
                    </Link>
                  </div>
                  <button type="button" onClick={() => setFav(a.id)} className="pt-1 text-left text-[12px] font-semibold text-brand-600 hover:underline">
                    Ranger dans un dossier de favoris…
                  </button>
                </div>
              </div>
            ))}
          </div>
          {list.length === 0 && <div className={cn(card, 'p-8 text-center text-sm text-muted')}>Aucune auto-école ne correspond à ces critères.</div>}
          <Pagination label={`Affichage de 1 à ${list.length} sur 42 auto-écoles`} pages={4} />
        </div>
      </div>
      {fav && <FavoriteModal open onClose={() => setFav(null)} aeId={fav} />}
    </div>
  )
}
