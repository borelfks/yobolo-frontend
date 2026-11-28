import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { ROUTES } from '@/shared/utils/routes'
import { EntetePro, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { APropos } from '@/modules/ecole/espace-pro/components/parametres/APropos'
import { Compte } from '@/modules/ecole/espace-pro/components/parametres/Compte'
import { Notifications } from '@/modules/ecole/espace-pro/components/parametres/Notifications'
import { Preferences } from '@/modules/ecole/espace-pro/components/parametres/Preferences'
import { Securite } from '@/modules/ecole/espace-pro/components/parametres/Securite'
import { Utilisateurs } from '@/modules/ecole/espace-pro/components/parametres/Utilisateurs'

const SECTIONS = ['', 'securite', 'notifications', 'preferences', 'utilisateurs', 'a-propos'] as const
type Section = (typeof SECTIONS)[number]
const CLES = { '': 'compte', securite: 'securite', notifications: 'notifications', preferences: 'preferences', utilisateurs: 'utilisateurs', 'a-propos': 'aPropos' } as const

/** Paramètres (canevas 7.1 à 7.7) : en-tête et six onglets, puis la rubrique ouverte. */
export function Parametres() {
  const { t } = useTranslation('pro', { keyPrefix: 'parametres' })
  const { section = '' } = useParams({ strict: false })
  const ouverte: Section = SECTIONS.find((s) => s === section) ?? ''
  const libelle = (s: Section) => t(`onglets.${CLES[s]}`)
  return (
    <div className="flex flex-col gap-2">
      <EntetePro
        miettes={[{ label: t('titre'), to: ROUTES.pro.settings() }, ...(ouverte ? [{ label: libelle(ouverte) }] : [])]}
        titre={t('titre')}
        sousTitre={t('sousTitre')}
        onglets={SECTIONS.map((s) => ({ label: libelle(s), to: ROUTES.pro.settings(s || undefined) }))}
      />
      <ChargementDonnees fallback={<SquelettePro cartes={2} entete={false} />}>
        {ouverte === '' && <Compte />}
        {ouverte === 'securite' && <Securite />}
        {ouverte === 'notifications' && <Notifications />}
        {ouverte === 'preferences' && <Preferences />}
        {ouverte === 'utilisateurs' && <Utilisateurs />}
        {ouverte === 'a-propos' && <APropos />}
      </ChargementDonnees>
    </div>
  )
}
