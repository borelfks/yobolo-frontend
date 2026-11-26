import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Briefcase, Crown, GraduationCap, Info, Layers, Mail, Megaphone, Send, ShieldCheck, UserPlus, UserRound, Users } from 'lucide-react'
import { ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { PhoneInput } from '@/shared/components/forms/Fields'
import { proCard, proInput } from '@/features/pro/proStyles'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { data } from '@/data'
import { useRoles } from '@/data/hooks'

/** Rôles des données de démo → clé de traduction. */
const ROLE_KEYS: Record<string, 'admin' | 'academicLead' | 'communication' | 'secretariat' | 'readOnly' | undefined> = {
  Administrateur: 'admin',
  'Responsable pédagogique': 'academicLead',
  Communication: 'communication',
  Secrétariat: 'secretariat',
  Consultation: 'readOnly',
}

/** L'icône et la couleur de chaque rôle, comme sur la maquette (img23). */
const ROLE_ICONES: Record<string, { icon: ReactNode; tuile: string }> = {
  Administrateur: { icon: <Crown />, tuile: 'bg-amber-50 text-amber-500' },
  'Responsable pédagogique': { icon: <GraduationCap />, tuile: 'bg-violet-50 text-violet-600' },
  Communication: { icon: <Megaphone />, tuile: 'bg-sky-50 text-brand-600' },
  Secrétariat: { icon: <Briefcase />, tuile: 'bg-orange-50 text-orange-500' },
  Consultation: { icon: <Users />, tuile: 'bg-emerald-50 text-emerald-600' },
}

/** « Inviter un utilisateur » (img23) : informations de la personne, rôle, liste des rôles disponibles. */
export function InviterUtilisateur() {
  const roles = useRoles()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const navigate = useNavigate()
  const [role, setRole] = useState('Administrateur')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const { ecole } = useMonEcole()
  const roleName = (r: string) => {
    const key = ROLE_KEYS[r]
    return key ? t(`roles.${key}.name`) : r
  }
  const roleDescription = (r: { nom: string; description: string }) => {
    const key = ROLE_KEYS[r.nom]
    return key ? t(`roles.${key}.description`) : r.description
  }
  const carte = cn(proCard, 'p-4')
  const titre = (icon: ReactNode, texte: string) => (
    <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600">
      {icon}
      {texte}
    </h2>
  )
  const envoyer = async () => {
    if (nom.trim().length < 2) return void toast.error(t('invite.nameRequired'))
    // Invitation pas encore acceptée : « En attente » (statut connu des badges), pas encore de connexion.
    await data.create(
      'utilisateurs',
      { etablissementId: ecole.id, nom: nom.trim(), role, telephone: telephone.trim() ? `+237 ${telephone.trim()}` : '', email: email.trim(), statut: 'En attente', connexion: '—', avatar: '' },
      'utilisateur',
    )
    toast.success(t('invite.sent', { name: nom, role: roleName(role) }))
    navigate(ROUTES.pro.settings('utilisateurs'))
  }
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('settings.crumbs.profile'), to: ROUTES.pro.profile() }, { label: t('invite.crumbs.settings'), to: ROUTES.pro.settings() }, { label: t('invite.crumbs.users'), to: ROUTES.pro.settings('utilisateurs') }, { label: t('invite.crumbs.current') }]}
        icon={<UserPlus />}
        title={t('invite.title')}
        subtitle={t('invite.subtitle')}
        actions={<span />}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className={carte}>
            {titre(<UserRound />, t('invite.infoTitle'))}
            <div className="mt-3 space-y-3">
              <label className="block">
                <ProLabel required>{t('invite.name')}</ProLabel>
                <span className="relative block">
                  <UserRound className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" aria-hidden="true" />
                  <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder={t('invite.namePlaceholder')} className={cn(proInput, 'pl-11')} />
                </span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <ProLabel required>{t('invite.phone')}</ProLabel>
                  <PhoneInput value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                </label>
                <label className="block">
                  <ProLabel>{t('invite.email')}</ProLabel>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" aria-hidden="true" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('invite.emailPlaceholder')} className={cn(proInput, 'pl-11')} />
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className={carte}>
            {titre(<Layers />, t('invite.accessTitle'))}
            <label className="mt-3 block">
              <ProLabel required>{t('invite.role')}</ProLabel>
              <span className="relative block">
                <GraduationCap className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" aria-hidden="true" />
                <select value={role} onChange={(e) => setRole(e.target.value)} className={cn(proInput, 'pl-11')}>
                  {roles.map((r) => (
                    <option key={r.nom} value={r.nom}>
                      {roleName(r.nom)}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <p className="mt-3 flex gap-2.5 rounded-xl bg-[#eef3fc] px-3 py-2.5 text-[13.5px] text-navy-900">
              <Info className="mt-0.5 size-5 shrink-0 fill-brand-600 text-white" aria-hidden="true" />
              {t('invite.tip')}
            </p>
          </div>
        </div>
        <div className={carte}>
          {titre(<ShieldCheck />, t('invite.rolesTitle'))}
          <div className="mt-3 space-y-2" role="radiogroup" aria-label={t('invite.rolesTitle')}>
            {roles.map((r) => {
              const style = ROLE_ICONES[r.nom]
              const actif = role === r.nom
              return (
                <button
                  key={r.nom}
                  type="button"
                  role="radio"
                  aria-checked={actif}
                  onClick={() => setRole(r.nom)}
                  className={cn('flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left', actif ? 'border-brand-200 bg-[#eef3fc]' : 'border-transparent hover:bg-slate-50')}
                >
                  <span className={cn('size-5 shrink-0 rounded-full border', actif ? 'border-[6px] border-brand-600' : 'border-slate-300')} aria-hidden="true" />
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl [&_svg]:size-6', style?.tuile ?? 'bg-slate-100 text-slate-600')}>{style?.icon ?? <Users />}</span>
                  <span>
                    <b className="block text-[15px] text-navy-900">{roleName(r.nom)}</b>
                    <span className="text-[13px] text-navy-900">{roleDescription(r)}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => navigate(ROUTES.pro.settings('utilisateurs'))} className="h-11 w-40 rounded-full border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800">
          {t('invite.cancel')}
        </button>
        <button type="button" onClick={() => void envoyer()} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-brand-600 px-8 text-[16px] font-semibold text-white hover:bg-brand-700">
          <Send className="size-5" />
          {t('invite.send')}
        </button>
      </div>
    </div>
  )
}
