import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, GraduationCap, Layers, MapPin } from 'lucide-react'
import { EcoleCard, ResultsHeader, SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { Card } from '@/shared/components/ui/Card'
import { Pagination } from '@/shared/components/ui/Pagination'
import { diplomesParType, domainesParType, regions, typeConfig, villes } from '@/mocks/schools'
import { useEtablissements } from '@/data/hooks'
import type { TypeSlug } from '@/shared/types'

/** Onglet principal : la liste des établissements du type. */
export function ListeTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const labels = useTypeLabels(type)
  const cfg = typeConfig[type]
  const [q, setQ] = useState('')
  const list = useEtablissements().filter((e) => e.type === cfg.type).filter((e) => (e.nom + e.filieres.join(' ')).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-5">
      <SearchPanel
        placeholder={t('listing.search.placeholderListe', { item: labels.searchItem })}
        fields={[
          { placeholder: t('listing.search.region'), options: regions.map((r) => r.nom), icon: <MapPin /> },
          { placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <Building2 /> },
          { placeholder: t('listing.search.field'), options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
          { placeholder: t('listing.search.level'), hint: t('listing.search.levelHint'), options: diplomesParType[type].map((d) => d.nom), icon: <Layers /> },
        ]}
        onSearch={setQ}
      />
      <ResultsHeader title={t('listing.found', { n: q ? list.length : cfg.count, pluriel: labels.pluriel })} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((e) => (
          <EcoleCard key={e.id} e={e} />
        ))}
      </div>
      {list.length === 0 && <Card className="p-8 text-center text-sm text-muted">{t('listing.liste.empty', { q })}</Card>}
      <Pagination label={t('listing.liste.pagination', { shown: list.length, total: cfg.count })} pages={4} />
    </div>
  )
}
