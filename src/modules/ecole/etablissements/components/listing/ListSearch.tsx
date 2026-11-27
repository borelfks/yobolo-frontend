import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Building2, GraduationCap, Layers, MapPin } from 'lucide-react'
import { SearchPanel } from '@/modules/ecole/etablissements/components/EcoleBlocks'
import { useTypeLabels } from '@/modules/ecole/etablissements/components/listing/useTypeLabels'
import type { TypeSlug } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'
import { useDiplomes, useDomaines, useRegions, useVilles } from '@/data/hooks'

/** Barre de recherche commune aux onglets IPES, Régions et Villes (img25, img28). */
/** La barre de recherche des onglets Régions et Villes : « Rechercher » ouvre la liste du type, filtrée. */
export function ListSearch({ type }: { type: TypeSlug }) {
  const navigate = useNavigate()
  const domaines = useDomaines(type)
  const diplomes = useDiplomes(type)
  const regions = useRegions()
  const villes = useVilles()
  const { t } = useTranslation('schools')
  const { searchItem } = useTypeLabels(type)
  return (
    <SearchPanel
      placeholder={t('listing.search.placeholder', { item: searchItem })}
      fields={[
        { name: 'region', placeholder: t('listing.search.region'), options: regions.map((r) => r.nom), icon: <MapPin /> },
        { name: 'ville', placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <Building2 /> },
        { name: 'filiere', placeholder: t('listing.search.field'), options: domaines.map((d) => d.nom), icon: <GraduationCap /> },
        { name: 'niveau', placeholder: t('listing.search.level'), hint: t('listing.search.levelHint'), options: diplomes.map((d) => d.nom), icon: <Layers /> },
      ]}
      onSearch={(q, c) => {
        const params = new URLSearchParams(Object.entries({ q, ...c }).filter(([, v]) => v))
        navigate({ href: `${ROUTES.schoolType(type)}${params.size ? `?${params}` : ''}` })
      }}
    />
  )
}
