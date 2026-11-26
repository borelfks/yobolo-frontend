import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/Button'
import { Img } from '@/shared/components/ui/Img'
import { BadgeDossier } from '@/shared/components/ui/BadgeDossier'
import { proCard } from '@/features/pro/proStyles'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'
import type { StatutDossier } from '@/shared/types'

const DATE = { day: '2-digit', month: 'long', year: 'numeric' } as const

/** Le haut d'un dossier reçu : image de la formation ou du permis, candidat, statut, repères. */
export function DossierEnTete({ image, candidat, statut, lignes }: { image?: string; candidat: string; statut: StatutDossier; lignes: { icone: ReactNode; texte?: string; date?: string }[] }) {
  const { t } = useTranslation('pro')
  return (
    <div className={cn(proCard, 'flex flex-col gap-4 p-4 sm:flex-row sm:items-center')}>
      {image && <Img src={image} alt="" className="h-24 w-full shrink-0 rounded-xl sm:w-40" />}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[22px] font-bold text-navy-900">{candidat}</h2>
          <BadgeDossier statut={statut} />
        </div>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[14.5px] text-navy-900">
          {lignes
            .filter((l) => l.texte || l.date)
            .map((l, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 [&_svg]:size-4 [&_svg]:text-brand-600">
                {l.icone}
                {l.date ? t('dossiers.detail.envoyeeLe', { date: shortDate(l.date, DATE) }) : l.texte}
              </span>
            ))}
        </p>
      </div>
    </div>
  )
}

/** Dossier introuvable (mauvais identifiant, dossier d'un autre établissement). */
export function DossierIntrouvablePro({ retour }: { retour: string }) {
  const { t } = useTranslation('pro')
  return (
    <div className={cn(proCard, 'space-y-3 p-8 text-center')}>
      <p className="text-sm text-muted">{t('dossiers.detail.introuvable')}</p>
      <Button to={retour} size="sm">
        {t('dossiers.detail.retour')}
      </Button>
    </div>
  )
}
