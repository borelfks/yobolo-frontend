import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Building2, CalendarDays, Car, CircleCheck, Folder, GraduationCap, Heart, Landmark, Lightbulb, MapPin, Star, Sun, Trash2 } from 'lucide-react'
import { Hero } from '@/components/domain/ecole'
import { Img } from '@/components/ui/Feedback'
import { useFavorites, type Favorite } from '@/hooks/useFavorites'
import { ecoleUrl, formationUrl } from '@/lib/ecole-links'
import { etablissementById, etablissements, formationById, formations } from '@/mocks/ecoles'
import { autoEcoleById, autoEcoles, permisCatalogue, type PermisCode } from '@/mocks/autoecoles'
import { cn } from '@/lib/utils'

type Filter = 'tous' | 'formation' | 'etablissement'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

/** Vignettes de la maquette (img48) pour les favoris de départ. */
const favPhotos: Record<string, string> = {
  'f-cg-ipc': '/maquette/fav-compta.jpg',
  'f-info-ipc': '/maquette/fav-info.jpg',
  ipc: '/maquette/fav-ipc.jpg',
}

export default function Favoris() {
  const { favorites, remove, clear } = useFavorites()
  const [filter, setFilter] = useState<Filter>('tous')
  const isFormation = (f: Favorite) => f.kind === 'formation' || f.kind === 'permis'
  const isEtab = (f: Favorite) => f.kind === 'etablissement' || f.kind === 'auto-ecole'
  const list = favorites.filter((f) => filter === 'tous' || (filter === 'formation' ? isFormation(f) : isEtab(f)))
  const menu: { key: Filter; label: string; count: number; icon: ReactNode }[] = [
    { key: 'tous', label: 'Tous les favoris', count: favorites.length, icon: <Folder /> },
    { key: 'formation', label: 'Formations', count: favorites.filter(isFormation).length, icon: <GraduationCap /> },
    { key: 'etablissement', label: 'Établissements', count: favorites.filter(isEtab).length, icon: <Building2 /> },
  ]
  return (
    <div className="mx-auto max-w-[1320px] space-y-5 px-5 py-4">
      <Hero
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: 'Mes favoris' }]}
        icon={<Heart />}
        image="/maquette/favoris-hero.jpg"
        title="Mes favoris"
        subtitle="Retrouvez ici les formations et établissements que vous avez enregistrés."
      />
      <div className="grid gap-5 lg:grid-cols-[266px_1fr]">
        <div className="space-y-5">
          <div className={cn(card, 'space-y-2 p-2.5')}>
            {menu.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setFilter(m.key)}
                className={cn('flex h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-[16px] font-semibold [&_svg]:size-6', filter === m.key ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}
              >
                {m.icon}
                {m.label} ({m.count})
              </button>
            ))}
          </div>
          <div className={cn(card, 'bg-[#f3f6fc] p-5')}>
            <p className="flex items-center gap-2.5 text-[18px] font-bold text-navy-900">
              <Lightbulb className="size-7 fill-amber-300 text-amber-500" /> Astuce
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-navy-900">Ajoutez des formations et des établissements à vos favoris pour les retrouver facilement.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[24px] font-bold text-navy-900">
              <Heart className="size-7" /> {menu.find((m) => m.key === filter)?.label} ({list.length})
            </h2>
            {favorites.length > 0 && (
              <button type="button" onClick={clear} className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-5 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
                <Trash2 className="size-5" />
                Tout supprimer
              </button>
            )}
          </div>
          {list.length === 0 && (
            <div className={cn(card, 'p-10 text-center')}>
              <Heart className="mx-auto size-10 text-slate-300" />
              <p className="mt-3 font-semibold text-navy-900">Aucun favori pour le moment</p>
              <p className="text-sm text-muted">Explorez les écoles et ajoutez celles qui vous intéressent.</p>
              <Link to="/ecoles" className="mt-4 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 font-semibold text-white">
                Explorer les écoles
              </Link>
            </div>
          )}
          {list.map((fav) => (
            <FavRow key={fav.id} fav={fav} onRemove={() => remove(fav.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ModePill({ mode }: { mode: string }) {
  const style = mode === 'Soir' ? 'bg-[#ece6ff]' : mode === 'Jour' ? 'bg-[#fff3cf]' : 'bg-[#f6e6f7]'
  const label = mode === 'Jour' ? 'Cours de jour' : mode === 'Soir' ? 'Cours du soir' : mode
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[14px] text-navy-900', style)}>
      <Sun className="size-5 fill-amber-300 text-amber-500" />
      {label}
    </span>
  )
}

function FavRow({ fav, onRemove }: { fav: Favorite; onRemove: () => void }) {
  let image = ''
  let badge = 'Formation'
  let title = ''
  let left: ReactNode = null
  let right: ReactNode = null
  let to = '/ecoles'
  let cta = 'Voir les détails'
  const price = (n: number) => (
    <>
      <p className="text-[14px] text-navy-900">Frais de formation</p>
      <p className="mt-1 rounded-full bg-[#e8efff] px-4 py-1.5 text-[18px] font-extrabold text-navy-800">
        {n.toLocaleString('fr-FR')} FCFA <span className="text-[14px] font-bold">/ an</span>
      </p>
    </>
  )
  if (fav.kind === 'formation' && formations.some((x) => x.id === fav.id)) {
    const f = formationById(fav.id)
    const e = etablissementById(f.etablissementId)
    ;[image, title, to] = [favPhotos[f.id] ?? f.image, f.nom, formationUrl(f)]
    left = (
      <>
        <p className="flex items-center gap-2 text-[15px] text-navy-900"><Landmark className="size-5" />{e.nom}</p>
        <p className="flex items-center gap-4 text-[15px] text-navy-900">
          <span className="inline-flex items-center gap-2"><CalendarDays className="size-5" />{f.dureeMois} mois</span>
          <ModePill mode={f.mode} />
        </p>
      </>
    )
    right = price(f.fraisAn)
  } else if (fav.kind === 'etablissement' && etablissements.some((x) => x.id === fav.id)) {
    const e = etablissementById(fav.id)
    ;[image, badge, title, to, cta] = [favPhotos[e.id] ?? e.image, 'Établissement', e.nom, ecoleUrl(e), 'Voir l’établissement']
    left = <p className="flex items-center gap-2 text-[15px] text-navy-900"><MapPin className="size-5" />{e.ville} – {e.quartier}</p>
    right = (
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-[16px] text-navy-900"><Star className="size-5 fill-amber-400 text-amber-400" />{e.note.toLocaleString('fr-FR')}/5 ({e.avis} avis)</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1 text-[14px] font-semibold text-white">
          <CircleCheck className="size-5 fill-white text-emerald-700" />
          Établissement vérifié
        </span>
      </div>
    )
  } else if (fav.kind === 'auto-ecole' && autoEcoles.some((x) => x.id === fav.id)) {
    const a = autoEcoleById(fav.id)
    ;[image, badge, title, to, cta] = [a.image, 'Établissement', a.nom, `/ecoles/auto-ecoles/${a.id}`, 'Voir l’établissement']
    left = <p className="flex items-center gap-2 text-[15px] text-navy-900"><MapPin className="size-5" />{a.ville} – {a.quartier}</p>
    right = <p className="flex items-center gap-1.5 text-[16px] text-navy-900"><Star className="size-5 fill-amber-400 text-amber-400" />{a.note.toLocaleString('fr-FR')}/5 ({a.avis} avis)</p>
  } else if (fav.kind === 'permis') {
    const [aeId, code] = fav.id.split(':')
    const a = autoEcoleById(aeId)
    const p = permisCatalogue[code as PermisCode] ?? permisCatalogue.B
    ;[image, title, to] = [p.image, `Permis ${p.code} – ${p.nom}`, `/ecoles/auto-ecoles/${a.id}/permis/${p.code}`]
    left = (
      <>
        <p className="flex items-center gap-2 text-[15px] text-navy-900"><Car className="size-5" />{a.nom}</p>
        <p className="flex items-center gap-2 text-[15px] text-navy-900"><CalendarDays className="size-5" />{p.duree}</p>
      </>
    )
    right = (
      <>
        <p className="text-[14px] text-navy-900">Tarif de la formation</p>
        <p className="mt-1 rounded-full bg-[#e8efff] px-4 py-1.5 text-[18px] font-extrabold text-navy-800">{p.prix.toLocaleString('fr-FR')} FCFA</p>
      </>
    )
  } else return null
  return (
    <div className={cn(card, 'relative flex flex-col gap-4 p-3 sm:flex-row sm:items-center')}>
      <Img src={image} alt={title} className="h-32 w-full rounded-xl sm:h-[100px] sm:w-[194px]" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="inline-block rounded-full bg-brand-600 px-3 py-0.5 text-[13px] font-semibold text-white">{badge}</span>
        <Link to={to} className="block text-[20px] font-bold text-navy-900 hover:text-brand-600">{title}</Link>
        {left}
      </div>
      <div className="flex items-center gap-6 border-line sm:min-w-[420px] sm:self-stretch sm:border-l sm:pl-8">
        <div className="flex-1">{right}</div>
        <Link to={to} className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-6 text-[15px] font-semibold whitespace-nowrap text-navy-800 hover:bg-brand-50">
          {cta}
          <ArrowRight className="size-5" />
        </Link>
      </div>
      <button type="button" aria-label="Retirer des favoris" onClick={onRemove} className="absolute top-3 right-5">
        <Heart className="size-7 fill-rose-600 text-rose-600" />
      </button>
    </div>
  )
}
