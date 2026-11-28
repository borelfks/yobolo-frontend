import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { useActualites, useDocuments, useFaq } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { ROUTES } from '@/shared/utils/routes'
import { EntetePro, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { Actualites } from '@/modules/ecole/espace-pro/components/contenus/Actualites'
import { Documents } from '@/modules/ecole/espace-pro/components/contenus/Documents'
import { Faq } from '@/modules/ecole/espace-pro/components/contenus/Faq'
import { Presentation } from '@/modules/ecole/espace-pro/components/contenus/Presentation'

const ONGLETS = ['', 'actualites', 'documents', 'faq'] as const
type Onglet = (typeof ONGLETS)[number]
const CLES = { '': 'presentation', actualites: 'actualites', documents: 'documents', faq: 'faq' } as const

/** Contenus et informations (canevas 5.1 à 5.6) : en-tête et onglets (avec leur nombre), puis l'onglet ouvert. */
export function Contenus() {
  const { tab = '' } = useParams({ strict: false })
  const onglet: Onglet = ONGLETS.find((o) => o === tab) ?? ''
  return (
    <ChargementDonnees fallback={<SquelettePro cartes={2} onglets />}>
      <div className="flex flex-col gap-2">
        <EnteteContenus onglet={onglet} />
        {onglet === '' && <Presentation />}
        {onglet === 'actualites' && <Actualites />}
        {onglet === 'documents' && <Documents />}
        {onglet === 'faq' && <Faq />}
      </div>
    </ChargementDonnees>
  )
}

function EnteteContenus({ onglet }: { onglet: Onglet }) {
  const { t } = useTranslation('pro', { keyPrefix: 'contenus' })
  const { ecole } = useMonEcole()
  const nombres: Record<Onglet, number | undefined> = { '': undefined, actualites: useActualites(ecole.id).length, documents: useDocuments(ecole.id).length, faq: useFaq(ecole.id).length }
  const libelle = (o: Onglet) => t(`onglets.${CLES[o]}`)
  return (
    <EntetePro
      miettes={[{ label: t('titre'), to: ROUTES.pro.contents() }, ...(onglet ? [{ label: libelle(onglet) }] : [])]}
      titre={t('titre')}
      sousTitre={t('sousTitre')}
      onglets={ONGLETS.map((o) => ({ label: nombres[o] === undefined ? libelle(o) : t('ongletNombre', { nom: libelle(o), n: nombres[o] }), to: ROUTES.pro.contents(o || undefined) }))}
    />
  )
}
