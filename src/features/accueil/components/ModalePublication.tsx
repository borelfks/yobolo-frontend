import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'
import { data } from '@/data'
import { useBrouillonPublication, useDomainesExpertise } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Checkbox, ChipsInput, Field, Input, Textarea } from '@/shared/components/forms/Fields'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'

const LONGUEUR_MAX_TITRE = 150
const NOMBRE_MAX_SUJETS = 5
const LONGUEUR_MAX_SUJET = 40
const NOMBRE_MAX_DOMAINES = 3

type Facon = 'publier' | 'brouillon'

/**
 * « Publier sur le fil » (ModalePublication de yibolo-client) : titre, texte,
 * domaines (1 à 3) et sujets. Publier ou enregistrer en brouillon écrit dans
 * la table `publications` ; un brouillon existant est repris à l'ouverture.
 * Les images et la vidéo de l'original ne sont pas reprises (rien n'est envoyé
 * dans ce projet).
 */
export function ModalePublication({ ouverte, onFermer }: { ouverte: boolean; onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const domaines = useDomainesExpertise()
  const brouillon = useBrouillonPublication(account?.id)
  const [facon, setFacon] = useState<Facon>('publier')

  const schema = useMemo(
    () =>
      z
        .object({
          titre: z.string().trim().max(LONGUEUR_MAX_TITRE, t('composer.erreurs.titreTropLong', { max: LONGUEUR_MAX_TITRE })),
          texte: z.string().trim(),
          domaines: z.array(z.string()).max(NOMBRE_MAX_DOMAINES, t('composer.erreurs.tropDeDomaines', { max: NOMBRE_MAX_DOMAINES })),
          sujets: z
            .array(z.string())
            .max(NOMBRE_MAX_SUJETS, t('composer.erreurs.tropDeSujets', { max: NOMBRE_MAX_SUJETS }))
            .refine((sujets) => sujets.every((sujet) => sujet.length <= LONGUEUR_MAX_SUJET), t('composer.erreurs.sujetTropLong', { max: LONGUEUR_MAX_SUJET })),
          facon: z.enum(['publier', 'brouillon']),
        })
        .superRefine((valeurs, contexte) => {
          if (valeurs.facon === 'brouillon') {
            if (!valeurs.titre && !valeurs.texte) contexte.addIssue({ code: 'custom', path: ['texte'], message: t('composer.erreurs.brouillonVide') })
            return
          }
          if (valeurs.domaines.length === 0) contexte.addIssue({ code: 'custom', path: ['domaines'], message: t('composer.erreurs.domaineRequis') })
          if (!valeurs.texte) contexte.addIssue({ code: 'custom', path: ['texte'], message: t('composer.erreurs.texteRequis') })
        }),
    [t],
  )

  const valeursDeDepart = () => ({
    titre: brouillon?.titre ?? '',
    texte: brouillon?.texte ?? '',
    domaines: brouillon?.domaines ?? [],
    sujets: brouillon?.sujets ?? [],
    facon: 'publier' as Facon,
  })

  const { register, handleSubmit, control, formState, setValue, watch, reset } = useForm({
    resolver: zodResolver(schema),
    values: ouverte ? valeursDeDepart() : undefined,
  })
  const champTexte = register('texte')
  const texte = watch('texte') ?? ''
  const choisis = watch('domaines') ?? []
  const mots = texte.trim().split(/\s+/).filter(Boolean).length

  const fermer = () => {
    reset()
    onFermer()
  }

  const envoyer = handleSubmit(async ({ titre, texte: corps, domaines: lesDomaines, sujets, facon: laFacon }) => {
    if (!account) return
    const publication = {
      auteurType: 'compte' as const,
      auteurId: account.id,
      ...(titre ? { titre } : {}),
      texte: corps,
      domaines: lesDomaines,
      sujets: sujets.map((sujet) => sujet.replace(/^#/, '').trim().toLocaleLowerCase()).filter(Boolean),
      publieeLe: new Date().toISOString(),
      statut: laFacon === 'brouillon' ? ('brouillon' as const) : ('publiee' as const),
    }
    try {
      if (brouillon) {
        await data.put('publications', { ...brouillon, ...publication, titre: titre || undefined })
      } else {
        await data.create('publications', { ...publication, jaimes: 0, commentaires: 0, lectures: 0 }, 'pub')
      }
      toast.success(t(laFacon === 'brouillon' ? 'composer.brouillonEnregistre' : 'composer.publiee'))
      fermer()
    } catch {
      toast.error(t('composer.erreurs.envoiEchoue'))
    }
  })

  const soumettre = (laFacon: Facon) => {
    setFacon(laFacon)
    setValue('facon', laFacon)
    void envoyer()
  }

  const enTete = brouillon ? 'Brouillon' : 'Publier'

  // Posée sur la page : une colonne collante (xl:sticky) retiendrait la fenêtre sous la barre du haut.
  return createPortal(
    <Modal
      open={ouverte}
      onClose={fermer}
      size="lg"
      title={t(`composer.titre${enTete}`)}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="neutral" onClick={fermer}>
            {t('composer.annuler')}
          </Button>
          <Button variant="outline" disabled={formState.isSubmitting} onClick={() => soumettre('brouillon')}>
            {t('composer.enregistrerLeBrouillon')}
          </Button>
          <Button disabled={formState.isSubmitting} onClick={() => soumettre('publier')}>
            {facon === 'publier' && formState.isSubmitting ? t('composer.envoi') : t('composer.publier')}
          </Button>
        </div>
      }
    >
      <p className="-mt-2 text-sm text-muted">{t(`composer.description${enTete}`)}</p>
      <form
        className="mt-4 flex max-h-[60dvh] flex-col gap-5 overflow-y-auto pr-1"
        onSubmit={(evenement) => {
          evenement.preventDefault()
          soumettre('publier')
        }}
      >
        <Field label={t('composer.champTitre')} hint={t('composer.hintTitre', { max: LONGUEUR_MAX_TITRE })} error={formState.errors.titre?.message}>
          <Input maxLength={LONGUEUR_MAX_TITRE} placeholder={t('composer.placeholderTitre')} {...register('titre')} />
        </Field>

        <Field label={t('composer.champTexte')} required hint={t('composer.hintTexte', { count: mots })} error={formState.errors.texte?.message}>
          <Textarea rows={6} placeholder={t('composer.invite')} name={champTexte.name} onChange={champTexte.onChange} onBlur={champTexte.onBlur} ref={champTexte.ref} />
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="flex w-full items-center justify-between gap-2 pb-2 text-sm font-semibold text-navy-900">
            <span>
              {t('composer.champDomaines')}
              <span className="text-rose-500"> *</span>
            </span>
            <span className="text-xs font-normal text-muted tabular-nums">
              {choisis.length} / {NOMBRE_MAX_DOMAINES}
            </span>
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {domaines.map((domaine) => {
              const coche = choisis.includes(domaine.id)
              return (
                <Checkbox
                  key={domaine.id}
                  label={domaine.nom}
                  checked={coche}
                  disabled={!coche && choisis.length >= NOMBRE_MAX_DOMAINES}
                  onChange={() =>
                    setValue('domaines', coche ? choisis.filter((id) => id !== domaine.id) : [...choisis, domaine.id], {
                      shouldDirty: true,
                      shouldValidate: formState.isSubmitted,
                    })
                  }
                  className="has-[input:disabled]:opacity-50"
                />
              )
            })}
          </div>
          <span className={formState.errors.domaines ? 'text-xs font-medium text-rose-600' : 'text-xs text-muted'}>
            {formState.errors.domaines?.message ?? t('composer.hintDomaines', { max: NOMBRE_MAX_DOMAINES })}
          </span>
        </fieldset>

        <Field label={t('composer.champSujets')} hint={t('composer.hintSujets')} error={formState.errors.sujets?.message}>
          <Controller
            control={control}
            name="sujets"
            render={({ field }) => <ChipsInput value={field.value ?? []} onChange={field.onChange} placeholder={t('composer.placeholderSujets')} />}
          />
        </Field>
      </form>
    </Modal>,
    document.body,
  )
}
