import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { ecoleUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { data } from '@/data'
import { useActualite, useParametres } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { shortDate } from '@/shared/utils/format'
import { ouvrir } from '@/shared/utils/liens'
import { ROUTES } from '@/shared/utils/routes'
import { CartePro, Conseil, EntetePro, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { CategorieActualite } from '@/modules/ecole/espace-pro/components/contenus/CategorieActualite'
import { FenetreActualite } from '@/modules/ecole/espace-pro/components/contenus/FenetreActualite'

/** 5.4 Voir ma publication : l'actualité telle que les visiteurs la voient, ses détails et les actions rapides. */
export function Publication() {
  return (
    <ChargementDonnees fallback={<SquelettePro cartes={2} colonne />}>
      <MaPublication />
    </ChargementDonnees>
  )
}

function MaPublication() {
  const { t } = useTranslation('pro', { keyPrefix: 'publication' })
  const { t: tp } = useTranslation('pro')
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const a = useActualite(id)
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  const [edition, setEdition] = useState(false)
  // Texte et date limite saisis dans « Modifier » (réglages) : seul ce qui a été saisi s'affiche.
  const corps = reglages[`actualite.${a.id}.texte`]
  const limite = reglages[`actualite.${a.id}.limite`]
  const lienPublic = `${window.location.origin}${ecoleUrl(ecole)}`
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(lienPublic)
      toast.success(t('lienCopie'))
    } catch {
      toast.error(t('lienNonCopie'))
    }
  }
  const supprimer = async () => {
    await navigate({ href: ROUTES.pro.contents('actualites') })
    await data.remove('actualites', a.id)
    toast.success(t('supprimee'))
  }
  const action = 'h-auto w-full justify-start rounded-none border-0 border-t border-border px-0 py-[11px] text-sm font-bold text-foreground hover:bg-transparent hover:text-primary'
  return (
    <div className="flex flex-col gap-2">
      <EntetePro
        miettes={[{ label: t('miettes.contenus'), to: ROUTES.pro.contents() }, { label: t('miettes.actualites'), to: ROUTES.pro.contents('actualites') }, { label: t('titre') }]}
        titre={t('titre')}
        sousTitre={t('sousTitre')}
        actions={
          <Button variant="secondary" onClick={() => setEdition(true)}>
            {tp('commun.modifier')}
          </Button>
        }
      />
      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-4">
        <article className="flex min-w-0 flex-col gap-4 overflow-hidden border-y border-border bg-card lg:rounded-lg lg:border">
          <img src={a.image} alt={a.titre} className="block h-[200px] w-full object-cover lg:h-80" />
          <div className="flex flex-col gap-3 px-5 pb-5">
            <span className="flex flex-wrap gap-1.5">
              <Badge variant="blue">{t('badge')}</Badge>
              <Badge variant="gray">
                <CategorieActualite valeur={a.categorie} />
              </Badge>
              {a.statut === 'Brouillon' && <Badge variant="amber">{tp('commun.statuts.brouillon')}</Badge>}
            </span>
            <h2 className="text-titre-sm leading-snug font-extrabold text-foreground">{a.titre}</h2>
            <span className="text-meta text-muted-foreground">{a.statut === 'Publiée' ? t('publieeLe', { date: a.date }) : t('nonPubliee')}</span>
            {typeof corps === 'string' && corps && <p className="text-ui leading-relaxed whitespace-pre-line text-foreground-soft">{corps}</p>}
            {typeof limite === 'string' && limite && <p className="text-sm font-semibold text-foreground">{t('dateLimite', { date: shortDate(limite, { day: 'numeric', month: 'long', year: 'numeric' }) })}</p>}
            {ecole.filieres.length > 0 && (
              <div className="flex flex-col gap-2">
                <b className="text-sm text-foreground">{t('filieres')}</b>
                <span className="flex flex-wrap gap-1.5">
                  {ecole.filieres.map((f) => (
                    <Badge key={f} variant="gray">
                      {f}
                    </Badge>
                  ))}
                </span>
              </div>
            )}
          </div>
        </article>
        <div className="flex min-w-0 flex-col gap-2 lg:sticky lg:top-[84px]">
          <CartePro titre={t('details')} serree>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t('categorie')}</dt>
              <dd className="font-bold text-foreground">
                <CategorieActualite valeur={a.categorie} />
              </dd>
              <dt className="text-muted-foreground">{t('date')}</dt>
              <dd className="font-bold text-foreground">{a.date}</dd>
              <dt className="text-muted-foreground">{t('statut')}</dt>
              <dd className="font-bold text-foreground">{tp(`commun.statuts.${a.statut === 'Publiée' ? 'publiee' : 'brouillon'}`)}</dd>
            </dl>
          </CartePro>
          <CartePro titre={t('actions.titre')} serree>
            <div>
              <Button variant="ghost" className={action} onClick={() => setEdition(true)}>
                {tp('commun.modifier')}
              </Button>
              <Button variant="ghost" className={action} onClick={() => void copier()}>
                {t('actions.copier')}
              </Button>
              <Button variant="ghost" className={action} onClick={() => ouvrir(lienPublic)}>
                {t('actions.ouvrir')}
              </Button>
              <Button variant="ghost" className={`${action} text-destructive-hover hover:text-destructive`} onClick={() => void supprimer()}>
                {t('actions.supprimer')}
              </Button>
            </div>
          </CartePro>
          <Conseil>{t('conseil')}</Conseil>
        </div>
      </div>
      {edition && <FenetreActualite key={a.id} open onClose={() => setEdition(false)} actu={a} />}
    </div>
  )
}
