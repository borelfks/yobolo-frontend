import { useTranslation } from 'react-i18next'
import { useParams } from '@tanstack/react-router'
import { Lien } from '@/shared/ui/Lien'
import { CalendarDays, Car, Coins, Home, Image as ImageIcon, Star } from 'lucide-react'
import { AEHeader } from '@/modules/ecole/auto-ecoles/components/AutoEcoleBlocks'
import { ApercuTab } from '@/modules/ecole/auto-ecoles/components/profile/ApercuTab'
import { AvisTab } from '@/modules/ecole/auto-ecoles/components/profile/AvisTab'
import { FormationsTab } from '@/modules/ecole/auto-ecoles/components/profile/FormationsTab'
import { GalerieTab } from '@/modules/ecole/auto-ecoles/components/profile/GalerieTab'
import { PlanningTab } from '@/modules/ecole/auto-ecoles/components/profile/PlanningTab'
import { TarifsTab } from '@/modules/ecole/auto-ecoles/components/profile/TarifsTab'
import { useAutoEcole } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Fiche d'une auto-école : en-tête, onglets, puis le contenu de l'onglet choisi. */
export function AutoEcoleProfil() {
  const { t } = useTranslation('driving-schools')
  const { id, tab = '' } = useParams({ strict: false })
  const a = useAutoEcole(id)
  const base = ROUTES.drivingSchool(a.id)
  const tabs = [
    { value: '', label: t('profile.tabs.overview'), icon: <Home /> },
    { value: 'formations', label: t('profile.tabs.trainings'), icon: <Car /> },
    { value: 'tarifs', label: t('profile.tabs.prices'), icon: <Coins /> },
    { value: 'planning', label: t('profile.tabs.schedule'), icon: <CalendarDays /> },
    { value: 'galerie', label: t('profile.tabs.gallery'), icon: <ImageIcon /> },
    { value: 'avis', label: t('profile.tabs.reviews', { count: a.avis }), icon: <Star /> },
  ]
  const current = tabs.find((x) => x.value === tab) ?? tabs[0]
  const heroImage = '/images/maquette/ae-hero-formations.jpg'
  const headers: Record<string, { title?: string; subtitle?: string; image?: string }> = {
    formations: { title: t('profile.headers.trainings.title'), subtitle: t('profile.headers.trainings.subtitle'), image: heroImage },
    planning: { title: t('profile.headers.schedule.title'), subtitle: t('profile.headers.schedule.subtitle'), image: heroImage },
    galerie: { title: t('profile.headers.gallery.title', { name: a.nom }), subtitle: t('profile.headers.gallery.subtitle'), image: heroImage },
    avis: { image: heroImage },
  }
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[
          { label: t('common.crumbs.school'), to: ROUTES.schools },
          { label: t('common.crumbs.drivingSchools'), to: ROUTES.drivingSchools },
          ...(tab ? [{ label: a.nom, to: base }, { label: current.label.replace(/ \(\d+\)$/, '') }] : [{ label: t('common.crumbs.profile') }]),
        ]}
        {...headers[tab]}
      />
      <nav className="flex flex-wrap gap-2.5">
        {tabs.map((x, i) => (
          <Lien
            key={x.value}
            to={i === 0 ? base : ROUTES.drivingSchool(a.id, x.value)}
            className={cn(
              'inline-flex h-11 items-center justify-center gap-2.5 rounded-xl px-6 text-[15.5px] font-semibold whitespace-nowrap shadow-sm [&_svg]:size-5',
              tab === x.value ? 'bg-brand-600 text-white shadow-brand-600/30' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100',
            )}
          >
            {x.icon}
            {x.label}
          </Lien>
        ))}
      </nav>
      {tab === '' && <ApercuTab id={a.id} />}
      {tab === 'formations' && <FormationsTab id={a.id} />}
      {tab === 'tarifs' && <TarifsTab id={a.id} />}
      {tab === 'planning' && <PlanningTab id={a.id} />}
      {tab === 'galerie' && <GalerieTab id={a.id} />}
      {tab === 'avis' && <AvisTab id={a.id} />}
    </div>
  )
}
