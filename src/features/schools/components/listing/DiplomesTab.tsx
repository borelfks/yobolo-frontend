import { useState } from 'react'
import { Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { Award, ChevronRight, FileBadge, FileCheck2, Flame, GraduationCap, HardHat, Layers, MapPin } from 'lucide-react'
import { SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { ArrowDot, SidePanel } from '@/features/schools/components/ListingBlocks'
import { formationsOfType } from '@/features/schools/components/listing/formationsOfType'
import { Img } from '@/shared/components/ui/Img'
import { useEtablissements, useFormations } from '@/data/hooks'
import { diplomesParType, domainesParType, typeConfig, villes } from '@/mocks/schools'
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

/** Les 4 formations populaires de la maquette (img27). */
const populairesIpes = [
  { titre: 'BTS Comptabilité & Gestion', diplome: 'BTS', image: '/images/maquette/form-bts-compta.jpg', id: 'f-cg-ipc' },
  { titre: 'Licence Informatique', diplome: 'Licence', image: '/images/maquette/form-licence-info.jpg', id: 'f-info-ipc' },
  { titre: 'Licence Santé Publique', diplome: 'Licence', image: '/images/maquette/form-licence-sante.jpg', id: 'f-lab-ims' },
  { titre: 'Master Génie Civil', diplome: 'Master', image: '/images/maquette/form-master-genie.jpg', id: 'f-audit-ipc' },
]

/** Onglet Diplômes : niveaux à gauche, tuiles de diplômes et formations populaires. */
export function DiplomesTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const dips = diplomesParType[type]
  const cfg = typeConfig[type]
  const [checked, setChecked] = useState<string[]>([])
  const formations = useFormations()
  const etablissements = useEtablissements()
  const populaires =
    type === 'ipes'
      ? populairesIpes
      : formationsOfType(type, formations, etablissements)
          .slice(0, 4)
          .map((f) => ({ titre: f.nom, diplome: f.diplome, image: f.image, id: f.id }))
  const listeGauche = type === 'ipes' ? [...dips, { nom: t('listing.diplomes.other'), count: 230 }] : dips
  return (
    <div className="space-y-4">
      <SearchPanel
        placeholder={t('listing.diplomes.searchPlaceholder')}
        fields={[
          { placeholder: t('listing.search.field'), options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
          { placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <MapPin /> },
        ]}
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
                  <Link key={d.nom} to={ROUTES.schoolType(type, 'frais')} className={cn('group flex items-center gap-4 rounded-2xl border border-line/60 px-4 py-3.5 shadow-[0_2px_8px_rgba(15,29,61,0.05)] transition-shadow hover:shadow-lg', tile.bg)}>
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
            <Link to={ROUTES.schoolType(type, 'frais')} className="text-[15px] font-semibold text-brand-600 underline underline-offset-4">
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
