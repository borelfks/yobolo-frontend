import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Building2, CalendarDays, FileBadge, GraduationCap, Layers, MapPin } from 'lucide-react'
import { Hero } from '@/shared/ui/Hero'
import { LinkTabs } from '@/shared/ui/Tabs'
import { DiplomesTab } from '@/modules/ecole/etablissements/components/listing/DiplomesTab'
import { FilieresTab } from '@/modules/ecole/etablissements/components/listing/FilieresTab'
import { FormationsTab } from '@/modules/ecole/etablissements/components/listing/FormationsTab'
import { ListeTab } from '@/modules/ecole/etablissements/components/listing/ListeTab'
import { RegionsTab } from '@/modules/ecole/etablissements/components/listing/RegionsTab'
import { VillesTab } from '@/modules/ecole/etablissements/components/listing/VillesTab'
import { isTypeSlug } from '@/modules/ecole/etablissements/schoolTypes'
import { useTypesEcole } from '@/data/hooks'
import { ROUTES } from '@/shared/utils/routes'

const heroImages: Record<string, string> = {
  '': '/images/maquette/ipes-hero.jpg',
  filieres: '/images/maquette/hero-filieres.jpg',
  diplomes: '/images/maquette/hero-diplomes.jpg',
  regions: '/images/maquette/hero-regions.jpg',
  villes: '/images/maquette/hero-villes.jpg',
  cours: '/images/maquette/ipes-hero.jpg',
}

export function TypeListing() {
  const { type, tab = '' } = useParams({ strict: false })
  const { t } = useTranslation('schools')
  const typesEcole = useTypesEcole()
  if (!isTypeSlug(type)) return <Navigate to={ROUTES.schools} replace />
  const cfg = typesEcole.find((x) => x.id === type)!
  const court = t(`types.${type}.court`)
  const long = t(`types.${type}.long`)
  const pluriel = t(`types.${type}.pluriel`)
  const base = ROUTES.schoolType(type)
  const tabs = [
    { value: '', label: t('listing.tabs.liste', { court, n: cfg.count }), icon: <GraduationCap /> },
    { value: 'filieres', label: t('listing.tabs.filieres'), icon: <Layers /> },
    { value: 'diplomes', label: t('listing.tabs.diplomes'), icon: <FileBadge /> },
    { value: 'regions', label: t('listing.tabs.regions'), icon: <MapPin /> },
    { value: 'villes', label: t('listing.tabs.villes'), icon: <Building2 /> },
    { value: 'cours', label: t('listing.tabs.cours'), icon: <CalendarDays /> },
  ]
  // Un onglet qui n'existe plus (comme l'ancien « Frais ») ramène à la liste.
  if (tab && !tabs.some((x) => x.value === tab)) return <Navigate to={base} replace />
  const titles: Record<string, [string, string | undefined, string]> = {
    '': [court, long, t('listing.titles.liste.subtitle')],
    filieres: [t('listing.titles.filieres.title', { pluriel }), undefined, t('listing.titles.filieres.subtitle', { long })],
    diplomes: [t('listing.titles.diplomes.title', { pluriel }), undefined, t('listing.titles.diplomes.subtitle')],
    regions: [t('listing.titles.regions.title', { court }), undefined, t('listing.titles.regions.subtitle', { pluriel })],
    villes: [t('listing.titles.villes.title', { court }), undefined, t('listing.titles.villes.subtitle', { pluriel })],
    cours: [t('listing.titles.cours.title', { court }), undefined, t('listing.titles.cours.subtitle')],
  }
  const [title, title2, subtitle] = titles[tab] ?? titles['']
  const tabIcon = tabs.find((x) => x.value === tab)?.icon
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Hero
        crumbs={[{ label: t('listing.crumb'), to: ROUTES.schools }, { label: court, to: base }, ...(tab ? [{ label: tabs.find((x) => x.value === tab)?.label as string }] : [])]}
        icon={tabIcon}
        image={heroImages[tab] ?? '/images/maquette/ipes-hero.jpg'}
        title={title}
        title2={title2}
        subtitle={subtitle}
      />
      <LinkTabs items={tabs} base={base} variant="block" />
      {tab === '' && <ListeTab type={type} />}
      {tab === 'filieres' && <FilieresTab type={type} />}
      {tab === 'diplomes' && <DiplomesTab type={type} />}
      {tab === 'regions' && <RegionsTab type={type} />}
      {tab === 'villes' && <VillesTab type={type} />}
      {tab === 'cours' && <FormationsTab type={type} />}
    </div>
  )
}
