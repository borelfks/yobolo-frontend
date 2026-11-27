import { Bookmark, Clock, Eye, Flag, MessageCircle, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from '@tanstack/react-router'
import { Lien } from '@/shared/ui/Lien'
import { dateHeureDuFil } from '@/modules/communaute/accueil/accueilDates'
import { blocsDuTexte, nomDuSujet, titreEtExtrait } from '@/modules/communaute/accueil/accueilFil'
import { PartagePublication } from '@/modules/communaute/accueil/components/article/PartagePublication'
import { PublicationsSimilaires } from '@/modules/communaute/accueil/components/article/PublicationsSimilaires'
import { FilDeCommentaires } from '@/modules/communaute/accueil/components/commentaires/FilDeCommentaires'
import { ModaleSignalement } from '@/modules/communaute/accueil/components/ModaleSignalement'
import { useAuteur } from '@/modules/communaute/accueil/hooks/useAuteur'
import { useNombreDeCommentaires, useVues } from '@/modules/communaute/accueil/hooks/useCompteursPublication'
import { useEnregistrement } from '@/modules/communaute/accueil/hooks/useEnregistrement'
import { useJaime } from '@/modules/communaute/accueil/hooks/useJaime'
import { useSujetsPublication } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Avatar } from '@/shared/ui/Avatar'
import { Img } from '@/shared/ui/Img'
import type { Publication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const MOTS_PAR_MINUTE = 200

/** Le point « · » devant un élément de la ligne d'infos (attaché à lui, il ne reste jamais seul en fin de ligne). */
const POINT = "sm:before:mr-1 sm:before:text-muted-foreground/60 sm:before:content-['·']"

/**
 * Une publication lue comme un article de presse (ArticlePublication de
 * yibolo-client) : rubrique, titre, signature, visuel, barre d'actions, texte
 * aéré, sujets, puis les commentaires. En colonne : le partage et les
 * publications proches.
 */
export function ArticlePublication({ publication }: { publication: Publication }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const auteur = useAuteur(publication)
  const jaime = useJaime(publication)
  const enregistrement = useEnregistrement(publication)
  const [signalementOuvert, setSignalementOuvert] = useState(false)
  const sujets = useSujetsPublication()
  const commentaires = useRef<HTMLElement>(null)
  const nombreDeCommentaires = useNombreDeCommentaires(publication)
  const vues = useVues(publication)
  // L'ouverture de la page compte une vue (une seule par compte).
  const { compter } = vues
  // eslint-disable-next-line react-hooks/exhaustive-deps -- une fois par publication ouverte
  useEffect(compter, [publication.id])
  // « Commenter » depuis le fil mène à `#commentaires` : la page s'y place.
  const { hash } = useLocation()
  useEffect(() => {
    if (hash !== '#commentaires') return
    // Après le retour en haut du cadre (ScrollRestoration), qui passe juste après.
    const minuterie = window.setTimeout(() => commentaires.current?.scrollIntoView({ block: 'start' }), 120)
    return () => window.clearTimeout(minuterie)
  }, [hash])

  const { titre, extrait } = titreEtExtrait(publication)
  const minutes = Math.max(1, Math.round(extrait.split(/\s+/).length / MOTS_PAR_MINUTE))
  const rubrique = publication.sujets[0]
  // On ne signale pas ce qu'on a écrit soi-même.
  const signalable = !(publication.auteurType === 'compte' && publication.auteurId === account?.id)
  const blocs = blocsDuTexte(extrait)

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <article className="flex min-w-0 flex-col gap-6">
        <header className="flex flex-col gap-4">
          {rubrique && (
            <Lien
              to={ROUTES.accueilSujet(rubrique)}
              className="w-fit rounded-md bg-brand-50 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider text-brand-700 uppercase transition-colors hover:bg-brand-100"
            >
              {nomDuSujet(rubrique, sujets)}
            </Lien>
          )}
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance text-navy-900 sm:text-[2.75rem]">{titre}</h1>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
            <span className="flex min-w-0 items-center gap-2">
              <Avatar src={auteur.photo || undefined} name={auteur.nom} size={28} className="ring-1 ring-line" />
              {auteur.vers ? (
                <Lien to={auteur.vers} title={t('article.voirLAuteur', { nom: auteur.nom })} className="truncate font-medium text-ink hover:underline">
                  {auteur.nom}
                </Lien>
              ) : (
                <span className="truncate font-medium text-ink">{auteur.nom}</span>
              )}
              <span className="shrink-0 rounded bg-brand-50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-brand-700">{t(`badge.${auteur.pastille}`)}</span>
            </span>
            <Separateur />
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-2">
              <time dateTime={publication.publieeLe} title={dateHeureDuFil(publication.publieeLe)} className="whitespace-nowrap">
                {shortDate(publication.publieeLe, { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
              <span className={`inline-flex items-center gap-1 whitespace-nowrap ${POINT}`}>
                <Clock className="size-3.5" aria-hidden="true" />
                {t('article.lecture', { count: minutes })}
              </span>
              <span className={`inline-flex items-center gap-1 whitespace-nowrap tabular-nums ${POINT}`}>
                <Eye className="size-3.5" aria-hidden="true" />
                {t('actions.lectures', { count: vues.nombre, nombre: num(vues.nombre) })}
              </span>
            </span>
          </div>
        </header>

        {/* Pas de grand cadre vide : sans photo, l'article passe directement aux actions. */}
        {publication.image && (
          <div className="overflow-hidden rounded-lg">
            <Img src={publication.image} alt="" className="aspect-[16/9] w-full" />
          </div>
        )}

        <div className="flex items-center gap-1 rounded-lg border border-line bg-white p-1.5">
          <ActionDArticle
            icone={<ThumbsUp className="size-4" aria-hidden="true" fill={jaime.aime ? 'currentColor' : 'none'} />}
            libelle={jaime.aime ? t('actions.nePlusAimer') : t('actions.jaime')}
            nombre={jaime.nombre}
            actif={jaime.aime}
            couleurActive="text-rose-600"
            aria-pressed={jaime.aime}
            disabled={jaime.enCours}
            onClick={() => void jaime.basculer()}
          />
          <ActionDArticle
            icone={<MessageCircle className="size-4" aria-hidden="true" />}
            libelle={t('actions.commenter')}
            nombre={nombreDeCommentaires}
            onClick={() => commentaires.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          />
          {/* « Enregistrer » (mettre en favoris) : pour les personnes physiques seulement. */}
          {account?.role === 'utilisateur' && (
            <ActionDArticle
              icone={<Bookmark className="size-4" aria-hidden="true" fill={enregistrement.enregistree ? 'currentColor' : 'none'} />}
              libelle={enregistrement.enregistree ? t('actions.enregistree') : t('actions.enregistrer')}
              actif={enregistrement.enregistree}
              aria-pressed={enregistrement.enregistree}
              disabled={enregistrement.enCours}
              onClick={() => void enregistrement.basculer()}
            />
          )}
          {signalable && (
            <ActionDArticle
              icone={<Flag className="size-4" aria-hidden="true" />}
              libelle={t('actions.signaler')}
              className="ml-auto"
              onClick={() => setSignalementOuvert(true)}
            />
          )}
        </div>

        {/* Le premier paragraphe en chapeau ; une suite « 1. … 2. … » en vraie liste numérotée. */}
        <div className="flex max-w-[68ch] flex-col gap-5 text-base leading-8 text-ink/90 sm:text-[1.0625rem]">
          {blocs.map((bloc, rang) =>
            bloc.liste ? (
              <ol key={rang} className="flex list-decimal flex-col gap-2 pl-6 marker:font-semibold marker:text-brand-600">
                {bloc.lignes.map((ligne) => (
                  <li key={ligne}>{ligne}</li>
                ))}
              </ol>
            ) : (
              <p key={rang} className={cn(rang === 0 && 'text-lg leading-8 font-medium text-ink sm:text-xl')}>
                {bloc.lignes[0]}
              </p>
            ),
          )}
        </div>

        {publication.sujets.length > 0 && (
          <ul aria-label={t('lecture.sujets')} className="flex flex-wrap gap-2 border-t border-line pt-5">
            {publication.sujets.map((sujet) => (
              <li key={sujet}>
                <Lien
                  to={ROUTES.accueilSujet(sujet)}
                  className="inline-flex min-h-8 items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
                >
                  #{sujet}
                </Lien>
              </li>
            ))}
          </ul>
        )}

        <section id="commentaires" ref={commentaires} className="flex scroll-mt-24 flex-col gap-4 border-t border-line pt-6">
          <h2 className="text-xl font-bold tracking-tight text-navy-900">{t('article.commentaires', { count: nombreDeCommentaires })}</h2>
          <FilDeCommentaires publicationId={publication.id} />
        </section>
      </article>

      <aside className="flex flex-col gap-10 lg:border-l lg:border-line lg:pl-8">
        <div className="flex flex-col gap-10 lg:sticky lg:top-[92px]">
          <PartagePublication titre={titre} publicationId={publication.id} />
          <PublicationsSimilaires publication={publication} />
        </div>
      </aside>

      <ModaleSignalement ouverte={signalementOuvert} publicationId={publication.id} onFermer={() => setSignalementOuvert(false)} />
    </div>
  )
}

/** Le trait entre l'auteur et la date, seulement quand ils tiennent sur une ligne. */
function Separateur() {
  return (
    <span aria-hidden="true" className="hidden text-line sm:inline">
      |
    </span>
  )
}

function ActionDArticle({
  icone,
  libelle,
  nombre,
  actif = false,
  couleurActive = 'text-brand-600',
  disabled = false,
  className,
  onClick,
  ...aria
}: {
  'aria-pressed'?: boolean
  icone: ReactNode
  libelle: string
  nombre?: number
  actif?: boolean
  /** La couleur du bouton actif (J'aime : rose, comme sur la carte du fil). */
  couleurActive?: string
  disabled?: boolean
  className?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={libelle}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium tabular-nums transition-colors hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:opacity-50',
        actif ? couleurActive : 'text-ink/80 hover:text-ink',
        className,
      )}
      {...aria}
    >
      {icone}
      <span className="max-sm:sr-only">{libelle}</span>
      {nombre !== undefined && <span className="text-muted-foreground">{num(nombre)}</span>}
    </button>
  )
}
