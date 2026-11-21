import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ChevronRight, CircleCheck, GraduationCap, Map as MapIcon, MapPin } from 'lucide-react'
import { ResultsHeader } from '@/features/schools/components/EcoleBlocks'
import { SidePanel } from '@/features/schools/components/ListingBlocks'
import { ListSearch } from '@/features/schools/components/listing/ListSearch'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { Img } from '@/shared/components/ui/Img'
import { regions, typeConfig } from '@/mocks/schools'
import type { TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Valeur interne de la ligne « Toutes les régions ». */
const ALL = 'Toutes les régions'

/** Onglet Régions : liste des régions à gauche, tuiles à droite. */
export function RegionsTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const { court, pluriel } = useTypeLabels(type)
  const cfg = typeConfig[type]
  const ratio = cfg.count / 532
  const n = (x: number) => Math.max(1, Math.round(x * ratio))
  const [sel, setSel] = useState(ALL)
  const shown = sel === ALL ? regions : regions.filter((r) => r.nom === sel)
  return (
    <div className="space-y-4">
      <ListSearch type={type} />
      <div className="grid gap-5 lg:grid-cols-[236px_1fr]">
        <SidePanel title={t('listing.regions.panel')} icon={<MapIcon />} className="[&>p]:text-[16px]">
          <ul className="space-y-0.5">
            {[{ nom: ALL, ipes: 532 }, ...regions].map((r, i) => (
              <li key={r.nom}>
                <button
                  type="button"
                  onClick={() => setSel(r.nom)}
                  className={cn('flex w-full items-center gap-2.5 rounded-lg px-2 py-[5px] text-left text-[14px]', sel === r.nom ? 'bg-[#e6eeff] font-semibold text-brand-700' : 'hover:bg-brand-50')}
                >
                  {i === 0 ? <CircleCheck className="size-[18px] fill-brand-600 text-white" /> : <MapPin className="size-[18px] text-navy-800" />}
                  <span className="flex-1">{i === 0 ? t('listing.regions.all') : r.nom}</span>
                  <span className="text-[13px]">({n(r.ipes)})</span>
                </button>
              </li>
            ))}
          </ul>
        </SidePanel>
        <div className="space-y-3">
          <ResultsHeader title={t('listing.found', { n: cfg.count, pluriel })} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {shown.map((r) => (
              <Link key={r.nom} to={ROUTES.schoolType(type)} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <Img src={r.image} alt={t('listing.regions.imageAlt', { name: r.nom })} className="h-[74px] w-full" />
                <div className="px-3 pt-2 pb-2.5 text-center">
                  <p className="text-[17px] font-bold text-navy-950">{r.nom}</p>
                  <p className="mt-1 flex items-center justify-center gap-2 text-[14px] text-navy-900">
                    <GraduationCap className="size-4" />
                    <span className="flex-1 text-left">
                      {n(r.ipes)} {court}
                    </span>
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
