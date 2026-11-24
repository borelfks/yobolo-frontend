import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'
import { data } from '@/data'
import { useCommentaires } from '@/data/hooks'
import { dateHeureDuFil, dateRelativeDuFil } from '@/features/accueil/accueilDates'
import { useSession } from '@/features/auth/hooks/useSession'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Textarea } from '@/shared/components/forms/Fields'
import { Button } from '@/shared/components/ui/Button'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

const LONGUEUR_MAX = 1000

/**
 * Les commentaires d'une publication (table `commentaires`) : la liste, du
 * plus ancien au plus récent, et le champ pour en écrire un au nom du compte
 * connecté. L'auteur d'un commentaire peut le supprimer.
 */
export function CommentairesPublication({ publicationId, focus }: { publicationId: string; focus: boolean }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const commentaires = useCommentaires(publicationId).toSorted((a, b) => a.le.localeCompare(b.le))

  const schema = useMemo(
    () => z.object({ texte: z.string().trim().min(1, t('commentaires.erreurs.vide')).max(LONGUEUR_MAX, t('commentaires.erreurs.tropLong', { max: LONGUEUR_MAX })) }),
    [t],
  )
  const { register, handleSubmit, reset, formState } = useForm({ resolver: zodResolver(schema), defaultValues: { texte: '' } })

  const champ = register('texte')

  const envoyer = handleSubmit(async ({ texte }) => {
    if (!account) return
    try {
      await data.create(
        'commentaires',
        { publicationId, compteId: account.id, auteur: account.name, avatar: account.avatar, texte, le: maintenant() },
        'com',
      )
      reset()
      toast.success(t('commentaires.publie'))
    } catch {
      toast.error(t('commentaires.erreurs.envoi'))
    }
  })

  const supprimer = async (id: string) => {
    try {
      await data.remove('commentaires', id)
      toast.success(t('commentaires.supprime'))
    } catch {
      toast.error(t('commentaires.erreurs.suppression'))
    }
  }

  return (
    <section aria-labelledby="titre-commentaires" className="flex flex-col gap-3 border-t border-line pt-4">
      <h3 id="titre-commentaires" className="text-sm font-bold text-navy-900">
        {t('commentaires.titre', { count: commentaires.length })}
      </h3>

      {commentaires.length === 0 ? (
        <p className="text-sm text-muted">{t('commentaires.aucun')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {commentaires.map((commentaire) => (
            <li key={commentaire.id} className="flex items-start gap-2.5">
              <Avatar src={commentaire.avatar} name={commentaire.auteur} size={34} />
              <div className="min-w-0 flex-1 rounded-xl bg-page px-3 py-2">
                <p className="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <span className="font-bold text-navy-900">{commentaire.auteur}</span>
                  <time dateTime={commentaire.le} title={dateHeureDuFil(commentaire.le)} className="text-muted">
                    {dateRelativeDuFil(commentaire.le)}
                  </time>
                </p>
                <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-line text-ink">{commentaire.texte}</p>
              </div>
              {commentaire.compteId === account?.id && (
                <button
                  type="button"
                  aria-label={t('commentaires.supprimer')}
                  title={t('commentaires.supprimer')}
                  onClick={() => void supprimer(commentaire.id)}
                  className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {account && (
        <form onSubmit={(evenement) => void envoyer(evenement)} className="flex items-start gap-2.5">
          <Avatar src={account.avatar} name={account.name} size={34} />
          <div className="min-w-0 flex-1">
            <label htmlFor="nouveau-commentaire" className="sr-only">
              {t('commentaires.champ')}
            </label>
            <Textarea
              id="nouveau-commentaire"
              rows={2}
              maxLength={LONGUEUR_MAX}
              autoFocus={focus}
              placeholder={t('commentaires.placeholder')}
              className="min-h-0"
              {...champ}
              max={undefined}
            />
            {formState.errors.texte && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.texte.message}</p>}
          </div>
          <Button type="submit" size="sm" disabled={formState.isSubmitting} aria-label={t('commentaires.envoyer')} title={t('commentaires.envoyer')}>
            <Send aria-hidden="true" />
            <span className="hidden sm:inline">{t('commentaires.envoyer')}</span>
          </Button>
        </form>
      )}
    </section>
  )
}
