import { Link } from 'react-router'
import { toast } from 'sonner'
import { ArrowRight, ArrowUp, CalendarDays, ChartNoAxesColumn, ChevronDown, Clock, Download, FileText, GraduationCap, Layers, Star, TrendingUp, UserRound, Users } from 'lucide-react'
import { ProHeader, proCard } from '@/components/domain/pro'
import { AreaTrend, Donut } from '@/components/shared/Charts'
import { useMonEcole } from '@/hooks/useSession'
import { formationsPro, sourcesVisites, visitesSerie } from '@/mocks/pro'
import { cn } from '@/lib/utils'

export default function Statistiques() {
  const { ecole, formations } = useMonEcole()
  const top = ecole.id === 'ipc' ? formationsPro.slice(0, 3).map((f) => f.nom) : formations.slice(0, 3).map((f) => f.nom)
  const kpis = [
    { v: '4 286', l: 'Vues de votre page', t: '+18 %', icon: <Users />, c: 'bg-[#e8f0ff]', ic: 'bg-[#d6e3ff] text-brand-600' },
    { v: '356', l: 'Candidatures / Préinscriptions', t: '+24 %', icon: <GraduationCap />, c: 'bg-[#e5f7ea]', ic: 'bg-[#cdeed8] text-emerald-600' },
    { v: '76', l: 'Téléchargements', t: '+12 %', icon: <FileText />, c: 'bg-[#fff4dd]', ic: 'bg-[#ffe7b8] text-amber-600' },
    { v: `${ecole.note.toLocaleString('fr-FR')} / 5`, l: `Note (${ecole.avis} avis)`, icon: <Star />, c: 'bg-[#f1ebff]', ic: 'bg-[#e1d4ff] text-violet-600' },
  ]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: 'Profil de l’établissement', to: '/pro/ecole/profil' }, { label: 'Statistiques' }]}
        icon={<ChartNoAxesColumn />}
        title="Statistiques"
        subtitle="Suivez la performance de votre établissement sur YIBOLO."
        actions={
          <div className="flex gap-3">
            <label className="relative flex h-11 w-56 items-center gap-2.5 rounded-full border-2 border-brand-600/50 bg-white px-4 text-[15px] text-navy-900">
              <CalendarDays className="size-5 text-brand-600" />
              <span className="flex-1">Derniers 30 jours</span>
              <ChevronDown className="size-5" />
              <select aria-label="Période" className="absolute inset-0 cursor-pointer opacity-0">
                <option>Derniers 30 jours</option>
                <option>Derniers 7 jours</option>
                <option>Derniers 6 mois</option>
              </select>
            </label>
            <button type="button" onClick={() => toast.success('Export PDF lancé')} className="inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-brand-600/70 bg-white px-6 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <Download className="size-5" />
              Exporter (PDF)
            </button>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className={cn('flex items-center gap-4 rounded-2xl px-4 py-3.5 shadow-sm', k.c)}>
            <span className={cn('grid size-14 shrink-0 place-items-center rounded-full [&_svg]:size-8', k.ic)}>{k.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between gap-2">
                <b className="text-[28px] leading-none text-navy-900">{k.v}</b>
                {k.t && <span className="inline-flex items-center gap-0.5 rounded-full bg-[#d4f2de] px-2 py-0.5 text-[12.5px] font-bold text-emerald-700"><ArrowUp className="size-3.5" />{k.t}</span>}
              </p>
              <p className="mt-1 truncate text-[14.5px] text-navy-900">{k.l}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><TrendingUp className="size-6 text-brand-600" />Évolution des visites</h2>
          <AreaTrend data={visitesSerie} height={200} dots />
        </div>
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Layers className="size-6 text-brand-600" />Sources des visites</h2>
          <div className="mt-3">
            <Donut data={sourcesVisites} center="4 286 Visites" size={170} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><GraduationCap className="size-6 text-brand-600" />Formations les plus consultées</h2>
          <ol className="mt-3 divide-y divide-line">
            {top.map((nom, i) => (
              <li key={nom} className="flex items-center gap-4 py-2.5 text-[15px] text-navy-900">
                <span className="grid size-7 place-items-center rounded-full bg-navy-800 text-[13px] font-bold text-white">{i + 1}</span>
                <span className="flex-1 font-semibold">{nom}</span>
                <span>{['1 028', '842', '618'][i]} vues</span>
              </li>
            ))}
          </ol>
          <Link to="/pro/ecole/formations" className="mt-2 flex items-center justify-center gap-2 text-[15px] font-semibold text-brand-600">
            Voir toutes les formations <ArrowRight className="size-5" />
          </Link>
        </div>
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Clock className="size-6 text-brand-600" />Dernières activités</h2>
          <ul className="mt-3 divide-y divide-line">
            {[
              { icon: <UserRound className="text-emerald-600" />, bg: 'bg-[#e5f7ea]', t: '12 nouvelles candidatures', d: 'aujourd’hui, 10:24' },
              { icon: <Download className="text-violet-600" />, bg: 'bg-[#f1ebff]', t: '8 téléchargements de documents', d: 'aujourd’hui, 09:17' },
              { icon: <Star className="text-brand-600" />, bg: 'bg-[#e8f0ff]', t: `3 nouveaux avis (note moyenne : ${ecole.note.toLocaleString('fr-FR')}/5)`, d: 'hier, 16:45' },
            ].map((a) => (
              <li key={a.t} className="flex items-center gap-3 py-2.5 text-[15px] text-navy-900">
                <span className={cn('grid size-10 place-items-center rounded-full [&_svg]:size-5', a.bg)}>{a.icon}</span>
                <span className="flex-1 font-semibold">{a.t}</span>
                <span className="text-[13.5px]">{a.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
