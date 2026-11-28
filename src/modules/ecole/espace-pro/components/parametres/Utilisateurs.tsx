import { useId, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { useMonEcole, useSession } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useActiviteSecurite, useRoles, useUtilisateurs } from '@/data/hooks'
import { Champ, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/shared/shadcn/dialog'
import { Input } from '@/shared/shadcn/input'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { initials, num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import type { UtilisateurPro } from '@/shared/types'
import { BandeauChiffres, CartePro, MenuPlus, StatutBadge, type ActionMenu } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { dateDuJour } from '@/modules/ecole/espace-pro/proData'
import { cleRole } from '@/modules/ecole/espace-pro/proRoles'

const COLONNES = 'lg:grid lg:grid-cols-[minmax(0,1.6fr)_1.3fr_1.4fr_0.7fr_1fr_48px] lg:items-center lg:gap-3'
const MOI = 'moi'

/** 7.5 Utilisateurs : chiffres, recherche, filtres, « + Inviter un utilisateur », la liste (le compte connecté en tête) et ses actions. */
export function Utilisateurs() {
  const { t } = useTranslation('pro', { keyPrefix: 'parametres.utilisateurs' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const navigate = useNavigate()
  const { ecole } = useMonEcole()
  const { account } = useSession()
  const roles = useRoles()
  const invites = useUtilisateurs(ecole.id)
  const derniere = useActiviteSecurite(account?.id).find((a) => a.evenement === 'connexion' && a.ok)
  const [q, setQ] = useState('')
  const [role, setRole] = useState('tous')
  const [statut, setStatut] = useState('tous')
  const [changement, setChangement] = useState<{ u: UtilisateurPro; role: string } | null>(null)

  const nomRole = (r: string) => {
    const cle = cleRole(r)
    return cle ? tp(`roles.${cle}.nom`) : r
  }
  // Le compte connecté est l'administrateur de l'espace (« Vous ») ; puis les personnes invitées.
  const moi: UtilisateurPro | null = account
    ? { id: MOI, etablissementId: ecole.id, nom: account.name, role: 'Administrateur', telephone: account.telephone, email: account.identifiant, statut: 'Actif', connexion: derniere ? shortDate(derniere.le, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—', avatar: account.avatar, vous: true }
    : null
  const tous = [...(moi ? [moi] : []), ...invites]
  const actifs = tous.filter((u) => u.statut === 'Actif').length
  const recherche = q.trim().toLowerCase()
  const liste = tous.filter((u) => (!recherche || `${u.nom} ${u.email} ${u.telephone}`.toLowerCase().includes(recherche)) && (role === 'tous' || u.role === role) && (statut === 'tous' || (statut === 'Actif' ? u.statut === 'Actif' : u.statut !== 'Actif')))

  const modifier = async (u: UtilisateurPro, patch: Partial<UtilisateurPro>, message: string) => {
    await data.update('utilisateurs', u.id, patch)
    toast.success(message)
  }
  const actions = (u: UtilisateurPro): ActionMenu[] =>
    u.vous
      ? [{ label: t('menu.monCompte'), onSelect: () => void navigate({ href: ROUTES.pro.settings() }) }]
      : [
          { label: t('menu.changerRole'), onSelect: () => setChangement({ u, role: u.role }) },
          u.statut === 'Actif' ? { label: t('menu.desactiver'), onSelect: () => void modifier(u, { statut: 'Inactif' }, t('menu.desactive', { nom: u.nom })) } : { label: t('menu.activer'), onSelect: () => void modifier(u, { statut: 'Actif' }, t('menu.active', { nom: u.nom })) },
          { label: t('menu.renvoyer'), masque: u.statut !== 'En attente', onSelect: () => void modifier(u, { connexion: t('menu.inviteLe', { date: dateDuJour() }) }, t('menu.renvoyee', { contact: u.email || u.telephone })) },
          { label: t('menu.retirer'), danger: true, onSelect: async () => { await data.remove('utilisateurs', u.id); toast.success(t('menu.retire', { nom: u.nom })) } },
        ]

  return (
    <CartePro titre={t('titre')} titreMasque>
      <BandeauChiffres
        colonnes={3}
        bordure="bas"
        chiffres={[
          { nom: t('chiffres.utilisateurs'), valeur: num(tous.length) },
          { nom: t('chiffres.actifs'), valeur: num(actifs) },
          { nom: t('chiffres.inactifs'), valeur: num(tous.length - actifs) },
        ]}
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative flex-[1_1_240px]">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('recherche')} aria-label={t('rechercheAria')} className="pl-10" />
        </label>
        <div className="max-lg:flex-[1_1_100%] lg:w-[210px]">
          <ListeDeroulante ariaLabel={t('role')} valeur={role} onChange={setRole} options={[{ value: 'tous', label: t('tousRoles') }, ...roles.map((r) => ({ value: r.nom, label: nomRole(r.nom) }))]} />
        </div>
        <div className="max-lg:flex-[1_1_100%] lg:w-[170px]">
          <ListeDeroulante ariaLabel={t('statut')} valeur={statut} onChange={setStatut} options={[{ value: 'tous', label: t('tousStatuts') }, { value: 'Actif', label: tp('commun.statuts.actif') }, { value: 'Inactif', label: tp('commun.statuts.inactif') }]} />
        </div>
        <Button asChild className="max-lg:w-full">
          <Lien to={ROUTES.pro.inviteUser}>{t('inviter')}</Lien>
        </Button>
      </div>
      <div role="table" aria-label={t('titre')}>
        <div role="row" className={cn('hidden pb-2.5 text-xs font-bold tracking-[0.02em] text-muted-foreground uppercase', COLONNES)}>
          {(['utilisateur', 'role', 'contact', 'statut', 'connexion'] as const).map((c) => (
            <span key={c} role="columnheader">
              {t(`colonnes.${c}`)}
            </span>
          ))}
          <span role="columnheader" className="text-right">
            {t('colonnes.actions')}
          </span>
        </div>
        {liste.length === 0 && <p className="border-t border-border py-6 text-center text-sm text-muted-foreground">{t('aucun')}</p>}
        {liste.map((u) => (
          <div key={u.id} role="row" className={cn('flex flex-col gap-1.5 border-t border-border py-3.5 lg:py-3', COLONNES)}>
            <span role="cell" className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-tint text-meta font-extrabold text-primary-strong" aria-hidden>
                {initials(u.nom)}
              </span>
              <b className="text-ui text-foreground">{u.nom}</b>
              {u.vous && <Badge variant="blue">{t('vous')}</Badge>}
            </span>
            {[
              [t('colonnes.role'), nomRole(u.role)],
              [t('colonnes.contact'), u.email || u.telephone],
            ].map(([label, valeur]) => (
              <span key={label} role="cell" className="flex gap-1.5 text-sm break-all text-foreground lg:block lg:text-foreground-soft">
                <span className="min-w-[120px] shrink-0 font-semibold text-muted-foreground lg:hidden">{label}</span>
                {valeur}
              </span>
            ))}
            <span role="cell">
              <StatutBadge statut={u.statut} />
            </span>
            <span role="cell" className="flex gap-1.5 text-sm text-foreground lg:block lg:text-foreground-soft">
              <span className="min-w-[120px] shrink-0 font-semibold text-muted-foreground lg:hidden">{t('colonnes.connexion')}</span>
              {u.connexion}
            </span>
            <span role="cell" className="flex justify-end max-lg:-mt-1">
              <MenuPlus label={t('actionsAria', { nom: u.nom })} actions={actions(u)} />
            </span>
          </div>
        ))}
      </div>
      <Dialog open={changement !== null} onOpenChange={(o) => !o && setChangement(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{t('changerRoleTitre', { nom: changement?.u.nom ?? '' })}</DialogTitle>
          <Champ id={`${id}-role`} label={t('role')}>
            <ListeDeroulante id={`${id}-role`} valeur={changement?.role ?? ''} onChange={(v) => changement && setChangement({ ...changement, role: v })} options={roles.map((r) => ({ value: r.nom, label: nomRole(r.nom) }))} />
          </Champ>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setChangement(null)}>
              {tp('commun.annuler')}
            </Button>
            <Button
              onClick={async () => {
                if (!changement) return
                await modifier(changement.u, { role: changement.role }, t('menu.roleChange', { nom: changement.u.nom, role: nomRole(changement.role) }))
                setChangement(null)
              }}
            >
              {tp('commun.enregistrer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CartePro>
  )
}
