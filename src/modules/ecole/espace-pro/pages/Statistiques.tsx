import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, MessageCircle } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { formationUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { useAvisEtablissement, useStatistiques } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Button } from '@/shared/shadcn/button'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { Lien } from '@/shared/ui/Lien'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { BandeauChiffres, CartePro, EntetePro, Pastille, SquelettePro, type Chiffre } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { BarreRepartition, CourbeVisites, LigneClassement } from '@/modules/ecole/espace-pro/components/statistiques/BlocsStatistiques'
import { formaterDate } from '@/shared/utils/dates'

/** Les périodes proposées (en jours). */
const PERIODES = [
  { jours: 7, cle: 'j7' },
  { jours: 30, cle: 'j30' },
  { jours: 182, cle: 'm6' },
] as const

/**
 * 6.1 Statistiques : tout est mesuré sur les pages publiques de l'établissement
 * (vues de sa fiche et leur provenance, vues de ses formations, téléchargements,
 * avis reçus). La période choisie s'applique à tout.
 */
export function Statistiques() {
  const { t } = useTranslation('pro', { keyPrefix: 'statistiques' })
  return (
    <div className="flex flex-col gap-2">
      <EntetePro
        miettes={[{ label: t('titre') }]}
        titre={t('titre')}
        sousTitre={t('sousTitre')}
        actions={
          <Button variant="outline" onClick={() => window.print()}>
            {t('exporter')}
          </Button>
        }
      />
      <ChargementDonnees fallback={<SquelettePro cartes={3} entete={false} />}>
        <Chiffres />
      </ChargementDonnees>
    </div>
  )
}

function Chiffres() {
  const { t } = useTranslation('pro', { keyPrefix: 'statistiques' })
  const { ecole, formations } = useMonEcole()
  const [jours, setJours] = useState<number>(30)
  // L'instant de référence, fixé à l'ouverture de la page.
  const [maintenant] = useState(() => Date.now())
  const stats = useStatistiques(ecole.id, jours, maintenant)
  const sansReponse = useAvisEtablissement(ecole.id).filter((a) => !a.reponse).length
  const tendance = (x: number | null): Pick<Chiffre, 'detail' | 'ton'> => (x === null ? { detail: t('kpis.sansComparaison') } : { detail: t(x >= 0 ? 'kpis.hausse' : 'kpis.baisse', { n: Math.abs(x) }), ton: x >= 0 ? 'hausse' : 'baisse' })
  const parSemaine = jours > 31
  const points = stats.serie.map((p) => ({ date: parSemaine ? t('courbe.semaineDu', { date: formaterDate(new Date(p.le), 'jourMois') }) : formaterDate(new Date(p.le), 'jourMois'), vues: p.value }))
  const totalSources = stats.sources.reduce((s, x) => s + x.value, 0)
  const maxSource = Math.max(1, ...stats.sources.map((s) => s.value))
  const top = formations
    .map((f) => ({ f, vues: stats.vuesFormations[f.id] ?? 0 }))
    .filter((x) => x.vues > 0)
    .sort((a, b) => b.vues - a.vues)
    .slice(0, 5)
  const vide = (texte: string) => <p className="rounded-md bg-muted px-3.5 py-3 text-sm text-muted-foreground">{texte}</p>

  return (
    <>
      <CartePro titre={t('periodeAria')} titreMasque>
        <ToggleGroup type="single" variant="outline" size="lg" value={String(jours)} onValueChange={(v) => v && setJours(Number(v))} aria-label={t('periodeAria')} className="flex-wrap">
          {PERIODES.map((p) => (
            <ToggleGroupItem key={p.jours} value={String(p.jours)}>
              {t(`periodes.${p.cle}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <BandeauChiffres
          colonnes={3}
          chiffres={[
            { nom: t('kpis.vues'), valeur: num(stats.vues.valeur), ...tendance(stats.vues.tendance) },
            { nom: t('kpis.telechargements'), valeur: num(stats.telechargements.valeur), ...tendance(stats.telechargements.tendance) },
            { nom: t('kpis.note', { count: ecole.avis }), valeur: ecole.avis > 0 ? t('kpis.sur5', { note: num(ecole.note) }) : '—', detail: ecole.avis > 0 ? t('kpis.sansReponse', { count: sansReponse }) : t('kpis.pasDAvis') },
          ]}
        />
      </CartePro>
      <CartePro titre={t('courbe.titre')} action={<span className="text-xs text-muted-foreground">{t(parSemaine ? 'courbe.parSemaine' : 'courbe.parJour')}</span>}>
        {stats.vues.valeur === 0 ? vide(t('vides.visites')) : <CourbeVisites points={points} enteteDate={t(parSemaine ? 'courbe.semaine' : 'courbe.jour')} />}
      </CartePro>
      <div className="grid gap-2 lg:grid-cols-2">
        <CartePro titre={t('sources.titre')}>
          {totalSources === 0
            ? vide(t('vides.sources'))
            : stats.sources.map((s) => <BarreRepartition key={s.id} nom={t(`sources.${s.id}`)} valeur={num(s.value)} part={t('pourcent', { n: Math.round((s.value / totalSources) * 100) })} relatif={(s.value / maxSource) * 100} />)}
        </CartePro>
        <CartePro titre={t('top.titre')}>
          {top.length === 0 ? vide(t('vides.top')) : top.map((x, i) => <LigneClassement key={x.f.id} rang={i + 1} nom={x.f.nom} vues={t('top.vues', { count: x.vues, n: num(x.vues) })} relatif={(x.vues / top[0]!.vues) * 100} to={formationUrl(x.f)} />)}
          <Lien to={ROUTES.pro.trainings} className="text-sm font-bold text-primary no-underline hover:underline">
            {t('top.toutes')}
          </Lien>
        </CartePro>
      </div>
      <CartePro titre={t('activites.titre')}>
        {stats.activites.length === 0 ? (
          vide(t('vides.activites'))
        ) : (
          <ul>
            {stats.activites.map((a) => (
              <li key={`${a.id}-${a.jour}`} className="flex flex-wrap items-center gap-3 border-t border-border py-3.5">
                <Pastille icone={a.id === 'downloads' ? Download : MessageCircle} ton={a.id === 'downloads' ? 'bleu' : 'violet'} />
                <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">{t(`activites.${a.id}`, { count: a.count, note: num(ecole.note) })}</span>
                <span className="text-xs font-medium text-muted-foreground">{t(`activites.${a.jour}`, { heure: a.heure })}</span>
              </li>
            ))}
          </ul>
        )}
      </CartePro>
    </>
  )
}
