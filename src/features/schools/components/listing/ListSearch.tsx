import { useTranslation } from 'react-i18next'
import { Building2, GraduationCap, Layers, MapPin } from 'lucide-react'
import { SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { useTypeLabels } from '@/features/schools/components/listing/useTypeLabels'
import { diplomesParType, domainesParType, regions, villes } from '@/mocks/schools'
import type { TypeSlug } from '@/shared/types'

/** Barre de recherche commune aux onglets IPES, Régions et Villes (img25, img28). */
export function ListSearch({ type, onSearch }: { type: TypeSlug; onSearch?: (q: string) => void }) {
  const { t } = useTranslation('schools')
  const { searchItem } = useTypeLabels(type)
  return (
    <SearchPanel
      placeholder={t('listing.search.placeholder', { item: searchItem })}
      fields={[
        { placeholder: t('listing.search.region'), options: regions.map((r) => r.nom), icon: <MapPin /> },
        { placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <Building2 /> },
        { placeholder: t('listing.search.field'), options: domainesParType[type].map((d) => d.nom), icon: <GraduationCap /> },
        { placeholder: t('listing.search.level'), hint: t('listing.search.levelHint'), options: diplomesParType[type].map((d) => d.nom), icon: <Layers /> },
      ]}
      onSearch={onSearch}
    />
  )
}
