import { useState } from 'react'
import { Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { ChevronRight, GraduationCap, Heart, MapPin } from 'lucide-react'
import { ResultsHeader } from '@/features/schools/components/EcoleBlocks'
import { SidePanel } from '@/features/schools/components/ListingBlocks'
import { ListSearch } from '@/features/schools/components/listing/ListSearch'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { Img } from '@/shared/components/ui/Img'
import { regions, typeConfig, villes, villesParRegion } from '@/mocks/schools'
import type { TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Onglet Villes : arbre régions → villes à gauche, tuiles de villes à droite. */
export function VillesTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const { court } = useTypeLabels(type)
  const cfg = typeConfig[type]
  const ratio = cfg.count / 532
  const n = (x: number) => Math.max(1, Math.round(x * ratio))
  const [openRegion, setOpenRegion] = useState('Centre')
  const [checked, setChecked] = useState<string[]>(['Yaoundé'])
  const regionCount = (r: string) => regions.find((x) => x.nom === r)?.ipes ?? 0
  const arbre = [...Object.keys(villesParRegion).map((r) => ({ nom: r, count: regionCount(r) })), { nom: t('listing.villes.otherRegions'), count: 170 }]
  return (
    <div className="space-y-4">
      <ListSearch type={type} />
      <div className="grid gap-5 lg:grid-cols-[246px_1fr]">
        <SidePanel title={t('listing.villes.panel')} icon={<MapPin />}>
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
          <ResultsHeader title={t('listing.villes.title', { court, n: cfg.count })} sort={[t('listing.villes.sort.count', { court }), t('listing.villes.sort.name')]} />
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {villes.map((v) => (
              <Link key={v.nom} to={ROUTES.schoolType(type)} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
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
                      <Trans t={t} i18nKey="listing.villes.tileCount" values={{ n: n(v.ipes), court }} components={{ b: <b /> }} />
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
