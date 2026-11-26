import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowRight, CalendarDays, Car, Clock, Hourglass, Info, Send } from 'lucide-react'
import { CheckLine, FilterBox, GreenCheck, Heading } from '@/features/driving-schools/components/profile/ProfileParts'
import { card, inscrireHref, permisShortName, sessionDays, sessionDuration, sessionHours, sessionStart } from '@/features/driving-schools/components/profile/profileUtils'
import { Img } from '@/shared/components/ui/Img'
import { useAutoEcole, usePermisDe, useSessionsDe } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'

const sessionTypes = ['next', 'upcoming'] as const
const tipKeys = ['code', 'flexible', 'groups', 'open'] as const

/** Onglet « Planning » de la fiche d'une auto-école. */
export function PlanningTab({ id }: { id: string }) {
  const permisCatalogue = usePermisDe(id)
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  const sessions = useSessionsDe(id)
  const [sel, setSel] = useState<string[]>(['B'])
  const [session, setSession] = useState<string[]>(['next'])
  const codes = (['A', 'B', 'C', 'D', 'E'] as PermisCode[]).filter((c) => a.permis.includes(c))
  // « Prochaines sessions » : la première session de chaque permis ; « Sessions à venir » : les suivantes.
  const premieres = new Set(codes.map((c) => sessions.find((s) => s.permis === c)?.id))
  const list = sessions.filter(
    (s) =>
      a.permis.includes(s.permis) &&
      (sel.length === 0 || sel.includes(s.permis)) &&
      (session.length === 0 || session.length === sessionTypes.length || (session.includes('next') ? premieres.has(s.id) : !premieres.has(s.id))),
  )
  const prochaine = sessions[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[222px_1fr_296px]">
      <FilterBox
        title={t('profile.schedule.filterTitle')}
        onReset={() => {
          setSel([])
          setSession([])
        }}
      >
        <p className="mt-3 mb-1 text-[16px] font-bold text-navy-900">{t('profile.filters.category')}</p>
        {codes.map((c) => (
          <CheckLine key={c} label={t('common.licenceTitle', { code: c, name: permisShortName(t, c) })} checked={sel.includes(c)} onChange={(on) => setSel(on ? [...sel, c] : sel.filter((x) => x !== c))} />
        ))}
        <p className="mt-3 mb-1 border-t border-line pt-3 text-[16px] font-bold text-navy-900">{t('profile.schedule.session')}</p>
        {sessionTypes.map((k) => (
          <CheckLine key={k} label={t(`profile.schedule.sessionTypes.${k}`)} checked={session.includes(k)} onChange={(on) => setSession(on ? [...session, k] : session.filter((x) => x !== k))} />
        ))}
      </FilterBox>
      <div className={cn(card, 'overflow-hidden')}>
        <div className="p-4">
          <Heading icon={<CalendarDays />}>{t('profile.schedule.title')}</Heading>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[14px] text-navy-900">
            <thead>
              <tr className="bg-[#eef3fc] text-left text-[14px] font-semibold">
                <th className="py-3 pl-4">{t('profile.schedule.columns.training')}</th>
                <th>{t('profile.schedule.columns.start')}</th>
                <th>{t('profile.schedule.columns.hours')}</th>
                <th>{t('profile.schedule.columns.duration')}</th>
                <th>{t('profile.schedule.columns.places')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted">{t('profile.filters.aucuneSession')}</td>
                </tr>
              )}
              {list.map((s) => {
                const p = permisCatalogue[s.permis]
                return (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="py-3 pl-4">
                      <span className="flex items-center gap-3">
                        <Img src={p.image} alt="" className="h-12 w-[76px] rounded-md" />
                        <span className="leading-tight">
                          <b className="block text-[15px]">{t('common.licence', { code: s.permis })}</b>
                          {s.permis === 'D' ? t('permis.D.short') : permisShortName(t, s.permis)}
                        </span>
                      </span>
                    </td>
                    <td><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-5 text-brand-600" />{sessionStart(s.debut)}</span></td>
                    <td><span className="inline-flex items-center gap-1.5"><Clock className="size-5 text-brand-600" /><span className="leading-tight">{sessionDays(t, s.horaires[0])}<span className="block">{sessionHours(t, s.horaires[1])}</span></span></span></td>
                    <td><span className="inline-flex items-center gap-1.5"><Hourglass className="size-5 text-brand-600" />{sessionDuration(t, s.duree)}</span></td>
                    <td><span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{t('common.places', { count: s.places })}</span></td>
                    <td className="pr-3 text-right">
                      <Link to={inscrireHref(a, s.permis)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-700">
                        {t('common.enrol')} <ArrowRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <aside className="space-y-4">
        <div className={cn(card, 'space-y-3 p-4')}>
          <Heading icon={<CalendarDays />}>{t('profile.schedule.nextIntake')}</Heading>
          <p className="rounded-xl bg-[#dcf5e4] py-3 text-center text-[24px] font-extrabold text-navy-900">{shortDate(new Date(2026, 10, 15), { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="flex items-center gap-2.5 text-[15px] text-navy-900"><Car className="size-5 text-navy-800" />{t('common.licenceTitle', { code: prochaine.permis, name: t(`permis.${prochaine.permis}.name`) })}</p>
          <p className="flex items-center gap-2.5 text-[15px] text-navy-900"><Clock className="size-5 text-navy-800" />{t('sessions.daysHours', { days: sessionDays(t, prochaine.horaires[0]), hours: sessionHours(t, prochaine.horaires[1]) })}</p>
          <Link to={inscrireHref(a, prochaine.permis)} className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
            <Send className="size-5" />
            {t('common.enrolNow')}
          </Link>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Info />}>{t('profile.schedule.goodToKnow')}</Heading>
          <ul className="mt-3 space-y-2.5">
            {tipKeys.map((k) => (
              <GreenCheck key={k}>{t(`profile.schedule.tips.${k}`)}</GreenCheck>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
