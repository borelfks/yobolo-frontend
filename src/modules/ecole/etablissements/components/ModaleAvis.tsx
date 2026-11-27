import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Briefcase, Building2, CalendarDays, Car, GraduationCap, Handshake, PencilLine, Send, ShieldCheck, Star, UserRound, Users } from 'lucide-react'
import { data } from '@/data'
import { useAutoEcole, useEtablissement } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { cn } from '@/shared/utils/cn'

/** Libellé de chaque note, de 1 à 5 étoiles. */
const LIBELLES = ['decevant', 'moyen', 'bien', 'tresBien', 'excellent'] as const

type CleCritere =
  | 'qualiteFormation'
  | 'competenceMoniteurs'
  | 'organisationPlanning'
  | 'infrastructuresVehicules'
  | 'accueilAccompagnement'
  | 'qualiteEnseignements'
  | 'competenceEnseignants'
  | 'organisationAdministration'
  | 'infrastructuresEquipements'
  | 'insertionPro'

/** Les critères et leur note préremplie (maquette). */
const CRITERES: Record<'etablissement' | 'auto-ecole', { cle: CleCritere; icone: ReactNode; defaut: number }[]> = {
  'auto-ecole': [
    { cle: 'qualiteFormation', icone: <GraduationCap />, defaut: 5 },
    { cle: 'competenceMoniteurs', icone: <UserRound />, defaut: 4 },
    { cle: 'organisationPlanning', icone: <CalendarDays />, defaut: 4 },
    { cle: 'infrastructuresVehicules', icone: <Car />, defaut: 4 },
    { cle: 'accueilAccompagnement', icone: <Handshake />, defaut: 5 },
  ],
  etablissement: [
    { cle: 'qualiteEnseignements', icone: <GraduationCap />, defaut: 5 },
    { cle: 'competenceEnseignants', icone: <Users />, defaut: 4 },
    { cle: 'organisationAdministration', icone: <CalendarDays />, defaut: 4 },
    { cle: 'infrastructuresEquipements', icone: <Building2 />, defaut: 4 },
    { cle: 'insertionPro', icone: <Briefcase />, defaut: 5 },
  ],
}

function Etoiles({ valeur, onChange, taille, compact }: { valeur: number; onChange: (v: number) => void; taille: string; compact?: boolean }) {
  const { t } = useTranslation('reviews')
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={t('donnerAvis.etoiles', { count: i })} aria-pressed={i <= valeur} onClick={() => onChange(i)} className={cn('grid place-items-center', compact ? 'min-h-9 min-w-8' : 'min-h-10 min-w-10')}>
          <Star className={cn(taille, i <= valeur ? 'fill-amber-400 text-amber-400' : 'fill-[#c9d4ea] text-[#c9d4ea]')} aria-hidden="true" />
        </button>
      ))}
    </span>
  )
}

/**
 * « Donner mon avis » dans une fenêtre, sur la fiche d'un établissement ou
 * d'une auto-école (décision du 2026-11-25 : plus de page à part). Note
 * globale obligatoire, critères facultatifs, commentaire de 10 caractères au
 * moins, confirmation d'avoir suivi une formation. L'avis est enregistré, la
 * note et le nombre d'avis, calculés, suivent ; l'établissement est prévenu.
 */
export function ModaleAvis({ genre, id, open, onClose }: { genre: 'etablissement' | 'auto-ecole'; id: string; open: boolean; onClose: () => void }) {
  const { t } = useTranslation('reviews')
  const { account } = useSession()
  // Les deux lectures sont faites à chaque fois (règle des hooks) ; seule celle du bon genre sert.
  const a = useAutoEcole(id)
  const e = useEtablissement(id)
  const ae = genre === 'auto-ecole'
  const criteres = CRITERES[genre]
  // Valeurs préremplies de la maquette : 4/5, critères notés, case cochée.
  const [note, setNote] = useState(4)
  const [notes, setNotes] = useState<Partial<Record<CleCritere, number>>>(() => Object.fromEntries(criteres.map((c) => [c.cle, c.defaut])))
  const [texte, setTexte] = useState('')
  const [confirme, setConfirme] = useState(true)
  const [envoi, setEnvoi] = useState(false)
  const [erreurs, setErreurs] = useState<{ texte?: string; confirme?: string }>({})

  const fermer = () => {
    setNote(4)
    setNotes(Object.fromEntries(criteres.map((c) => [c.cle, c.defaut])))
    setTexte('')
    setConfirme(true)
    setErreurs({})
    onClose()
  }

  const publier = async () => {
    const suite = {
      texte: texte.trim().length < 10 ? t('donnerAvis.toasts.tropCourt') : undefined,
      confirme: !confirme ? (ae ? t('donnerAvis.toasts.confirmAutoEcole') : t('donnerAvis.toasts.confirmEcole')) : undefined,
    }
    setErreurs(suite)
    if (suite.texte || suite.confirme) return
    setEnvoi(true)
    try {
      // Auteur : le compte connecté, sinon « Visiteur ». La date est un texte, comme les avis de la maquette.
      const auteur = { compteId: account?.id, nom: account?.name ?? t('donnerAvis.visiteur'), avatar: account?.avatar ?? '', date: t('donnerAvis.aLInstant'), note, texte: texte.trim() }
      if (ae) {
        await data.create('avisAutoEcoles', { ...auteur, autoEcoleId: a.id, criteres: criteres.map((c) => notes[c.cle] ?? c.defaut) }, 'avis')
      } else {
        await data.create('avisEtablissements', { ...auteur, etablissementId: e.id, role: 'Étudiant', utile: 0 }, 'avis')
        await data.create('notifications', { etablissementId: e.id, type: 'avis', titre: t('donnerAvis.notification.titre'), texte: t('donnerAvis.notification.texte', { name: auteur.nom, note }), date: t('donnerAvis.aLInstant'), lu: false }, 'notification')
      }
      toast.success(t('donnerAvis.toasts.merci'))
      fermer()
    } catch {
      toast.error(t('donnerAvis.toasts.echec'))
    } finally {
      setEnvoi(false)
    }
  }

  const libelle = LIBELLES[note - 1]
  return (
    <Modal
      open={open}
      onClose={fermer}
      size="lg"
      icon={<PencilLine className="mt-0.5 size-6 text-brand-600" aria-hidden="true" />}
      title={
        <span className="block">
          <span className="block text-[22px] font-bold">{t('donnerAvis.title')}</span>
          <span className="block text-[14px] font-normal text-muted-foreground">{ae ? a.nom : e.nom}</span>
        </span>
      }
      footer={
        <>
          <Button variant="outline" onClick={fermer}>
            {t('donnerAvis.annuler')}
          </Button>
          <Button disabled={envoi} onClick={() => void publier()}>
            <Send aria-hidden="true" />
            {t('donnerAvis.publier')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] text-navy-900">{t('donnerAvis.intro')}</p>
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[16px] font-bold text-navy-900">
              {t('donnerAvis.noteGlobale')} <span className="text-rose-500">*</span>
            </span>
            <Etoiles valeur={note} onChange={setNote} taille="size-8" />
            {libelle && (
              <span className="rounded-lg bg-[#e6eeff] px-3 py-1 text-[15px] text-navy-900">
                <b>{note}/5</b> – {t(`donnerAvis.notes.${libelle}`)}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-[16px] font-bold text-navy-900">
            {t('donnerAvis.criteresTitre')} <span className="font-normal text-muted-foreground">{t('donnerAvis.facultatif')}</span>
          </p>
          <div className="mt-2 grid gap-2">
            {criteres.map((c) => (
              <div key={c.cle} className="flex items-center gap-3 rounded-xl bg-[#eef3fc] py-1 pr-1 pl-3 text-[14px] text-navy-900 [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:text-brand-600">
                {c.icone}
                <span className="min-w-0 flex-1 leading-tight">{t(`donnerAvis.criteres.${c.cle}`)}</span>
                <Etoiles valeur={notes[c.cle] ?? 0} onChange={(v) => setNotes({ ...notes, [c.cle]: v })} taille="size-4" compact />
              </div>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[16px] font-bold text-navy-900">
            {t('donnerAvis.commentaire')} <span className="text-rose-500">*</span>
          </span>
          <span className="relative block">
            <textarea
              rows={4}
              maxLength={500}
              value={texte}
              aria-invalid={Boolean(erreurs.texte)}
              onChange={(ev) => (setTexte(ev.target.value), setErreurs((x) => ({ ...x, texte: undefined })))}
              placeholder={ae ? t('donnerAvis.placeholder.autoEcole') : t('donnerAvis.placeholder.ecole')}
              className="w-full resize-none rounded-xl border border-[#c9d4ea] px-4 py-3 pb-7 text-[15px] outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
            />
            <span className="absolute right-3 bottom-3 text-[12px] text-ink/70">{texte.length} / 500</span>
          </span>
          {erreurs.texte && <span className="mt-1 block text-xs font-medium text-rose-600">{erreurs.texte}</span>}
        </label>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[14.5px] text-navy-900">
            <input type="checkbox" checked={confirme} onChange={(ev) => (setConfirme(ev.target.checked), setErreurs((x) => ({ ...x, confirme: undefined })))} className="mt-0.5 size-5 shrink-0 accent-brand-600" />
            {ae ? t('donnerAvis.confirm.autoEcole') : t('donnerAvis.confirm.ecole')}
          </label>
          {erreurs.confirme && <p className="mt-1 text-xs font-medium text-rose-600">{erreurs.confirme}</p>}
        </div>
        <p className="flex items-start gap-2 rounded-xl bg-page px-3 py-2 text-[13px] text-navy-900">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
          {t('donnerAvis.verifie.texte')}
        </p>
      </div>
    </Modal>
  )
}
