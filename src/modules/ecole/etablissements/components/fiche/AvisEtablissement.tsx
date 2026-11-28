import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ThumbsUp } from 'lucide-react'
import { data } from '@/data'
import { useAvisEtablissement, useRepartitionEtablissement } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ActionAvis, ArticleAvis, AucunAvis, EnteteListeAvis, ReponseAvis, ResumeAvis } from '@/modules/ecole/avis/components/BlocsAvis'
import { ModaleAvis } from '@/modules/ecole/avis/components/ModaleAvis'
import { Button } from '@/shared/shadcn/button'
import { Textarea } from '@/shared/shadcn/textarea'
import type { AvisEtablissement as Avis, Etablissement } from '@/shared/types'
import { notifier } from '@/shared/utils/notifications'
import { load, save } from '@/shared/utils/storage'
import { Carte, RangeePuces } from '@/modules/ecole/etablissements/components/Bases'
import { MenuTri } from '@/modules/ecole/etablissements/components/liste/Resultats'
import { dateDesDonnees } from '@/shared/utils/dates'

type Profil = 'tous' | 'etudiants' | 'anciens' | 'entreprises'
type Tri = 'recents' | 'mieuxNotes' | 'utiles'

/** Rôle d'un auteur d'avis (valeur fixe des données) → fin de sa clé de traduction. */
const ROLES = { Étudiant: 'etudiant', Étudiante: 'etudiante', 'Ancien étudiant': 'ancienEtudiant', 'Ancienne étudiante': 'ancienneEtudiante', Entreprise: 'entreprise' } as const
const profilDe = (role: string): Exclude<Profil, 'tous'> => (role.startsWith('Ancien') ? 'anciens' : role === 'Entreprise' ? 'entreprises' : 'etudiants')

/**
 * Onglet « Avis » de la fiche d'un établissement : profils (Tous, Étudiants,
 * Anciens étudiants, Entreprises), résumé des notes, « Donner mon avis »,
 * puis les avis, triés. L'établissement connecté répond à ses avis.
 */
export function AvisEtablissement({ e }: { e: Etablissement }) {
  const { t } = useTranslation('schools')
  const avis = useAvisEtablissement(e.id)
  const repartition = useRepartitionEtablissement(e.id)
  const { account } = useSession()
  const [profil, setProfil] = useState<Profil>('tous')
  const [tri, setTri] = useState<Tri>('recents')
  const [donner, setDonner] = useState(false)
  const nombre = (p: Profil) => (p === 'tous' ? avis.length : avis.filter((a) => profilDe(a.role) === p).length)
  const liste = avis.filter((a) => profil === 'tous' || profilDe(a.role) === profil).sort((a, b) => (tri === 'mieuxNotes' ? b.note - a.note : tri === 'utiles' ? b.utile - a.utile : 0))
  return (
    <Carte>
      <RangeePuces<Profil> valeur={profil} onChange={setProfil} options={(['tous', 'etudiants', 'anciens', 'entreprises'] as const).map((p) => ({ valeur: p, libelle: t(`fiche.avis.profils.${p}`, { n: nombre(p) }) }))} />
      {avis.length === 0 ? (
        <AucunAvis texte={t('fiche.avis.invitation')} onDonner={() => setDonner(true)} />
      ) : (
        <>
          <ResumeAvis note={e.note} nombre={t('fiche.avis.nombre', { count: avis.length })} repartition={repartition} onDonner={() => setDonner(true)} />
          <EnteteListeAvis
            titre={t('fiche.avis.titre', { n: liste.length })}
            tri={
              <MenuTri<Tri>
                valeur={tri}
                onChange={setTri}
                options={(['recents', 'mieuxNotes', 'utiles'] as const).map((v) => ({ valeur: v, libelle: t(`fiche.avis.tris.${v}`) }))}
              />
            }
          />
          {liste.map((a) => (
            <LigneAvis key={a.id} a={a} ecole={e.sigle || e.nom} peutRepondre={account?.ecoleId === e.id} />
          ))}
          {liste.length === 0 && <p className="text-sm text-muted-foreground">{t('fiche.avis.aucunProfil')}</p>}
        </>
      )}
      <ModaleAvis genre="etablissement" id={e.id} nom={e.nom} open={donner} onClose={() => setDonner(false)} />
    </Carte>
  )
}

/** Un avis d'établissement : « Avis utile » (compté dans la base) et, pour l'établissement, Répondre / Modifier / Retirer. */
function LigneAvis({ a, ecole, peutRepondre }: { a: Avis; ecole: string; peutRepondre: boolean }) {
  const { t } = useTranslation('schools')
  const [repondre, setRepondre] = useState(false)
  const [texte, setTexte] = useState(a.reponse?.texte ?? '')
  // « Utile » : le nombre est dans la base ; ce navigateur retient qu'il a déjà voté.
  const [utile, setUtile] = useState(() => load<string[]>('avis-utiles', []).includes(a.id))
  const voter = async () => {
    const votes = load<string[]>('avis-utiles', [])
    const suivant = !utile
    setUtile(suivant)
    save('avis-utiles', suivant ? [...votes, a.id] : votes.filter((x) => x !== a.id))
    await data.update('avisEtablissements', a.id, { utile: Math.max(0, a.utile + (suivant ? 1 : -1)) })
  }
  const publier = async () => {
    if (texte.trim().length < 2) return void toast.error(t('ecoleProfil.avis.reply.tooShort'))
    await data.update('avisEtablissements', a.id, { reponse: { texte: texte.trim(), le: dateDesDonnees() } })
    // L'auteur de l'avis est prévenu, s'il a un compte (une première réponse seulement).
    if (a.compteId && !a.reponse)
      await notifier(a.compteId, { type: 'review', titre: t('ecoleProfil.avis.reply.notification.titre'), texte: t('ecoleProfil.avis.reply.notification.texte', { school: ecole }), quand: t('ecoleProfil.avis.reply.notification.quand'), vers: window.location.pathname })
    setRepondre(false)
    toast.success(t('ecoleProfil.avis.reply.published'))
  }
  const retirer = async () => {
    await data.update('avisEtablissements', a.id, { reponse: undefined })
    setTexte('')
    toast.success(t('ecoleProfil.avis.reply.removed'))
  }
  const role = a.role in ROLES ? t(`ecoleProfil.avis.roles.${ROLES[a.role as keyof typeof ROLES]}`) : a.role
  return (
    <ArticleAvis
      avatar={a.avatar}
      nom={a.nom}
      meta={`${role} · ${a.date}`}
      note={a.note}
      texte={a.texte}
      actions={
        <>
          <ActionAvis actif={utile} aria-pressed={utile} onClick={() => void voter()}>
            <ThumbsUp className="size-4" fill={utile ? 'currentColor' : 'none'} aria-hidden />
            {t('fiche.avis.utile')}
            {a.utile > 0 && ` (${a.utile})`}
          </ActionAvis>
          {peutRepondre && !repondre && (
            <>
              <ActionAvis onClick={() => setRepondre(true)}>{a.reponse ? t('ecoleProfil.avis.reply.edit') : t('ecoleProfil.avis.reply.reply')}</ActionAvis>
              {a.reponse && (
                <ActionAvis actif ton="destructive" onClick={() => void retirer()}>
                  {t('ecoleProfil.avis.reply.remove')}
                </ActionAvis>
              )}
            </>
          )}
        </>
      }
    >
      {a.reponse && !repondre && <ReponseAvis titre={t('ecoleProfil.avis.reply.from')} date={a.reponse.le} texte={a.reponse.texte} />}
      {repondre && (
        <div className="mt-1 flex flex-col gap-2">
          <Textarea value={texte} onChange={(ev) => setTexte(ev.target.value)} rows={3} aria-label={t('ecoleProfil.avis.reply.label')} placeholder={t('ecoleProfil.avis.reply.placeholder')} className="min-h-[88px]" />
          <div className="flex gap-2">
            <Button size="md" onClick={() => void publier()}>
              {t('ecoleProfil.avis.reply.publish')}
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={() => {
                setRepondre(false)
                setTexte(a.reponse?.texte ?? '')
              }}
            >
              {t('ecoleProfil.avis.reply.cancel')}
            </Button>
          </div>
        </div>
      )}
    </ArticleAvis>
  )
}
