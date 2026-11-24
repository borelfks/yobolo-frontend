import { useTranslation } from 'react-i18next'
import type { OffreEmploi } from '@/shared/types'
import { fcfa, num } from '@/shared/utils/format'

/**
 * Ce qu'on montre d'une rémunération — ou rien quand l'employeur la masque
 * (libelleRemuneration de yibolo-client) : « 250 000 – 350 000 FCFA », « Négociable ».
 */
export function useRemuneration({ affichage, minimum, maximum }: OffreEmploi['remuneration']) {
  const { t } = useTranslation('accueil')
  if (affichage === 'Masquee') return null
  if (affichage === 'Negociable' || (minimum === undefined && maximum === undefined)) return t('offre.negociable')
  if (minimum !== undefined && maximum !== undefined) return `${num(minimum)} – ${fcfa(maximum)}`
  return fcfa((minimum ?? maximum)!)
}
