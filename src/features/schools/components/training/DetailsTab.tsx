import { useTranslation } from 'react-i18next'
import { Briefcase, Clock, Coins, GraduationCap, Info, Sun, Target } from 'lucide-react'
import { Check, Heading } from '@/features/schools/components/training/TrainingUi'
import { card, modeKey, soft } from '@/features/schools/components/training/trainingShared'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'

const objectives = ['o1', 'o2', 'o3', 'o4', 'o5'] as const
const jobs = ['comptable', 'assistantGestion', 'gestionnaireTresorerie', 'assistantControle', 'collaborateurCabinet'] as const

/** Onglet « Détails » d'une formation. */
export function DetailsTab({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  const tiles = [
    { icon: <GraduationCap />, label: t('formationDetail.details.diplome'), value: f.diplome },
    { icon: <Clock />, label: t('formationDetail.details.duree'), value: t('shared.months', { count: f.dureeMois }) },
    { icon: <Sun className="fill-amber-300 text-amber-500" />, label: t('formationDetail.details.cours'), value: <span className="rounded-full bg-[#f6e6f7] px-3 py-0.5">{t(`shared.modes.${modeKey[f.mode]}`)}</span> },
    { icon: <Coins />, label: t('formationDetail.details.fees'), value: `${fcfa(f.fraisAn)} ${t('shared.perYear')}` },
  ]
  return (
    <div className={cn(card, 'space-y-4 p-4')}>
      <div>
        <Heading icon={<Info />}>{t('formationDetail.details.presentationTitle')}</Heading>
        <p className="mt-1.5 text-[15px] leading-relaxed text-navy-900">{t('formationDetail.details.presentationText', { name: f.nom })}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-[0.95fr_0.75fr_0.9fr_1.2fr]">
        {tiles.map((x) => (
          <div key={x.label} className={cn(soft, 'flex items-center gap-4 px-4 py-3 [&_svg]:size-8 [&_svg]:shrink-0 [&_svg]:text-navy-800')}>
            {x.icon}
            <div>
              <p className="text-[14px] text-navy-900">{x.label}</p>
              <p className="text-[17px] font-bold whitespace-nowrap text-navy-900">{x.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cn(soft, 'p-4')}>
          <Heading icon={<Target />} className="text-[19px]">{t('formationDetail.details.objectives')}</Heading>
          <ul className="mt-2.5 space-y-1.5">
            {objectives.map((o) => (
              <Check key={o}>{t(`formationDetail.details.objectivesList.${o}`)}</Check>
            ))}
          </ul>
        </div>
        <div className={cn(soft, 'p-4')}>
          <Heading icon={<Briefcase />} className="text-[19px]">{t('formationDetail.details.outcomes')}</Heading>
          <ul className="mt-2.5 space-y-1.5">
            {jobs.map((j) => (
              <Check key={j}>{t(`formationDetail.jobs.${j}`)}</Check>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
