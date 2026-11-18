import { Link } from 'react-router'
import { ArrowRight, BadgeCheck, BookOpen, Briefcase, Building2, CalendarDays, ExternalLink, Eye, GraduationCap, ImagePlus, Images, Layers, MapPin, Megaphone, MessageSquareText, PencilLine, Phone, Plus, Rocket, ShieldCheck, Wallet, Zap } from 'lucide-react'
import { ecoleUrl } from '@/lib/ecole-links'
import { Button } from '@/components/ui/Button'
import { Card, Section } from '@/components/ui/Card'
import { Img, Rating, Ring } from '@/components/ui/Feedback'
import { Stepper } from '@/components/ui/Stepper'
import { IconTile, Kpi, KpiGrid, PageTitle, QuickAction } from '@/components/shared/Blocks'
import { useMonEcole } from '@/hooks/useSession'
import { CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const { ecole, formations } = useMonEcole()
  const infos = [
    { label: 'Présentation', text: 'Décrivez votre établissement', icon: <Building2 />, tone: 'blue' as const, to: '/pro/ecole/contenus' },
    { label: 'Conditions d’admission', text: 'Définissez les critères et pièces', icon: <ShieldCheck />, tone: 'violet' as const, to: '/pro/ecole/contenus/faq' },
    { label: 'Frais & paiement', text: 'Renseignez les tarifs et modalités', icon: <Wallet />, tone: 'amber' as const, to: '/pro/ecole/formations' },
    { label: 'Calendrier académique', text: 'Indiquez la rentrée et les dates clés', icon: <CalendarDays />, tone: 'sky' as const, to: '/pro/ecole/contenus/documents' },
    { label: 'Débouchés', text: 'Listez les métiers et secteurs', icon: <Briefcase />, tone: 'violet' as const, to: '/pro/ecole/formations' },
    { label: 'Contact & localisation', text: 'Vos coordonnées et adresse', icon: <Phone />, tone: 'blue' as const, to: '/pro/ecole/profil/coordonnees' },
  ]
  return (
    <div className="space-y-6">
      <PageTitle
        title="Bienvenue sur votre espace professionnel"
        subtitle="Gérez et actualisez toutes les informations de votre établissement sur YIBOLO."
        actions={
          <Button to={ecoleUrl(ecole)} variant="outline" size="lg">
            <Eye />
            Voir ma page publique
            <ExternalLink />
          </Button>
        }
      />
      <KpiGrid>
        <Kpi icon={<GraduationCap />} label="Formations" value={Math.max(ecole.formations, formations.length)} tone="blue" />
        <Kpi icon={<Layers />} label="Filières" value={(ecole.principales ?? ecole.filieres).length} tone="green" />
        <Kpi icon={<Images />} label="Photos / Vidéos" value={28} tone="violet" />
        <Kpi icon={<MessageSquareText />} label="Avis reçus" value={ecole.avis} tone="amber" extra={<Rating value={ecole.note} className="text-sm" />} />
      </KpiGrid>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <Ring value={92} size={104} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-navy-900">Complétude de votre profil</h2>
                <p className="text-sm text-muted">Votre page est presque complète.</p>
                <Stepper steps={['Profil', 'Formations', 'Informations', 'Galerie', 'Optimisation']} current={4} tone="green" className="mt-4" />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm">
              <Rocket className="size-5 text-emerald-600" />
              <span className="flex-1">Plus que <b>1 étape</b> pour un profil optimal : optimisez votre page.</span>
              <Button to="/pro/ecole/profil/medias" variant="outline" size="sm">Finaliser <ArrowRight /></Button>
            </div>
          </Card>
          <Section title="Informations à gérer" icon={<Layers />} action={<span className="text-xs text-muted">Dernière mise à jour : 10 nov. 2026</span>}>
            <div className="grid gap-3 md:grid-cols-2">
              {infos.map((i) => (
                <Link key={i.label} to={i.to} className="flex items-center gap-3 rounded-2xl border border-line p-3 transition-colors hover:bg-brand-50">
                  <IconTile icon={i.icon} tone={i.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy-900">{i.label}</p>
                    <p className="truncate text-xs text-muted">{i.text}</p>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  <ArrowRight className="size-4 text-muted" />
                </Link>
              ))}
            </div>
          </Section>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-brand-50 px-5 py-3">
              <p className="flex items-center gap-2 font-bold text-navy-900"><Eye className="size-5 text-brand-600" /> Aperçu de votre page publique</p>
              <Link to={ecoleUrl(ecole)} aria-label="Ouvrir la page publique"><ExternalLink className="size-4 text-brand-600" /></Link>
            </div>
            <div className="flex gap-4 p-5">
              <Img src={ecole.image} alt={ecole.nom} className="size-24 rounded-xl" />
              <div className="space-y-1.5">
                <p className="font-bold text-navy-900">{ecole.nom}</p>
                <Rating value={ecole.note} count={ecole.avis} />
                <p className="flex items-center gap-1 text-xs text-muted"><MapPin className="size-3.5" />{ecole.ville} – {ecole.quartier}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white"><BadgeCheck className="size-3.5" />Établissement vérifié</span>
              </div>
            </div>
          </Card>
          <Section title="Actions rapides" icon={<Zap />}>
            <div className="space-y-2.5">
              <QuickAction tone="primary" icon={<Plus />} label="Créer une formation" to="/pro/ecole/formations/nouvelle" />
              <QuickAction icon={<ImagePlus />} label="Ajouter des photos / vidéos" to="/pro/ecole/profil/medias" />
              <QuickAction icon={<Megaphone />} label={<>Répondre aux avis <span className="text-rose-500">(3)</span></>} to={`${ecoleUrl(ecole)}/avis`} />
              <QuickAction icon={<PencilLine />} label="Mettre à jour les informations" to="/pro/ecole/profil" />
              <QuickAction icon={<BookOpen />} label="Publier une actualité" to="/pro/ecole/contenus/actualites" />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
