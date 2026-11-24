import { ArrowRight, Bookmark, Eye, Flag, Heart, Link2, MessageCircle, Share2, ThumbsUp, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { data } from '@/data'
import { useCommentaires } from '@/data/hooks'
import { CLASSES_GESTE, titreEtExtrait } from '@/features/accueil/accueilFil'
import { ConfirmerSuppression } from '@/features/accueil/components/ConfirmerSuppression'
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
  SeparateurDuMenu,
  TitreDuFil,
  VisuelDuFil,
} from '@/features/accueil/components/ElementsDuFil'
import { ModaleSignalement } from '@/features/accueil/components/ModaleSignalement'
import { useAuteur } from '@/features/accueil/hooks/useAuteur'
import { useEnregistrement } from '@/features/accueil/hooks/useEnregistrement'
import { useJaime } from '@/features/accueil/hooks/useJaime'
import { usePartage } from '@/features/accueil/hooks/usePartage'
import { usePublicationOuverte } from '@/features/accueil/hooks/usePublicationOuverte'
import { useSession } from '@/features/auth/hooks/useSession'
import { Img } from '@/shared/components/ui/Img'
import type { Publication } from '@/shared/types'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

function Chiffre({ icone, nombre, libelle }: { icone: ReactNode; nombre: number; libelle: string }) {
  return (
    <span className="inline-flex items-center gap-1" title={libelle}>
      {icone}
      <span aria-hidden="true">{num(nombre)}</span>
      <span className="sr-only">{libelle}</span>
    </span>
  )
}

/**
 * Une publication du fil (PublicationDuFil de yibolo-client). Le titre, le
 * visuel et « Voir plus » ouvrent la publication en lecture sur l'accueil
 * (il n'y a pas de page « publication » dans ce projet) ; « Commenter » l'ouvre
 * sur le champ de commentaire. L'auteur peut supprimer sa publication.
 */
export function PublicationDuFil({ publication }: { publication: Publication }) {
  const { t } = useTranslation('accueil')
  const { titre, extrait } = titreEtExtrait(publication)
  const auteur = useAuteur(publication)
  const jaime = useJaime(publication)
  const enregistrement = useEnregistrement(publication)
  const { partager, copierLeLien } = usePartage()
  const { versLaLecture, compterUneLecture } = usePublicationOuverte()
  const [signalement, setSignalement] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const { account } = useSession()
  const commentaires = publication.commentaires + useCommentaires(publication.id).length
  const mienne = publication.auteurType === 'compte' && publication.auteurId === account?.id

  const supprimer = async () => {
    setSuppression(false)
    try {
      await data.remove('publications', publication.id)
      // Ses « J'aime », commentaires et enregistrements partent avec elle (les compteurs restent justes).
      for (const table of ['jaimes', 'commentaires', 'enregistrements'] as const) {
        for (const x of await data.list(table)) if (x.publicationId === publication.id) await data.remove(table, x.id)
      }
      toast.success(t('suppression.faite'))
    } catch {
      toast.error(t('suppression.echec'))
    }
  }

  const vers = versLaLecture(publication.id)
  const lien = ROUTES.accueilPublication(publication.id)
  const ouvrir = () => compterUneLecture(publication)

  return (
    <ArticleDuFil>
      <EnTeteDuFil
        nom={auteur.nom}
        photo={auteur.photo}
        vers={auteur.vers}
        pastille={auteur.pastille}
        nature="publication"
        date={publication.publieeLe}
        menu={
          <MenuDuFil>
            {(fermer) => (
              <>
                <ChoixDuMenu
                  onClick={() => {
                    fermer()
                    void enregistrement.basculer()
                  }}
                >
                  <Bookmark aria-hidden="true" />
                  {enregistrement.enregistree ? t('actions.retirerDesEnregistres') : t('actions.enregistrer')}
                </ChoixDuMenu>
                <ChoixDuMenu
                  onClick={() => {
                    fermer()
                    void copierLeLien(lien)
                  }}
                >
                  <Link2 aria-hidden="true" />
                  {t('actions.copierLeLien')}
                </ChoixDuMenu>
                <SeparateurDuMenu />
                {mienne && (
                  <ChoixDuMenu
                    danger
                    onClick={() => {
                      fermer()
                      setSuppression(true)
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                    {t('suppression.menu')}
                  </ChoixDuMenu>
                )}
                <ChoixDuMenu
                  danger
                  onClick={() => {
                    fermer()
                    setSignalement(true)
                  }}
                >
                  <Flag aria-hidden="true" />
                  {t('actions.signaler')}
                </ChoixDuMenu>
              </>
            )}
          </MenuDuFil>
        }
      />

      <div className="flex flex-col gap-1">
        <TitreDuFil vers={vers} onClick={ouvrir}>
          {titre}
        </TitreDuFil>
        {extrait && <ExtraitDuFil>{extrait}</ExtraitDuFil>}
      </div>

      {publication.image && (
        <VisuelDuFil vers={vers} onClick={ouvrir}>
          <Img src={publication.image} alt="" className="aspect-[16/7] w-full" />
        </VisuelDuFil>
      )}

      <PiedDuFil>
        <ChiffresDuFil>
          <Chiffre
            icone={<Heart className="size-[0.8125rem] text-rose-600" fill="currentColor" aria-hidden="true" />}
            nombre={jaime.nombre}
            libelle={t('actions.jaimes', { count: jaime.nombre, nombre: num(jaime.nombre) })}
          />
          <Chiffre
            icone={<MessageCircle className="size-[0.8125rem]" aria-hidden="true" />}
            nombre={commentaires}
            libelle={t('actions.commentaires', { count: commentaires, nombre: num(commentaires) })}
          />
          <Chiffre
            icone={<Eye className="size-[0.8125rem]" aria-hidden="true" />}
            nombre={publication.lectures}
            libelle={t('actions.lectures', { count: publication.lectures, nombre: num(publication.lectures) })}
          />
          <LienDuPied vers={vers} onClick={ouvrir}>
            {t('actions.voirPlus')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </LienDuPied>
        </ChiffresDuFil>

        <GestesDuFil>
          <GesteDuFil
            icone={<ThumbsUp className="size-[0.8125rem] shrink-0" fill={jaime.aime ? 'currentColor' : 'none'} aria-hidden="true" />}
            libelle={t('actions.jaime')}
            etiquette={jaime.aime ? t('actions.nePlusAimer') : t('actions.jaime')}
            actif={jaime.aime}
            couleurActive="text-rose-600"
            disabled={jaime.enCours}
            onClick={() => void jaime.basculer()}
          />
          <Link to={versLaLecture(publication.id, true)} onClick={ouvrir} className={`${CLASSES_GESTE} text-muted hover:text-ink`}>
            <MessageCircle className="size-[0.8125rem] shrink-0" aria-hidden="true" />
            <span className="truncate">{t('actions.commenter')}</span>
          </Link>
          <GesteDuFil
            icone={<Share2 className="size-[0.8125rem] shrink-0" aria-hidden="true" />}
            libelle={t('actions.partager')}
            onClick={() => void partager(lien, titre)}
          />
        </GestesDuFil>
      </PiedDuFil>

      <ConfirmerSuppression ouverte={suppression} onAnnuler={() => setSuppression(false)} onConfirmer={() => void supprimer()} />
      <ModaleSignalement ouverte={signalement} publicationId={publication.id} onFermer={() => setSignalement(false)} />
    </ArticleDuFil>
  )
}
