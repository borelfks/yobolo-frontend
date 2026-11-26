import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CalendarDays, CalendarPlus, Clock, Pencil, Trash2, Users } from 'lucide-react'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useInscriptionsRecues, useSessionsDe } from '@/data/hooks'
import { data } from '@/data'
import { permisIcon } from '@/features/driving-schools/autoEcoleRules'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Field, Input, Select } from '@/shared/components/forms/Fields'
import { proCard } from '@/features/pro/proStyles'
import { dossierOuvert } from '@/shared/utils/dossiers'
import { cn } from '@/shared/utils/cn'
import { dateDeDemo, demoDate, texteDeDate } from '@/shared/utils/format'
import type { PermisCode, SessionAutoEcole } from '@/shared/types'

/** Les jours et les durées proposés (valeurs enregistrées, comme celles de la maquette). */
const JOURS = ['Lun – Ven', 'Lun – Sam', 'Sam – Dim'] as const
const DUREES = ['≈ 1 mois', '≈ 2 mois', '≈ 3 mois', '≈ 4 mois', '≈ 6 mois'] as const
const HEURES = Array.from({ length: 15 }, (_, i) => `${String(i + 6).padStart(2, '0')}h`)

/** « 08h – 12h » → heures de début et de fin. */
const heuresDe = (texte?: string) => {
  const m = /^(\d{2}h) – (\d{2}h)$/.exec(texte ?? '')
  return { debut: m?.[1] ?? '08h', fin: m?.[2] ?? '12h' }
}
/** « 2026-11-15 » (champ date) ↔ « 15 nov. 2026 » (données). */
const versChamp = (texte?: string) => {
  const d = texte ? dateDeDemo(texte) : null
  return d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : ''
}
const aujourdhui = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * « Planning des sessions » : les sessions de l'auto-école (permis, début,
 * jours et heures, durée, places). Elles s'affichent sur sa fiche publique
 * (Planning, fiche du permis) et dans le formulaire d'inscription.
 */
export function PlanningSessions() {
  const { t } = useTranslation('pro')
  const { t: tae } = useTranslation('driving-schools')
  const { autoEcole, ecole } = useMonEcole()
  const sessions = useSessionsDe(ecole.id)
  const inscriptions = useInscriptionsRecues(ecole.id)
  const [edition, setEdition] = useState<SessionAutoEcole | 'nouvelle' | null>(null)
  const [suppression, setSuppression] = useState<SessionAutoEcole | null>(null)
  if (!autoEcole) return null
  // Élèves inscrits à une session : leurs dossiers encore ouverts ou acceptés.
  const inscrits = (s: SessionAutoEcole) => inscriptions.filter((i) => i.permis === s.permis && i.donnees.session === s.debut && (dossierOuvert(i.statut) || i.statut === 'Acceptée')).length

  const supprimer = async (s: SessionAutoEcole) => {
    setSuppression(null)
    if (inscrits(s) > 0) return void toast.error(t('autoEcole.planning.supprimerImpossible'))
    await data.remove('sessions', s.id)
    toast.success(t('autoEcole.planning.supprimee'))
  }

  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('autoEcole.planning.crumb') }]}
        icon={<CalendarDays />}
        title={t('autoEcole.planning.title')}
        subtitle={t('autoEcole.planning.subtitle')}
        actions={
          <Button size="lg" className="rounded-full" onClick={() => setEdition('nouvelle')}>
            <CalendarPlus />
            {t('autoEcole.planning.ajouter')}
          </Button>
        }
      />
      {sessions.length === 0 ? (
        <div className={cn(proCard, 'space-y-3 p-8 text-center')}>
          <p className="text-sm text-muted">{t('autoEcole.planning.aucune')}</p>
          <Button size="sm" onClick={() => setEdition('nouvelle')}>
            <CalendarPlus />
            {t('autoEcole.planning.ajouter')}
          </Button>
        </div>
      ) : (
        <div className={cn(proCard, 'overflow-hidden')}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[14.5px] text-navy-900">
              <thead>
                <tr className="bg-[#eef3fc] text-left text-[15px] font-bold">
                  <th className="py-3 pl-5">{t('autoEcole.planning.colonnes.permis')}</th>
                  <th>{t('autoEcole.planning.colonnes.debut')}</th>
                  <th>{t('autoEcole.planning.colonnes.horaires')}</th>
                  <th>{t('autoEcole.planning.colonnes.duree')}</th>
                  <th>{t('autoEcole.planning.colonnes.places')}</th>
                  <th>{t('autoEcole.planning.colonnes.inscrits')}</th>
                  <th className="pr-5 text-right">{t('autoEcole.planning.colonnes.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const Icone = permisIcon[s.permis]
                  const passee = (dateDeDemo(s.debut)?.getTime() ?? 0) < aujourdhui().getTime()
                  return (
                    <tr key={s.id} className={cn('border-t border-line', passee && 'text-muted')}>
                      <td className="py-2.5 pl-5">
                        <span className="inline-flex items-center gap-2 font-bold">
                          <Icone className="size-5 text-brand-600" aria-hidden="true" />
                          {tae('common.licence', { code: s.permis })}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <CalendarDays className="size-4 text-brand-600" aria-hidden="true" />
                          {demoDate(s.debut)}
                          {passee && <span className="text-xs">({t('autoEcole.planning.passee')})</span>}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <Clock className="size-4 text-brand-600" aria-hidden="true" />
                          {s.horaires.join(' · ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap">{s.duree}</td>
                      <td className={cn('font-semibold', s.places === 0 && 'text-rose-600')}>{s.places === 0 ? t('autoEcole.planning.complete') : s.places}</td>
                      <td>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="size-4 text-brand-600" aria-hidden="true" />
                          {inscrits(s)}
                        </span>
                      </td>
                      <td className="pr-5">
                        <div className="flex justify-end gap-2">
                          <button type="button" aria-label={t('autoEcole.planning.modifier')} onClick={() => setEdition(s)} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800 hover:bg-brand-100">
                            <Pencil className="size-4" />
                          </button>
                          <button type="button" aria-label={t('autoEcole.planning.supprimer')} onClick={() => setSuppression(s)} className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {edition && <FenetreSession permis={autoEcole.permis} autoEcoleId={autoEcole.id} session={edition === 'nouvelle' ? null : edition} onClose={() => setEdition(null)} />}
      <Modal
        open={!!suppression}
        onClose={() => setSuppression(null)}
        icon={<Trash2 className="mt-1 size-5 text-rose-600" aria-hidden="true" />}
        title={t('autoEcole.planning.confirmerTitre')}
        footer={
          <>
            <Button variant="neutral" onClick={() => setSuppression(null)}>
              {t('dossiers.decision.annuler')}
            </Button>
            <Button variant="danger" onClick={() => suppression && void supprimer(suppression)}>
              {t('autoEcole.planning.supprimer')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-900">{t('autoEcole.planning.confirmerTexte')}</p>
      </Modal>
    </div>
  )
}

/** Ajouter ou modifier une session. */
function FenetreSession({ permis, autoEcoleId, session, onClose }: { permis: PermisCode[]; autoEcoleId: string; session: SessionAutoEcole | null; onClose: () => void }) {
  const { t } = useTranslation('pro')
  const { t: tae } = useTranslation('driving-schools')
  const heures = heuresDe(session?.horaires[1])
  const schema = useMemo(
    () =>
      z
        .object({
          permis: z.string().min(1, t('autoEcole.planning.erreurs.permis')),
          debut: z.string().refine((v) => !!v && new Date(`${v}T00:00:00`).getTime() >= aujourdhui().getTime(), t('autoEcole.planning.erreurs.debut')),
          jours: z.string().min(1),
          heureDebut: z.string(),
          heureFin: z.string(),
          duree: z.string().min(1),
          places: z.string().refine((v) => /^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 60, t('autoEcole.planning.erreurs.places')),
        })
        .refine((v) => v.heureFin > v.heureDebut, { path: ['heureFin'], message: t('autoEcole.planning.erreurs.heures') }),
    [t],
  )
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      permis: session?.permis ?? permis[0] ?? '',
      debut: versChamp(session?.debut),
      jours: session?.horaires[0] ?? JOURS[0],
      heureDebut: heures.debut,
      heureFin: heures.fin,
      duree: session?.duree ?? DUREES[1],
      places: String(session?.places ?? 10),
    },
  })
  const e = formState.errors
  const enregistrer = handleSubmit(async (v) => {
    const champs = {
      autoEcoleId,
      permis: v.permis as PermisCode,
      debut: texteDeDate(new Date(`${v.debut}T00:00:00`)),
      horaires: [v.jours, `${v.heureDebut} – ${v.heureFin}`],
      duree: v.duree,
      places: Number(v.places),
    }
    if (session) await data.update('sessions', session.id, champs)
    else await data.create('sessions', champs, 'session')
    toast.success(t(session ? 'autoEcole.planning.modifiee' : 'autoEcole.planning.ajoutee'))
    onClose()
  })
  return (
    <Modal
      open
      onClose={onClose}
      title={t(session ? 'autoEcole.planning.modifierTitre' : 'autoEcole.planning.ajouter')}
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            {t('dossiers.decision.annuler')}
          </Button>
          <Button disabled={formState.isSubmitting} onClick={() => void enregistrer()}>
            {t('autoEcole.planning.enregistrer')}
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={(ev) => void enregistrer(ev)} className="grid gap-3 sm:grid-cols-2">
        <Field label={t('autoEcole.planning.colonnes.permis')} required error={e.permis?.message}>
          <Select options={permis.map((c) => ({ value: c, label: tae('common.licenceTitle', { code: c, name: tae(`permis.${c}.name`) }) }))} {...register('permis')} />
        </Field>
        <Field label={t('autoEcole.planning.colonnes.debut')} required error={e.debut?.message}>
          <Input type="date" {...register('debut')} />
        </Field>
        <Field label={t('autoEcole.planning.jours')} required>
          <Select options={JOURS.map((j) => ({ value: j, label: j }))} {...register('jours')} />
        </Field>
        <Field label={t('autoEcole.planning.colonnes.duree')} required>
          <Select options={DUREES.map((d) => ({ value: d, label: d }))} {...register('duree')} />
        </Field>
        <Field label={t('autoEcole.planning.heureDebut')} required>
          <Select options={HEURES.map((h) => ({ value: h, label: h }))} {...register('heureDebut')} />
        </Field>
        <Field label={t('autoEcole.planning.heureFin')} required error={e.heureFin?.message}>
          <Select options={HEURES.map((h) => ({ value: h, label: h }))} {...register('heureFin')} />
        </Field>
        <Field label={t('autoEcole.planning.colonnes.places')} required error={e.places?.message}>
          <Input inputMode="numeric" {...register('places')} />
        </Field>
      </form>
    </Modal>
  )
}
