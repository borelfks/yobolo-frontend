import { Trans, useTranslation } from 'react-i18next'
import { BarChart3, ChevronRight, ImagePlus, Megaphone, MessageCircle, Pencil, Plus, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Progress } from '@/shared/shadcn/progress'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import type { Etablissement } from '@/shared/types'
import { CartePro, Pastille, type TonPastille } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { ETAPES_PROFIL, INFOS_A_GERER, type EtapeProfil, type InfoAGerer } from '@/modules/ecole/espace-pro/proStats'

/** Une tâche du bloc « À faire » : pastille, titre, texte, bouton. */
export type Tache = { id: string; icone: LucideIcon; ton: TonPastille; titre: string; texte: string; action: string; to: string; principale?: boolean }

/** « À faire » : les actions qui attendent l'établissement (calculées). */
export function CarteAFaire({ taches }: { taches: Tache[] }) {
  const { t } = useTranslation('pro', { keyPrefix: 'tableau.aFaire' })
  return (
    <CartePro titre={t('titre')} action={<span className="text-meta text-muted-foreground">{t('nombre', { count: taches.length })}</span>}>
      {taches.length === 0 ? (
        <p className="border-t border-border pt-3.5 text-sm text-muted-foreground">{t('vide')}</p>
      ) : (
        <ul>
          {taches.map((x) => (
            <li key={x.id} className="flex items-center gap-3 border-t border-border py-3.5">
              <Pastille icone={x.icone} ton={x.ton} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <b className="text-ui text-foreground">{x.titre}</b>
                <span className="text-meta text-muted-foreground">{x.texte}</span>
              </span>
              <Button asChild variant={x.principale ? 'default' : 'secondary'} size="sm" className="h-[34px] px-3.5">
                <Lien to={x.to}>{x.action}</Lien>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </CartePro>
  )
}

/** « Complétude de votre profil » : pourcentage, barre, étapes, prochaine étape. */
export function CarteCompletude({ completude, etapes, restantes, prochaine, versProchaine }: { completude: number; etapes: Record<EtapeProfil, boolean>; restantes: number; prochaine?: EtapeProfil; versProchaine?: string }) {
  const { t } = useTranslation('pro', { keyPrefix: 'tableau.completude' })
  return (
    <CartePro titre={t('titre')} description={t('texte')} action={<b className="text-titre-md font-extrabold text-success">{t('pourcent', { pct: completude })}</b>}>
      <Progress value={completude} aria-label={t('aria')} className="bg-success-soft" />
      <ol className="flex flex-wrap gap-x-4 gap-y-2.5 lg:gap-x-[22px]">
        {ETAPES_PROFIL.map((e) => (
          <li key={e} className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className={cn('grid size-[22px] shrink-0 place-items-center rounded-full text-xs font-extrabold', etapes[e] ? 'bg-success text-white' : 'border-2 border-border-strong bg-card')} aria-hidden>
              {etapes[e] ? '✓' : ''}
            </span>
            {t(`etapes.${e}`)}
            <span className="sr-only">{etapes[e] ? t('faite') : t('aFaire')}</span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-2.5 rounded-md bg-success-soft px-3.5 py-3">
        <span className="flex-[1_1_220px] text-sm text-foreground">
          {prochaine ? <Trans t={t} i18nKey="reste" count={restantes} values={{ etape: t(`etapes.${prochaine}`) }} components={{ b: <b /> }} /> : t('complet')}
        </span>
        {versProchaine && (
          <Button asChild variant="secondary" size="sm" className="h-[34px] px-3.5">
            <Lien to={versProchaine}>{t('finaliser')}</Lien>
          </Button>
        )}
      </div>
    </CartePro>
  )
}

/** « Informations à gérer » : chaque information, renseignée ou à compléter. */
export function CarteInfos({ infos, liens }: { infos: Record<InfoAGerer, boolean>; liens: Record<InfoAGerer, string> }) {
  const { t } = useTranslation('pro', { keyPrefix: 'tableau.infos' })
  return (
    <CartePro titre={t('titre')}>
      <div className="grid gap-x-6 lg:grid-cols-2">
        {INFOS_A_GERER.map((i) => (
          <Lien key={i} to={liens[i]} className="group flex items-center gap-2.5 border-t border-border py-3 text-foreground no-underline">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <b className="text-ui group-hover:text-primary group-hover:underline">{t(`items.${i}.nom`)}</b>
              <span className="text-meta text-muted-foreground">{t(`items.${i}.texte`)}</span>
            </span>
            <Badge variant={infos[i] ? 'green' : 'gray'}>{infos[i] ? t('renseigne') : t('aCompleter')}</Badge>
          </Lien>
        ))}
      </div>
    </CartePro>
  )
}

/** « Aperçu de votre page publique » : la carte de l'établissement telle que les visiteurs la voient. */
export function ApercuPagePublique({ ecole, pagePublique }: { ecole: Etablissement; pagePublique: string }) {
  const { t } = useTranslation('pro')
  const filieres = ecole.principales ?? ecole.filieres
  return (
    <CartePro titre={t('tableau.apercu.titre')} serree>
      <Lien to={pagePublique} className="flex flex-col overflow-hidden rounded-lg border border-border text-foreground no-underline hover:shadow-card-hover">
        <img src={ecole.bandeau ?? ecole.couverture ?? ecole.image} alt="" className="h-[110px] w-full bg-border object-cover" />
        <img src={ecole.logo ?? ecole.vignette ?? ecole.image} alt="" className="-mt-7 ml-3.5 size-14 rounded-md border-2 border-card bg-card object-cover shadow-raised" />
        <span className="flex flex-col gap-1 px-3.5 pt-2 pb-3.5">
          <b className="text-ui leading-snug">{ecole.nom}</b>
          <span className="text-meta text-muted-foreground">
            {ecole.ville}, {ecole.quartier}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
            <ShieldCheck className="size-3.5" strokeWidth={2.4} aria-hidden />
            {t('commun.verifie')}
          </span>
          <span className="text-meta font-bold">{ecole.avis > 0 ? t('commun.note', { note: num(ecole.note), count: ecole.avis }) : t('commun.pasDAvis')}</span>
          {filieres.length > 0 && (
            <span className="text-meta text-muted-foreground">
              {filieres.slice(0, 3).join(' · ')}
              {filieres.length > 3 && ` · ${t('tableau.apercu.plus', { count: filieres.length - 3 })}`}
            </span>
          )}
          <span className="mt-1 border-t border-secondary pt-2 text-meta text-muted-foreground">
            <b className="text-foreground">{t('tableau.apercu.formations', { count: ecole.formations })}</b>
            {ecole.rentree && ` · ${t('tableau.apercu.rentree', { date: ecole.rentree })}`}
          </span>
        </span>
      </Lien>
      <Button asChild variant="secondary" size="md">
        <Lien to={pagePublique}>{t('commun.voirPagePublique')}</Lien>
      </Button>
    </CartePro>
  )
}

/** « Actions rapides » : six liens vers les pages de l'espace. */
export function ActionsRapides({ liens, sansReponse }: { liens: Record<'creer' | 'medias' | 'avis' | 'infos' | 'actu' | 'stats', string>; sansReponse: number }) {
  const { t } = useTranslation('pro', { keyPrefix: 'tableau.rapides' })
  const items: { id: keyof typeof liens; icone: LucideIcon }[] = [
    { id: 'creer', icone: Plus },
    { id: 'medias', icone: ImagePlus },
    { id: 'avis', icone: MessageCircle },
    { id: 'infos', icone: Pencil },
    { id: 'actu', icone: Megaphone },
    { id: 'stats', icone: BarChart3 },
  ]
  return (
    <CartePro titre={t('titre')} serree>
      <ul>
        {items.map(({ id, icone: Icone }) => (
          <li key={id}>
            <Lien to={liens[id]} className="flex items-center gap-2.5 border-t border-border py-[11px] text-sm font-bold text-foreground no-underline hover:text-primary">
              <Icone className="size-[18px] shrink-0 text-primary" aria-hidden />
              <span className="flex-1">{t(id, { count: sansReponse })}</span>
              <ChevronRight className="size-4 shrink-0 text-input" aria-hidden />
            </Lien>
          </li>
        ))}
      </ul>
    </CartePro>
  )
}
