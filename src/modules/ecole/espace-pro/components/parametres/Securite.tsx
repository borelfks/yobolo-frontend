import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CircleCheck, KeyRound, Laptop, TriangleAlert } from 'lucide-react'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { masquerNumero } from '@/modules/compte/auth/authOtp'
import { data } from '@/data'
import { useActiviteSecurite } from '@/data/hooks'
import { Champ, ChampMotDePasse } from '@/shared/blocs/Formulaire'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Switch } from '@/shared/shadcn/switch'
import { decrireAppareil } from '@/shared/utils/appareil'
import { protegerMotDePasse, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { cn } from '@/shared/utils/cn'
import { CartePro, LigneReglage, Pastille } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { useReglages } from '@/modules/ecole/espace-pro/hooks/useReglages'
import { formaterDate } from '@/shared/utils/dates'

const EVENEMENTS = { connexion: { icone: CircleCheck, ton: 'vert' }, echec: { icone: TriangleAlert, ton: 'rouge' }, motDePasse: { icone: KeyRound, ton: 'gris' } } as const
const DATE_HEURE = 'dateHeure' as const

/** 7.2 Sécurité : changer le mot de passe (vérifié), double authentification, session actuelle, activité récente. */
export function Securite() {
  const { t } = useTranslation('pro', { keyPrefix: 'parametres.securite' })
  const id = useId()
  const { account } = useSession()
  const activite = useActiviteSecurite(account?.id)
  const reglages = useReglages('securite')
  const [actuel, setActuel] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreurs, setErreurs] = useState<{ actuel?: string; nouveau?: string; confirmation?: string }>({})
  const [enCours, setEnCours] = useState(false)
  const regles = [
    { id: 'longueur', ok: nouveau.length >= 8 },
    { id: 'majuscule', ok: /[A-Z]/.test(nouveau) },
    { id: 'chiffre', ok: /\d/.test(nouveau) },
    { id: 'special', ok: /[^A-Za-z0-9]/.test(nouveau) },
  ] as const
  const deuxFacteurs = reglages.oui('deuxFacteurs', true)

  const mettreAJour = async () => {
    if (!account) return
    const e = {
      actuel: actuel ? undefined : t('erreurs.actuel'),
      nouveau: regles.every((r) => r.ok) ? undefined : t('erreurs.nouveau'),
      confirmation: nouveau === confirmation ? undefined : t('erreurs.confirmation'),
    }
    setErreurs(e)
    if (e.actuel || e.nouveau || e.confirmation) return
    setEnCours(true)
    try {
      if (!(await verifierMotDePasse(account.motDePasse, actuel))) return void setErreurs({ actuel: t('erreurs.incorrect') })
      await data.update('comptes', account.id, { motDePasse: await protegerMotDePasse(nouveau) })
      await data.create('activiteSecurite', { compteId: account.id, evenement: 'motDePasse', le: new Date().toISOString(), appareil: decrireAppareil(), ok: true }, 'activite')
      setActuel('')
      setNouveau('')
      setConfirmation('')
      toast.success(t('motDePasseChange'))
    } finally {
      setEnCours(false)
    }
  }

  return (
    <>
      <CartePro titre={t('motDePasse')}>
        <div className="grid gap-3.5 lg:grid-cols-2">
          <Champ id={`${id}-actuel`} label={t('actuel')} erreur={erreurs.actuel}>
            <ChampMotDePasse id={`${id}-actuel`} autoComplete="current-password" className="h-11" value={actuel} onChange={(e) => setActuel(e.target.value)} aria-invalid={!!erreurs.actuel || undefined} />
          </Champ>
          <span className="hidden lg:block" />
          <Champ id={`${id}-nouveau`} label={t('nouveau')} erreur={erreurs.nouveau}>
            <ChampMotDePasse id={`${id}-nouveau`} autoComplete="new-password" className="h-11" value={nouveau} onChange={(e) => setNouveau(e.target.value)} aria-invalid={!!erreurs.nouveau || undefined} />
          </Champ>
          <Champ id={`${id}-confirmation`} label={t('confirmation')} erreur={erreurs.confirmation}>
            <ChampMotDePasse id={`${id}-confirmation`} autoComplete="new-password" className="h-11" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} aria-invalid={!!erreurs.confirmation || undefined} />
          </Champ>
        </div>
        <ul className="flex flex-wrap gap-x-[18px] gap-y-2" aria-live="polite">
          {regles.map((r) => (
            <li key={r.id} className={cn('flex items-center gap-2 text-meta', r.ok ? 'font-bold text-success' : 'text-muted-foreground')}>
              <span aria-hidden>{r.ok ? '✓' : '○'}</span> {t(`regles.${r.id}`)}
            </li>
          ))}
        </ul>
        <Button className="self-start" loading={enCours} onClick={() => void mettreAJour()}>
          {t('mettreAJour')}
        </Button>
      </CartePro>
      <CartePro titre={t('deuxFacteursTitre')}>
        <LigneReglage id={`${id}-2fa`} titre={t('codeTelephone')} aide={t('codeTelephoneAide', { numero: masquerNumero(account?.telephone ?? '') })}>
          <span className="text-meta font-bold text-foreground">{t(deuxFacteurs ? 'activee' : 'desactivee')}</span>
          <Switch
            checked={deuxFacteurs}
            aria-labelledby={`${id}-2fa`}
            onCheckedChange={async (v) => {
              await reglages.enregistrer({ deuxFacteurs: v })
              toast.success(t(v ? 'deuxFacteursActive' : 'deuxFacteursDesactive'))
            }}
          />
        </LigneReglage>
      </CartePro>
      <CartePro titre={t('sessions')}>
        <div className="flex flex-wrap items-center gap-3 border-t border-border py-3.5">
          <Pastille icone={Laptop} ton="gris" />
          <span className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5">
            <b className="text-ui text-foreground">{decrireAppareil()}</b>
            <span className="text-xs font-medium text-muted-foreground">{t('cetAppareil')}</span>
          </span>
          <Badge variant="green">{t('sessionActuelle')}</Badge>
        </div>
      </CartePro>
      <CartePro titre={t('activite')}>
        {activite.length === 0 ? (
          <p className="rounded-md bg-muted px-3.5 py-3 text-sm text-muted-foreground">{t('aucuneActivite')}</p>
        ) : (
          <ul>
            {activite.slice(0, 10).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 border-t border-border py-3.5">
                <Pastille icone={EVENEMENTS[a.evenement].icone} ton={EVENEMENTS[a.evenement].ton} />
                <span className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5">
                  <b className="text-ui text-foreground">{t(`evenements.${a.evenement}`)}</b>
                  <span className="text-xs font-medium text-muted-foreground">
                    {formaterDate(a.le, DATE_HEURE)} · {a.appareil}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CartePro>
    </>
  )
}
