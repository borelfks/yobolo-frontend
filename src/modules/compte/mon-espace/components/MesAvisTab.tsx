import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Car, ExternalLink, GraduationCap, MessageSquareReply, PencilLine, Star, Trash2 } from 'lucide-react'
import { useAutoEcoles, useEtablissements, useMesAvis, useMesInscriptions } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ecoleUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'
import { modifierAvis, supprimerAvis } from '@/modules/compte/mon-espace/espaceActions'
import { AucunDossier } from '@/modules/compte/mon-espace/components/Dossiers'
import { Field, Textarea } from '@/shared/forms/Fields'
import { Button } from '@/shared/ui/Button'
import { Card, Section } from '@/shared/ui/Card'
import { Modal } from '@/shared/ui/Modal'
import { StarInput, Stars } from '@/shared/ui/StarRating'
import type { AvisAutoEcole, AvisEtablissement } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

type Cible = { genre: 'etablissement'; avis: AvisEtablissement } | { genre: 'auto-ecole'; avis: AvisAutoEcole }

/**
 * « Mes avis » : « À évaluer » (les établissements et auto-écoles où le compte
 * a un dossier, sans avis encore : « Donner mon avis »), puis les avis donnés,
 * avec la réponse de l'établissement ; modifiables et supprimables.
 */
export function MesAvisTab() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const mes = useMesAvis(account?.id)
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const [modifier, setModifier] = useState<Cible | null>(null)
  const [supprimer, setSupprimer] = useState<Cible | null>(null)

  const liste: (Cible & { nom: string; vers: string })[] = [
    ...mes.etablissements.map((avis) => {
      const e = etablissements.find((x) => x.id === avis.etablissementId)
      return { genre: 'etablissement' as const, avis, nom: e?.nom ?? '—', vers: e ? ecoleUrl(e, 'avis') : ROUTES.schools }
    }),
    ...mes.autoEcoles.map((avis) => {
      const a = autoEcoles.find((x) => x.id === avis.autoEcoleId)
      return { genre: 'auto-ecole' as const, avis, nom: a?.nom ?? '—', vers: ROUTES.drivingSchool(avis.autoEcoleId, 'avis') }
    }),
  ]

  const confirmerSuppression = async () => {
    const c = supprimer
    setSupprimer(null)
    if (!c) return
    try {
      await supprimerAvis(c)
      toast.success(t('avis.supprime'))
    } catch {
      toast.error(t('avis.erreurs.echec'))
    }
  }

  return (
    <div className="space-y-3">
      <AEvaluer />
      {liste.length === 0 && <AucunDossier texte={`${t('avis.aucun')} ${t('avis.conseil')}`} action={t('dossiers.trouverFormation')} vers={ROUTES.schools} />}
      {liste.map((c) => (
        <Card key={c.avis.id} className="space-y-2 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-navy-900">{c.nom}</p>
            <span className="text-[13px] text-muted-foreground">{c.avis.date}</span>
          </div>
          <Stars value={c.avis.note} />
          <p className="text-[14.5px] text-navy-900">{c.avis.texte}</p>
          {c.avis.reponse && (
            <div className="rounded-xl bg-page p-3 text-sm">
              <p className="flex items-center gap-1.5 font-semibold text-navy-900">
                <MessageSquareReply className="size-4 text-brand-600" aria-hidden="true" />
                {t('avis.reponse')}
              </p>
              <p className="mt-1 text-navy-900">{c.avis.reponse.texte}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button to={c.vers} variant="ghost" size="sm">
              <ExternalLink aria-hidden="true" />
              {t('avis.voir')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setModifier(c)}>
              <PencilLine aria-hidden="true" />
              {t('avis.modifier')}
            </Button>
            <Button variant="danger-outline" size="sm" onClick={() => setSupprimer(c)}>
              <Trash2 aria-hidden="true" />
              {t('avis.supprimer')}
            </Button>
          </div>
        </Card>
      ))}

      {modifier && <ModifierAvis cible={modifier} onFermer={() => setModifier(null)} />}
      <Modal
        open={!!supprimer}
        onClose={() => setSupprimer(null)}
        icon={<Trash2 className="mt-1 size-5 text-rose-600" aria-hidden="true" />}
        title={t('avis.supprimerTitre')}
        footer={
          <>
            <Button variant="neutral" onClick={() => setSupprimer(null)}>
              {t('avis.annuler')}
            </Button>
            <Button variant="danger" onClick={() => void confirmerSuppression()}>
              {t('avis.supprimer')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-900">{t('avis.supprimerTexte')}</p>
      </Modal>
    </div>
  )
}

/** Les lieux où le compte a envoyé un dossier et qu'il n'a pas encore évalués. */
function AEvaluer() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const { preinscriptions, inscriptionsAutoEcole } = useMesInscriptions(account?.id)
  const mes = useMesAvis(account?.id)
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const lieux = [
    ...[...new Set(preinscriptions.map((p) => p.etablissementId))]
      .filter((id) => !mes.etablissements.some((a) => a.etablissementId === id))
      .flatMap((id) => {
        const e = etablissements.find((x) => x.id === id)
        return e ? [{ id: e.id, nom: e.nom, icone: <GraduationCap />, vers: ROUTES.schoolReview(slugOfType(e.type), e.id) }] : []
      }),
    ...[...new Set(inscriptionsAutoEcole.map((i) => i.autoEcoleId))]
      .filter((id) => !mes.autoEcoles.some((a) => a.autoEcoleId === id))
      .flatMap((id) => {
        const a = autoEcoles.find((x) => x.id === id)
        return a ? [{ id: a.id, nom: a.nom, icone: <Car />, vers: ROUTES.drivingSchoolReview(a.id) }] : []
      }),
  ]
  if (lieux.length === 0) return null
  return (
    <Section title={t('avis.aEvaluer.titre')} subtitle={t('avis.aEvaluer.texte')} icon={<Star />}>
      <ul className="divide-y divide-line">
        {lieux.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center gap-3 py-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 [&_svg]:size-5">{l.icone}</span>
            <span className="min-w-0 flex-1 font-semibold text-navy-900">{l.nom}</span>
            <Button to={l.vers} size="sm">
              <Star aria-hidden="true" />
              {t('avis.aEvaluer.donner')}
            </Button>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Fenêtre « Modifier mon avis » : note et commentaire (10 caractères au moins, comme à l'envoi). */
function ModifierAvis({ cible, onFermer }: { cible: Cible; onFermer: () => void }) {
  const { t } = useTranslation('espace')
  const schema = useMemo(() => z.object({ note: z.number().min(1).max(5), texte: z.string().trim().min(10, t('avis.erreurs.court')) }), [t])
  const { register, handleSubmit, setValue, watch, formState } = useForm({ resolver: zodResolver(schema), defaultValues: { note: cible.avis.note, texte: cible.avis.texte } })
  const enregistrer = handleSubmit(async ({ note, texte }) => {
    try {
      await modifierAvis(cible, note, texte)
      toast.success(t('avis.modifie'))
      onFermer()
    } catch {
      toast.error(t('avis.erreurs.echec'))
    }
  })
  return (
    <Modal
      open
      onClose={onFermer}
      icon={<Star className="mt-1 size-5 text-amber-500" aria-hidden="true" />}
      title={t('avis.modifierTitre')}
      footer={
        <>
          <Button variant="neutral" onClick={onFermer}>
            {t('avis.annuler')}
          </Button>
          <Button disabled={formState.isSubmitting} onClick={() => void enregistrer()}>
            {t('avis.enregistrer')}
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => void enregistrer(e)} className="space-y-4">
        <Field label={t('avis.note')} required>
          <StarInput value={watch('note')} onChange={(v) => setValue('note', v, { shouldDirty: true })} />
        </Field>
        <Field label={t('avis.commentaire')} required error={formState.errors.texte?.message}>
          <Textarea rows={4} {...register('texte')} max={undefined} />
        </Field>
      </form>
    </Modal>
  )
}
