import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Car, Coins, Inbox, UserRound } from 'lucide-react'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { ContactCandidat, DecisionDossier } from '@/features/pro/components/DecisionDossier'
import { DossierEnTete, DossierIntrouvablePro } from '@/features/pro/components/DossierEnTete'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useInscriptionsRecues, usePermisDe } from '@/data/hooks'
import { piecesAE } from '@/features/driving-schools/autoEcoleRules'
import { ChampsDossier, PiecesDossier } from '@/shared/components/ui/DetailDossier'
import { FilDossier } from '@/shared/components/ui/FilDossier'
import { CLE_STATUT, deciderDossier, type DecisionDossier as Decision } from '@/shared/utils/dossiers'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Le détail d'une inscription reçue : l'élève, le permis et la session, ses pièces, le suivi et la décision. */
export function InscriptionRecue() {
  const { t } = useTranslation('pro')
  const { t: tae } = useTranslation('driving-schools', { keyPrefix: 'enrollment' })
  const { id } = useParams()
  const { ecole } = useMonEcole()
  const i = useInscriptionsRecues(ecole.id).find((x) => x.id === id)
  const catalogue = usePermisDe(ecole.id)
  const crumbs = [{ label: t('dossiers.inscriptions.crumb'), to: ROUTES.pro.enrollments }, { label: t('dossiers.detail.crumb') }]
  if (!i) {
    return (
      <div className="space-y-3.5">
        <ProHeader crumbs={crumbs} icon={<Inbox />} title={t('dossiers.detail.title')} subtitle={t('dossiers.inscriptions.subtitle')} actions={<span />} />
        <DossierIntrouvablePro retour={ROUTES.pro.enrollments} />
      </div>
    )
  }
  const d = i.donnees
  const permis = catalogue[i.permis]
  const objet = t('autoEcole.permis', { code: i.permis })
  const candidat = `${(d.nom ?? '').toUpperCase()} ${d.prenom ?? ''}`.trim() || t('dossiers.anonyme')
  // Les pièces demandées (img67) : celles que l'élève a jointes.
  const pieces = piecesAE.filter((p) => d.fichiers?.[p.key] || d.pieces[p.key]).map((p) => ({ cle: p.key, nom: tae(`pieces.${p.key}.label`), fichierId: d.fichiers?.[p.key] }))
  const decider = (decision: Decision, texte: string) =>
    deciderDossier({ genre: 'inscription', dossier: i }, decision, texte, {
      titre: t(`dossiers.notification.titres.${CLE_STATUT[decision] as 'enEtude' | 'complement' | 'acceptee' | 'refusee'}`),
      texte: t('dossiers.notification.texte', { school: ecole.nom, objet }),
      quand: t('dossiers.notification.quand'),
      vers: ROUTES.espaceInscription(i.id),
    })
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={crumbs} icon={<Inbox />} title={t('dossiers.detail.title')} subtitle={t('dossiers.inscriptions.subtitle')} actions={<span />} />
      <DossierEnTete
        image={permis?.image}
        candidat={candidat}
        statut={i.statut}
        lignes={[
          { icone: <Car />, texte: objet },
          { icone: <Coins />, texte: permis ? t('dossiers.detail.prix', { prix: fcfa(permis.prix) }) : '' },
          { icone: <CalendarDays />, texte: d.session ? t('dossiers.detail.session', { date: d.session }) : '' },
          { icone: <CalendarDays />, date: i.envoyeeLe },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          <FilDossier echanges={i.echanges ?? []} vue="etablissement" />
          <ChampsDossier
            titre={t('dossiers.detail.candidat')}
            icone={<UserRound />}
            champs={[
              { label: t('dossiers.champs.nom'), valeur: d.nom },
              { label: t('dossiers.champs.prenom'), valeur: d.prenom },
              { label: t('dossiers.champs.sexe'), valeur: d.sexe },
              { label: t('dossiers.champs.naissance'), valeur: d.naissance },
              { label: t('dossiers.champs.telephone'), valeur: d.telephone },
              { label: t('dossiers.champs.email'), valeur: d.email },
              { label: t('dossiers.champs.ville'), valeur: d.ville },
              { label: t('dossiers.champs.quartier'), valeur: d.quartier },
            ]}
          />
          <PiecesDossier pieces={pieces} />
        </div>
        <div className="space-y-4">
          <DecisionDossier statut={i.statut} onDecider={decider} />
          <ContactCandidat telephone={d.telephone} email={d.email} />
        </div>
      </div>
    </div>
  )
}
