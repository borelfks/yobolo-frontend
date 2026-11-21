import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import layoutFr from '@/app/layouts/locales/fr.json'
import layoutEn from '@/app/layouts/locales/en.json'
import landingFr from '@/features/landing/locales/fr.json'
import landingEn from '@/features/landing/locales/en.json'
import authFr from '@/features/auth/locales/fr.json'
import authEn from '@/features/auth/locales/en.json'
import schoolsFr from '@/features/schools/locales/fr.json'
import schoolsEn from '@/features/schools/locales/en.json'
import drivingSchoolsFr from '@/features/driving-schools/locales/fr.json'
import drivingSchoolsEn from '@/features/driving-schools/locales/en.json'
import reviewsFr from '@/features/reviews/locales/fr.json'
import reviewsEn from '@/features/reviews/locales/en.json'
import favoritesFr from '@/features/favorites/locales/fr.json'
import favoritesEn from '@/features/favorites/locales/en.json'
import proFr from '@/features/pro/locales/fr.json'
import proEn from '@/features/pro/locales/en.json'
import commonFr from '@/shared/locales/fr.json'
import commonEn from '@/shared/locales/en.json'

export const CLE_STOCKAGE_LANGUE = 'yibolo:langue'
export type Langue = 'fr' | 'en'

/** Les langues proposées par le sélecteur ; le libellé vient de « common ». */
export const LANGUES = [
  { code: 'fr', libelleCle: 'languageSwitcher.francais' },
  { code: 'en', libelleCle: 'languageSwitcher.anglais' },
] as const

function langueInitiale(): Langue {
  try {
    const stockee = localStorage.getItem(CLE_STOCKAGE_LANGUE)
    return stockee === 'fr' || stockee === 'en' ? stockee : 'fr'
  } catch {
    return 'fr'
  }
}

void i18next.use(initReactI18next).init({
  lng: langueInitiale(),
  fallbackLng: 'fr',
  defaultNS: 'common',
  ns: ['common', 'layout', 'landing', 'auth', 'schools', 'driving-schools', 'reviews', 'favorites', 'pro'],
  resources: {
    fr: {
      common: commonFr,
      layout: layoutFr,
      landing: landingFr,
      auth: authFr,
      schools: schoolsFr,
      'driving-schools': drivingSchoolsFr,
      reviews: reviewsFr,
      favorites: favoritesFr,
      pro: proFr,
    },
    en: {
      common: commonEn,
      layout: layoutEn,
      landing: landingEn,
      auth: authEn,
      schools: schoolsEn,
      'driving-schools': drivingSchoolsEn,
      reviews: reviewsEn,
      favorites: favoritesEn,
      pro: proEn,
    },
  },
  interpolation: { escapeValue: false },
  returnNull: false,
})

document.documentElement.lang = i18next.resolvedLanguage ?? 'fr'

i18next.on('languageChanged', (langue) => {
  try {
    localStorage.setItem(CLE_STOCKAGE_LANGUE, langue)
  } catch {
    /* stockage bloqué : la langue vaut pour cette visite seulement */
  }
  document.documentElement.lang = langue
})

/**
 * `i18n.language` peut valoir `en-US` : on le ramène à une langue proposée.
 */
export function langueActive(langue: string = i18next.language): Langue {
  return LANGUES.find(({ code }) => langue.startsWith(code))?.code ?? 'fr'
}

/** Paramètre régional pour Intl (nombres, dates) selon la langue choisie. */
export function currentLocale() {
  return langueActive() === 'en' ? 'en-GB' : 'fr-FR'
}

export default i18next
