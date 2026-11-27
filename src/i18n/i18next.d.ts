import type layoutFr from '@/app/layouts/locales/fr.json'
import type landingFr from '@/modules/landing/locales/fr.json'
import type authFr from '@/modules/compte/auth/locales/fr.json'
import type schoolsFr from '@/modules/ecole/etablissements/locales/fr.json'
import type drivingSchoolsFr from '@/modules/ecole/auto-ecoles/locales/fr.json'
import type reviewsFr from '@/modules/ecole/avis/locales/fr.json'
import type favoritesFr from '@/modules/compte/favoris/locales/fr.json'
import type proFr from '@/modules/ecole/espace-pro/locales/fr.json'
import type accueilFr from '@/modules/communaute/accueil/locales/fr.json'
import type espaceFr from '@/modules/compte/mon-espace/locales/fr.json'
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
