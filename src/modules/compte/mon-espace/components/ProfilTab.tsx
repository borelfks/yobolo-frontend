import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Save, UserRound } from 'lucide-react'
import { data } from '@/data'
import { useComptes, useDecoupage } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { chiffresDuNumero, formaterNumero, numeroValide } from '@/modules/compte/auth/authOtp'
import { VerificationCode } from '@/modules/compte/auth/components/VerificationCode'
import { PhotoDuCompte } from '@/modules/compte/mon-espace/components/PhotoDuCompte'
import { Checkbox, Field, Input, PhoneInput, Radio, Select } from '@/shared/forms/Fields'
import { SelectionGeographique } from '@/shared/forms/SelectionGeographique'
import { Button } from '@/shared/ui/Button'
import { Section } from '@/shared/ui/Card'
import { Modal } from '@/shared/ui/Modal'
import type { Lieu } from '@/shared/types'
import { villeDuLieu } from '@/shared/utils/geographie'
import { normaliserIdentifiant } from '@/shared/utils/motDePasse'
import { CIVILITES, NATIONALITES } from '@/shared/utils/personne'

/**
 * « Mon profil » : les informations demandées à l'inscription (comme dans
 * yibolo-client) — civilité, prénom, nom, nationalité, résidence (région →
 * département → arrondissement, quartier) —, plus la date de naissance, le
 * téléphone (WhatsApp), l'e-mail et la photo. Enregistrés dans `comptes` ; ils
 * préremplissent les préinscriptions et les inscriptions. La photo s'enregistre
 * dès qu'elle est choisie ; un nouveau numéro est d'abord confirmé par un code.
 */
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

export function ProfilTab() {
  const { t } = useTranslation('espace')
  const { t: tc } = useTranslation('common')
  const { account } = useSession()
  const comptes = useComptes()
  const { arrondissements } = useDecoupage()
  // Les modifications en attente du code envoyé au nouveau numéro.
  const [aConfirmer, setAConfirmer] = useState<Valeurs | null>(null)

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
      toast.success(t('profil.enregistre'))
    } catch {
      toast.error(t('profil.erreurs.enregistrement'))
    }
  }

  const enregistrer = handleSubmit(async (v) => {
    const autres = comptes.filter((c) => c.id !== account.id)
    const identifiant = v.email.trim() || formaterNumero(v.telephone)
    if (autres.some((c) => normaliserIdentifiant(c.identifiant) === normaliserIdentifiant(identifiant))) {
      return setError('email', { message: t('profil.erreurs.emailPris') })
    }
    if (autres.some((c) => chiffresDuNumero(c.telephone) === chiffresDuNumero(v.telephone))) {
      return setError('telephone', { message: t('profil.erreurs.telephonePris') })
    }
    // Un nouveau numéro : le code envoyé dessus le confirme avant l'enregistrement.
    if (chiffresDuNumero(v.telephone) !== chiffresDuNumero(account.telephone)) return setAConfirmer(v)
    await sauver(v)
  })

  const e = formState.errors
  return (
    <Section title={t('profil.titre')} subtitle={t('profil.texte')} icon={<UserRound />}>
      <form noValidate onSubmit={(ev) => void enregistrer(ev)} className="space-y-5">
        <PhotoDuCompte compte={account} size={84} variante="profil" />

        <fieldset>
          <legend className="mb-1.5 text-sm font-bold text-navy-900">{t('profil.civilite')}</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {CIVILITES.map((c) => (
              <Radio key={c} value={c} label={tc(`personne.civilites.${c}`)} {...register('civilite')} />
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t('profil.prenom')} required error={e.prenom?.message}>
            <Input autoComplete="given-name" {...register('prenom')} />
          </Field>
          <Field label={t('profil.nom')} required error={e.nom?.message}>
            <Input autoComplete="family-name" {...register('nom')} />
          </Field>
          <Field label={t('profil.nationalite')}>
            <Select options={NATIONALITES.map((n) => ({ value: n, label: tc(`personne.nationalites.${n}`) }))} placeholder={t('profil.choisir')} {...register('nationalite')} />
          </Field>
          <Field label={t('profil.naissance')}>
            <Input type="date" {...register('naissance')} />
          </Field>
          <div className="space-y-2">
            <Field label={t('profil.telephone')} required hint={t('profil.telephoneAide')} error={e.telephone?.message}>
              <PhoneInput autoComplete="tel" {...register('telephone')} />
            </Field>
            <Checkbox label={t('profil.whatsapp')} {...register('whatsapp')} />
          </div>
          <Field label={t('profil.email')} hint={t('profil.emailAide')} error={e.email?.message}>
            <Input type="email" autoComplete="email" {...register('email')} />
          </Field>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold text-navy-900">{t('profil.residence')}</legend>
          <SelectionGeographique
            valeur={lieu}
            onChange={changerLieu}
            erreurs={{ region: e.region?.message, departement: e.departement?.message, arrondissement: e.arrondissement?.message, quartier: e.quartier?.message }}
          />
        </fieldset>
        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            <Save aria-hidden="true" />
            {t('profil.enregistrer')}
          </Button>
        </div>
      </form>
      <Modal open={!!aConfirmer} onClose={() => setAConfirmer(null)} title={t('profil.code.titre')}>
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
      </Modal>
    </Section>
  )
}
