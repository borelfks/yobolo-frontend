import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Eye, XCircle } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Img } from '@/shared/components/ui/Img'
import { Modal } from '@/shared/components/ui/Modal'
import { shortDate } from '@/shared/utils/format'

/** Statut d'un dossier, par le texte et la couleur. */
export function StatutDossier({ statut }: { statut: 'Envoyée' | 'Annulée' }) {
  const { t } = useTranslation('espace')
  return <Badge tone={statut === 'Annulée' ? 'gray' : 'green'}>{t(`statuts.${statut}`)}</Badge>
}

/** Une ligne de « Mes préinscriptions » ou de « Mes permis ». */
export function LigneDossier({
  image,
  titre,
  sousTitre,
  envoyeeLe,
  annuleeLe,
  statut,
  extra,
  vers,
  onAnnuler,
}: {
  image: string
  titre: ReactNode
  sousTitre: ReactNode
  envoyeeLe: string
  annuleeLe?: string
  statut: 'Envoyée' | 'Annulée'
  extra?: ReactNode
  vers: string
  onAnnuler: () => void
}) {
  const { t } = useTranslation('espace')
  const date = { day: '2-digit', month: 'short', year: 'numeric' } as const
  return (
    <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <Img src={image} alt="" className="h-20 w-full shrink-0 rounded-xl sm:w-32" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold text-navy-900">{titre}</p>
          <StatutDossier statut={statut} />
        </div>
        <p className="text-sm text-muted">{sousTitre}</p>
        <p className="flex flex-wrap items-center gap-x-3 text-[13px] text-navy-800">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-4 text-brand-600" aria-hidden="true" />
            {statut === 'Annulée' && annuleeLe ? t('dossiers.annuleeLe', { date: shortDate(annuleeLe, date) }) : t('dossiers.envoyeeLe', { date: shortDate(envoyeeLe, date) })}
          </span>
          {extra}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button to={vers} variant="outline" size="sm">
          <Eye aria-hidden="true" />
          {t('dossiers.voir')}
        </Button>
        {statut === 'Envoyée' && (
          <Button variant="danger-outline" size="sm" onClick={onAnnuler}>
            <XCircle aria-hidden="true" />
            {t('dossiers.annuler')}
          </Button>
        )}
      </div>
    </Card>
  )
}

/** Fenêtre de confirmation avant d'annuler un dossier. */
export function ConfirmerAnnulation({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const { t } = useTranslation('espace')
  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<XCircle className="mt-1 size-5 text-rose-600" aria-hidden="true" />}
      title={t('dossiers.annulation.titre')}
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            {t('dossiers.annulation.garder')}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {t('dossiers.annulation.confirmer')}
          </Button>
        </>
      }
    >
      <p className="text-sm text-navy-900">{t('dossiers.annulation.texte')}</p>
    </Modal>
  )
}

/** Liste vide, avec le lien pour commencer. */
export function AucunDossier({ texte, action, vers }: { texte: string; action: string; vers: string }) {
  return (
    <Card className="space-y-3 p-8 text-center">
      <p className="text-sm text-muted">{texte}</p>
      <Button to={vers} size="sm">
        {action}
      </Button>
    </Card>
  )
}
