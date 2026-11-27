import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, BookOpenText, CalendarDays, ChevronDown, ChevronUp, Clock, Layers, Sun } from 'lucide-react'
import { Heading } from '@/modules/ecole/etablissements/components/training/TrainingUi'
import { card, modeKey, soft } from '@/modules/ecole/etablissements/components/training/trainingShared'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { useProgramme } from '@/data/hooks'

/** Onglet « Programme » d'une formation. */
export function ProgrammeTab({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  const semestres = useProgramme(f.id)
  const years = [...new Set(semestres.map((s) => s.annee))]
  const [year, setYear] = useState(years[0])
  const [open, setOpen] = useState<string>('Semestre 1')
  return (
    <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
      <div className={cn(card, 'h-fit space-y-3 p-4')}>
        <Heading icon={<BookOpenText />}>{t('formationDetail.programme.overview')}</Heading>
        <p className="border-b border-line pb-4 text-[15.5px] leading-snug text-navy-900">{t('formationDetail.programme.overviewText')}</p>
        {[
          { icon: <Clock />, k: t('formationDetail.programme.duree'), v: t('shared.months', { count: f.dureeMois }) },
          { icon: <Sun className="fill-amber-300 text-amber-500" />, k: t('formationDetail.programme.cours'), v: t(`shared.modes.${modeKey[f.mode]}`) },
          // Le volume horaire : la somme des heures du programme publié (rien d'inventé sans programme).
          ...(semestres.length ? [{ icon: <Layers />, k: t('formationDetail.programme.volume'), v: t('formationDetail.programme.hours', { count: semestres.reduce((n, s) => n + s.heures, 0) }) }] : []),
        ].map((r) => (
          <div key={r.k} className={cn(soft, 'flex items-center gap-3 px-3 py-2.5 text-[15.5px] text-navy-900 [&_svg]:size-6 [&_svg]:text-navy-800')}>
            {r.icon}
            <span>
              <b>{r.k} :</b> {r.v}
            </span>
          </div>
        ))}
      </div>
      <div className={cn(card, 'space-y-3 p-4')}>
        <Heading icon={<BookOpen />}>{t('formationDetail.programme.detailed')}</Heading>
        {semestres.length === 0 && <p className="rounded-xl bg-page px-4 py-3 text-[15px] text-muted-foreground">{t('formationDetail.programme.aucun')}</p>}
        {years.length > 0 && <div className="grid grid-cols-2 gap-1 rounded-full border border-line p-1">
          {years.map((y, i) => (
            <button key={y} type="button" onClick={() => setYear(y)} className={cn('h-10 rounded-full text-[16px] font-semibold', year === y ? 'bg-brand-600 text-white' : 'text-navy-900 hover:bg-brand-50')}>
              {i + 1}
              <sup>{i === 0 ? t('formationDetail.programme.ordinalFirst') : t('formationDetail.programme.ordinalOther')}</sup> {t('formationDetail.programme.yearLabel', { range: i === 0 ? 'S1 – S2' : 'S3 – S4' })}
            </button>
          ))}
        </div>}
        {semestres.filter((s) => s.annee === year).map((s) => {
          const isOpen = open === s.semestre
          return (
            <div key={s.semestre} className="rounded-xl border border-line">
              <button type="button" onClick={() => setOpen(isOpen ? '' : s.semestre)} className="flex h-11 w-full items-center justify-between rounded-xl bg-[#eef3fc] px-4 text-left text-[17px] font-bold text-navy-900">
                {s.semestre}
                {isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
              {isOpen && (
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  <ul className="flex-1 space-y-2 border-line sm:border-r">
                    {s.ue.map((u) => (
                      <li key={u} className="flex items-center gap-3 text-[14.5px] text-navy-900">
                        <span className="size-2 rounded-full bg-brand-600" />
                        {u}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-4 text-[15px] text-navy-900 sm:w-56">
                    <p className="flex items-center gap-2.5"><CalendarDays className="size-6 text-brand-600" />{t('formationDetail.programme.units', { count: s.ue.length })}</p>
                    <p className="flex items-center gap-2.5 font-semibold"><Clock className="size-6 text-brand-600" />{t('formationDetail.programme.hours', { count: s.heures })}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
