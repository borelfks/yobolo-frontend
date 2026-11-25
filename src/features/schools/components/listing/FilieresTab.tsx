import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LayoutGrid } from 'lucide-react'
import { ResultsHeader } from '@/features/schools/components/EcoleBlocks'
import { ArrowDot, IconCountList, InlineSearch, SidePanel } from '@/features/schools/components/ListingBlocks'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { domaineIcon, tilePalette } from '@/features/schools/schoolDomains'
import type { TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { useDomaines, useTypeEcole } from '@/data/hooks'

/** Valeur interne de la ligne « Toutes les filières » (son icône est déduite de ce nom). */
const ALL = 'Toutes les filières'

/** Onglet Filières : domaines à gauche, cartes de filières (img26). */
export function FilieresTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const { pluriel } = useTypeLabels(type)
  const doms = useDomaines(type)
  const cfg = useTypeEcole(type)
  const [sel, setSel] = useState(ALL)
  const [q, setQ] = useState('')
  const [tri, setTri] = useState(0)
  const navigate = useNavigate()
  const allLabel = t('listing.filieres.all')
  // Les domaines qui ont au moins une formation publiée (chiffres calculés).
  const base = doms.map((d) => ({ nom: d.nom, ecoles: d.ecoles, formations: d.formations }))
  const trouvees = base.filter((c) => c.nom.toLowerCase().includes(q.toLowerCase()))
  // Tri : popularité (établissements), nom, nombre de formations.
  const cartes = [...trouvees].sort((a, b) => (tri === 1 ? a.nom.localeCompare(b.nom) : tri === 2 ? b.formations - a.formations : b.ecoles - a.ecoles))
  return (
    <div className="grid gap-5 lg:grid-cols-[296px_1fr]">
      <SidePanel title={t('listing.filieres.domains')} icon={<LayoutGrid />}>
        <IconCountList
          value={sel === ALL ? allLabel : sel}
          onChange={(v) => {
            setSel(v === allLabel ? ALL : v)
            // Un domaine ouvre la liste des établissements qui le proposent.
            if (v !== allLabel) navigate(`${ROUTES.schoolType(type)}?${new URLSearchParams({ filiere: v })}`)
          }}
          items={[{ label: ALL, count: cfg.filieres }, ...doms].map((d) => ({ label: 'label' in d ? allLabel : d.nom, count: d.count, icon: domaineIcon('label' in d ? d.label : d.nom) }))}
        />
      </SidePanel>
      <div className="space-y-3">
        <InlineSearch placeholder={t('listing.filieres.searchPlaceholder')} onSearch={setQ} />
        <ResultsHeader
          title={t('listing.filieres.available', { n: q ? cartes.length : cfg.filieres })}
          sort={[t('listing.filieres.sort.popularity'), t('listing.filieres.sort.name'), t('listing.filieres.sort.trainings')]}
          tri={tri}
          onTri={setTri}
        />
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {cartes.map((c, i) => {
            const Icon = domaineIcon(c.nom)
            const [l1, l2] = c.nom.includes(' & ') ? [c.nom.split(' & ')[0], '& ' + c.nom.split(' & ').slice(1).join(' & ')] : [c.nom, '']
            return (
              <Link key={c.nom} to={`${ROUTES.schoolType(type)}?${new URLSearchParams({ q: c.nom.split(/[ &]/)[0]! })}`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-3 shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <span className={cn('grid size-14 shrink-0 place-items-center rounded-xl', tilePalette[i % tilePalette.length])}>
                  <Icon className="size-8" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] leading-tight font-bold whitespace-nowrap text-navy-950">
                    {l1}
                    {l2 && <span className="block">{l2}</span>}
                  </p>
                  <p className="mt-1.5 text-[12px] whitespace-nowrap text-ink/80">
                    {t('listing.filieres.cardMeta', { ecoles: c.ecoles, pluriel, formations: num(c.formations) })}
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
