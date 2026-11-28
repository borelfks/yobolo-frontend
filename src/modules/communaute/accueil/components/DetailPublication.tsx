import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useSujetsPublication } from '@/data/hooks'
import { dateRelativeDuFil } from '@/modules/communaute/accueil/accueilDates'
import { CHAMP_COMMENTAIRE, motDiese, premiereLigne, texteDe } from '@/modules/communaute/accueil/accueilFil'
import { Carte } from '@/modules/communaute/accueil/components/Carte'
import { CommentairesPublication } from '@/modules/communaute/accueil/components/commentaires/CommentairesPublication'
import { ActionsPublication, EnTetePublication } from '@/modules/communaute/accueil/components/ElementsPublication'
import { usePublicationsDuFil } from '@/modules/communaute/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { useJaime } from '@/modules/communaute/accueil/hooks/useJaime'
import { useNombreDeCommentaires, useVues } from '@/modules/communaute/accueil/hooks/useCompteursPublication'
import { Button } from '@/shared/shadcn/button'
import type { Publication } from '@/shared/types'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

/** « ← Retour au fil » (ordinateur) ou « ← Publication » (téléphone, sur une bande blanche). */
export function RetourAuFil() {
  const { t } = useTranslation('accueil')
  return (
    <div className="border-b border-border bg-card px-3 py-2.5 lg:border-0 lg:bg-transparent lg:px-0.5 lg:py-0">
      <Button asChild variant="link" className="gap-1.5 text-foreground">
        <Lien to={ROUTES.accueil}>
          <ArrowLeft className="size-5" aria-hidden />
          <span className="lg:hidden">{t('detail.publication')}</span>
          <span className="hidden lg:inline">{t('detail.retour')}</span>
        </Lien>
      </Button>
    </div>
  )
}

/**
 * Une publication ouverte (canevas : « Détail d'une publication ») : l'en-tête,
 * la photo, le texte entier, les mots-dièses (un clic montre le fil du sujet),
 * les chiffres, la barre d'actions, puis les commentaires. L'ouverture compte
 * une vue (une par compte).
 */
export function DetailPublication({ publication, auteur }: { publication: Publication; auteur: { nom: string; photo?: string; role: string } }) {
  const { t } = useTranslation('accueil')
  const sujets = useSujetsPublication()
  const { seulement } = useFiltresDuFil()
  const { aime } = useJaime(publication)
  const commentaires = useNombreDeCommentaires(publication)
  const vues = useVues(publication)
  const { compter } = vues
  // L'ouverture de la page compte une vue (une seule par compte).
  // eslint-disable-next-line react-hooks/exhaustive-deps -- une fois par publication ouverte
  useEffect(compter, [publication.id])
  // Une notification « réponse à votre commentaire » mène à `#commentaires` : la page s'y place.
  const { hash } = useLocation()
  useEffect(() => {
    if (hash !== 'commentaires' && hash !== '#commentaires') return
    const minuterie = window.setTimeout(() => document.getElementById('commentaires')?.scrollIntoView({ block: 'start' }), 120)
    return () => window.clearTimeout(minuterie)
  }, [hash])

  return (
    <Carte element="article" className="overflow-hidden">
      <EnTetePublication publication={publication} auteur={auteur} />
      {publication.image && <img src={publication.image} alt="" className="mt-3 block max-h-[260px] w-full object-cover lg:max-h-[420px]" />}
      <p className="px-4 pt-3.5 pb-2 text-sm leading-relaxed whitespace-pre-line">{texteDe(publication)}</p>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1 px-4 pb-3">
        {publication.sujets.map((id) => (
          <Button key={id} variant="link" onClick={() => seulement({ sujets: [id] })}>
            #{motDiese(sujets.find((s) => s.id === id)?.nom ?? id)}
          </Button>
        ))}
      </div>
      <div className="mx-4 flex min-h-[34px] items-center justify-between gap-2 border-b border-border text-xs text-muted-foreground">
        <span>{aime ? t('detail.vousAimez') : ''}</span>
        <span>{t('publication.chiffres', { commentaires: t('publication.commentaires', { count: commentaires }), vues: t('publication.vues', { count: vues.nombre }) })}</span>
      </div>
      <ActionsPublication publication={publication} onCommenter={() => document.getElementById(CHAMP_COMMENTAIRE)?.focus()} />
      <CommentairesPublication publicationId={publication.id} />
    </Carte>
  )
}

/** « Plus de publications de … » : les autres publications du même auteur, sous la publication ouverte. */
export function AutresPublications({ publication, nom }: { publication: Publication; nom: string }) {
  const { t } = useTranslation('accueil')
  const { publications, nombreDeCommentaires } = usePublicationsDuFil()
  const autres = publications.filter((p) => p.auteurId === publication.auteurId && p.id !== publication.id)
  if (autres.length === 0) return null
  return (
    <Carte element="section" className="overflow-hidden">
      <h2 className="px-4 pt-3.5 pb-1.5 text-base font-bold">{t('detail.autres', { nom })}</h2>
      {autres.map((p) => (
        <Lien key={p.id} to={ROUTES.publication(p.id)} className="flex flex-col gap-1 border-t border-border px-4 py-3 text-foreground no-underline hover:bg-row-hover">
          <span className="line-clamp-2 text-sm leading-snug font-semibold">{premiereLigne(p)}</span>
          <span className="text-xs text-muted-foreground">
            {dateRelativeDuFil(p.publieeLe)} · {t('publication.commentaires', { count: nombreDeCommentaires(p) })}
          </span>
        </Lien>
      ))}
    </Carte>
  )
}
