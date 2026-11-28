import { useState } from 'react'
import { Bell, Download, Heart, Plus, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Checkbox } from '@/shared/shadcn/checkbox'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/shared/shadcn/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/select'
import { Switch } from '@/shared/shadcn/switch'
import { Textarea } from '@/shared/shadcn/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { Couleur, Rangee, Section } from './Vitrine'

const COULEURS: [string, string][] = [
  ['background', '#F4F6FA'], ['card', '#FFFFFF'], ['foreground', '#0B1B3F'], ['foreground-soft', '#3C4660'],
  ['muted-foreground', '#4A5670'], ['subtle-foreground', '#66718A'], ['border', '#E0E4EC'], ['border-strong', '#C9D0DD'],
  ['input', '#9AA5BA'], ['accent', '#F1F4F9'], ['secondary', '#EEF1F6'], ['primary', '#1F55E6'],
  ['primary-hover', '#1843B8'], ['primary-soft', '#EEF3FD'], ['primary-tint', '#E8EFFD'], ['success', '#0F7A55'],
  ['success-soft', '#E6F6EE'], ['destructive', '#D92D4B'], ['destructive-soft', '#FDECEF'], ['warning', '#E0A500'],
  ['warning-soft', '#FFF6DB'], ['tone-violet', '#6D3FD6'], ['tone-teal', '#0A6A8F'], ['tone-pink', '#B4236D'],
]

export function SectionCouleurs() {
  return (
    <Section id="couleurs" titre="Couleurs" texte="Les jetons de src/app/styles/theme.css, relevés dans le canevas. Aucune couleur ne s'écrit en dur.">
      <div className="flex flex-wrap gap-4">
        {COULEURS.map(([jeton, valeur]) => (
          <Couleur key={jeton} jeton={jeton} valeur={valeur} />
        ))}
      </div>
    </Section>
  )
}

export function SectionTexte() {
  return (
    <Section id="texte" titre="Texte" texte="Plus Jakarta Sans. Titres en 800, libellés en 700, texte courant en 500.">
      <div className="flex flex-col gap-3">
        <p className="text-titre font-extrabold tracking-[-0.01em]">Titre de page — 28 px, 800</p>
        <p className="text-2xl font-extrabold">Titre de section — 24 px, 800</p>
        <p className="text-lg font-extrabold">Titre de carte — 18 px, 800</p>
        <p className="text-ui font-bold">Bouton, onglet — 15 px, 700</p>
        <p className="text-sm font-medium text-foreground-soft">Texte courant — 14 px, 500</p>
        <p className="text-meta text-muted-foreground">Texte d'appoint — 13 px</p>
        <p className="text-xs font-bold tracking-[0.02em] text-muted-foreground uppercase">En-tête de tableau — 12 px, capitales</p>
      </div>
    </Section>
  )
}

export function SectionBoutons() {
  const [charge, setCharge] = useState(false)
  const essayer = () => {
    setCharge(true)
    window.setTimeout(() => setCharge(false), 1500)
  }
  return (
    <Section id="boutons" titre="Boutons" texte="Toujours en pilule. Un seul bouton principal par zone.">
      <Rangee nom="Variantes">
        <Button>Primaire</Button>
        <Button variant="secondary">Secondaire</Button>
        <Button variant="outline">Neutre</Button>
        <Button variant="destructive">Danger</Button>
        <Button variant="destructive-solid">Supprimer</Button>
        <Button variant="ghost">Discret</Button>
        <Button variant="link">Lien</Button>
        <Button variant="link-muted">Lien gris</Button>
      </Rangee>
      <Rangee nom="Tailles">
        <Button size="sm">32 px</Button>
        <Button size="md">36 px</Button>
        <Button>40 px</Button>
        <Button size="lg">
          <Search />
          44 px
        </Button>
        <Button size="icon" variant="ghost" aria-label="Notifications">
          <Bell />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Favori">
          <Heart />
        </Button>
      </Rangee>
      <Rangee nom="États">
        <Button loading={charge} onClick={essayer}>
          {charge ? 'Enregistrement…' : 'Cliquer pour charger'}
        </Button>
        <Button disabled>Désactivé</Button>
        <Button variant="secondary">
          <Plus />
          Avec icône
        </Button>
        <Button variant="outline">
          <Download />
          Télécharger
        </Button>
        <Button variant="destructive">
          <Trash2 />
          Supprimer
        </Button>
      </Rangee>
    </Section>
  )
}

export function SectionBadges() {
  return (
    <Section id="badges" titre="Badges et puces" texte="Badges : statut (24 px). Puces : filtres et choix (32 px), actives en vert.">
      <Rangee nom="Badges">
        <Badge variant="green">Publiée</Badge>
        <Badge variant="gray">Brouillon</Badge>
        <Badge variant="blue">Nouveau</Badge>
        <Badge variant="amber">Expire bientôt</Badge>
        <Badge variant="red">Expiré</Badge>
        <Badge variant="violet">Expert</Badge>
        <Badge variant="solid-green">Vérifié</Badge>
        <Badge variant="outline">Neutre</Badge>
      </Rangee>
      <Rangee nom="Puces">
        <ToggleGroup type="single" defaultValue="tous" variant="outline" aria-label="Filtre">
          <ToggleGroupItem value="tous">Tous</ToggleGroupItem>
          <ToggleGroupItem value="ipes">IPES</ToggleGroupItem>
          <ToggleGroupItem value="cfp">CFP</ToggleGroupItem>
          <ToggleGroupItem value="autres">Autres</ToggleGroupItem>
        </ToggleGroup>
      </Rangee>
    </Section>
  )
}

export function SectionChamps() {
  return (
    <Section id="champs" titre="Champs" texte="44 px, bordure gris-bleu, contour bleu au focus, rouge en erreur. L'étiquette est au-dessus, l'erreur en dessous.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ds-nom">
            Nom de l'établissement <span className="text-destructive">*</span>
          </Label>
          <Input id="ds-nom" placeholder="Ex. : Institut Professionnel du Centre" />
          <p className="text-xs font-medium text-muted-foreground">Le nom tel qu'il apparaît sur l'agrément.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ds-mail">E-mail</Label>
          <Input id="ds-mail" aria-invalid defaultValue="contact@" />
          <p className="text-xs font-medium text-destructive">Saisissez une adresse e-mail valide.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Région</Label>
          <Select>
            <SelectTrigger aria-label="Région">
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centre">Centre</SelectItem>
              <SelectItem value="littoral">Littoral</SelectItem>
              <SelectItem value="ouest">Ouest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ds-off">Désactivé</Label>
          <Input id="ds-off" disabled defaultValue="Non modifiable" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="ds-zone">Présentation</Label>
          <Textarea id="ds-zone" placeholder="Décrivez la formation en quelques lignes." />
        </div>
      </div>
      <Rangee nom="Cases, choix, interrupteur">
        <label className="flex items-center gap-2 text-sm text-foreground-soft">
          <Checkbox defaultChecked /> Je confirme
        </label>
        <RadioGroup defaultValue="jour" className="flex gap-4" aria-label="Type de cours">
          <label className="flex items-center gap-2 text-sm text-foreground-soft">
            <RadioGroupItem value="jour" /> Jour
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground-soft">
            <RadioGroupItem value="soir" /> Soir
          </label>
        </RadioGroup>
        <label className="flex items-center gap-2 text-sm text-foreground-soft">
          <Switch defaultChecked aria-label="Double authentification" /> Double authentification
        </label>
      </Rangee>
    </Section>
  )
}
