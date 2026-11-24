import { ArrowRight, Eye, Link2, Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { data } from '@/data'
import {
  ArticleDuFil,
  ChiffresDuFil,
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
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { Img } from '@/shared/components/ui/Img'
import type { Actualite, Etablissement } from '@/shared/types'
import { num } from '@/shared/utils/format'

/**
 * Une actualité publiée par un établissement (table `actualites`, écrite dans
 * l'espace pro). Elle mène à la fiche publique de l'établissement ; l'ouvrir
 * compte une vue, la partager compte un partage (les chiffres de l'espace pro).
 */
export function ActualiteDuFil({ actualite, etablissement, date }: { actualite: Actualite; etablissement: Etablissement; date: string }) {
  const { t } = useTranslation('accueil')
  const { partager, copierLeLien } = usePartage()
  const vers = ecoleUrl(etablissement)
  const compterUneVue = () => void data.update('actualites', actualite.id, { vues: actualite.vues + 1 })
  const compterUnPartage = () => void data.update('actualites', actualite.id, { partages: actualite.partages + 1 })

  return (
    <ArticleDuFil>
      <EnTeteDuFil
        nom={etablissement.nom}
        vers={vers}
        pastille="ecole"
        nature="actualite"
        date={date || undefined}
        menu={
          <MenuDuFil>
            {(fermer) => (
              <ChoixDuMenu
                onClick={() => {
                  fermer()
                  compterUnPartage()
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
        <TitreDuFil vers={vers} onClick={compterUneVue}>
          {actualite.titre}
        </TitreDuFil>
        <ExtraitDuFil>{actualite.categorie}</ExtraitDuFil>
      </div>

      {actualite.image && (
        <VisuelDuFil vers={vers} onClick={compterUneVue}>
          <Img src={actualite.image} alt="" className="aspect-[16/7] w-full" />
        </VisuelDuFil>
      )}

      <PiedDuFil>
        <ChiffresDuFil>
          <span className="inline-flex items-center gap-1" title={t('actualite.vues', { count: actualite.vues, nombre: num(actualite.vues) })}>
            <Eye className="size-[0.8125rem]" aria-hidden="true" />
            <span aria-hidden="true">{num(actualite.vues)}</span>
            <span className="sr-only">{t('actualite.vues', { count: actualite.vues, nombre: num(actualite.vues) })}</span>
          </span>
          <span className="inline-flex items-center gap-1" title={t('actualite.partages', { count: actualite.partages, nombre: num(actualite.partages) })}>
            <Share2 className="size-[0.8125rem]" aria-hidden="true" />
            <span aria-hidden="true">{num(actualite.partages)}</span>
            <span className="sr-only">{t('actualite.partages', { count: actualite.partages, nombre: num(actualite.partages) })}</span>
          </span>
        </ChiffresDuFil>
        <GestesDuFil>
          <GesteDuFil
            icone={<Share2 className="size-4" aria-hidden="true" />}
            libelle={t('actions.partager')}
            onClick={() => {
              compterUnPartage()
              void partager(vers, actualite.titre)
            }}
          />
          <LienDuPied vers={vers} onClick={compterUneVue}>
            {t('actualite.voir')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </LienDuPied>
        </GestesDuFil>
      </PiedDuFil>
    </ArticleDuFil>
  )
}
