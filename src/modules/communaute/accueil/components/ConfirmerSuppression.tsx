import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

/** Demander confirmation avant de supprimer sa publication (elle ne se récupère pas). */
export function ConfirmerSuppression({ ouverte, onAnnuler, onConfirmer }: { ouverte: boolean; onAnnuler: () => void; onConfirmer: () => void }) {
  const { t } = useTranslation('accueil')
  return createPortal(
    <Modal
      open={ouverte}
      onClose={onAnnuler}
      title={t('suppression.titre')}
      footer={
        <>
          <Button variant="neutral" onClick={onAnnuler}>
            {t('suppression.annuler')}
          </Button>
          <Button variant="danger" onClick={onConfirmer}>
            {t('suppression.confirmer')}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">{t('suppression.texte')}</p>
    </Modal>,
    document.body,
  )
}
