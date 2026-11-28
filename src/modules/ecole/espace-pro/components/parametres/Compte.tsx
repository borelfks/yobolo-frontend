import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { numeroPropre, numeroValide } from '@/modules/compte/auth/authOtp'
import { data } from '@/data'
import { Champ } from '@/shared/blocs/Formulaire'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Switch } from '@/shared/shadcn/switch'
import { Lien } from '@/shared/ui/Lien'
import { initials } from '@/shared/utils/format'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { ROUTES } from '@/shared/utils/routes'
import { ChampIndicatif, CartePro, LigneReglage, PiedFormulaire } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { useReglages } from '@/modules/ecole/espace-pro/hooks/useReglages'
import { sansIndicatif } from '@/modules/ecole/espace-pro/proData'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 7.1 Compte et accès : photo, nom, téléphone, e-mail (table `comptes`), rôle ; mot de passe et 2FA. */
export function Compte() {
  const { t } = useTranslation('pro', { keyPrefix: 'parametres.compte' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const { account } = useSession()
  const securite = useReglages('securite')
  const [saisie, setSaisie] = useState<{ nom?: string; telephone?: string; email?: string }>({})
  const [erreurs, setErreurs] = useState<{ nom?: string; telephone?: string; email?: string }>({})
  const [enCours, setEnCours] = useState(false)
  if (!account) return null
  const nom = saisie.nom ?? account.name
  const telephone = saisie.telephone ?? sansIndicatif(account.telephone)
  const email = saisie.email ?? account.identifiant

  const changerPhoto = async (f: File) => {
    if (f.size > TAILLE_MAX_PHOTO) return void toast.error(t('photoTropLourde'))
    await data.update('comptes', account.id, { avatar: await lireImage(f) })
    toast.success(t('photoChangee'))
  }
  const enregistrer = async () => {
    const e = { nom: nom.trim() ? undefined : t('erreurs.nom'), telephone: numeroValide(telephone) ? undefined : t('erreurs.telephone'), email: EMAIL.test(email.trim()) ? undefined : t('erreurs.email') }
    setErreurs(e)
    if (e.nom || e.telephone || e.email) return void toast.error(tp('profil.erreurs.corriger'))
    setEnCours(true)
    try {
      await data.update('comptes', account.id, { name: nom.trim(), telephone: numeroPropre(telephone), identifiant: email.trim() })
      setSaisie({})
      toast.success(tp('commun.enregistre'))
    } finally {
      setEnCours(false)
    }
  }
  const deuxFacteurs = securite.oui('deuxFacteurs', true)
  return (
    <>
      <CartePro titre={t('titre')} description={t('description')}>
        <div className="flex flex-wrap items-center gap-3.5 border-y border-border py-3">
          <Avatar className="size-[72px]">
            <AvatarImage src={account.avatar || undefined} alt={t('photoAlt', { nom: account.name })} className="object-cover" />
            <AvatarFallback className="bg-primary-tint text-2xl font-extrabold text-primary-strong">{initials(account.name)}</AvatarFallback>
          </Avatar>
          <span className="flex flex-col gap-1.5">
            <Button asChild variant="secondary" size="sm" className="h-[34px] cursor-pointer self-start px-3.5 focus-within:outline-2 focus-within:outline-ring">
              <label>
                {t('changerPhoto')}
                <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void changerPhoto(f) }} />
              </label>
            </Button>
            <span className="text-xs font-medium text-muted-foreground">{t('photoFormat')}</span>
          </span>
        </div>
        <div className="grid gap-3.5 lg:grid-cols-2">
          <Champ id={`${id}-nom`} label={t('nom')} erreur={erreurs.nom}>
            <Input id={`${id}-nom`} value={nom} onChange={(e) => setSaisie((s) => ({ ...s, nom: e.target.value }))} aria-invalid={!!erreurs.nom || undefined} />
          </Champ>
          <Champ id={`${id}-tel`} label={t('telephone')} erreur={erreurs.telephone}>
            <ChampIndicatif id={`${id}-tel`} value={telephone} onChange={(e) => setSaisie((s) => ({ ...s, telephone: e.target.value }))} aria-invalid={!!erreurs.telephone || undefined} />
          </Champ>
          <Champ id={`${id}-email`} label={t('email')} erreur={erreurs.email}>
            <Input id={`${id}-email`} type="email" value={email} onChange={(e) => setSaisie((s) => ({ ...s, email: e.target.value }))} aria-invalid={!!erreurs.email || undefined} />
          </Champ>
          <Champ id={`${id}-role`} label={t('role')}>
            <Input id={`${id}-role`} value={tp('roles.admin.nom')} readOnly className="bg-muted" />
          </Champ>
        </div>
      </CartePro>
      <CartePro titre={t('securite')}>
        <div>
          <LigneReglage titre={t('motDePasse')} aide={t('motDePasseAide')}>
            <Button asChild variant="secondary" size="sm" className="h-[34px] px-3.5">
              <Lien to={ROUTES.pro.settings('securite')}>{tp('commun.modifier')}</Lien>
            </Button>
          </LigneReglage>
          <LigneReglage id={`${id}-2fa`} titre={t('deuxFacteurs')} aide={t('deuxFacteursAide')}>
            <Switch
              checked={deuxFacteurs}
              aria-labelledby={`${id}-2fa`}
              onCheckedChange={async (v) => {
                await securite.enregistrer({ deuxFacteurs: v })
                toast.success(tp(v ? 'parametres.securite.deuxFacteursActive' : 'parametres.securite.deuxFacteursDesactive'))
              }}
            />
          </LigneReglage>
        </div>
      </CartePro>
      <PiedFormulaire>
        <Button variant="outline" onClick={() => (setSaisie({}), setErreurs({}), toast(tp('commun.annule')))}>
          {tp('commun.annuler')}
        </Button>
        <Button loading={enCours} onClick={() => void enregistrer()}>
          {tp('commun.enregistrerModifications')}
        </Button>
      </PiedFormulaire>
    </>
  )
}
