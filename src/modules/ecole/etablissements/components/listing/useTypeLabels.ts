import { useTranslation } from 'react-i18next'
import type { TypeSlug } from '@/shared/types'

/**
 * Libellés traduits d'un type d'école (typeConfig) : « IPES », « Instituts Privés
 * d’Enseignement Supérieur », pluriel, et l'objet de recherche (« un IPES »).
 */
export function useTypeLabels(type: TypeSlug) {
  const { t } = useTranslation('schools')
  return {
    court: t(`types.${type}.court`),
    long: t(`types.${type}.long`),
    pluriel: t(`types.${type}.pluriel`),
    searchItem: t(`types.${type}.searchItem`),
  }
}
