import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useDomainesExpertise, useEnregistrements } from '@/data/hooks'
import { basculerDans } from '@/modules/communaute/accueil/accueilFil'
import { Carte, PhotoRonde } from '@/modules/communaute/accueil/components/Carte'
import { usePublicationsDuFil } from '@/modules/communaute/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { useMoi } from '@/modules/communaute/accueil/hooks/useMoi'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Une ligne de raccourci : un libellé et son chiffre en bleu (12 px, demi-gras). */
function LigneRaccourci({ vers, onClick, actif, children, chiffre }: { vers?: string; onClick?: () => void; actif?: boolean; children: ReactNode; chiffre: ReactNode }) {
  const classes = cn('h-auto w-full justify-between rounded-none px-3 py-2 text-xs font-semibold text-muted-foreground', actif && 'bg-primary-soft')
  const contenu = (
    <>
      <span className="truncate">{children}</span>
      <b className="text-primary">{chiffre}</b>
    </>
  )
  if (vers)
    return (
      <Button asChild variant="ghost" className={classes}>
        <Lien to={vers}>{contenu}</Lien>
      </Button>
    )
  return (
    <Button variant="ghost" className={classes} onClick={onClick} aria-pressed={actif}>
      {contenu}
    </Button>
  )
}

/**
 * La carte du compte (colonne de gauche) : bandeau bleu, photo, nom et rôle
 * (qui mènent au profil), puis les raccourcis : « Publications enregistrées »
 * filtre le fil ; « Mes favoris » et « Notifications non lues » (personne
 * physique), « Mon espace professionnel » (école).
 */
export function CarteMoi() {
  const { t } = useTranslation('accueil')
  const moi = useMoi()
  const { filtres, changer } = useFiltresDuFil()
  if (!moi) return null
  return (
    <Carte className="overflow-hidden">
      <div className="h-14 bg-linear-[120deg] from-primary to-foreground" />
      <Lien to={moi.profil} className="-mt-9 flex flex-col items-center gap-1 px-3 pb-3.5 text-center text-foreground no-underline">
        <PhotoRonde src={moi.photo} nom={moi.nom} className={cn('size-[72px] border-2 border-card bg-card', moi.estEcole && 'rounded-xl')} />
        <b className="mt-2 text-base">{moi.nom}</b>
        <span className="text-xs text-muted-foreground">{moi.role}</span>
      </Lien>
      <div className="border-t border-border py-1.5">
        <LigneRaccourci onClick={() => changer({ enregistrees: !filtres.enregistrees })} actif={filtres.enregistrees} chiffre={moi.nbEnregistrees}>
          {t('moi.enregistrees')}
        </LigneRaccourci>
        {moi.estEcole ? (
          <LigneRaccourci vers={ROUTES.pro.root} chiffre="→">
            {t('moi.espacePro')}
          </LigneRaccourci>
        ) : (
          <>
            <LigneRaccourci vers={ROUTES.favorites} chiffre={moi.nbFavoris}>
              {t('moi.favoris')}
            </LigneRaccourci>
            <LigneRaccourci vers={ROUTES.notifications} chiffre={moi.nbNonLues}>
              {t('moi.nonLues')}
            </LigneRaccourci>
          </>
        )}
      </div>
    </Carte>
  )
}

/**
 * « Mes domaines » : les domaines des publications enregistrées, avec le
 * nombre de publications de chacun ; un clic filtre le fil (un second l'annule).
 */
export function MesDomaines() {
  const { t } = useTranslation('accueil')
  const moi = useMoi()
  const domaines = useDomainesExpertise()
  const { publications } = usePublicationsDuFil()
  const enregistrees = useEnregistrements(moi?.id)
  const { filtres, changer } = useFiltresDuFil()
  const ids = [...new Set(publications.filter((p) => enregistrees.some((e) => e.publicationId === p.id)).flatMap((p) => p.domaines))]
  const mesDomaines = ids.map((id) => domaines.find((d) => d.id === id)).filter((d) => d !== undefined)
  if (mesDomaines.length === 0) return null
  return (
    <Carte className="pt-3 pb-1.5">
      <p className="px-3 pb-1.5 text-xs font-bold text-foreground">{t('moi.mesDomaines')}</p>
      {mesDomaines.map((d) => (
        <LigneRaccourci
          key={d.id}
          actif={filtres.domaines.includes(d.id)}
          onClick={() => changer({ domaines: basculerDans(filtres.domaines, d.id) })}
          chiffre={publications.filter((p) => p.domaines.includes(d.id)).length}
        >
          # {d.nom}
        </LigneRaccourci>
      ))}
    </Carte>
  )
}
