import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'

/** Bloc « introuvable » d'un dossier (mauvais identifiant, autre compte). */
export function DossierIntrouvable({ retour }: { retour: string }) {
  const { t } = useTranslation('espace')
  return (
    <Card className="space-y-3 p-8 text-center">
      <p className="text-sm text-muted">{t('dossiers.introuvable')}</p>
      <Button to={retour} size="sm">
        {t('dossiers.retour')}
      </Button>
    </Card>
  )
}
