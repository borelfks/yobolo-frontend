import { useTranslation } from 'react-i18next'
import { AlertCircle, Award, CalendarDays, CircleCheck, FileText, GraduationCap, Users } from 'lucide-react'
import { Heading } from '@/modules/ecole/etablissements/components/training/TrainingUi'
import { card, soft } from '@/modules/ecole/etablissements/components/training/trainingShared'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

const pieces = ['bac', 'releves', 'cni', 'photo'] as const

/** Onglet « Conditions d’admission » d'une formation. */
export function AdmissionTab({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  return (
    <div className={cn(card, 'space-y-4 p-5')}>
      <div>
        <Heading icon={<GraduationCap />} className="text-[24px] [&_svg]:size-8">{t('formationDetail.admission.title')}</Heading>
        <p className="mt-2 max-w-sm text-[15.5px] text-navy-900">{t('formationDetail.admission.intro', { name: f.nom })}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 border-line md:border-r md:pr-5">
          {[
            { icon: <Award />, k: t('formationDetail.admission.niveau'), v: t('formationDetail.admission.niveauValue') },
            { icon: <Users />, k: t('formationDetail.admission.selection'), v: t('formationDetail.admission.selectionValue') },
            { icon: <CalendarDays />, k: t('formationDetail.admission.periode'), v: t('formationDetail.admission.periodeValue') },
          ].map((r) => (
            <div key={r.k} className={cn(soft, 'flex items-center gap-4 px-4 py-3 [&_svg]:size-8 [&_svg]:text-navy-800')}>
              {r.icon}
              <div>
                <p className="text-[17px] font-bold text-navy-900">{r.k}</p>
                <p className="text-[14.5px] text-navy-900">{r.v}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Heading icon={<FileText />} className="text-[20px]">{t('formationDetail.admission.documents')}</Heading>
          <ul className="mt-3 space-y-2.5">
            {pieces.map((p) => (
              <li key={p} className={cn(soft, 'flex items-center gap-3 px-3 py-2 text-[14.5px] text-navy-900')}>
                <CircleCheck className="size-5 fill-brand-600 text-white" />
                <span className="flex-1">{t(`formationDetail.admission.pieces.${p}`)}</span>
                <span className="rounded-md bg-rose-100 px-2.5 py-0.5 text-[13px] font-semibold text-rose-600">{t('formationDetail.admission.required')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={cn(soft, 'flex items-center gap-4 px-4 py-3 text-[15px] text-navy-900')}>
        <AlertCircle className="size-6 text-navy-800" />
        <b className="text-[17px]">{t('formationDetail.admission.goodToKnow')}</b>
        <span className="h-6 w-px bg-line" />
        {t('formationDetail.admission.incomplete')}
      </div>
    </div>
  )
}
