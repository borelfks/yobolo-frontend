import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CircleCheck, FileText, GraduationCap, Image as ImageIcon, List, MapPin, Star } from 'lucide-react'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { Img } from '@/shared/components/ui/Img'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { ApercuTab } from '@/features/schools/components/profile/ApercuTab'
import { FormationsTab } from '@/features/schools/components/profile/FormationsTab'
import { InformationsTab } from '@/features/schools/components/profile/InformationsTab'
import { AvisTab } from '@/features/schools/components/profile/AvisTab'
import { GalerieTab } from '@/features/schools/components/profile/GalerieTab'
import { etablissementById, isTypeSlug, slugOfType } from '@/mocks/schools'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

export function EcoleProfil() {
  const { t } = useTranslation('schools')
  const { id, tab = '' } = useParams()
  const e = etablissementById(id)
  const slug = slugOfType(e.type)
  const base = ROUTES.school(slug, e.id)
  const typeLabel = isTypeSlug(slug) ? t(`shared.types.${slug}`) : t('shared.school')
  const tabs = [
    { value: '', label: t('ecoleProfil.tabs.apercu'), icon: <List /> },
    { value: 'formations', label: t('ecoleProfil.tabs.formations', { n: e.formations }), icon: <GraduationCap /> },
    { value: 'informations', label: t('ecoleProfil.tabs.informations'), icon: <FileText /> },
    { value: 'avis', label: t('ecoleProfil.tabs.avis', { n: e.avis }), icon: <Star /> },
    { value: 'galerie', label: t('ecoleProfil.tabs.galerie'), icon: <ImageIcon /> },
  ]
  const current = tabs.find((x) => x.value === tab) ?? tabs[0]
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Breadcrumb items={[{ label: t('shared.school'), to: ROUTES.schools }, { label: typeLabel, to: ROUTES.schoolType(slug) }, { label: e.nom, to: base }, { label: current.label.replace(/ \(\d+\)$/, '') }]} className="-mt-1" />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white">
        <Img src="/images/maquette/fiche-hero.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[32%] object-left md:block" />
        <div className="relative flex flex-col gap-5 p-2.5 md:flex-row md:items-center">
          <Img src={e.photoFiche ?? e.image} alt={e.nom} className="h-[86px] w-full rounded-xl md:w-[210px]" />
          <div className="space-y-3 pb-2 md:pb-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[22px] font-bold md:text-[27px]">{e.nom}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[12.5px] font-semibold">
                <CircleCheck className="size-4 fill-white text-emerald-600" />
                {t('shared.verified')}
              </span>
            </div>
            <p className="flex flex-wrap items-center gap-x-4 text-[16px]">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <b>{num(e.note)}</b>/5 {t('shared.ratingCount', { count: e.avis })}
              </span>
              <span className="h-5 w-px bg-white/40" />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-5 fill-white/90 text-navy-800" />
                {e.ville} – {e.quartier}
              </span>
            </p>
          </div>
        </div>
      </section>
      <LinkTabs items={tabs} base={base} variant="block" className="[&>a]:flex-none [&>a]:min-w-[166px] [&>a]:text-[15px] [&>a]:h-10" />
      {tab === '' && <ApercuTab id={e.id} />}
      {tab === 'formations' && <FormationsTab id={e.id} />}
      {tab === 'informations' && <InformationsTab id={e.id} />}
      {tab === 'avis' && <AvisTab id={e.id} />}
      {tab === 'galerie' && <GalerieTab id={e.id} />}
    </div>
  )
}
