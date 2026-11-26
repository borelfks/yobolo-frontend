import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/Badge'
import { CLE_STATUT, TON_STATUT } from '@/shared/utils/dossiers'
import type { StatutDossier } from '@/shared/types'

/** Le statut d'un dossier (préinscription, inscription en auto-école), par le texte et la couleur. */
export function BadgeDossier({ statut }: { statut: StatutDossier }) {
  const { t } = useTranslation()
  return <Badge tone={TON_STATUT[statut]}>{t(`dossier.statuts.${CLE_STATUT[statut]}`)}</Badge>
}
