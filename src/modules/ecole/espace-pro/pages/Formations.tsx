import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { GraduationCap, Search } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { formationUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { data, newId } from '@/data'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { EmptyState } from '@/shared/blocs/Etats'
import { ListeDeroulante } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { Lien } from '@/shared/ui/Lien'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import type { FormationPro, StatutPublication } from '@/shared/types'
import { BandeauChiffres, CartePro, EntetePro, SquelettePro, type ActionMenu } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { ListeFormations, PaginationFormations } from '@/modules/ecole/espace-pro/components/formations/ListeFormations'
import { useFormationsEcole } from '@/modules/ecole/espace-pro/hooks/useFormationsEcole'
import { PREFIXE_FORMATION_CREEE } from '@/modules/ecole/espace-pro/proData'
import { formaterDate } from '@/shared/utils/dates'

const PAR_PAGE = 10
const STATUTS = ['toutes', 'Publiée', 'Brouillon'] as const
type FiltreStatut = (typeof STATUTS)[number]
const TRIS = ['recent', 'nom', 'rentree'] as const
type Tri = (typeof TRIS)[number]
const CLES_STATUTS = { toutes: 'toutes', Publiée: 'publiees', Brouillon: 'brouillons' } as const

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/** 4.1 Gérer les formations : chiffres (qui filtrent), recherche, filière, tri, statut, tableau paginé. */
export function Formations() {
  const { t } = useTranslation('pro', { keyPrefix: 'formations' })
  return (
    <div className="flex flex-col gap-2">
      <EntetePro
        miettes={[{ label: t('miette') }]}
        titre={t('titre')}
        sousTitre={t('sousTitre')}
        actions={
          <Button asChild>
            <Lien to={ROUTES.pro.newTraining}>{t('creer')}</Lien>
          </Button>
        }
      />
      <ChargementDonnees fallback={<SquelettePro cartes={1} entete={false} />}>
        <GererFormations />
      </ChargementDonnees>
    </div>
  )
}

function GererFormations() {
  const { t } = useTranslation('pro', { keyPrefix: 'formations' })
  const { t: tp } = useTranslation('pro')
  const navigate = useNavigate()
  const { ecole } = useMonEcole()
  const { lignes, enTable, fiche } = useFormationsEcole()
  const [q, setQ] = useState('')
  const [filiere, setFiliere] = useState('toutes')
  const [statut, setStatut] = useState<FiltreStatut>('toutes')
  const [tri, setTri] = useState<Tri>('recent')
  const [page, setPage] = useState(1)

  const nb = (s: FiltreStatut) => (s === 'toutes' ? lignes.length : lignes.filter((f) => f.statut === s).length)
  const filieres = [...new Set(lignes.map((f) => f.filiere).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  const recherche = q.trim().toLowerCase()
  const dateRentree = (f: FormationPro) => f.dateLimite ?? (f.rentree && f.rentree !== '—' ? f.rentree : '~')
  const filtrees = lignes
    .filter((f) => (statut === 'toutes' || f.statut === statut) && (filiere === 'toutes' || f.filiere === filiere) && (!recherche || `${f.nom} ${f.code} ${f.filiere}`.toLowerCase().includes(recherche)))
    .toSorted((a, b) => (tri === 'nom' ? a.nom.localeCompare(b.nom) : tri === 'rentree' ? dateRentree(a).localeCompare(dateRentree(b)) : 0))
  const pages = Math.max(1, Math.ceil(filtrees.length / PAR_PAGE))
  const courante = Math.min(page, pages)
  const visibles = filtrees.slice((courante - 1) * PAR_PAGE, courante * PAR_PAGE)
  const choisirStatut = (s: FiltreStatut) => (setStatut(s), setPage(1))
  const reinitialiser = () => (setQ(''), setFiliere('toutes'), setStatut('toutes'), setPage(1))

  // « 24 mois » (valeur des données) → durée traduite ; toute autre valeur reste telle quelle.
  const duree = (d: string) => {
    const m = /^(\d+) mois$/.exec(d)
    return m ? tp('commun.duree', { count: Number(m[1]) }) : d
  }
  const rentree = (f: FormationPro) => (f.dateLimite ? formaterDate(f.dateLimite, 'abregee') : f.rentree || '—')

  // Une ligne vient du tableau (formationsPro), d'une fiche (formations), ou des deux : on met à jour ce qui existe.
  const changerStatut = async (f: FormationPro, s: StatutPublication) => {
    if (enTable(f.id)) await data.update('formationsPro', f.id, { statut: s })
    const source = fiche(f.id)
    // Publiée pour la première fois : elle prend place dans le fil de l'accueil à cette date.
    if (source) await data.update('formations', f.id, s === 'Publiée' && !source.publieeLe ? { statut: s, publieeLe: maintenant() } : { statut: s })
    toast.success(t(s === 'Brouillon' ? 'menu.depubliee' : 'menu.publiee', { name: f.nom }))
  }
  const dupliquer = async (f: FormationPro) => {
    const id = newId(PREFIXE_FORMATION_CREEE)
    const nom = t('menu.copie', { name: f.nom })
    const source = fiche(f.id)
    if (source) await data.create('formations', { ...source, id, nom, etablissementId: ecole.id, statut: 'Brouillon', publieeLe: undefined })
    await data.create('formationsPro', { ...f, id, nom, etablissementId: ecole.id, statut: 'Brouillon' })
    toast.success(t('menu.dupliquee', { name: nom }))
  }
  const supprimer = async (f: FormationPro) => {
    if (enTable(f.id)) await data.remove('formationsPro', f.id)
    if (fiche(f.id)) await data.remove('formations', f.id)
    // Elle quitte aussi les favoris.
    if ((await data.list('favoris')).some((x) => x.id === f.id)) await data.remove('favoris', f.id)
    toast.success(t('menu.supprimee', { name: f.nom }))
  }
  const actions = (f: FormationPro): ActionMenu[] => {
    const source = fiche(f.id)
    return [
      { label: t('menu.voir'), masque: !source || source.statut !== 'Publiée', onSelect: () => source && void navigate({ href: formationUrl(source) }) },
      { label: t('menu.dupliquer'), onSelect: () => void dupliquer(f) },
      f.statut === 'Brouillon' ? { label: t('menu.publier'), onSelect: () => void changerStatut(f, 'Publiée') } : { label: t('menu.depublier'), onSelect: () => void changerStatut(f, 'Brouillon') },
      { label: t('menu.supprimer'), danger: true, onSelect: () => void supprimer(f) },
    ]
  }

  if (lignes.length === 0)
    return (
      <EmptyState
        icone={GraduationCap}
        titre={t('vide.titre')}
        texte={t('vide.texte')}
        className="max-lg:rounded-none max-lg:border-x-0"
        action={
          <Button asChild>
            <Lien to={ROUTES.pro.newTraining}>{t('creer')}</Lien>
          </Button>
        }
      />
    )

  return (
    <CartePro>
      <BandeauChiffres
        colonnes={3}
        colonnesMobile={3}
        chiffres={(['toutes', 'Publiée', 'Brouillon'] as const).map((s) => ({ nom: t(`chiffres.${CLES_STATUTS[s]}`), valeur: num(nb(s)), actif: statut === s, onClick: () => choisirStatut(s) }))}
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative flex-[1_1_260px]">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} placeholder={t('recherche')} aria-label={t('rechercheAria')} className="pl-10" />
        </label>
        <div className="max-lg:flex-[1_1_100%] lg:w-[215px]">
          <ListeDeroulante ariaLabel={t('filiere')} valeur={filiere} onChange={(v) => (setFiliere(v), setPage(1))} options={[{ value: 'toutes', label: t('filiereToutes') }, ...filieres.map((f) => ({ value: f, label: t('filiereValeur', { filiere: f }) }))]} />
        </div>
        <div className="max-lg:flex-[1_1_100%] lg:w-[240px]">
          <ListeDeroulante ariaLabel={t('trier')} valeur={tri} onChange={(v) => setTri(TRIS.find((x) => x === v) ?? 'recent')} options={TRIS.map((x) => ({ value: x, label: t(`tris.${x}`) }))} />
        </div>
      </div>
      <ToggleGroup type="single" variant="outline" size="lg" value={statut} onValueChange={(v) => v && choisirStatut(STATUTS.find((s) => s === v) ?? 'toutes')} aria-label={t('statutAria')} className="flex-wrap">
        {STATUTS.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {t(`statuts.${CLES_STATUTS[s]}`, { n: nb(s) })}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {filtrees.length === 0 ? (
        <div className="flex flex-col items-center gap-2 border-t border-border px-4 py-8 text-center">
          <b className="text-base text-foreground">{t('aucune')}</b>
          <Button variant="secondary" size="md" onClick={reinitialiser}>
            {t('reinitialiser')}
          </Button>
        </div>
      ) : (
        <ListeFormations lignes={visibles} duree={duree} rentree={rentree} actions={actions} />
      )}
      <PaginationFormations total={filtrees.length} parPage={PAR_PAGE} page={courante} onPage={setPage} />
    </CartePro>
  )
}
