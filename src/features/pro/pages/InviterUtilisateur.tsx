import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Info, Send, UserPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card, Section } from '@/shared/components/ui/Card'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { Field, Input, PhoneInput, Radio, Select } from '@/shared/components/forms/Fields'
import { FormFooter, PageTitle, Tip } from '@/shared/components/ui/Blocks'
import { ROUTES } from '@/shared/utils/routes'
import { roles } from '@/mocks/pro'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { data } from '@/data'

/** Rôles des données de démo → clé de traduction. */
const ROLE_KEYS: Record<string, 'admin' | 'academicLead' | 'communication' | 'secretariat' | 'readOnly' | undefined> = {
  Administrateur: 'admin',
  'Responsable pédagogique': 'academicLead',
  Communication: 'communication',
  Secrétariat: 'secretariat',
  Consultation: 'readOnly',
}

export function InviterUtilisateur() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const navigate = useNavigate()
  const [role, setRole] = useState('Responsable pédagogique')
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
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: t('invite.crumbs.settings'), to: ROUTES.pro.settings() }, { label: t('invite.crumbs.users'), to: ROUTES.pro.settings('utilisateurs') }, { label: t('invite.crumbs.current') }]} />
      <PageTitle icon={<UserPlus />} title={t('invite.title')} subtitle={t('invite.subtitle')} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="space-y-4 p-5">
          <Field label={t('invite.name')} required><Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder={t('invite.namePlaceholder')} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('invite.phone')} required><PhoneInput value={telephone} onChange={(e) => setTelephone(e.target.value)} /></Field>
            <Field label={t('invite.email')}><Input type="email" placeholder={t('invite.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          </div>
          <Field label={t('invite.role')} required><Select options={roles.map((r) => ({ value: r.nom, label: roleName(r.nom) }))} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
          <Tip icon={<Info />}>{t('invite.tip')}</Tip>
          <FormFooter>
            <Button variant="neutral" onClick={() => navigate(ROUTES.pro.settings('utilisateurs'))}>{t('invite.cancel')}</Button>
            <Button
              onClick={async () => {
                if (nom.trim().length < 2) return toast.error(t('invite.nameRequired'))
                // Invitation pas encore acceptée : « En attente » (statut connu des badges), pas encore de connexion.
                await data.create(
                  'utilisateurs',
                  { etablissementId: ecole.id, nom: nom.trim(), role, telephone: telephone.trim() ? `+237 ${telephone.trim()}` : '', email: email.trim(), statut: 'En attente', connexion: '—', avatar: '' },
                  'utilisateur',
                )
                toast.success(t('invite.sent', { name: nom, role: roleName(role) }))
                navigate(ROUTES.pro.settings('utilisateurs'))
              }}
            >
              <Send />
              {t('invite.send')}
            </Button>
          </FormFooter>
        </Card>
        <Section title={t('invite.rolesTitle')}>
          <div className="space-y-3">
            {roles.map((r) => (
              <div key={r.nom} className={`rounded-xl border p-3 ${role === r.nom ? 'border-brand-600 bg-brand-50' : 'border-line'}`}>
                <Radio name="role" label={roleName(r.nom)} description={roleDescription(r)} checked={role === r.nom} onChange={() => setRole(r.nom)} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
