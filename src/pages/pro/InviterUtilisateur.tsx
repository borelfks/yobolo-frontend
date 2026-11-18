import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Info, Send, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, Section } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Feedback'
import { Field, Input, PhoneInput, Radio, Select } from '@/components/ui/Form'
import { FormFooter, PageTitle, Tip } from '@/components/shared/Blocks'
import { roles } from '@/mocks/pro'

export default function InviterUtilisateur() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Responsable pédagogique')
  const [nom, setNom] = useState('')
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Paramètres', to: '/pro/ecole/parametres' }, { label: 'Utilisateurs', to: '/pro/ecole/parametres/utilisateurs' }, { label: 'Inviter un utilisateur' }]} />
      <PageTitle icon={<UserPlus />} title="Inviter un utilisateur" subtitle="Donnez accès à votre espace à un membre de votre équipe." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="space-y-4 p-5">
          <Field label="Nom et prénom" required><Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Claire Ndongo" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Téléphone" required><PhoneInput /></Field>
            <Field label="E-mail (optionnel)"><Input type="email" placeholder="prenom.nom@ecole.cm" /></Field>
          </div>
          <Field label="Rôle" required><Select options={roles.map((r) => r.nom)} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
          <Tip icon={<Info />}>L’invitation est envoyée par e-mail ou SMS. La personne crée son mot de passe en suivant le lien reçu.</Tip>
          <FormFooter>
            <Button variant="neutral" onClick={() => navigate('/pro/ecole/parametres/utilisateurs')}>Annuler</Button>
            <Button
              onClick={() => {
                if (nom.trim().length < 2) return toast.error('Indiquez le nom de la personne invitée.')
                toast.success(`Invitation envoyée à ${nom} (${role})`)
                navigate('/pro/ecole/parametres/utilisateurs')
              }}
            >
              <Send />
              Envoyer l’invitation
            </Button>
          </FormFooter>
        </Card>
        <Section title="Rôles disponibles">
          <div className="space-y-3">
            {roles.map((r) => (
              <div key={r.nom} className={`rounded-xl border p-3 ${role === r.nom ? 'border-brand-600 bg-brand-50' : 'border-line'}`}>
                <Radio name="role" label={r.nom} description={r.description} checked={role === r.nom} onChange={() => setRole(r.nom)} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
