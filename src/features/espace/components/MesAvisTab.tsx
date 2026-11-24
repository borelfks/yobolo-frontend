import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ExternalLink, MessageSquareReply, PencilLine, Star, Trash2 } from 'lucide-react'
import { useAutoEcoles, useEtablissements, useMesAvis } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { modifierAvis, supprimerAvis } from '@/features/espace/espaceActions'
import { AucunDossier } from '@/features/espace/components/Dossiers'
import { Field, Textarea } from '@/shared/components/forms/Fields'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Modal } from '@/shared/components/ui/Modal'
import { StarInput, Stars } from '@/shared/components/ui/StarRating'
import type { AvisAutoEcole, AvisEtablissement } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

type Cible = { genre: 'etablissement'; avis: AvisEtablissement } | { genre: 'auto-ecole'; avis: AvisAutoEcole }

/** « Mes avis » : ceux que le compte a donnés, avec la réponse de l'établissement ; modifiables et supprimables. */
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

  if (liste.length === 0) return <AucunDossier texte={`${t('avis.aucun')} ${t('avis.conseil')}`} action={t('dossiers.trouverFormation')} vers={ROUTES.schools} />
  return (
    <div className="space-y-3">
      {liste.map((c) => (
        <Card key={c.avis.id} className="space-y-2 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-navy-900">{c.nom}</p>
            <span className="text-[13px] text-muted">{c.avis.date}</span>
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
