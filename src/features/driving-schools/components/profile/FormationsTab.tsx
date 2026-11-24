import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowRight, CalendarDays, ChevronRight, Clock, Coins, GraduationCap } from 'lucide-react'
import { CheckLine, FilterBox, Heading, WhyCard } from '@/features/driving-schools/components/profile/ProfileParts'
import { card, inscrireHref, permisShortName } from '@/features/driving-schools/components/profile/profileUtils'
import { Img } from '@/shared/components/ui/Img'
import { useAutoEcole, usePermisCatalogue } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const trainingTypes = ['initial', 'refresher'] as const

/** Onglet « Formations & Permis » de la fiche d'une auto-école. */
export function FormationsTab({ id }: { id: string }) {
  const permisCatalogue = usePermisCatalogue()
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  const [sel, setSel] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const codes = (['A', 'B', 'C', 'D', 'E'] as PermisCode[]).filter((c) => a.permis.includes(c))
  const list = codes.filter((c) => sel.length === 0 || sel.includes(c))
  return (
    <div className="grid gap-4 lg:grid-cols-[254px_1fr_316px]">
      <FilterBox
        title={t('profile.trainings.filterTitle')}
        onReset={() => {
          setSel([])
          setTypes([])
        }}
      >
        <p className="mt-3 mb-1 text-[16px] font-bold text-navy-900">{t('profile.filters.category')}</p>
        {codes.map((c) => (
          <CheckLine key={c} label={t('common.licenceTitle', { code: c, name: permisShortName(t, c) })} checked={sel.includes(c)} onChange={(on) => setSel(on ? [...sel, c] : sel.filter((x) => x !== c))} />
        ))}
        <p className="mt-3 mb-1 border-t border-line pt-3 text-[16px] font-bold text-navy-900">{t('profile.trainings.type')}</p>
        {trainingTypes.map((k) => (
          <CheckLine key={k} label={t(`profile.trainings.types.${k}`)} checked={types.includes(k)} onChange={(on) => setTypes(on ? [...types, k] : types.filter((x) => x !== k))} />
        ))}
      </FilterBox>
      <div className="space-y-3">
        <div className={cn(card, 'flex items-center justify-between px-4 py-3')}>
          <Heading icon={<GraduationCap />}>{t('profile.trainings.title')}</Heading>
          <span className="text-[13px] text-navy-900">{t('profile.trainings.count', { count: list.length })}</span>
        </div>
        {list.map((c) => {
          const p = permisCatalogue[c]
          return (
            <div key={c} className={cn(card, 'flex flex-col gap-4 p-2.5 sm:flex-row sm:items-center')}>
              <Img src={p.image} alt={t(`permis.${c}.vehicle`)} className="h-[82px] w-full rounded-lg sm:w-[150px]" />
              <div className="flex-1">
                <p className="text-[20px] font-bold text-navy-900">{t('common.licenceTitle', { code: c, name: permisShortName(t, c) })}</p>
                <p className="text-[14.5px] text-navy-900">{t(`permis.${c}.sub`)}</p>
                <p className="mt-1 flex items-center gap-3 text-[15px] text-navy-900">
                  <span className="inline-flex items-center gap-1.5"><Clock className="size-5 text-brand-600" />{t(`permis.${c}.duration`)}</span>
                  <span className="h-5 w-px bg-line" />
                  <span className="inline-flex items-center gap-1.5 font-bold text-brand-600"><Coins className="size-5" />{fcfa(p.prix)}</span>
                </p>
              </div>
              <Link to={ROUTES.license(a.id, c)} className="mr-2 inline-flex h-10 items-center gap-2 rounded-xl border-2 border-brand-600/60 px-5 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                {t('profile.trainings.details')} <ChevronRight className="size-4" />
              </Link>
            </div>
          )
        })}
      </div>
      <div className="space-y-4">
        <WhyCard />
        <Link to={inscrireHref(a)} className="flex items-center gap-4 rounded-2xl bg-[linear-gradient(120deg,#1f55e6,#2f6bff)] p-5 text-white shadow-lg shadow-brand-600/30">
          <span className="flex-1">
            <span className="flex items-center gap-2.5 text-[20px] font-bold"><CalendarDays className="size-7" />{t('common.enrolNow')}</span>
            <span className="mt-1 block text-[14.5px] text-white/90">{t('profile.trainings.ctaText')}</span>
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-white text-brand-600"><ArrowRight className="size-6" /></span>
        </Link>
      </div>
    </div>
  )
}
