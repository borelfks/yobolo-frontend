import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import layoutFr from '@/app/layouts/locales/fr.json'
import layoutEn from '@/app/layouts/locales/en.json'
import landingFr from '@/modules/landing/locales/fr.json'
import landingEn from '@/modules/landing/locales/en.json'
import authFr from '@/modules/compte/auth/locales/fr.json'
import authEn from '@/modules/compte/auth/locales/en.json'
import schoolsFr from '@/modules/ecole/etablissements/locales/fr.json'
import schoolsEn from '@/modules/ecole/etablissements/locales/en.json'
import drivingSchoolsFr from '@/modules/ecole/auto-ecoles/locales/fr.json'
import drivingSchoolsEn from '@/modules/ecole/auto-ecoles/locales/en.json'
import reviewsFr from '@/modules/ecole/avis/locales/fr.json'
import reviewsEn from '@/modules/ecole/avis/locales/en.json'
import favoritesFr from '@/modules/compte/favoris/locales/fr.json'
import favoritesEn from '@/modules/compte/favoris/locales/en.json'
import proFr from '@/modules/ecole/espace-pro/locales/fr.json'
import proEn from '@/modules/ecole/espace-pro/locales/en.json'
import accueilFr from '@/modules/communaute/accueil/locales/fr.json'
import accueilEn from '@/modules/communaute/accueil/locales/en.json'
import espaceFr from '@/modules/compte/mon-espace/locales/fr.json'
import espaceEn from '@/modules/compte/mon-espace/locales/en.json'
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
  ns: ['common', 'layout', 'landing', 'auth', 'schools', 'driving-schools', 'reviews', 'favorites', 'pro', 'accueil', 'espace'],
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
      accueil: accueilFr,
      espace: espaceFr,
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
      accueil: accueilEn,
      espace: espaceEn,
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
