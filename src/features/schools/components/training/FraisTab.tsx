import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, BookOpen, Briefcase, Calculator, CalendarDays, CircleCheck, Coins, CreditCard, GraduationCap, Monitor, Tag, Users } from 'lucide-react'
import { Heading } from '@/features/schools/components/training/TrainingUi'
import { card, soft } from '@/features/schools/components/training/trainingShared'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'

const tips = ['t1', 't2'] as const

/** Onglet « Frais & paiement » d'une formation. */
export function FraisTab({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  const ans = Math.max(1, Math.round(f.dureeMois / 12))
  const [modalite, setModalite] = useState(0)
  const modalites = [
    { t: t('formationDetail.frais.once'), d: <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700">{t('formationDetail.frais.discount')}</span> },
    { t: t('formationDetail.frais.twoInstalments'), d: t('formationDetail.frais.twoInstalmentsDesc') },
    { t: t('formationDetail.frais.monthly'), d: t('formationDetail.frais.monthlyDesc', { amount: fcfa(Math.round(f.fraisAn / 12)) }) },
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Coins />}>{t('formationDetail.frais.title')}</Heading>
          <div className={cn(soft, 'mt-3 divide-y divide-line px-4')}>
            <div className="flex items-center gap-3 py-3 text-[16px] text-navy-900">
              <Tag className="size-6 text-navy-800" />
              <span className="flex-1 font-semibold">{t('formationDetail.frais.inscription')}</span>
              <b>{fcfa(f.fraisInscription)}</b>
            </div>
            <div className="flex items-center gap-3 py-3 text-[16px] text-navy-900">
              <GraduationCap className="size-6 text-navy-800" />
              <span className="flex-1 font-semibold leading-tight">
                {t('formationDetail.frais.scolarite')} <span className="block text-[14px] font-normal">{t('formationDetail.frais.perYear')}</span>
              </span>
              <b>{fcfa(f.fraisAn)}</b>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#dfe8fb] px-4 py-3 text-navy-900">
            <Calculator className="size-7 text-navy-800" />
            <span className="flex-1 text-[16px] leading-tight font-semibold">
              {t('formationDetail.frais.total')} <span className="block font-normal">{t('formationDetail.frais.years', { count: ans })}</span>
            </span>
            <span className="rounded-full bg-brand-600 px-5 py-2 text-[18px] font-extrabold text-white">{fcfa(f.fraisAn * ans)}</span>
          </div>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CreditCard />}>{t('formationDetail.frais.payment')}</Heading>
          <div className="mt-3 space-y-2">
            {modalites.map((m, i) => (
              <button key={m.t} type="button" onClick={() => setModalite(i)} className={cn(soft, 'flex w-full items-center gap-3 px-3 py-2.5 text-left')}>
                <CalendarDays className="size-7 text-navy-800" />
                <span className="flex-1">
                  <span className="block text-[15px] font-bold text-navy-900">{m.t}</span>
                  <span className="text-[13px] text-navy-900">{m.d}</span>
                </span>
                <CircleCheck className={cn('size-6', modalite === i ? 'fill-emerald-600 text-white' : 'fill-slate-300 text-white')} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CircleCheck />}>{t('formationDetail.frais.covers')}</Heading>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { icon: <BookOpen />, t: [t('formationDetail.frais.coverTiles.cours1'), t('formationDetail.frais.coverTiles.cours2')] },
              { icon: <Monitor />, t: [t('formationDetail.frais.coverTiles.tp1'), t('formationDetail.frais.coverTiles.tp2')] },
              { icon: <Users />, t: [t('formationDetail.frais.coverTiles.encadrement1'), t('formationDetail.frais.coverTiles.encadrement2')] },
              { icon: <Briefcase />, t: [t('formationDetail.frais.coverTiles.stage1'), t('formationDetail.frais.coverTiles.stage2')] },
            ].map((x) => (
              <div key={x.t[0]} className={cn(soft, 'flex flex-col items-center gap-2 px-2 py-3 text-center text-[14px] leading-tight text-navy-900 [&_svg]:size-8 [&_svg]:text-brand-600')}>
                {x.icon}
                <span>
                  {x.t[0]}
                  <span className="block">{x.t[1]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-[#fff8e6] p-4">
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <AlertCircle className="size-7 fill-amber-400 text-white" /> {t('formationDetail.frais.goodToKnow')}
          </h2>
          <ul className="mt-3 space-y-3 text-[15px] text-navy-900">
            {tips.map((k) => (
              <li key={k} className="flex items-start gap-2.5">
                <CircleCheck className="mt-0.5 size-5 shrink-0 fill-amber-400 text-white" />
                {t(`formationDetail.frais.tips.${k}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
