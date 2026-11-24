import { useState, type ReactNode } from 'react'
import { filtrerFormations, type Criteres } from '@/features/schools/schoolSearch'
import { pageDe } from '@/shared/utils/pages'
import { useTranslation } from 'react-i18next'
import { Building2, Clock3, Funnel, GraduationCap, Layers, MapPin, Moon, Repeat, Sun } from 'lucide-react'
import { FormationRow, ResultsHeader, SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { SidePanel } from '@/features/schools/components/ListingBlocks'
import { formationsOfType } from '@/features/schools/components/listing/formationsOfType'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { modeKey } from '@/features/schools/schoolLinks'
import { Card } from '@/shared/components/ui/Card'
import { Pagination } from '@/shared/components/ui/Pagination'
import type { ModeCours, TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { useDiplomes, useDomaines, useEtablissements, useFormations, useRegions, useTranchesFrais, useTypeEcole, useVilles } from '@/data/hooks'

const inTranche = (frais: number, i: number) => [frais < 250000, frais >= 250000 && frais < 500000, frais >= 500000 && frais < 750000, frais >= 750000 && frais < 1000000, frais >= 1000000][i]

/** Les modes de cours, dans l'ordre des filtres. */
const MODES: ModeCours[] = ['Jour', 'Soir', 'Jour & Soir']
/** Formations par page. */
const PAR_PAGE = 8

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
  const cfg = useTypeEcole(type)
  const tranches = useTranchesFrais()
  const domaines = useDomaines(type)
  const diplomes = useDiplomes(type)
  const villes = useVilles()
  const regions = useRegions()
  const all = formationsOfType(type, useFormations(), useEtablissements())
  const etablissements = useEtablissements()
  const [tr, setTr] = useState<number[]>([])
  const [modes, setModes] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [criteres, setCriteres] = useState<Criteres>({})
  const [tri, setTri] = useState(0)
  const [page, setPage] = useState(1)
  const toggle = <T,>(list: T[], v: T, on: boolean) => (setPage(1), on ? [...list, v] : list.filter((x) => x !== v))
  // Les nombres des filtres comptent les formations trouvées par la recherche.
  const trouvees = filtrerFormations(all, q, criteres, etablissements)
  const compteMode = (m: ModeCours) => trouvees.filter((f) => f.mode === m).length
  const compteTranche = (i: number) => trouvees.filter((f) => inTranche(f.fraisAn, i)).length
  const list = trouvees.filter((f) => (tr.length === 0 || tr.some((i) => inTranche(f.fraisAn, i))) && (modes.length === 0 || modes.includes(f.mode)))
  // Tri : en « frais », Frais croissants · Frais décroissants · Pertinence ; en « cours », Pertinence · Frais croissants.
  const cle = (mode === 'frais' ? ['asc', 'desc', 'pertinence'] : ['pertinence', 'asc'])[tri]
  const triee = cle === 'asc' ? [...list].sort((a, b) => a.fraisAn - b.fraisAn) : cle === 'desc' ? [...list].sort((a, b) => b.fraisAn - a.fraisAn) : list
  const { pages, page: courante, elements } = pageDe(triee, page, PAR_PAGE)
  const filtered = tr.length > 0 || modes.length > 0 || Boolean(q) || Object.values(criteres).some(Boolean)
  return (
    <div className="space-y-4">
      <SearchPanel
        placeholder={t('listing.formations.searchPlaceholder', { item: searchItem })}
        fields={[
          { name: 'region', placeholder: t('listing.search.region'), options: regions.map((r) => r.nom), icon: <MapPin /> },
          { name: 'ville', placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <Building2 /> },
          { name: 'filiere', placeholder: t('listing.search.field'), options: domaines.map((d) => d.nom), icon: <GraduationCap /> },
          { name: 'niveau', placeholder: t('listing.search.level'), hint: t('listing.search.levelHint'), options: diplomes.map((d) => d.nom), icon: <Layers /> },
        ]}
        onSearch={(texte, c) => (setQ(texte), setCriteres(c), setPage(1))}
      />
      <div className="grid gap-5 lg:grid-cols-[262px_1fr]">
        {mode === 'frais' ? (
          <SidePanel title={t('listing.formations.filterFees')} icon={<Funnel />} className="[&>p]:text-[17px]">
            <p className="mb-1 border-t border-line pt-3 text-[15px] font-bold text-navy-950">{t('listing.formations.feeRange')}</p>
            {tranches.map((tranche, i) => (
              <CheckRow key={tranche.id} label={t(`listing.formations.tranches.${tranche.id}`)} count={compteTranche(i)} checked={tr.includes(i)} onChange={(on) => setTr(toggle(tr, i, on))} />
            ))}
            <p className="mt-3 mb-1 border-t border-line pt-3 text-[15px] font-bold text-navy-950">{t('listing.formations.courseType')}</p>
            {MODES.map((m) => (
              <CheckRow key={m} label={t(`modes.${modeKey[m]}`)} count={compteMode(m)} checked={modes.includes(m)} onChange={(on) => setModes(toggle(modes, m as string, on))} />
            ))}
          </SidePanel>
        ) : (
          <SidePanel title={t('listing.formations.courseMode')} icon={<Clock3 />}>
            <div className="space-y-1">
              <CheckRow label={t('listing.formations.allCourses')} count={trouvees.length} checked={modes.length === 0} onChange={() => (setModes([]), setPage(1))} highlight />
              <CheckRow label={t('listing.formations.day')} count={compteMode('Jour')} icon={<Sun className="size-5 fill-amber-400 text-amber-500" />} checked={modes.includes('Jour')} onChange={(on) => setModes(toggle(modes, 'Jour', on))} />
              <CheckRow label={t('listing.formations.evening')} count={compteMode('Soir')} icon={<Moon className="size-5 fill-navy-800 text-navy-800" />} checked={modes.includes('Soir')} onChange={(on) => setModes(toggle(modes, 'Soir', on))} />
              <CheckRow label={t('listing.formations.dayEvening')} count={compteMode('Jour & Soir')} icon={<Repeat className="size-5 text-brand-600" />} checked={modes.includes('Jour & Soir')} onChange={(on) => setModes(toggle(modes, 'Jour & Soir', on))} />
            </div>
          </SidePanel>
        )}
        <div className="space-y-3">
          <ResultsHeader
            title={mode === 'frais' ? t('listing.formations.titleFrais', { n: filtered ? list.length : cfg.count }) : t('listing.formations.titleCours', { n: filtered ? list.length : cfg.count })}
            tri={tri}
            onTri={(i) => (setTri(i), setPage(1))}
            sort={
              mode === 'frais'
                ? [t('listing.formations.sort.feesAsc'), t('listing.formations.sort.feesDesc'), t('listing.formations.sort.pertinence')]
                : [t('listing.formations.sort.pertinence'), t('listing.formations.sort.feesAsc')]
            }
          />
          {elements.map((f) => (
            <FormationRow key={f.id} f={f} chips={mode} />
          ))}
          {list.length === 0 && <Card className="p-8 text-center text-sm text-muted">{t('listing.formations.empty')}</Card>}
          <Pagination label={t('listing.formations.shown', { n: elements.length })} pages={pages} page={courante} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
