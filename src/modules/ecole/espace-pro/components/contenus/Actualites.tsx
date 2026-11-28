import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Megaphone } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useActualites } from '@/data/hooks'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { useParametresRecherche } from '@/shared/hooks/useParametresRecherche'
import { ROUTES } from '@/shared/utils/routes'
import type { Actualite } from '@/shared/types'
import { CartePro, Conseil, MenuPlus, StatutBadge } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { FenetreActualite } from '@/modules/ecole/espace-pro/components/contenus/FenetreActualite'
import { CategorieActualite } from '@/modules/ecole/espace-pro/components/contenus/CategorieActualite'

/** Contenus › Actualités : la liste (image, catégorie, statut, titre, date) et « + Nouvelle actualité ». `?nouvelle=1` ouvre la fenêtre. */
export function Actualites() {
  const { t } = useTranslation('pro', { keyPrefix: 'contenus.actualites' })
  const { t: tp } = useTranslation('pro')
  const { ecole } = useMonEcole()
  const actualites = useActualites(ecole.id)
  const [params, setParams] = useParametresRecherche()
  const [edition, setEdition] = useState<Actualite | null>(null)
  const nouvelle = params.get('nouvelle') === '1'
  const ouvrir = (ouvert: boolean) =>
    setParams((p) => {
      if (ouvert) p.set('nouvelle', '1')
      else p.delete('nouvelle')
      return p
    }, { replace: true })

  const dupliquer = async (a: Actualite) => {
    await data.create('actualites', { ...a, id: undefined, etablissementId: ecole.id, titre: t('copie', { titre: a.titre }), statut: 'Brouillon' }, 'actualite')
    toast.success(t('dupliquee'))
  }
  const changerStatut = async (a: Actualite, statut: Actualite['statut']) => {
    await data.update('actualites', a.id, { statut })
    toast.success(t(statut === 'Publiée' ? 'publiee' : 'depubliee'))
  }
  const supprimer = async (a: Actualite) => {
    await data.remove('actualites', a.id)
    toast.success(t('supprimee'))
  }
  return (
    <CartePro
      titre={t('titre', { n: actualites.length })}
      action={
        <Button size="md" onClick={() => ouvrir(true)}>
          {t('nouvelle')}
        </Button>
      }
    >
      <Conseil>{t('conseil')}</Conseil>
      {actualites.length === 0 ? (
        <div className="flex flex-col items-center gap-2 border-t border-border py-8 text-center">
          <Megaphone className="size-6 text-muted-foreground" aria-hidden />
          <b className="text-base text-foreground">{t('vide')}</b>
        </div>
      ) : (
        <ul>
          {actualites.map((a) => (
            <li key={a.id} className="flex flex-wrap items-start gap-3 border-t border-border py-3.5">
              <img src={a.image} alt="" className="h-40 w-full rounded-md object-cover lg:h-[104px] lg:w-40 lg:shrink-0" />
              <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1">
                <span className="flex flex-wrap gap-1.5">
                  <Badge variant="blue">
                    <CategorieActualite valeur={a.categorie} />
                  </Badge>
                  <StatutBadge statut={a.statut} />
                </span>
                <b className="text-base leading-snug text-foreground">{a.titre}</b>
                <span className="text-xs font-medium text-muted-foreground">{a.statut === 'Publiée' ? t('publieeLe', { date: a.date }) : t('nonVisible')}</span>
                <span className="mt-1.5 flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Lien to={ROUTES.pro.publication(a.id)}>{tp('commun.voir')}</Lien>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEdition(a)}>
                    {tp('commun.modifier')}
                  </Button>
                  <MenuPlus
                    label={t('plus', { titre: a.titre })}
                    className="size-8"
                    actions={[
                      { label: t('dupliquer'), onSelect: () => void dupliquer(a) },
                      a.statut === 'Brouillon' ? { label: tp('commun.publier'), onSelect: () => void changerStatut(a, 'Publiée') } : { label: t('depublier'), onSelect: () => void changerStatut(a, 'Brouillon') },
                      { label: tp('commun.supprimer'), danger: true, onSelect: () => void supprimer(a) },
                    ]}
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <FenetreActualite open={nouvelle} onClose={() => ouvrir(false)} />
      {edition && <FenetreActualite key={edition.id} open onClose={() => setEdition(null)} actu={edition} />}
    </CartePro>
  )
}
