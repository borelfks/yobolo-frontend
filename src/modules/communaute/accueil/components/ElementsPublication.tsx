import { useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Bookmark, Ellipsis, Flag, MessageCircle, Send, ThumbsUp } from 'lucide-react'
import { dateHeureDuFil, dateRelativeDuFil } from '@/modules/communaute/accueil/accueilDates'
import { premiereLigne } from '@/modules/communaute/accueil/accueilFil'
import { PhotoRonde } from '@/modules/communaute/accueil/components/Carte'
import { ModaleSignalement } from '@/modules/communaute/accueil/components/ModaleSignalement'
import { useEnregistrement } from '@/modules/communaute/accueil/hooks/useEnregistrement'
import { useJaime } from '@/modules/communaute/accueil/hooks/useJaime'
import { usePartage } from '@/modules/communaute/accueil/hooks/usePartage'
import { useSignalement } from '@/modules/communaute/accueil/hooks/useSignalement'
import { Button } from '@/shared/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import type { Publication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/**
 * L'en-tête d'une publication : photo de l'auteur, nom, rôle, « il y a 2 j ·
 * Public », et le menu « … » (signaler la publication, ou annuler le signalement).
 * Une publication signalée porte le bandeau « Publication signalée ».
 */
export function EnTetePublication({ publication, auteur }: { publication: Publication; auteur: { nom: string; photo?: string; role: string } }) {
  const { t } = useTranslation('accueil')
  const { signalee, annuler } = useSignalement(publication.id)
  const [fenetre, setFenetre] = useState(false)
  return (
    <>
      <header className="flex gap-2 px-4 pt-3">
        <PhotoRonde src={auteur.photo} nom={auteur.nom} />
        <div className="flex min-w-0 flex-1 flex-col leading-snug">
          <b className="text-sm">{auteur.nom}</b>
          <span className="text-xs text-muted-foreground">{auteur.role}</span>
          <span className="text-xs text-muted-foreground">
            <time dateTime={publication.publieeLe} title={dateHeureDuFil(publication.publieeLe)}>
              {dateRelativeDuFil(publication.publieeLe)}
            </time>{' '}
            · {t('publication.public')}
          </span>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={t('publication.plusDActions')}>
              <Ellipsis className="size-5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem className="min-h-11 items-center gap-2.5 text-sm text-foreground" onSelect={() => (signalee ? void annuler() : setFenetre(true))}>
              <Flag className="size-5 text-foreground" strokeWidth={1.8} aria-hidden />
              <span className="flex flex-col gap-px">
                <span>{signalee ? t('signalement.annulerMenu') : t('signalement.menu')}</span>
                <span className="text-xs font-medium text-muted-foreground">{signalee ? t('signalement.annulerAide') : t('signalement.aide')}</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {signalee && (
        <p role="status" className="mx-4 mt-2 rounded-md bg-destructive-soft px-3 py-2 text-meta font-semibold text-destructive-hover">
          {t('signalement.bandeau')}
        </p>
      )}
      <ModaleSignalement ouverte={fenetre} publicationId={publication.id} onFermer={() => setFenetre(false)} />
    </>
  )
}

/** Un bouton de la barre d'actions : icône et libellé côte à côte (ordinateur), l'un sous l'autre (téléphone). */
function Action({ icone, libelle, actif, ...props }: { icone: ReactNode; libelle: string; actif?: boolean } & Omit<ComponentProps<typeof Button>, 'children'>) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-14 min-w-0 flex-1 flex-col gap-0.5 rounded-sm px-1 text-caption3 font-semibold lg:h-11 lg:flex-row lg:gap-1.5 lg:text-meta [&_svg]:size-5',
        actif && 'text-primary hover:text-primary',
      )}
      {...props}
    >
      {icone}
      <span className="truncate">{libelle}</span>
    </Button>
  )
}

/**
 * La barre d'actions d'une publication (canevas) : « J'aime », « Commenter »,
 * « Partager » (« Lien copié » ensuite), « Enregistrer » / « Enregistrée ».
 * Toutes écrivent dans la base, sauf « Partager » (feuille de partage ou lien copié).
 */
export function ActionsPublication({ publication, onCommenter }: { publication: Publication; onCommenter: () => void }) {
  const { t } = useTranslation('accueil')
  const jaime = useJaime(publication)
  const enregistrement = useEnregistrement(publication)
  const { partager } = usePartage()
  const [partagee, setPartagee] = useState(false)
  return (
    <div className="flex px-2 py-1">
      <Action
        icone={<ThumbsUp strokeWidth={1.8} fill={jaime.aime ? 'currentColor' : 'none'} aria-hidden />}
        libelle={t('actions.jaime')}
        actif={jaime.aime}
        aria-pressed={jaime.aime}
        disabled={jaime.enCours}
        onClick={() => void jaime.basculer()}
      />
      <Action icone={<MessageCircle strokeWidth={1.8} aria-hidden />} libelle={t('actions.commenter')} onClick={onCommenter} />
      <Action
        icone={<Send strokeWidth={1.8} aria-hidden />}
        libelle={partagee ? t('actions.lienCopie') : t('actions.partager')}
        onClick={() => {
          void partager(ROUTES.publication(publication.id), premiereLigne(publication))
          setPartagee(true)
        }}
      />
      <Action
        icone={<Bookmark strokeWidth={1.8} fill={enregistrement.enregistree ? 'currentColor' : 'none'} aria-hidden />}
        libelle={enregistrement.enregistree ? t('actions.enregistree') : t('actions.enregistrer')}
        actif={enregistrement.enregistree}
        aria-pressed={enregistrement.enregistree}
        disabled={enregistrement.enCours}
        onClick={() => void enregistrement.basculer()}
      />
    </div>
  )
}

/** « Vous », « Vous et 2 autres », ou le nombre de « J'aime », derrière la pastille bleue (ligne des chiffres). */
export function JaimesPublication({ publication }: { publication: Publication }) {
  const { t } = useTranslation('accueil')
  const { aime, nombre } = useJaime(publication)
  if (nombre === 0) return <span />
  return (
    <span className="flex items-center gap-1">
      <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
        <ThumbsUp className="size-2.5" fill="currentColor" strokeWidth={0} aria-hidden />
      </span>
      {aime ? (nombre === 1 ? t('jaimes.vous') : t('jaimes.vousEt', { count: nombre - 1 })) : t('jaimes.nombre', { count: nombre })}
    </span>
  )
}
