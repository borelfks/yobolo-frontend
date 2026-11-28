import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { dateHeureDuFil, dateRelativeDuFil } from '@/modules/communaute/accueil/accueilDates'
import { PhotoRonde } from '@/modules/communaute/accueil/components/Carte'
import { SaisieCommentaire } from '@/modules/communaute/accueil/components/commentaires/SaisieCommentaire'
import { ModaleSignalement } from '@/modules/communaute/accueil/components/ModaleSignalement'
import { useAuteurs } from '@/modules/communaute/accueil/hooks/useAuteur'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/shadcn/alert-dialog'
import { Button } from '@/shared/shadcn/button'
import type { Commentaire } from '@/shared/types'
import { notifier } from '@/shared/utils/notifications'
import { ROUTES } from '@/shared/utils/routes'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/** Une action sous la bulle (« Répondre », « Modifier »…) : 12 px, gras, gris. */
function ActionCommentaire({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <Button variant="link-muted" className="min-h-6 text-xs font-bold" onClick={onClick}>
      {children}
    </Button>
  )
}

/**
 * Un commentaire (canevas) : photo, bulle grise (nom, date, rôle, texte), puis
 * « Répondre » — et pour son auteur « Modifier », « Supprimer », pour les
 * autres « Signaler ». Les réponses se rangent dessous (un seul niveau) ;
 * l'auteur du commentaire est prévenu d'une réponse.
 */
export function LigneCommentaire({ commentaire, reponses }: { commentaire: Commentaire; /** Absent sur une réponse. */ reponses?: Commentaire[] }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const auteurDe = useAuteurs()
  const [enModification, setEnModification] = useState(false)
  const [reponse, setReponse] = useState(false)
  const [signalement, setSignalement] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const auteur = auteurDe(commentaire.compteId, { nom: commentaire.auteur, photo: commentaire.avatar || undefined })
  const mien = commentaire.compteId === account?.id
  const premierNiveau = reponses !== undefined

  const corriger = async (texte: string) => {
    try {
      await data.update('commentaires', commentaire.id, { texte, modifieLe: maintenant() })
      toast.success(t('commentaires.modifie'))
      setEnModification(false)
      return true
    } catch {
      toast.error(t('commentaires.erreurs.envoi'))
      return false
    }
  }

  const repondre = async (texte: string) => {
    if (!account) return false
    try {
      await data.create(
        'commentaires',
        { publicationId: commentaire.publicationId, parentId: commentaire.id, compteId: account.id, auteur: account.name, avatar: account.avatar, texte, le: maintenant() },
        'com',
      )
      if (commentaire.compteId !== account.id)
        await notifier(commentaire.compteId, {
          type: 'message',
          titre: t('commentaires.notification.titre'),
          texte: t('commentaires.notification.texte', { nom: account.name }),
          quand: t('commentaires.notification.quand'),
          vers: `${ROUTES.publication(commentaire.publicationId)}#commentaires`,
        })
      toast.success(t('commentaires.reponsePubliee'))
      setReponse(false)
      return true
    } catch {
      toast.error(t('commentaires.erreurs.envoi'))
      return false
    }
  }

  // Les réponses des autres restent visibles, sous « Ce commentaire a été supprimé ».
  const retirer = async () => {
    try {
      if ((reponses ?? []).length > 0) await data.update('commentaires', commentaire.id, { supprime: true, texte: '' })
      else await data.remove('commentaires', commentaire.id)
      toast.success(t('commentaires.supprime'))
    } catch {
      toast.error(t('commentaires.erreurs.suppression'))
    }
  }

  return (
    <li className="flex gap-2">
      <PhotoRonde src={commentaire.supprime ? undefined : auteur.photo} nom={commentaire.supprime ? '·' : auteur.nom} className="size-10" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {commentaire.supprime ? (
          <p className="rounded-md rounded-tl-none bg-accent px-3 py-2 text-sm text-muted-foreground italic">{t('commentaires.supprimeTexte')}</p>
        ) : enModification && account ? (
          <SaisieCommentaire
            photo={account.avatar || undefined}
            nom={account.name}
            placeholder={t('commentaires.placeholder')}
            libelleEnvoi={t('commentaires.enregistrer')}
            valeurInitiale={commentaire.texte}
            focus
            onAnnuler={() => setEnModification(false)}
            onEnvoyer={corriger}
          />
        ) : (
          <div className="rounded-md rounded-tl-none bg-accent px-3 pt-2 pb-2.5">
            <div className="flex justify-between gap-2">
              <b className="text-sm">{auteur.nom}</b>
              <time dateTime={commentaire.le} title={dateHeureDuFil(commentaire.le)} className="text-xs whitespace-nowrap text-muted-foreground">
                {dateRelativeDuFil(commentaire.le)}
                {commentaire.modifieLe && ` · ${t('commentaires.modifieCourt')}`}
              </time>
            </div>
            <span className="block text-xs text-muted-foreground">{auteur.role}</span>
            <p className="mt-2 text-sm leading-normal break-words whitespace-pre-line">{commentaire.texte}</p>
          </div>
        )}

        {account && !commentaire.supprime && !enModification && (
          <span className="flex flex-wrap gap-3 pl-2">
            {premierNiveau && <ActionCommentaire onClick={() => setReponse(true)}>{t('commentaires.repondre')}</ActionCommentaire>}
            {mien ? (
              <>
                <ActionCommentaire onClick={() => setEnModification(true)}>{t('commentaires.modifier')}</ActionCommentaire>
                <ActionCommentaire onClick={() => setSuppression(true)}>{t('commentaires.supprimerCourt')}</ActionCommentaire>
              </>
            ) : (
              <ActionCommentaire onClick={() => setSignalement(true)}>{t('commentaires.signaler')}</ActionCommentaire>
            )}
          </span>
        )}

        {reponses && reponses.length > 0 && (
          <ul className="mt-2 flex flex-col gap-3">
            {reponses.map((r) => (
              <LigneCommentaire key={r.id} commentaire={r} />
            ))}
          </ul>
        )}

        {reponse && account && (
          <div className="mt-2">
            <SaisieCommentaire
              photo={account.avatar || undefined}
              nom={account.name}
              placeholder={t('commentaires.repondreA', { nom: auteur.nom })}
              libelleEnvoi={t('commentaires.publier')}
              focus
              onAnnuler={() => setReponse(false)}
              onEnvoyer={repondre}
            />
          </div>
        )}
      </div>

      <AlertDialog open={suppression} onOpenChange={setSuppression}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('commentaires.confirmerSuppression')}</AlertDialogTitle>
            <AlertDialogDescription>{t('commentaires.confirmerSuppressionDetail')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('commentaires.annuler')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive-solid" onClick={() => void retirer()}>
              {t('commentaires.supprimerCourt')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ModaleSignalement ouverte={signalement} publicationId={commentaire.publicationId} commentaireId={commentaire.id} onFermer={() => setSignalement(false)} />
    </li>
  )
}
