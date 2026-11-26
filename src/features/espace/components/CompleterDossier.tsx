import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Paperclip, Send } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Section } from '@/shared/components/ui/Card'
import { Field, Textarea } from '@/shared/components/forms/Fields'
import { completerDossier, type Dossier } from '@/shared/utils/dossiers'
import { shortDate } from '@/shared/utils/format'

const aujourdhui = () => shortDate(new Date(), { day: '2-digit', month: 'short', year: 'numeric' })

/**
 * Réponse du candidat à « Complément demandé » : un message et, s'il veut,
 * une pièce. Le dossier repart vers l'établissement.
 */
export function CompleterDossier({ dossier, demande, nomCandidat, objet }: { dossier: Dossier; demande: string; nomCandidat: string; objet: string }) {
  const { t } = useTranslation('espace')
  const [fichier, setFichier] = useState<File | null>(null)
  const [envoi, setEnvoi] = useState(false)
  const schema = useMemo(() => z.object({ texte: z.string().trim().min(2, t('complement.erreurTexte')) }), [t])
  const { register, handleSubmit, reset, formState } = useForm({ resolver: zodResolver(schema), defaultValues: { texte: '' } })

  const envoyer = handleSubmit(async ({ texte }) => {
    setEnvoi(true)
    try {
      const ok = await completerDossier(dossier, texte, fichier, {
        titre: t('complement.notificationTitre'),
        texte: t('complement.notificationTexte', { name: nomCandidat, objet }),
        date: aujourdhui(),
      })
      if (!ok) return void toast.error(t('complement.tropLourd'))
      toast.success(t('complement.envoye'))
      reset()
      setFichier(null)
    } catch {
      toast.error(t('complement.echec'))
    } finally {
      setEnvoi(false)
    }
  })

  return (
    <Section title={t('complement.titre')} icon={<Send />} className="border-amber-200 bg-amber-50/40">
      <p className="mb-3 rounded-xl bg-white px-3 py-2 text-sm text-navy-900">
        <b>{t('complement.demande')}</b> {demande}
      </p>
      <form noValidate onSubmit={(e) => void envoyer(e)} className="space-y-3">
        <Field label={t('complement.message')} required error={formState.errors.texte?.message}>
          <Textarea rows={3} placeholder={t('complement.exemple')} {...register('texte')} max={undefined} />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-navy-800 hover:bg-slate-50">
            <Paperclip className="size-4 text-brand-600" aria-hidden="true" />
            {fichier ? fichier.name : t('complement.joindre')}
            <input type="file" accept=".pdf,image/*" className="sr-only" onChange={(e) => setFichier(e.target.files?.[0] ?? null)} />
          </label>
          <span className="text-xs text-muted">{t('complement.formats')}</span>
          <Button type="submit" size="sm" disabled={envoi} className="ml-auto">
            <Send aria-hidden="true" />
            {t('complement.envoyer')}
          </Button>
        </div>
      </form>
    </Section>
  )
}
