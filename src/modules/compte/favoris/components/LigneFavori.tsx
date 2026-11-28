import { useTranslation } from 'react-i18next'
import type { FavoriAffiche } from '@/modules/compte/favoris/hooks/useFavorisAffiches'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'

/**
 * Un favori (canevas « Mes favoris ») : vignette, badges (genre, dossier,
 * « Établissement vérifié »), titre, deux lignes d'appoint, puis « Voir les
 * détails » (ou « Voir l’établissement », « Lire ») et « Retirer des favoris ».
 */
export function LigneFavori({ favori }: { favori: FavoriAffiche }) {
  const { t } = useTranslation('favorites')
  return (
    <article className="flex flex-wrap gap-3.5 border-t border-border py-4">
      {favori.image ? (
        <img src={favori.image} alt="" className="h-[150px] w-full rounded-md object-cover lg:h-[100px] lg:w-[140px] lg:flex-none" />
      ) : (
        <span className="h-[150px] w-full rounded-md bg-secondary lg:h-[100px] lg:w-[140px] lg:flex-none" aria-hidden />
      )}
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1">
        <span className="flex flex-wrap gap-1.5">
          <Badge variant="blue">{favori.badge}</Badge>
          <Badge variant="gray">{favori.dossier}</Badge>
          {favori.verifie && <Badge variant="green">{t('badges.verifie')}</Badge>}
        </span>
        <b className="text-base leading-snug">{favori.titre}</b>
        {favori.sous && <span className="text-meta text-muted-foreground">{favori.sous}</span>}
        <span className="text-meta text-foreground-soft">{favori.details}</span>
        <span className="mt-1.5 flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="md">
            <Lien to={favori.vers}>{favori.action}</Lien>
          </Button>
          <Button variant="outline" size="md" onClick={favori.retirer}>
            {t('retirer')}
          </Button>
        </span>
      </div>
    </article>
  )
}

/** L'astuce sous la liste, sur fond bleu pâle. */
export function AstuceFavoris() {
  const { t } = useTranslation('favorites')
  return (
    <p className="flex gap-2.5 rounded-md bg-primary-soft px-3.5 py-3 text-sm text-primary-strong">
      <b>{t('astuce.titre')}</b>
      <span>{t('astuce.texte')}</span>
    </p>
  )
}
