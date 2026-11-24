import { ArrowRight, Link2, MapPin, Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { jourEtMois } from '@/features/accueil/accueilDates'
import {
  ArticleDuFil,
  ChoixDuMenu,
  EnTeteDuFil,
  ExtraitDuFil,
  GesteDuFil,
  GestesDuFil,
  LienDuPied,
  MenuDuFil,
  PiedDuFil,
  TitreDuFil,
} from '@/features/accueil/components/ElementsDuFil'
import { useRemuneration } from '@/features/accueil/hooks/useRemuneration'
import { usePartage } from '@/features/accueil/hooks/usePartage'
import { useOffreOuverte } from '@/features/accueil/hooks/useOffreOuverte'
import { useSession } from '@/features/auth/hooks/useSession'
import { useCandidatures, useEtablissements } from '@/data/hooks'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import type { OffreEmploi } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Une offre d'emploi du fil (OffreDuFil de yibolo-client). Le titre et
 * « Voir l'offre » ouvrent sa fiche sur l'accueil (`?offre=…`), où l'on
 * postule. Une école qui recrute mène à sa fiche publique.
 */
export function OffreDuFil({ offre }: { offre: OffreEmploi }) {
  const { t } = useTranslation('accueil')
  const { partager, copierLeLien } = usePartage()
  const remuneration = useRemuneration(offre.remuneration)
  const ecole = useEtablissements().find((e) => e.id === offre.etablissementId)

  const { account } = useSession()
  const candidate = useCandidatures(account?.id).some((c) => c.offreId === offre.id)
  const vers = useOffreOuverte().versLaFiche(offre.id)
  const lien = ROUTES.accueilOffre(offre.id)

  return (
    <ArticleDuFil>
      <EnTeteDuFil
        nom={offre.publieurNom}
        vers={ecole ? ecoleUrl(ecole) : undefined}
        pastille={offre.publieurType === 'ecole' ? 'ecole' : 'entreprise'}
        nature="offre"
        date={offre.publieeLe}
        menu={
          <MenuDuFil>
            {(fermer) => (
              <ChoixDuMenu
                onClick={() => {
                  fermer()
                  void copierLeLien(lien)
                }}
              >
                <Link2 aria-hidden="true" />
                {t('actions.copierLeLien')}
              </ChoixDuMenu>
            )}
          </MenuDuFil>
        }
      />

      <div className="flex flex-col gap-1">
        <TitreDuFil vers={vers}>{offre.titre}</TitreDuFil>
        <ExtraitDuFil>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {offre.lieu}
          </span>
          {' · '}
          {t(`contrats.${offre.typeDeContrat}`)}
          {' · '}
          {t(`modes.${offre.modeDeTravail}`)}
        </ExtraitDuFil>
        {remuneration && <p className="text-xs font-semibold text-navy-900">{remuneration}</p>}
        <p className="text-[0.6875rem] text-muted">{t('offre.clotureLe', { date: jourEtMois(offre.clotureeLe) })}</p>
        {candidate && <p className="text-[0.6875rem] font-semibold text-emerald-700">{t('offre.candidatureEnvoyeeBadge')}</p>}
      </div>

      <PiedDuFil>
        <GestesDuFil>
          <GesteDuFil
            icone={<Share2 className="size-4" aria-hidden="true" />}
            libelle={t('actions.partager')}
            onClick={() => void partager(lien, offre.titre)}
          />
          <LienDuPied vers={vers}>
            {t('offre.voir')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </LienDuPied>
        </GestesDuFil>
      </PiedDuFil>
    </ArticleDuFil>
  )
}
