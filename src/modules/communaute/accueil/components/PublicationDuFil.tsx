import { ArrowRight, Bookmark, Eye, Flag, Heart, Link2, MessageCircle, Share2, ThumbsUp, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Lien } from '@/shared/ui/Lien'
import { toast } from 'sonner'
import { data } from '@/data'
import { CLASSES_GESTE, titreEtExtrait } from '@/modules/communaute/accueil/accueilFil'
import { ConfirmerSuppression } from '@/modules/communaute/accueil/components/ConfirmerSuppression'
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
} from '@/modules/communaute/accueil/components/ElementsDuFil'
import { ModaleSignalement } from '@/modules/communaute/accueil/components/ModaleSignalement'
import { useAuteur } from '@/modules/communaute/accueil/hooks/useAuteur'
import { useNombreDeCommentaires, useVues } from '@/modules/communaute/accueil/hooks/useCompteursPublication'
import { useEnregistrement } from '@/modules/communaute/accueil/hooks/useEnregistrement'
import { useJaime } from '@/modules/communaute/accueil/hooks/useJaime'
import { usePartage } from '@/modules/communaute/accueil/hooks/usePartage'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { VisuelPublication } from '@/modules/communaute/accueil/components/article/VisuelPublication'
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
 * visuel et « Voir plus » ouvrent sa page (`/accueil/publications/:id`) ;
 * « Commenter » l'ouvre sur ses commentaires.
 */
export function PublicationDuFil({ publication }: { publication: Publication }) {
  const { t } = useTranslation('accueil')
  const { titre, extrait } = titreEtExtrait(publication)
  const auteur = useAuteur(publication)
  const jaime = useJaime(publication)
  const enregistrement = useEnregistrement(publication)
  const { partager, copierLeLien } = usePartage()
  const [signalement, setSignalement] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const { account } = useSession()
  const commentaires = useNombreDeCommentaires(publication)
  const vues = useVues(publication)
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

  // La publication s'ouvre sur sa page, qui compte la lecture (comme dans yibolo-client).
  const vers = ROUTES.publication(publication.id)
  const lien = vers

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
                {/* « Enregistrer » (mettre en favoris) : pour les personnes physiques seulement. */}
                {account?.role === 'utilisateur' && (
                  <ChoixDuMenu
                    onClick={() => {
                      fermer()
                      void enregistrement.basculer()
                    }}
                  >
                    <Bookmark aria-hidden="true" />
                    {enregistrement.enregistree ? t('actions.retirerDesEnregistres') : t('actions.enregistrer')}
                  </ChoixDuMenu>
                )}
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
        <TitreDuFil vers={vers}>
          {titre}
        </TitreDuFil>
        {extrait && <ExtraitDuFil>{extrait}</ExtraitDuFil>}
      </div>

      {/* Sans photo, l'icône du domaine sur sa teinte : les cartes gardent le même rythme. */}
      <VisuelDuFil vers={vers}>
        <VisuelPublication publication={publication} className="aspect-[16/7] w-full" />
      </VisuelDuFil>

      <PiedDuFil>
        <ChiffresDuFil>
          {/* Le cœur et son nombre : un vrai bouton « J'aime », sans ouvrir la publication. */}
          <button
            type="button"
            aria-pressed={jaime.aime}
            aria-label={jaime.aime ? t('actions.nePlusAimer') : t('actions.jaime')}
            title={t('actions.jaimes', { count: jaime.nombre, nombre: num(jaime.nombre) })}
            disabled={jaime.enCours}
            onClick={() => void jaime.basculer()}
            className="-mx-1.5 inline-flex min-h-8 items-center gap-1 rounded-md px-1.5 text-rose-600 transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:opacity-60"
          >
            <Heart className="size-[0.875rem] transition-transform active:scale-125 motion-reduce:transition-none" fill={jaime.aime ? 'currentColor' : 'none'} aria-hidden="true" />
            <span className="text-muted-foreground">{num(jaime.nombre)}</span>
          </button>
          <Chiffre
            icone={<MessageCircle className="size-[0.8125rem]" aria-hidden="true" />}
            nombre={commentaires}
            libelle={t('actions.commentaires', { count: commentaires, nombre: num(commentaires) })}
          />
          <Chiffre
            icone={<Eye className="size-[0.8125rem]" aria-hidden="true" />}
            nombre={vues.nombre}
            libelle={t('actions.lectures', { count: vues.nombre, nombre: num(vues.nombre) })}
          />
          <LienDuPied vers={vers}>
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
          <Lien to={`${vers}#commentaires`} className={`${CLASSES_GESTE} text-muted-foreground hover:text-ink`}>
            <MessageCircle className="size-[0.8125rem] shrink-0" aria-hidden="true" />
            <span className="truncate">{t('actions.commenter')}</span>
          </Lien>
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
