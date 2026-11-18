import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { CalendarDays, Copy, ExternalLink, Eye, Lightbulb, Pencil, Share2, Tag, Trash2 } from 'lucide-react'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, Section } from '@/components/ui/Card'
import { Breadcrumb, Img } from '@/components/ui/Feedback'
import { InfoRow, QuickAction, Tip } from '@/components/shared/Blocks'
import { useMonEcole } from '@/hooks/useSession'
import { actualiteById } from '@/mocks/pro'

export default function Publication() {
  const { id } = useParams()
  const a = actualiteById(id)
  const { ecole } = useMonEcole()
  const navigate = useNavigate()
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Contenus', to: '/pro/ecole/contenus' }, { label: 'Actualités', to: '/pro/ecole/contenus/actualites' }, { label: 'Voir ma publication' }]} />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <Img src={a.image} alt="" className="h-64 w-full" />
          <div className="space-y-4 p-6">
            <div className="flex gap-2">
              <Badge tone="blue">Actualité</Badge>
              <StatusBadge status={a.statut} />
            </div>
            <h1 className="text-2xl text-navy-900">{a.titre}</h1>
            <p className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1"><CalendarDays className="size-4" />Publié le {a.date}</span>
              <span className="flex items-center gap-1"><Eye className="size-4" />{a.vues} vues</span>
            </p>
            <p className="text-sm leading-relaxed text-ink/85">
              {ecole.nom} ouvre les préinscriptions pour l’année académique 2026 – 2027. Les candidats peuvent déposer leur dossier en ligne sur YIBOLO ou directement au secrétariat. Les places sont limitées dans certaines filières : ne tardez pas !
            </p>
            <div>
              <p className="mb-2 text-sm font-bold text-navy-900">Filières concernées</p>
              <div className="flex flex-wrap gap-2">{ecole.filieres.map((f) => <Badge key={f} tone="violet">{f}</Badge>)}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4">
              <p className="text-sm"><b>Date limite d’inscription :</b> 30 septembre 2026</p>
              <Button onClick={() => toast('Bouton visible des visiteurs sur la page publique')}>S’inscrire maintenant</Button>
            </div>
          </div>
        </Card>
        <aside className="space-y-4">
          <Section title="Détails">
            <div className="divide-y divide-line">
              <InfoRow icon={<Tag />} label="Catégorie" value={a.categorie} />
              <InfoRow icon={<CalendarDays />} label="Date" value={a.date} />
              <InfoRow icon={<Eye />} label="Vues" value={a.vues} />
              <InfoRow icon={<Share2 />} label="Partages" value={a.partages} />
            </div>
          </Section>
          <Section title="Actions rapides">
            <div className="space-y-2">
              <QuickAction icon={<Pencil />} label="Modifier" onClick={() => toast('Édition de la publication (démo)')} />
              <QuickAction icon={<Copy />} label="Copier le lien public" onClick={() => { void navigator.clipboard?.writeText(window.location.href); toast.success('Lien copié') }} />
              <QuickAction icon={<ExternalLink />} label="Ouvrir dans un nouvel onglet" onClick={() => window.open(window.location.href, '_blank', 'noopener')} />
              <Button variant="danger-outline" className="w-full justify-start" onClick={() => { toast('Publication supprimée (démo)'); navigate('/pro/ecole/contenus/actualites') }}>
                <Trash2 /> Supprimer la publication
              </Button>
            </div>
          </Section>
          <Tip title="Conseil" icon={<Lightbulb />} tone="amber">Partagez vos actualités sur vos réseaux sociaux pour attirer plus de candidats.</Tip>
        </aside>
      </div>
    </div>
  )
}
