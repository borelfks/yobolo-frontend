import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CalendarDays, Copy, ExternalLink, Eye, Lightbulb, Pencil, Share2, Tag, Trash2 } from 'lucide-react'
import { Badge, StatusBadge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Card, Section } from '@/shared/components/ui/Card'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { Img } from '@/shared/components/ui/Img'
import { InfoRow, QuickAction, Tip } from '@/shared/components/ui/Blocks'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { ActuModal } from '@/features/pro/components/ActuModal'
import { data } from '@/data'
import { useActualite, useParametres } from '@/data/hooks'
import { num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { ecoleUrl } from '@/features/schools/schoolLinks'

/** Catégories des actualités (données de démo) → clé de traduction. */
const NEWS_CATEGORY_KEYS: Record<string, 'admission' | 'event' | 'training' | 'results' | undefined> = {
  'Rentrée / Admission': 'admission',
  Événement: 'event',
  Formation: 'training',
  Résultats: 'results',
}

export function Publication() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { id } = useParams()
  const a = useActualite(id)
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  // Texte et date limite saisis dans « Modifier » (réglages), sinon ceux de la maquette.
  const corps = reglages[`actualite.${a.id}.texte`]
  const limite = reglages[`actualite.${a.id}.limite`]
  const [edition, setEdition] = useState(false)
  const navigate = useNavigate()
  const categoryKey = NEWS_CATEGORY_KEYS[a.categorie]
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: t('publication.crumbs.contents'), to: ROUTES.pro.contents() }, { label: t('publication.crumbs.news'), to: ROUTES.pro.contents('actualites') }, { label: t('publication.crumbs.current') }]} />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <Img src={a.image} alt="" className="h-64 w-full" />
          <div className="space-y-4 p-6">
            <div className="flex gap-2">
              <Badge tone="blue">{t('publication.badge')}</Badge>
              <StatusBadge status={a.statut} />
            </div>
            <h1 className="text-2xl text-navy-900">{a.titre}</h1>
            <p className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1"><CalendarDays className="size-4" />{t('publication.publishedOn', { date: a.date })}</span>
              <span className="flex items-center gap-1"><Eye className="size-4" />{t('publication.views', { count: a.vues })}</span>
            </p>
            <p className="text-sm leading-relaxed text-ink/85">
              {typeof corps === 'string' && corps ? corps : t('publication.body', { school: ecole.nom })}
            </p>
            <div>
              <p className="mb-2 text-sm font-bold text-navy-900">{t('publication.fields')}</p>
              <div className="flex flex-wrap gap-2">{ecole.filieres.map((f) => <Badge key={f} tone="violet">{f}</Badge>)}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4">
              <p className="text-sm"><Trans t={t} i18nKey="publication.deadline" values={{ date: shortDate(typeof limite === 'string' && limite ? limite : new Date(2026, 8, 30), { day: 'numeric', month: 'long', year: 'numeric' }) }} components={{ b: <b /> }} /></p>
              <Button to={ecoleUrl(ecole, 'formations')}>{t('publication.signUp')}</Button>
            </div>
          </div>
        </Card>
        <aside className="space-y-4">
          <Section title={t('publication.details.title')}>
            <div className="divide-y divide-line">
              <InfoRow icon={<Tag />} label={t('publication.details.category')} value={categoryKey ? t(`contents.news.categories.${categoryKey}`) : a.categorie} />
              <InfoRow icon={<CalendarDays />} label={t('publication.details.date')} value={a.date} />
              <InfoRow icon={<Eye />} label={t('publication.details.views')} value={num(a.vues)} />
              <InfoRow icon={<Share2 />} label={t('publication.details.shares')} value={num(a.partages)} />
            </div>
          </Section>
          <Section title={t('publication.quickActions.title')}>
            <div className="space-y-2">
              <QuickAction icon={<Pencil />} label={t('publication.quickActions.edit')} onClick={() => setEdition(true)} />
              <QuickAction icon={<Copy />} label={t('publication.quickActions.copyLink')} onClick={() => { void navigator.clipboard?.writeText(window.location.href); toast.success(t('publication.quickActions.linkCopied')) }} />
              <QuickAction icon={<ExternalLink />} label={t('publication.quickActions.openNewTab')} onClick={() => window.open(window.location.href, '_blank', 'noopener')} />
              <Button variant="danger-outline" className="w-full justify-start" onClick={async () => { navigate(ROUTES.pro.contents('actualites')); await data.remove('actualites', a.id); toast.success(t('publication.quickActions.deleted')) }}>
                <Trash2 /> {t('publication.quickActions.delete')}
              </Button>
            </div>
          </Section>
          <Tip title={t('publication.tipTitle')} icon={<Lightbulb />} tone="amber">{t('publication.tipText')}</Tip>
        </aside>
      </div>
      <ActuModal key={a.id} open={edition} onClose={() => setEdition(false)} actu={a} />
    </div>
  )
}
