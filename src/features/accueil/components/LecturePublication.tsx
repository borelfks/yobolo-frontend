import { Bookmark, Eye, Heart, MessageCircle, Share2, ThumbsUp } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { titreEtExtrait } from '@/features/accueil/accueilFil'
import { dateHeureDuFil, dateRelativeDuFil } from '@/features/accueil/accueilDates'
import { useAuteur } from '@/features/accueil/hooks/useAuteur'
import { useEnregistrement } from '@/features/accueil/hooks/useEnregistrement'
import { useJaime } from '@/features/accueil/hooks/useJaime'
import { usePartage } from '@/features/accueil/hooks/usePartage'
import { CommentairesPublication } from '@/features/accueil/components/CommentairesPublication'
import { useCommentaires } from '@/data/hooks'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Button } from '@/shared/components/ui/Button'
import { Img } from '@/shared/components/ui/Img'
import { Modal } from '@/shared/components/ui/Modal'
import type { Publication } from '@/shared/types'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

interface LecturePublicationProps {
  publication: Publication
  onFermer: () => void
  /** Un sujet touché filtre le fil sur ce sujet. */
  onSujet: (sujet: string) => void
  /** Ouverte par « Commenter » : le champ de commentaire prend la main. */
  commenter: boolean
}

/**
 * Une publication lue en entier. yibolo-client l'ouvre sur sa propre page ;
 * ce projet n'en a pas : elle s'ouvre en fenêtre sur l'accueil, avec son
 * adresse (`/accueil?publication=…`) pour être partagée.
 */
export function LecturePublication({ publication, onFermer, onSujet, commenter }: LecturePublicationProps) {
  const { t } = useTranslation('accueil')
  const auteur = useAuteur(publication)
  const { titre, extrait } = titreEtExtrait(publication)
  const jaime = useJaime(publication)
  const enregistrement = useEnregistrement(publication)
  const { partager } = usePartage()
  const commentaires = publication.commentaires + useCommentaires(publication.id).length

  return createPortal(
    <Modal
      open
      onClose={onFermer}
      size="lg"
      title={titre}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant={jaime.aime ? 'soft' : 'neutral'} size="sm" aria-pressed={jaime.aime} disabled={jaime.enCours} onClick={() => void jaime.basculer()}>
            <ThumbsUp fill={jaime.aime ? 'currentColor' : 'none'} aria-hidden="true" />
            {jaime.aime ? t('actions.nePlusAimer') : t('actions.jaime')}
          </Button>
          <Button
            variant={enregistrement.enregistree ? 'soft' : 'neutral'}
            size="sm"
            aria-pressed={enregistrement.enregistree}
            disabled={enregistrement.enCours}
            onClick={() => void enregistrement.basculer()}
          >
            <Bookmark fill={enregistrement.enregistree ? 'currentColor' : 'none'} aria-hidden="true" />
            {enregistrement.enregistree ? t('actions.enregistree') : t('actions.enregistrer')}
          </Button>
          <Button variant="neutral" size="sm" onClick={() => void partager(ROUTES.accueilPublication(publication.id), titre)}>
            <Share2 aria-hidden="true" />
            {t('actions.partager')}
          </Button>
        </div>
      }
    >
      <div className="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto pr-1">
        <div className="flex items-center gap-2.5">
          <Avatar src={auteur.photo} name={auteur.nom} size={40} />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-navy-900">{auteur.nom}</p>
            <p className="text-xs text-muted">
              <time dateTime={publication.publieeLe} title={dateHeureDuFil(publication.publieeLe)}>
                {dateRelativeDuFil(publication.publieeLe)}
              </time>
              {' · '}
              {t(`badge.${auteur.pastille}`)}
            </p>
          </div>
        </div>

        {extrait && <p className="text-sm leading-relaxed whitespace-pre-line text-ink">{extrait}</p>}

        {publication.image && <Img src={publication.image} alt="" className="aspect-[16/7] w-full rounded-xl" />}

        {publication.sujets.length > 0 && (
          <ul aria-label={t('lecture.sujets')} className="flex flex-wrap gap-1.5">
            {publication.sujets.map((sujet) => (
              <li key={sujet}>
                <button
                  type="button"
                  onClick={() => onSujet(sujet)}
                  className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  #{sujet}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="flex items-center gap-4 text-xs text-muted tabular-nums">
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3.5 text-rose-600" fill="currentColor" aria-hidden="true" />
            {t('actions.jaimes', { count: jaime.nombre, nombre: num(jaime.nombre) })}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            {t('actions.commentaires', { count: commentaires, nombre: num(commentaires) })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden="true" />
            {t('actions.lectures', { count: publication.lectures, nombre: num(publication.lectures) })}
          </span>
        </p>

        <CommentairesPublication publicationId={publication.id} focus={commenter} />
      </div>
    </Modal>,
    document.body,
  )
}
