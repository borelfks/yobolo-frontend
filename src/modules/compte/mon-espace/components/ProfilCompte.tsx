import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { data } from '@/data'
import { useComptes, useDecoupage } from '@/data/hooks'
import { chiffresDuNumero, formaterNumero, numeroValide } from '@/modules/compte/auth/authOtp'
import { VerificationCode } from '@/modules/compte/auth/components/VerificationCode'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { PhotoDuCompte } from '@/modules/compte/mon-espace/components/PhotoDuCompte'
import { CarteCompte, EnTeteCompte } from '@/shared/blocs/CadreCompte'
import { CaseACocher, Champ, ChampTelephone, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { ChampsLieu } from '@/shared/forms/ChampsLieu'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/shadcn/dialog'
import { Input } from '@/shared/shadcn/input'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import type { Lieu } from '@/shared/types'
import { villeDuLieu } from '@/shared/utils/geographie'
import { normaliserIdentifiant } from '@/shared/utils/motDePasse'
import { CIVILITES, NATIONALITES } from '@/shared/utils/personne'

type Valeurs = {
  civilite: (typeof CIVILITES)[number]
  prenom: string
  nom: string
  nationalite: string
  naissance: string
  telephone: string
  whatsapp: boolean
  email: string
  region: string
  departement: string
  arrondissement: string
  quartier: string
}

/**
 * « Mon profil » (canevas) : la photo, la civilité, le prénom, le nom, la
 * nationalité, la date de naissance, le téléphone (WhatsApp), l'e-mail et la
 * résidence, enregistrés dans `comptes`. Un nouveau numéro est d'abord
 * confirmé par un code ; « Profil mis à jour » s'affiche après l'enregistrement.
 */
export function ProfilCompte() {
  const { t } = useTranslation('espace')
  const { t: tc } = useTranslation('common')
  const { account } = useSession()
  const comptes = useComptes()
  const { arrondissements } = useDecoupage()
  // Les modifications en attente du code envoyé au nouveau numéro.
  const [aConfirmer, setAConfirmer] = useState<Valeurs | null>(null)
  const [enregistre, setEnregistre] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        civilite: z.enum(CIVILITES),
        prenom: z.string().trim().min(1, t('profil.erreurs.prenom')),
        nom: z.string().trim().min(1, t('profil.erreurs.nom')),
        nationalite: z.string(),
        naissance: z.string(),
        telephone: z.string().refine(numeroValide, t('profil.erreurs.telephone')),
        whatsapp: z.boolean(),
        email: z.string().trim().refine((v) => v === '' || z.email().safeParse(v).success, t('profil.erreurs.email')),
        region: z.string().min(1, tc('geographie.erreurs.region')),
        departement: z.string().min(1, tc('geographie.erreurs.departement')),
        arrondissement: z.string().min(1, tc('geographie.erreurs.arrondissement')),
        quartier: z.string().trim().min(1, tc('geographie.erreurs.quartier')),
      }),
    [t, tc],
  )
  // Un ancien compte n'a que « name » : le prénom et le nom s'en déduisent.
  const [prenomDeduit = '', ...reste] = (account?.name ?? '').split(' ')
  const { register, handleSubmit, formState, setError, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      civilite: account?.civilite ?? 'Monsieur',
      prenom: account?.prenom ?? prenomDeduit,
      nom: account?.nom ?? reste.join(' '),
      nationalite: account?.nationalite ?? '',
      naissance: account?.naissance ?? '',
      telephone: account ? chiffresDuNumero(account.telephone) : '',
      whatsapp: account?.whatsapp ?? false,
      email: account?.identifiant.includes('@') ? account.identifiant : '',
      region: account?.region ?? '',
      departement: account?.departement ?? '',
      arrondissement: account?.arrondissement ?? '',
      quartier: account?.quartier ?? '',
    },
  })
  if (!account) return null

  const lieu: Lieu = { region: watch('region'), departement: watch('departement'), arrondissement: watch('arrondissement'), quartier: watch('quartier') }
  const changerLieu = (l: Lieu) => {
    for (const cle of ['region', 'departement', 'arrondissement', 'quartier'] as const) setValue(cle, l[cle], { shouldDirty: true, shouldValidate: formState.isSubmitted })
  }

  const sauver = async (v: Valeurs, telephoneVerifie?: boolean) => {
    const telephone = formaterNumero(v.telephone)
    try {
      await data.update('comptes', account.id, {
        civilite: v.civilite,
        prenom: v.prenom.trim(),
        nom: v.nom.trim(),
        name: `${v.prenom.trim()} ${v.nom.trim()}`,
        nationalite: v.nationalite || undefined,
        naissance: v.naissance || undefined,
        telephone,
        ...(telephoneVerifie ? { telephoneVerifie } : {}),
        whatsapp: v.whatsapp,
        // L'e-mail (ou, sans e-mail, le téléphone) est l'identifiant de connexion.
        identifiant: v.email.trim() || telephone,
        region: v.region,
        departement: v.departement,
        arrondissement: v.arrondissement,
        ville: villeDuLieu(v, arrondissements),
        quartier: v.quartier.trim(),
      })
      setEnregistre(true)
    } catch {
      toast.error(t('profil.erreurs.enregistrement'))
    }
  }

  const enregistrer = handleSubmit(async (v) => {
    setEnregistre(false)
    const autres = comptes.filter((c) => c.id !== account.id)
    const identifiant = v.email.trim() || formaterNumero(v.telephone)
    if (autres.some((c) => normaliserIdentifiant(c.identifiant) === normaliserIdentifiant(identifiant))) return setError('email', { message: t('profil.erreurs.emailPris') })
    if (autres.some((c) => chiffresDuNumero(c.telephone) === chiffresDuNumero(v.telephone))) return setError('telephone', { message: t('profil.erreurs.telephonePris') })
    // Un nouveau numéro : le code envoyé dessus le confirme avant l'enregistrement.
    if (chiffresDuNumero(v.telephone) !== chiffresDuNumero(account.telephone)) return setAConfirmer(v)
    await sauver(v)
  })

  const e = formState.errors
  return (
    <CarteCompte>
      <EnTeteCompte titre={t('profil.titre')} texte={t('profil.texte')} />
      <PhotoDuCompte compte={account} size={88} variante="profil" />
      <form noValidate onSubmit={(ev) => void enregistrer(ev)} className="flex flex-col gap-3.5">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-bold">{t('profil.civilite')}</legend>
          <ToggleGroup type="single" variant="outline" value={watch('civilite')} onValueChange={(v) => v && setValue('civilite', CIVILITES.find((c) => c === v) ?? 'Monsieur', { shouldDirty: true })}>
            {CIVILITES.map((c) => (
              <ToggleGroupItem key={c} value={c}>
                {tc(`personne.civilites.${c}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>
        <div className="grid gap-3 lg:grid-cols-2">
          <Champ id="profil-prenom" label={t('profil.prenom')} erreur={e.prenom?.message}>
            <Input id="profil-prenom" autoComplete="given-name" aria-invalid={!!e.prenom || undefined} {...register('prenom')} />
          </Champ>
          <Champ id="profil-nom" label={t('profil.nom')} erreur={e.nom?.message}>
            <Input id="profil-nom" autoComplete="family-name" aria-invalid={!!e.nom || undefined} {...register('nom')} />
          </Champ>
          <Champ id="profil-nationalite" label={t('profil.nationalite')}>
            <ListeDeroulante
              id="profil-nationalite"
              valeur={watch('nationalite')}
              onChange={(v) => setValue('nationalite', v, { shouldDirty: true })}
              placeholder={t('profil.choisir')}
              options={NATIONALITES.map((n) => ({ value: n, label: tc(`personne.nationalites.${n}`) }))}
            />
          </Champ>
          <Champ id="profil-naissance" label={t('profil.naissance')}>
            <Input id="profil-naissance" type="date" {...register('naissance')} />
          </Champ>
        </div>
        <Champ id="profil-telephone" label={t('profil.telephone')} aide={t('profil.telephoneAide')} erreur={e.telephone?.message}>
          <ChampTelephone id="profil-telephone" autoComplete="tel" aria-invalid={!!e.telephone || undefined} {...register('telephone')} />
        </Champ>
        <CaseACocher label={t('profil.whatsapp')} checked={watch('whatsapp')} onCheckedChange={(v) => setValue('whatsapp', v === true, { shouldDirty: true })} className="-mt-1.5" />
        <Champ id="profil-email" label={t('profil.email')} aide={t('profil.emailAide')} erreur={e.email?.message}>
          <Input id="profil-email" type="email" autoComplete="email" aria-invalid={!!e.email || undefined} {...register('email')} />
        </Champ>
        <ChampsLieu
          titre={t('profil.residence')}
          valeur={lieu}
          onChange={changerLieu}
          erreurs={{ region: e.region?.message, departement: e.departement?.message, arrondissement: e.arrondissement?.message, quartier: e.quartier?.message }}
        />
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-2">
          <Button type="submit" loading={formState.isSubmitting}>
            {t('profil.enregistrer')}
          </Button>
          {enregistre && (
            <span role="status" className="text-sm font-bold text-success">
              {t('profil.enregistre')}
            </span>
          )}
        </div>
      </form>
      <Dialog open={!!aConfirmer} onOpenChange={(o) => !o && setAConfirmer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">{t('profil.code.titre')}</DialogTitle>
          </DialogHeader>
          {aConfirmer && (
            <VerificationCode
              telephone={formaterNumero(aConfirmer.telephone)}
              libelleBouton={t('profil.code.bouton')}
              onVerifie={async () => {
                await sauver(aConfirmer, true)
                setAConfirmer(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </CarteCompte>
  )
}
