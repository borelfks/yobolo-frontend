import { ArrowRight, Link2, Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  VisuelDuFil,
} from '@/features/accueil/components/ElementsDuFil'
import { usePartage } from '@/features/accueil/hooks/usePartage'
import { useEtablissements } from '@/data/hooks'
import { ecoleUrl, formationUrl } from '@/features/schools/schoolLinks'
import { Img } from '@/shared/components/ui/Img'
import type { Formation } from '@/shared/types'
import { fcfa } from '@/shared/utils/format'

/** Une formation du fil (FormationDuFil de yibolo-client), lue dans la table `formations`. */
export function FormationDuFil({ formation }: { formation: Formation }) {
  const { t } = useTranslation('accueil')
  const { partager, copierLeLien } = usePartage()
  const ecole = useEtablissements().find((e) => e.id === formation.etablissementId)

  const vers = formationUrl(formation)
  const details = [
    t('formation.prixParAn', { prix: fcfa(formation.fraisAn) }),
    formation.diplome,
    t('formation.duree', { count: formation.dureeMois }),
  ]

  return (
    <ArticleDuFil>
      <EnTeteDuFil
        nom={ecole?.nom ?? t('auteur.inconnu')}
        vers={ecole ? ecoleUrl(ecole) : undefined}
        pastille="ecole"
        nature="formation"
        date={formation.publieeLe}
        menu={
          <MenuDuFil>
            {(fermer) => (
              <ChoixDuMenu
                onClick={() => {
                  fermer()
                  void copierLeLien(vers)
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
        <TitreDuFil vers={vers}>{formation.nom}</TitreDuFil>
        {formation.description && <ExtraitDuFil>{formation.description}</ExtraitDuFil>}
        <p className="text-[0.6875rem] text-muted">{details.join(' · ')}</p>
      </div>

      {formation.image && (
        <VisuelDuFil vers={vers}>
          <Img src={formation.image} alt="" className="aspect-[16/7] w-full" />
        </VisuelDuFil>
      )}

      <PiedDuFil>
        <GestesDuFil>
          <GesteDuFil
            icone={<Share2 className="size-4" aria-hidden="true" />}
            libelle={t('actions.partager')}
            onClick={() => void partager(vers, formation.nom)}
          />
          <LienDuPied vers={vers}>
            {t('formation.voir')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </LienDuPied>
        </GestesDuFil>
      </PiedDuFil>
    </ArticleDuFil>
  )
}
