import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Building2, CalendarDays, GraduationCap, Inbox, School, UserRound } from 'lucide-react'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { ContactCandidat, DecisionDossier } from '@/features/pro/components/DecisionDossier'
import { DossierEnTete, DossierIntrouvablePro } from '@/features/pro/components/DossierEnTete'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useDossiersPreinscription, useFormations } from '@/data/hooks'
import { ChampsDossier, PiecesDossier } from '@/shared/components/ui/DetailDossier'
import { FilDossier } from '@/shared/components/ui/FilDossier'
import { CLE_STATUT, deciderDossier, type DecisionDossier as Decision } from '@/shared/utils/dossiers'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Le détail d'une préinscription reçue : le candidat, son parcours, ses pièces, le suivi et la décision. */
export function PreinscriptionRecue() {
  const { t } = useTranslation('pro')
  const { id } = useParams()
  const { ecole } = useMonEcole()
  const p = useDossiersPreinscription(ecole.id).find((x) => x.id === id)
  const f = useFormations().find((x) => x.id === p?.formationId)
  const crumbs = [{ label: t('dossiers.preinscriptions.crumb'), to: ROUTES.pro.preRegistrations }, { label: t('dossiers.detail.crumb') }]
  if (!p) {
    return (
      <div className="space-y-3.5">
        <ProHeader crumbs={crumbs} icon={<Inbox />} title={t('dossiers.detail.title')} subtitle={t('dossiers.preinscriptions.subtitle')} actions={<span />} />
        <DossierIntrouvablePro retour={ROUTES.pro.preRegistrations} />
      </div>
    )
  }
  const d = p.donnees
  const candidat = `${(d.nom ?? '').toUpperCase()} ${d.prenom ?? ''}`.trim() || t('dossiers.anonyme')
  const champ = (cle: string, label: string) => ({ label, valeur: d[cle] })
  // Pièces : « piece_<clé> » (nom du fichier) et « fichier_<clé> » (identifiant dans la table `fichiers`).
  const pieces = Object.entries(d)
    .filter(([k]) => k.startsWith('piece_'))
    .map(([k, nom]) => ({ cle: k, nom, fichierId: d[`fichier_${k.slice('piece_'.length)}`] }))
  const decider = (decision: Decision, texte: string) =>
    deciderDossier({ genre: 'preinscription', dossier: p }, decision, texte, {
      titre: t(`dossiers.notification.titres.${CLE_STATUT[decision] as 'enEtude' | 'complement' | 'acceptee' | 'refusee'}`),
      texte: t('dossiers.notification.texte', { school: ecole.sigle || ecole.nom, objet: f?.nom ?? '' }),
      quand: t('dossiers.notification.quand'),
      vers: ROUTES.espacePreinscription(p.id),
    })
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={crumbs} icon={<Inbox />} title={t('dossiers.detail.title')} subtitle={t('dossiers.preinscriptions.subtitle')} actions={<span />} />
      <DossierEnTete
        image={f?.image}
        candidat={candidat}
        statut={p.statut}
        lignes={[
          { icone: <GraduationCap />, texte: f?.nom ?? '—' },
          { icone: <Building2 />, texte: f ? t('dossiers.detail.frais', { prix: fcfa(f.fraisAn) }) : '' },
          { icone: <CalendarDays />, date: p.envoyeeLe },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          <FilDossier echanges={p.echanges ?? []} vue="etablissement" />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChampsDossier
              titre={t('dossiers.detail.candidat')}
              icone={<UserRound />}
              champs={[
                champ('nom', t('dossiers.champs.nom')),
                champ('prenom', t('dossiers.champs.prenom')),
                champ('sexe', t('dossiers.champs.sexe')),
                champ('naissance', t('dossiers.champs.naissance')),
                champ('nationalite', t('dossiers.champs.nationalite')),
                champ('telephone', t('dossiers.champs.telephone')),
                champ('email', t('dossiers.champs.email')),
              ]}
            />
            <ChampsDossier
              titre={t('dossiers.detail.parcours')}
              icone={<School />}
              champs={[champ('diplome', t('dossiers.champs.diplome')), champ('serie', t('dossiers.champs.serie')), champ('annee', t('dossiers.champs.annee')), champ('etablissementOrigine', t('dossiers.champs.etablissementOrigine'))]}
            />
          </div>
          <PiecesDossier pieces={pieces} />
        </div>
        <div className="space-y-4">
          <DecisionDossier statut={p.statut} onDecider={decider} />
          <ContactCandidat telephone={d.telephone} email={d.email} />
        </div>
      </div>
    </div>
  )
}
