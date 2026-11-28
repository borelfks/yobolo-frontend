import { useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleAlert, Eye, FileText, Upload, type LucideIcon } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { Checkbox } from '@/shared/shadcn/checkbox'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/select'
import { cn } from '@/shared/utils/cn'
import { forceDuMotDePasse, NIVEAUX_FORCE } from '@/shared/utils/motDePasse'

/**
 * Un champ de formulaire du canevas : libellé (14 px, gras), astérisque rouge
 * si `requis`, « (facultatif) » si `facultatif`, le champ, puis l'aide (12 px)
 * ou le message d'erreur en rouge. `id` : celui du champ (relié au libellé).
 */
export function Champ({
  id,
  label,
  requis,
  facultatif,
  aide,
  erreur,
  action,
  className,
  children,
}: {
  id: string
  label: ReactNode
  requis?: boolean
  facultatif?: boolean
  aide?: ReactNode
  erreur?: string
  /** Un lien posé à droite du libellé (« Mot de passe oublié ? »). */
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="inline">
          {label}
          {requis && <span className="ml-1 text-destructive">*</span>}
          {facultatif && <span className="ml-1 font-medium text-muted-foreground">{t('formulaire.facultatif')}</span>}
        </Label>
        {action}
      </span>
      {children}
      {erreur ? (
        <p id={`${id}-erreur`} className="text-xs font-semibold text-destructive">
          {erreur}
        </p>
      ) : (
        aide && <p className="text-xs font-medium text-muted-foreground">{aide}</p>
      )}
    </div>
  )
}

/** Le champ du canevas, en 48 px (écrans de connexion et d'inscription). */
export function ChampTexte({ className, ...props }: ComponentProps<typeof Input>) {
  return <Input className={cn('h-12', className)} {...props} />
}

/** Un numéro de téléphone camerounais : « +237 » devant, puis le numéro. */
export function ChampTelephone({ className, ...props }: Omit<ComponentProps<typeof Input>, 'type'>) {
  return (
    <div className="flex gap-2">
      <span className="grid h-12 shrink-0 place-items-center rounded-sm border border-input bg-muted px-3.5 text-ui font-bold text-foreground">+237</span>
      <Input type="tel" inputMode="tel" placeholder="690 12 34 56" className={cn('h-12', className)} {...props} />
    </div>
  )
}

/** Mot de passe avec « Afficher » / « Masquer » posé dans le champ (connexion du canevas). */
export function ChampMotDePasse({ className, ...props }: Omit<ComponentProps<typeof Input>, 'type'>) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('h-12 pr-24', className)} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? t('formulaire.motDePasse.masquerAria') : t('formulaire.motDePasse.afficherAria')}
        className="absolute top-2 right-2 px-2.5 text-primary hover:bg-primary-soft hover:text-primary"
      >
        {visible ? t('formulaire.motDePasse.masquer') : t('formulaire.motDePasse.afficher')}
      </Button>
    </div>
  )
}

const COULEURS_FORCE = ['bg-destructive', 'bg-warning', 'bg-success-bright', 'bg-success-bright'] as const

/** La solidité du mot de passe : quatre barres de 5 px et « 8 caractères minimum · Bon mot de passe ». */
export function JaugeMotDePasse({ motDePasse, aide }: { motDePasse: string; aide: string }) {
  const { t } = useTranslation()
  const force = forceDuMotDePasse(motDePasse)
  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <span className="mt-0.5 grid grid-cols-4 gap-1" aria-hidden>
        {NIVEAUX_FORCE.map((niveau, rang) => (
          <i key={niveau} className={cn('h-[5px] rounded-full', rang < force ? COULEURS_FORCE[force - 1] : 'bg-track')} />
        ))}
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        {aide}
        {force > 0 && <> · {t(`formulaire.motDePasse.jauge.${NIVEAUX_FORCE[force - 1] ?? 'faible'}`)}</>}
      </span>
    </div>
  )
}

/** Une case à cocher et son libellé (14 px, demi-gras). */
export function CaseACocher({ label, className, ...props }: ComponentProps<typeof Checkbox> & { label: ReactNode }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-foreground', className)}>
      <Checkbox {...props} />
      {label}
    </label>
  )
}

const TONS = {
  info: 'border-primary-line bg-primary-soft text-primary-strong',
  succes: 'border-success-soft bg-success-soft text-success',
  erreur: 'border-destructive-line bg-destructive-soft text-destructive-hover',
} as const

/** Un encadré de message : information (bleu), réussite (vert) ou erreur (rouge, annoncée). */
export function Encadre({ ton, icone: Icone = CircleAlert, children, className }: { ton: keyof typeof TONS; icone?: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <div role={ton === 'erreur' ? 'alert' : undefined} className={cn('flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-sm leading-normal', TONS[ton], className)}>
      <Icone className="mt-px size-[18px] shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const COLONNES: Record<number, string> = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }

/**
 * Les étapes d'un parcours : une barre de 6 px par étape (bleue jusqu'à
 * l'étape en cours) et, si `noms` est donné, « 1. Profil » dessous.
 */
export function BarreEtapes({ nombre, courante, noms }: { nombre: number; courante: number; noms?: string[] }) {
  const { t } = useTranslation()
  return (
    <ol aria-label={t('formulaire.etapes.aria')} className={cn('grid', COLONNES[nombre] ?? 'grid-cols-4', noms ? 'gap-2' : 'gap-1.5')}>
      {Array.from({ length: nombre }, (_, k) => (
        <li key={k} aria-current={k === courante ? 'step' : undefined} className="flex flex-col gap-2">
          <span className={cn('block h-1.5 rounded-full', k <= courante ? 'bg-primary' : 'bg-track')} />
          {noms && (
            <span className={cn('text-xs font-bold', k === courante ? 'text-primary-strong' : k < courante ? 'text-foreground' : 'text-muted-foreground')}>
              {k + 1}. {noms[k]}
            </span>
          )}
          {!noms && <span className="sr-only">{t('formulaire.etapes.etape', { n: k + 1, total: nombre })}</span>}
        </li>
      ))}
    </ol>
  )
}

/**
 * Une liste déroulante (brique Select) à partir d'une liste d'options.
 * `grand` : 48 px, comme les champs des écrans de connexion et d'inscription.
 */
export function ListeDeroulante({
  id,
  valeur,
  onChange,
  options,
  placeholder,
  grand = false,
  invalide,
  disabled,
  ariaLabel,
}: {
  id?: string
  valeur: string
  onChange: (valeur: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  grand?: boolean
  invalide?: boolean
  disabled?: boolean
  ariaLabel?: string
}) {
  return (
    <Select value={valeur} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id} size={grand ? 'lg' : 'default'} aria-invalid={invalide || undefined} aria-label={ariaLabel} aria-describedby={invalide && id ? `${id}-erreur` : undefined}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-72">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * Une pièce à joindre (canevas : document d'un accord, certificat du NIU) :
 * icône, titre avec astérisque, formats acceptés ou nom du fichier choisi,
 * « Importer » (ou « Remplacer ») qui ouvre le choix du fichier.
 */
export function PieceAJoindre({
  titre,
  requis = true,
  aide,
  nomFichier,
  erreur,
  onFichier,
  onVoir,
  accept = '.pdf,.jpg,.jpeg,.png',
}: {
  titre: string
  requis?: boolean
  /** Les formats acceptés (« PDF, JPG ou PNG (max. 3 Mo) »), montrés tant qu'aucun fichier n'est choisi. */
  aide: string
  /** Le fichier choisi ou déjà joint (« nom · taille »). */
  nomFichier?: string
  erreur?: string
  onFichier: (f: File) => void
  /** Ouvrir le document déjà joint. */
  onVoir?: () => void
  accept?: string
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn('flex flex-wrap items-center gap-3 rounded-lg border bg-muted px-3.5 py-3', erreur ? 'border-destructive' : 'border-transparent')}>
        <FileText className="size-5 shrink-0 text-primary" aria-hidden />
        <span className="flex min-w-0 flex-[1_1_160px] flex-col gap-0.5">
          <b className="text-sm text-foreground">
            {titre}
            {requis && <span className="ml-1 text-destructive">*</span>}
          </b>
          <span className="truncate text-xs font-medium text-muted-foreground">{nomFichier ?? aide}</span>
        </span>
        {onVoir && (
          <Button type="button" variant="ghost" size="icon-sm" onClick={onVoir} aria-label={t('formulaire.pieces.voir')} className="text-primary">
            <Eye className="size-5" aria-hidden />
          </Button>
        )}
        <Button asChild variant="outline" size="md" className="cursor-pointer focus-within:outline-2 focus-within:outline-ring">
          <label>
            <Upload aria-hidden />
            {nomFichier ? t('formulaire.pieces.remplacer') : t('formulaire.pieces.importer')}
            <input
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) onFichier(f)
              }}
            />
          </label>
        </Button>
      </div>
      {erreur && <p className="text-xs font-semibold text-destructive">{erreur}</p>}
    </div>
  )
}
