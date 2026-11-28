import { useTranslation } from 'react-i18next'
import type { Formation } from '@/shared/types'

/** « Jour et soir », « Jour » ou « Soir » selon les formations publiées. */
export function useCoursDe() {
  const { t } = useTranslation('schools')
  return (formations: Formation[]) => {
    const jour = formations.some((f) => f.mode.includes('Jour'))
    const soir = formations.some((f) => f.mode.includes('Soir'))
    return jour && soir ? t('fiche.cours.jourEtSoir') : jour ? t('fiche.cours.jour') : soir ? t('fiche.cours.soir') : '—'
  }
}
