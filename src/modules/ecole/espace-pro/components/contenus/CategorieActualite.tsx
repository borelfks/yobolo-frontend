import { useTranslation } from 'react-i18next'
import { CATEGORIES_ACTUALITE } from '@/modules/ecole/espace-pro/proData'

const CLES = Object.keys(CATEGORIES_ACTUALITE) as (keyof typeof CATEGORIES_ACTUALITE)[]

/** La catégorie d'une actualité (valeur des données, en français), traduite ; une valeur inconnue reste telle quelle. */
export function CategorieActualite({ valeur }: { valeur: string }) {
  const { t } = useTranslation('pro')
  const cle = CLES.find((c) => CATEGORIES_ACTUALITE[c] === valeur)
  return <>{cle ? t(`contenus.categories.${cle}`) : valeur}</>
}
