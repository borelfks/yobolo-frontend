import type layoutFr from '@/app/layouts/locales/fr.json'
import type landingFr from '@/features/landing/locales/fr.json'
import type authFr from '@/features/auth/locales/fr.json'
import type schoolsFr from '@/features/schools/locales/fr.json'
import type drivingSchoolsFr from '@/features/driving-schools/locales/fr.json'
import type reviewsFr from '@/features/reviews/locales/fr.json'
import type favoritesFr from '@/features/favorites/locales/fr.json'
import type proFr from '@/features/pro/locales/fr.json'
import type accueilFr from '@/features/accueil/locales/fr.json'
import type espaceFr from '@/features/espace/locales/fr.json'
import type commonFr from '@/shared/locales/fr.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof commonFr
      layout: typeof layoutFr
      landing: typeof landingFr
      auth: typeof authFr
      schools: typeof schoolsFr
      'driving-schools': typeof drivingSchoolsFr
      reviews: typeof reviewsFr
      favorites: typeof favoritesFr
      pro: typeof proFr
      accueil: typeof accueilFr
      espace: typeof espaceFr
    }
  }
}
