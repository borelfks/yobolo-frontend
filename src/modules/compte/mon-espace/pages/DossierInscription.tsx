import { useState } from 'react'
import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CalendarDays, Car, ExternalLink, Star, UserRound, XCircle } from 'lucide-react'
import { useAutoEcoles, useMesInscriptions, usePermisCatalogue } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { annulerInscription } from '@/modules/compte/mon-espace/espaceActions'
import { ConfirmerAnnulation, StatutDossier } from '@/modules/compte/mon-espace/components/Dossiers'
import { ChampsDossier, DossierIntrouvable, PiecesDossier } from '@/modules/compte/mon-espace/components/DetailDossier'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Img } from '@/shared/ui/Img'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { formaterDate } from '@/shared/utils/dates'


/** Le détail d'une inscription à un permis : auto-école, session, champs saisis, pièces jointes. */
export function DossierInscription() {
  const { t } = useTranslation('espace')
  const { id } = useParams({ strict: false })
  const { account } = useSession()
  const i = useMesInscriptions(account?.id).inscriptionsAutoEcole.find((x) => x.id === id)
  const a = useAutoEcoles().find((x) => x.id === i?.autoEcoleId)
  const catalogue = usePermisCatalogue()
  const permis = i ? catalogue[i.permis] : undefined
  const [annuler, setAnnuler] = useState(false)
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  const retour = ROUTES.espace('auto-ecole')

  const confirmer = async () => {
    setAnnuler(false)
    if (!i) return
    try {
      await annulerInscription(i)
      toast.success(t('dossiers.annulation.faite'))
    } catch {
      toast.error(t('dossiers.annulation.echec'))
    }
  }

  const d = i?.donnees
  const pieces = Object.entries(d?.fichiers ?? {}).map(([cle, fichierId]) => ({ cle, nom: cle, fichierId }))

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 px-5 py-4">
      <Breadcrumb items={[{ label: t('crumbs.espace'), to: ROUTES.espace() }, { label: t('crumbs.permis'), to: retour }, { label: i ? t('dossiers.detailPermis', { code: i.permis }) : t('dossiers.introuvable') }]} className="-mt-1" />
      {!i || !d ? (
        <DossierIntrouvable retour={retour} />
      ) : (
        <>
          <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            {permis && <Img src={permis.image} alt="" className="h-24 w-full shrink-0 rounded-xl sm:w-40" />}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-titre-sm font-bold text-navy-900">{t('dossiers.detailPermis', { code: i.permis })}</h1>
                <StatutDossier statut={i.statut} />
              </div>
              <p className="flex items-center gap-1.5 text-[15px] text-navy-900">
                <Car className="size-4 text-brand-600" aria-hidden="true" />
                {a?.nom ?? '—'}
              </p>
              <p className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {i.statut === 'Annulée' && i.annuleeLe ? t('dossiers.annuleeLe', { date: formaterDate(i.annuleeLe, 'longue') }) : t('dossiers.envoyeeLe', { date: formaterDate(i.envoyeeLe, 'longue') })}
                </span>
                {d.session && <span>{t('dossiers.session', { date: d.session })}</span>}
                {permis && (
                  <span>
                    {t('dossiers.prix')} : <b className="text-navy-900">{fcfa(permis.prix)}</b>
                  </span>
                )}
              </p>
            </div>
          </Card>
          <div className="flex flex-wrap gap-2">
            <Button to={ROUTES.drivingSchool(i.autoEcoleId)} variant="outline" size="sm">
              <ExternalLink aria-hidden="true" />
              {t('dossiers.voirAutoEcole')}
            </Button>
            <Button to={ROUTES.drivingSchoolReview(i.autoEcoleId)} variant="outline" size="sm">
              <Star aria-hidden="true" />
              {t('dossiers.donnerAvis')}
            </Button>
            {i.statut === 'Envoyée' && (
              <Button variant="danger-outline" size="sm" onClick={() => setAnnuler(true)}>
                <XCircle aria-hidden="true" />
                {t('dossiers.annuler')}
              </Button>
            )}
          </div>
          <ChampsDossier
            titre={t('dossiers.candidat')}
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
          <ConfirmerAnnulation open={annuler} onClose={() => setAnnuler(false)} onConfirm={() => void confirmer()} />
        </>
      )}
    </div>
  )
}
