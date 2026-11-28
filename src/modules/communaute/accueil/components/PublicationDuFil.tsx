import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { useSujetsPublication } from '@/data/hooks'
import { extraitDe, motDiese } from '@/modules/communaute/accueil/accueilFil'
import { Carte } from '@/modules/communaute/accueil/components/Carte'
import { ActionsPublication, EnTetePublication, JaimesPublication } from '@/modules/communaute/accueil/components/ElementsPublication'
import { useNombreDeCommentaires, useVues } from '@/modules/communaute/accueil/hooks/useCompteursPublication'
import { Button } from '@/shared/shadcn/button'
import type { Publication } from '@/shared/types'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Une publication du fil (canevas) : en-tête de l'auteur, extrait et
 * « …voir plus », mots-dièses des sujets, photo, ligne des chiffres
 * (« J'aime », commentaires, vues) et barre d'actions. L'extrait, la photo et
 * les chiffres ouvrent la publication ; « Commenter » l'ouvre sur ses commentaires.
 */
export function PublicationDuFil({ publication, auteur }: { publication: Publication; auteur: { nom: string; photo?: string; role: string } }) {
  const { t } = useTranslation('accueil')
  const navigate = useNavigate()
  const sujets = useSujetsPublication()
  const commentaires = useNombreDeCommentaires(publication)
  const vues = useVues(publication)
  const { extrait, suite } = extraitDe(publication)
  const vers = ROUTES.publication(publication.id)
  const motsDieses = publication.sujets.map((id) => `#${motDiese(sujets.find((s) => s.id === id)?.nom ?? id)}`).join('  ')

  return (
    <Carte element="article" className="overflow-hidden">
      <EnTetePublication publication={publication} auteur={auteur} />
      <p className="px-4 pt-2.5 pb-1.5 text-sm leading-normal whitespace-pre-line text-foreground">
        {extrait}
        {suite && (
          <Button asChild variant="link-muted" className="ml-1 align-baseline font-bold">
            <Lien to={vers}>{t('publication.voirPlus')}</Lien>
          </Button>
        )}
      </p>
      {motsDieses && <p className="px-4 pb-2 text-sm font-semibold whitespace-pre text-primary">{motsDieses}</p>}
      {publication.image && (
        <Lien to={vers} aria-label={t('publication.ouvrir')} className="block bg-border">
          <img src={publication.image} alt="" className="block max-h-60 w-full object-cover lg:max-h-[340px]" />
        </Lien>
      )}
      <div className="mx-4 flex min-h-[34px] items-center justify-between gap-2 border-b border-border text-xs text-muted-foreground">
        <JaimesPublication publication={publication} />
        <Button asChild variant="link-muted" className="text-xs font-medium">
          <Lien to={vers}>{t('publication.chiffres', { commentaires: t('publication.commentaires', { count: commentaires }), vues: t('publication.vues', { count: vues.nombre }) })}</Lien>
        </Button>
      </div>
      <ActionsPublication publication={publication} onCommenter={() => void navigate({ href: `${vers}#commentaires` })} />
    </Carte>
  )
}
