import { useState } from 'react'
import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Building2, CalendarDays, ExternalLink, GraduationCap, School, Star, UserRound, XCircle } from 'lucide-react'
import { useEtablissements, useFormations, useMesInscriptions } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ecoleUrl, formationUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'
import { annulerPreinscription } from '@/modules/compte/mon-espace/espaceActions'
import { ConfirmerAnnulation, StatutDossier } from '@/modules/compte/mon-espace/components/Dossiers'
import { ChampsDossier, DossierIntrouvable, PiecesDossier } from '@/modules/compte/mon-espace/components/DetailDossier'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Img } from '@/shared/ui/Img'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const DATE = { day: '2-digit', month: 'long', year: 'numeric' } as const
const aujourdhui = () => shortDate(new Date(), { day: '2-digit', month: 'short', year: 'numeric' })

/** Le détail d'une préinscription envoyée : formation, établissement, champs saisis, pièces jointes. */
export function DossierPreinscription() {
  const { t } = useTranslation('espace')
  const { id } = useParams({ strict: false })
  const { account } = useSession()
  const p = useMesInscriptions(account?.id).preinscriptions.find((x) => x.id === id)
  const f = useFormations().find((x) => x.id === p?.formationId)
  const e = useEtablissements().find((x) => x.id === p?.etablissementId)
  const [annuler, setAnnuler] = useState(false)
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  const retour = ROUTES.espace('preinscriptions')
  const titre = t('dossiers.detailPreinscription')

  const confirmer = async () => {
    setAnnuler(false)
    if (!p) return
    try {
      await annulerPreinscription(p, {
        titre: t('dossiers.annulation.notificationTitre'),
        texte: t('dossiers.annulation.notificationTexte', { name: account.name, training: f?.nom ?? '' }),
        date: aujourdhui(),
      })
      toast.success(t('dossiers.annulation.faite'))
    } catch {
      toast.error(t('dossiers.annulation.echec'))
    }
  }

  const d = p?.donnees ?? {}
  const champ = (cle: keyof typeof labels) => ({ label: labels[cle], valeur: d[cle] })
  const labels = {
    nom: t('dossiers.champs.nom'),
    prenom: t('dossiers.champs.prenom'),
    sexe: t('dossiers.champs.sexe'),
    naissance: t('dossiers.champs.naissance'),
    nationalite: t('dossiers.champs.nationalite'),
    telephone: t('dossiers.champs.telephone'),
    email: t('dossiers.champs.email'),
    diplome: t('dossiers.champs.diplome'),
    serie: t('dossiers.champs.serie'),
    annee: t('dossiers.champs.annee'),
    etablissementOrigine: t('dossiers.champs.etablissementOrigine'),
  }
  // Pièces : « piece_<clé> » (nom du fichier) et « fichier_<clé> » (identifiant dans la table `fichiers`).
  const pieces = Object.entries(d)
    .filter(([k]) => k.startsWith('piece_'))
    .map(([k, nom]) => ({ cle: k, nom, fichierId: d[`fichier_${k.slice('piece_'.length)}`] }))

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 px-5 py-4">
      <Breadcrumb items={[{ label: t('crumbs.espace'), to: ROUTES.espace() }, { label: t('crumbs.preinscriptions'), to: retour }, { label: titre }]} className="-mt-1" />
      {!p ? (
        <DossierIntrouvable retour={retour} />
      ) : (
        <>
          <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            {f && <Img src={f.image} alt="" className="h-24 w-full shrink-0 rounded-xl sm:w-40" />}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[22px] font-bold text-navy-900">{f?.nom ?? titre}</h1>
                <StatutDossier statut={p.statut} />
              </div>
              <p className="flex items-center gap-1.5 text-[15px] text-navy-900">
                <Building2 className="size-4 text-brand-600" aria-hidden="true" />
                {e?.nom ?? '—'}
              </p>
              <p className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {p.statut === 'Annulée' && p.annuleeLe ? t('dossiers.annuleeLe', { date: shortDate(p.annuleeLe, DATE) }) : t('dossiers.envoyeeLe', { date: shortDate(p.envoyeeLe, DATE) })}
                </span>
              </p>
            </div>
          </Card>
          <div className="flex flex-wrap gap-2">
            {f && (
              <Button to={formationUrl(f)} variant="outline" size="sm">
                <GraduationCap aria-hidden="true" />
                {t('dossiers.voirFormation')}
              </Button>
            )}
            {e && (
              <Button to={ecoleUrl(e)} variant="outline" size="sm">
                <ExternalLink aria-hidden="true" />
                {t('dossiers.voirEtablissement')}
              </Button>
            )}
            {e && slugOfType(e.type) !== 'auto-ecoles' && (
              <Button to={ROUTES.schoolReview(slugOfType(e.type), e.id)} variant="outline" size="sm">
                <Star aria-hidden="true" />
                {t('dossiers.donnerAvis')}
              </Button>
            )}
            {p.statut === 'Envoyée' && (
              <Button variant="danger-outline" size="sm" onClick={() => setAnnuler(true)}>
                <XCircle aria-hidden="true" />
                {t('dossiers.annuler')}
              </Button>
            )}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChampsDossier titre={t('dossiers.candidat')} icone={<UserRound />} champs={[champ('nom'), champ('prenom'), champ('sexe'), champ('naissance'), champ('nationalite'), champ('telephone'), champ('email')]} />
            <ChampsDossier titre={t('dossiers.parcours')} icone={<School />} champs={[champ('diplome'), champ('serie'), champ('annee'), champ('etablissementOrigine')]} />
          </div>
          <PiecesDossier pieces={pieces} />
          <ConfirmerAnnulation open={annuler} onClose={() => setAnnuler(false)} onConfirm={() => void confirmer()} />
        </>
      )}
    </div>
  )
}
