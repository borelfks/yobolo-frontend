import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowRight, CalendarDays, CircleCheck, Clock, Coins, CreditCard, GraduationCap, Info, Send, Wallet } from 'lucide-react'
import { GreenCheck, Heading } from '@/features/driving-schools/components/profile/ProfileParts'
import { card, inscrireHref } from '@/features/driving-schools/components/profile/profileUtils'
import { Img } from '@/shared/components/ui/Img'
import { autoEcoleById, permisCatalogue } from '@/mocks/drivingSchools'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const includedKeys = ['code', 'driving', 'materials', 'exam', 'fees'] as const

/** Onglet « Tarifs » de la fiche d'une auto-école. */
export function TarifsTab({ id }: { id: string }) {
  const { t } = useTranslation('driving-schools')
  const a = autoEcoleById(id)
  const codes = (['A', 'B', 'C', 'D', 'E'] as PermisCode[]).filter((c) => a.permis.includes(c))
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_338px]">
      <div className="space-y-4">
        <div className={cn(card, 'space-y-3 p-4')}>
          <Heading icon={<Coins />} className="text-[25px] [&_svg]:size-9">{t('profile.prices.title')}</Heading>
          {codes.map((c) => {
            const p = permisCatalogue[c]
            return (
              <div key={c} className="flex flex-col gap-4 rounded-xl border border-line p-2 sm:flex-row sm:items-center">
                <Img src={p.tarifImage} alt={t(`permis.${c}.vehicle`)} className="h-[74px] w-full rounded-lg sm:w-[158px]" />
                <div className="flex-1">
                  <p className="text-[20px] font-bold text-navy-900">{t('common.licenceTitle', { code: c, name: t(`permis.${c}.name`) })}</p>
                  <p className="mt-1 flex items-center gap-3 text-[15px] text-navy-900">
                    <span className="inline-flex items-center gap-1.5"><Clock className="size-5 text-brand-600" />{t(`permis.${c}.duration`)}</span>
                    <span className="h-5 w-px bg-line" />
                    <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-5 text-brand-600" />{t('profile.prices.fullTraining')}</span>
                  </p>
                </div>
                <span className="rounded-xl bg-[#e8efff] px-6 py-3 text-[24px] font-extrabold text-brand-700">{fcfa(p.prix)}</span>
                <Link to={inscrireHref(id, c)} className="mr-2 inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-7 text-[15px] font-semibold text-white hover:bg-brand-700">
                  {t('common.enrol')} <ArrowRight className="size-5" />
                </Link>
              </div>
            )
          })}
        </div>
        <div className={cn(card, 'flex items-center gap-3 px-4 py-3 text-[15px] text-navy-900')}>
          <Info className="size-6 text-brand-600" />
          <span>
            <Trans t={t} i18nKey="profile.prices.note" components={{ link: <Link to={ROUTES.drivingSchool(a.id, 'planning')} className="text-brand-600 underline" /> }} />
          </span>
        </div>
      </div>
      <aside className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CircleCheck />}>{t('profile.prices.includedTitle')}</Heading>
          <ul className="mt-3 space-y-2">
            {includedKeys.map((k) => (
              <GreenCheck key={k}>{t(`profile.prices.included.${k}`)}</GreenCheck>
            ))}
          </ul>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CreditCard />}>{t('profile.prices.paymentTitle')}</Heading>
          <ul className="mt-3 space-y-3 text-[15px] text-navy-900">
            <li className="flex items-center gap-3"><Wallet className="size-6 text-brand-600" /><span className="flex-1">{t('profile.prices.paymentOnce')}</span><span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[13px] font-bold text-white">{t('profile.prices.discount')}</span></li>
            <li className="flex items-start gap-3"><CalendarDays className="size-6 text-brand-600" /><span><b>{t('profile.prices.paymentInstalments')}</b><span className="block text-[14px]">{t('profile.prices.paymentConditions')}</span></span></li>
          </ul>
        </div>
        <Link to={inscrireHref(id)} className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-brand-600 text-[20px] font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700">
          <Send className="size-6" />
          {t('common.enrolNow')}
        </Link>
      </aside>
    </div>
  )
}
