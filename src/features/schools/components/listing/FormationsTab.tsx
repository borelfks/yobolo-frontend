import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Clock3, Funnel, GraduationCap, Layers, MapPin, Moon, Repeat, Sun } from 'lucide-react'
import { FormationRow, ResultsHeader, SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { SidePanel } from '@/features/schools/components/ListingBlocks'
import { formationsOfType } from '@/features/schools/components/listing/formationsOfType'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { modeKey } from '@/features/schools/schoolLinks'
import { Card } from '@/shared/components/ui/Card'
import { Pagination } from '@/shared/components/ui/Pagination'
import { diplomesParType, domainesParType, regions, typeConfig, villes } from '@/mocks/schools'
import type { ModeCours, TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

const tranches = [
  { key: 'lt250', count: 86 },
  { key: 'from250to500', count: 198 },
  { key: 'from500to750', count: 142 },
  { key: 'from750to1000', count: 72 },
  { key: 'gt1000', count: 34 },
] as const
const inTranche = (frais: number, i: number) => [frais < 250000, frais >= 250000 && frais < 500000, frais >= 500000 && frais < 750000, frais >= 750000 && frais < 1000000, frais >= 1000000][i]

const modesFrais: [ModeCours, number][] = [
  ['Jour', 320],
  ['Soir', 168],
  ['Jour & Soir', 44],
]

function CheckRow({ label, count, checked, onChange, icon, highlight }: { label: string; count: number; checked: boolean; onChange: (v: boolean) => void; icon?: ReactNode; highlight?: boolean }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] whitespace-nowrap', highlight && checked && 'bg-[#e6eeff] font-semibold text-brand-700')}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-[18px] accent-brand-600" />
      {icon}
      <span className="flex-1">{label}</span>
      <span className="text-[13px] text-ink">({count})</span>
    </label>
  )
}

/** Onglets Frais et Cours (Jour/Soir) : filtres à gauche, lignes de formations à droite (img30, img31). */
export function FormationsTab({ type, mode }: { type: TypeSlug; mode: 'frais' | 'cours' }) {
  const { t } = useTranslation('schools')
  const { searchItem } = useTypeLabels(type)
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
        placeholder={t('listing.formations.searchPlaceholder', { item: searchItem })}
        fields={[
          { placeholder: t('listing.search.region'), options: regions.map((r) => r.nom), icon: <MapPin /> },
          { placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <Building2 /> },
          { placeholder: t('listing.search.field'), options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
          { placeholder: t('listing.search.level'), hint: t('listing.search.levelHint'), options: diplomesParType[type].map((d) => d.nom), icon: <Layers /> },
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[262px_1fr]">
        {mode === 'frais' ? (
          <SidePanel title={t('listing.formations.filterFees')} icon={<Funnel />} className="[&>p]:text-[17px]">
            <p className="mb-1 border-t border-line pt-3 text-[15px] font-bold text-navy-950">{t('listing.formations.feeRange')}</p>
            {tranches.map((tranche, i) => (
              <CheckRow key={tranche.key} label={t(`listing.formations.tranches.${tranche.key}`)} count={tranche.count} checked={tr.includes(i)} onChange={(on) => setTr(toggle(tr, i, on))} />
            ))}
            <p className="mt-3 mb-1 border-t border-line pt-3 text-[15px] font-bold text-navy-950">{t('listing.formations.courseType')}</p>
            {modesFrais.map(([m, c]) => (
              <CheckRow key={m} label={t(`modes.${modeKey[m]}`)} count={c} checked={modes.includes(m)} onChange={(on) => setModes(toggle(modes, m as string, on))} />
            ))}
          </SidePanel>
        ) : (
          <SidePanel title={t('listing.formations.courseMode')} icon={<Clock3 />}>
            <div className="space-y-1">
              <CheckRow label={t('listing.formations.allCourses')} count={cfg.count} checked={modes.length === 0} onChange={() => setModes([])} highlight />
              <CheckRow label={t('listing.formations.day')} count={326} icon={<Sun className="size-5 fill-amber-400 text-amber-500" />} checked={modes.includes('Jour')} onChange={(on) => setModes(toggle(modes, 'Jour', on))} />
              <CheckRow label={t('listing.formations.evening')} count={164} icon={<Moon className="size-5 fill-navy-800 text-navy-800" />} checked={modes.includes('Soir')} onChange={(on) => setModes(toggle(modes, 'Soir', on))} />
              <CheckRow label={t('listing.formations.dayEvening')} count={42} icon={<Repeat className="size-5 text-brand-600" />} checked={modes.includes('Jour & Soir')} onChange={(on) => setModes(toggle(modes, 'Jour & Soir', on))} />
            </div>
          </SidePanel>
        )}
        <div className="space-y-3">
          <ResultsHeader
            title={mode === 'frais' ? t('listing.formations.titleFrais', { n: filtered ? list.length : cfg.count }) : t('listing.formations.titleCours', { n: filtered ? list.length : cfg.count })}
            sort={
              mode === 'frais'
                ? [t('listing.formations.sort.feesAsc'), t('listing.formations.sort.feesDesc'), t('listing.formations.sort.pertinence')]
                : [t('listing.formations.sort.pertinence'), t('listing.formations.sort.feesAsc')]
            }
          />
          {list.map((f) => (
            <FormationRow key={f.id} f={f} chips={mode} />
          ))}
          {list.length === 0 && <Card className="p-8 text-center text-sm text-muted">{t('listing.formations.empty')}</Card>}
          <Pagination label={t('listing.formations.shown', { n: list.length })} pages={2} />
        </div>
      </div>
    </div>
  )
}
