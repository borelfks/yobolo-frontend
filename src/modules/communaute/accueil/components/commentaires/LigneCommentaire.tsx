import { Flag, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { dateHeureDuFil, dateRelativeDuFil } from '@/modules/communaute/accueil/accueilDates'
import { ModaleSignalement } from '@/modules/communaute/accueil/components/ModaleSignalement'
import { ZoneDeSaisie } from '@/modules/communaute/accueil/components/commentaires/ZoneDeSaisie'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { MenuActions } from '@/shared/ui/MenuActions'
import { Modal } from '@/shared/ui/Modal'
import type { Commentaire } from '@/shared/types'
import { notifier } from '@/shared/utils/notifications'
import { ROUTES } from '@/shared/utils/routes'

const CLASSES_ACTION = 'inline-flex min-h-8 items-center rounded-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/**
 * Un commentaire à la manière des réseaux sociaux (LigneCommentaire de
 * yibolo-client) : une bulle, un menu « ⋯ » pour modifier, supprimer ou
 * signaler, puis « Répondre » sous la bulle. Répondre à une réponse ouvre la
 * saisie du commentaire parent, adressée à son auteur : un seul niveau.
 */
export function LigneCommentaire({
  commentaire,
  reponses,
  onRepondre,
  nomsDuFil = [],
}: {
  commentaire: Commentaire
  /** Absent sur une réponse : une réponse se rattache au commentaire qu'elle suit. */
  reponses?: Commentaire[]
  /** Sur une réponse : ouvre la saisie du commentaire parent, adressée à son auteur. */
  onRepondre?: (nom: string) => void
  nomsDuFil?: string[]
}) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const [enModification, setEnModification] = useState(false)
  const [reponseA, setReponseA] = useState<string | null>(null)
  const [signalement, setSignalement] = useState(false)
  const [suppression, setSuppression] = useState(false)

  const mien = commentaire.compteId === account?.id
  const premierNiveau = reponses !== undefined
  const noms = premierNiveau ? [commentaire.auteur, ...(reponses ?? []).map((r) => r.auteur)] : nomsDuFil
  const repondre = (nom: string) => (premierNiveau ? setReponseA(nom) : onRepondre?.(nom))

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

  const envoyerLaReponse = async (texte: string) => {
    if (!account) return false
    try {
      await data.create(
        'commentaires',
        { publicationId: commentaire.publicationId, parentId: commentaire.id, compteId: account.id, auteur: account.name, avatar: account.avatar, texte, le: maintenant() },
        'com',
      )
      // L'auteur du commentaire est prévenu (s'il ne se répond pas à lui-même).
      if (commentaire.compteId !== account.id)
        await notifier(commentaire.compteId, {
          type: 'message',
          titre: t('commentaires.notification.titre'),
          texte: t('commentaires.notification.texte', { nom: account.name }),
          quand: t('commentaires.notification.quand'),
          vers: `${ROUTES.publication(commentaire.publicationId)}#commentaires`,
        })
      toast.success(t('commentaires.reponsePubliee'))
      setReponseA(null)
      return true
    } catch {
      toast.error(t('commentaires.erreurs.envoi'))
      return false
    }
  }

  // Supprimer : les réponses des autres restent visibles, sous « Ce commentaire a été supprimé ».
  const retirer = async () => {
    setSuppression(false)
    try {
      if (premierNiveau && (reponses ?? []).length > 0) await data.update('commentaires', commentaire.id, { supprime: true, texte: '' })
      else await data.remove('commentaires', commentaire.id)
      toast.success(t('commentaires.supprime'))
    } catch {
      toast.error(t('commentaires.erreurs.suppression'))
    }
  }

  return (
    <li className="flex gap-2">
      <Avatar src={commentaire.supprime ? undefined : commentaire.avatar || undefined} name={commentaire.supprime ? '·' : commentaire.auteur} size={32} className="shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {commentaire.supprime ? (
          <p className="w-fit rounded-2xl border border-line bg-white px-3 py-2 text-sm text-muted-foreground italic">{t('commentaires.supprimeTexte')}</p>
        ) : enModification ? (
          <ZoneDeSaisie
            placeholder={t('commentaires.placeholder')}
            libelleEnvoi={t('commentaires.enregistrer')}
            valeurInitiale={commentaire.texte}
            focusAuMontage
            onAnnuler={() => setEnModification(false)}
            onEnvoyer={corriger}
          />
        ) : (
          <div className="group/ligne flex w-full items-start gap-1">
            <div className="w-fit max-w-full min-w-0 rounded-2xl border border-line bg-white px-3 py-2">
              <span className="block text-xs font-semibold text-navy-900">{commentaire.auteur}</span>
              <p className="text-sm break-words whitespace-pre-line text-ink">
                <TexteAvecMention texte={commentaire.texte} noms={noms} />
              </p>
            </div>
            {account && (
              // À droite de la bulle, toujours au même endroit ; sur ordinateur il apparaît au survol.
              <div className="ml-auto shrink-0 transition-opacity sm:opacity-0 sm:group-hover/ligne:opacity-100 sm:focus-within:opacity-100">
              <MenuActions
                className="bg-transparent text-muted-foreground hover:bg-page hover:text-ink"
                label={t('commentaires.options')}
                actions={[
                  { label: t('commentaires.modifier'), icon: <Pencil />, hidden: !mien, onClick: () => setEnModification(true) },
                  { label: t('commentaires.supprimerCourt'), icon: <Trash2 />, danger: true, hidden: !mien, onClick: () => setSuppression(true) },
                  { label: t('actions.signaler'), icon: <Flag />, danger: true, hidden: mien, onClick: () => setSignalement(true) },
                ]}
              />
              </div>
            )}
          </div>
        )}

        {!enModification && !commentaire.supprime && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-3 text-xs text-muted-foreground">
            <time dateTime={commentaire.le} title={dateHeureDuFil(commentaire.le)} className="tabular-nums">
              {dateRelativeDuFil(commentaire.le)}
            </time>
            {account && (
              <button type="button" onClick={() => repondre(commentaire.auteur)} className={CLASSES_ACTION}>
                {t('commentaires.repondre')}
              </button>
            )}
            {commentaire.modifieLe && <span title={t('commentaires.modifieLe', { date: dateHeureDuFil(commentaire.modifieLe) })}>{t('commentaires.modifieCourt')}</span>}
          </span>
        )}

        {reponses && reponses.length > 0 && (
          <ul className="mt-2 flex flex-col gap-3">
            {reponses.map((reponse) => (
              <LigneCommentaire key={reponse.id} commentaire={reponse} onRepondre={(nom) => setReponseA(nom)} nomsDuFil={noms} />
            ))}
          </ul>
        )}

        {reponseA !== null && account && (
          <div className="mt-2 flex gap-2">
            <Avatar src={account.avatar || undefined} name={account.name} size={32} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <ZoneDeSaisie
                key={reponseA}
                placeholder={t('commentaires.repondreA', { nom: reponseA })}
                libelleEnvoi={t('commentaires.envoyer')}
                valeurInitiale={reponseA === account.name ? '' : `${reponseA} `}
                focusAuMontage
                onAnnuler={() => setReponseA(null)}
                onEnvoyer={envoyerLaReponse}
              />
            </div>
          </div>
        )}
      </div>

      {createPortal(
        <Modal
          open={suppression}
          onClose={() => setSuppression(false)}
          icon={<Trash2 className="mt-1 size-5 text-rose-600" aria-hidden="true" />}
          title={t('commentaires.confirmerSuppression')}
          footer={
            <>
              <Button variant="neutral" onClick={() => setSuppression(false)}>
                {t('suppression.annuler')}
              </Button>
              <Button variant="danger" onClick={() => void retirer()}>
                {t('commentaires.supprimerCourt')}
              </Button>
            </>
          }
        >
          <p className="text-sm text-navy-900">{t('commentaires.confirmerSuppressionDetail')}</p>
        </Modal>,
        document.body,
      )}
      <ModaleSignalement ouverte={signalement} publicationId={commentaire.publicationId} commentaireId={commentaire.id} onFermer={() => setSignalement(false)} />
    </li>
  )
}

/** « Awa Mbarga merci ! » : le nom de la personne à qui l'on répond, mis en avant. */
function TexteAvecMention({ texte, noms }: { texte: string; noms: string[] }) {
  const nom = noms.filter((un) => un && texte.startsWith(`${un} `)).sort((a, b) => b.length - a.length)[0]
  if (!nom) return <>{texte}</>
  return (
    <>
      <span className="font-semibold text-brand-600">{nom}</span>
      {texte.slice(nom.length)}
    </>
  )
}
