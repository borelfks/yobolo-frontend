import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { Award, ChevronRight, FileBadge, FileCheck2, Flame, GraduationCap, HardHat, Layers, MapPin } from 'lucide-react'
import { SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { ArrowDot, SidePanel } from '@/features/schools/components/ListingBlocks'
import { formationsOfType } from '@/features/schools/components/listing/formationsOfType'
import { Img } from '@/shared/components/ui/Img'
import { useDiplomes, useDomaines, useEtablissements, useFormations, useFormationsPopulaires, useTypeEcole, useVilles } from '@/data/hooks'
import type { TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const diplomeTiles = [
  { bg: 'bg-[#eaf2ff]', icon: GraduationCap, color: 'text-brand-600' },
  { bg: 'bg-[#f2ecff]', icon: FileBadge, color: 'text-violet-600' },
  { bg: 'bg-[#e8f7ee]', icon: Award, color: 'text-emerald-600' },
  { bg: 'bg-[#fff6e3]', icon: HardHat, color: 'text-amber-500' },
  { bg: 'bg-[#e6f6fb]', icon: FileCheck2, color: 'text-cyan-600' },
  { bg: 'bg-[#f2ecff]', icon: GraduationCap, color: 'text-violet-600' },
]

/** Onglet Diplômes : niveaux à gauche, tuiles de diplômes et formations populaires. */
export function DiplomesTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const navigate = useNavigate()
  const cfg = useTypeEcole(type)
  const domaines = useDomaines(type)
  // Seuls les diplômes auxquels mène au moins une formation publiée.
  const dips = useDiplomes(type).filter((d) => d.count > 0)
  const villes = useVilles()
  const [checked, setChecked] = useState<string[]>([])
  const formations = useFormations()
  const etablissements = useEtablissements()
  const populairesBase = useFormationsPopulaires(type).map((f) => ({ titre: f.titre, diplome: f.diplome, image: f.image, id: f.formationId }))
  // Sans sélection enregistrée pour ce type : ses 4 premières formations publiées.
  const populaires =
    populairesBase.length > 0
      ? populairesBase
      : formationsOfType(type, formations, etablissements)
          .slice(0, 4)
          .map((f) => ({ titre: f.nom, diplome: f.diplome, image: f.image, id: f.id }))
  const listeGauche = cfg.autresDiplomes ? [...dips, { nom: t('listing.diplomes.other'), count: cfg.autresDiplomes }] : dips
  return (
    <div className="space-y-4">
      <SearchPanel
        placeholder={t('listing.diplomes.searchPlaceholder')}
        fields={[
          { name: 'filiere', placeholder: t('listing.search.field'), options: domaines.map((d) => d.nom), icon: <GraduationCap /> },
          { name: 'ville', placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <MapPin /> },
        ]}
        onSearch={(q, c) => {
          // « Rechercher » ouvre la liste du type, filtrée.
          const params = new URLSearchParams(Object.entries({ q, ...c }).filter(([, v]) => v))
          navigate(`${ROUTES.schoolType(type)}${params.size ? `?${params}` : ''}`)
        }}
      />
      <div className="grid gap-5 lg:grid-cols-[256px_1fr]">
        <SidePanel title={t('listing.diplomes.level')} icon={<Layers />}>
          <ul className="space-y-0.5">
            <li>
              <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-[14px]', checked.length === 0 && 'bg-[#e6eeff] font-semibold')}>
                <input type="checkbox" checked={checked.length === 0} onChange={() => setChecked([])} className="size-[18px] accent-brand-600" />
                <span className="flex-1">{t('listing.diplomes.all')}</span>
                <span className="text-[13px]">({num(cfg.diplomes)})</span>
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
                  <span className="text-[13px]">({num(d.count)})</span>
                </label>
              </li>
            ))}
          </ul>
        </SidePanel>
        <div className="space-y-3">
          <h2 className="text-[19px] font-bold text-navy-950">{t('listing.diplomes.available', { n: num(cfg.diplomes) })}</h2>
          <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {dips
              .filter((d) => checked.length === 0 || checked.includes(d.nom))
              .map((d, i) => {
                const tile = diplomeTiles[i % diplomeTiles.length]
                return (
                  <Link key={d.nom} to={`${ROUTES.schoolType(type)}?${new URLSearchParams({ niveau: d.nom })}`} className={cn('group flex items-center gap-4 rounded-2xl border border-line/60 px-4 py-3.5 shadow-[0_2px_8px_rgba(15,29,61,0.05)] transition-shadow hover:shadow-lg', tile.bg)}>
                    <span className={cn('grid size-12 shrink-0 place-items-center rounded-xl bg-white/70', tile.color)}>
                      <tile.icon className="size-7" />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="block text-[19px] font-bold text-navy-950">{d.nom}</span>
                      <span className="text-[15px] text-navy-900">
                        <Trans t={t} i18nKey="listing.diplomes.tileCount" values={{ n: num(d.count) }} components={{ b: <b /> }} />
                      </span>
                    </span>
                    <ArrowDot />
                  </Link>
                )
              })}
          </div>
          <div className="flex items-center justify-between pt-2">
            <h3 className="flex items-center gap-2 text-[20px] font-bold text-navy-950">
              <Flame className="size-6 fill-orange-500 text-orange-500" /> {t('listing.diplomes.popular')}
            </h3>
            <Link to={ROUTES.schoolType(type, 'cours')} className="text-[15px] font-semibold text-brand-600 underline underline-offset-4">
              {t('listing.diplomes.seeAll')}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {populaires.map((p) => (
              <Link key={p.titre} to={ROUTES.training(p.id)} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
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
