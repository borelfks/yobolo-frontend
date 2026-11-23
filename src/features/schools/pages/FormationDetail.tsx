import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Coins, GraduationCap, Landmark, List, MapPin, Users } from 'lucide-react'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { Img } from '@/shared/components/ui/Img'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { FormationAside } from '@/features/schools/components/training/FormationAside'
import { DetailsTab } from '@/features/schools/components/training/DetailsTab'
import { ProgrammeTab } from '@/features/schools/components/training/ProgrammeTab'
import { AdmissionTab } from '@/features/schools/components/training/AdmissionTab'
import { FraisTab } from '@/features/schools/components/training/FraisTab'
import { DebouchesTab } from '@/features/schools/components/training/DebouchesTab'
import { isTypeSlug, slugOfType } from '@/mocks/schools'
import { useEtablissement, useFormation } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Photo d'en-tête propre à certaines formations (maquette img39). */
const headerPhotos: Record<string, string> = { 'f-cg-ipc': '/images/maquette/formation-header-compta.jpg' }

export function FormationDetail() {
  const { t } = useTranslation('schools')
  const { id, tab = '' } = useParams()
  const f = useFormation(id)
  const e = useEtablissement(f.etablissementId)
  const slug = slugOfType(e.type)
  const base = ROUTES.training(f.id)
  const tabs = [
    { value: '', label: t('formationDetail.tabs.details'), icon: <List /> },
    { value: 'programme', label: t('formationDetail.tabs.programme'), icon: <GraduationCap /> },
    { value: 'admission', label: t('formationDetail.tabs.admission'), icon: <CalendarDays /> },
    { value: 'frais', label: t('formationDetail.tabs.frais'), icon: <Coins /> },
    { value: 'debouches', label: t('formationDetail.tabs.debouches'), icon: <Users /> },
  ]
  const current = tabs.find((x) => x.value === tab) ?? tabs[0]
  return (
    <div className="mx-auto max-w-[1320px] space-y-3.5 px-5 py-4">
      <Breadcrumb
        className="-mt-1"
        items={[
          { label: t('shared.school'), to: ROUTES.schools },
          { label: isTypeSlug(slug) ? t(`shared.types.${slug}`) : t('shared.school'), to: ROUTES.schoolType(slug) },
          { label: e.nom, to: ecoleUrl(e) },
          { label: t('formationDetail.breadcrumbFormations'), to: ROUTES.school(slug, e.id, 'formations') },
          ...(tab ? [{ label: f.nom, to: base }] : []),
          { label: current.label },
        ]}
      />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white">
        <Img src="/images/maquette/formation-hero.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[33%] object-left md:block" />
        <div className="relative flex flex-col gap-6 p-2.5 md:flex-row md:items-center">
          <Img src={headerPhotos[f.id] ?? f.image} alt={f.nom} className="h-[115px] w-full rounded-xl md:w-[235px]" />
          <div className="space-y-2 pb-2 md:pb-0">
            <span className="inline-block rounded-full bg-brand-500 px-3.5 py-0.5 text-[15px] font-semibold">{t('formationDetail.badge')}</span>
            <h1 className="text-[26px] font-extrabold md:text-[32px]">{f.nom}</h1>
            <p className="flex flex-wrap items-center gap-x-5 text-[17px]">
              <span className="inline-flex items-center gap-2">
                <Landmark className="size-5" />
                {e.nom}
              </span>
              <span className="h-6 w-px bg-white/40" />
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-5 fill-white/90 text-navy-800" />
                {e.ville} – {e.quartier}
              </span>
            </p>
          </div>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
        <div className="min-w-0 space-y-3.5">
          <nav className="flex flex-wrap gap-2.5">
            {tabs.map((x, i) => (
              <Link
                key={x.value}
                to={i === 0 ? base : ROUTES.training(f.id, x.value)}
                className={cn(
                  'inline-flex h-11 flex-1 items-center justify-center gap-2.5 rounded-xl px-4 text-[15px] font-semibold whitespace-nowrap [&_svg]:size-5',
                  tab === x.value ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100',
                )}
              >
                {x.icon}
                {x.label}
              </Link>
            ))}
          </nav>
          {tab === '' && <DetailsTab f={f} />}
          {tab === 'programme' && <ProgrammeTab f={f} />}
          {tab === 'admission' && <AdmissionTab f={f} />}
          {tab === 'frais' && <FraisTab f={f} />}
          {tab === 'debouches' && <DebouchesTab f={f} />}
        </div>
        <FormationAside f={f} showRentree={tab !== 'programme'} />
      </div>
    </div>
  )
}
