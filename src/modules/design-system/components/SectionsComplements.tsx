import { useState } from 'react'
import { Bold, Search } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/shadcn/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/shadcn/popover'
import { ScrollArea } from '@/shared/shadcn/scroll-area'
import { Separator } from '@/shared/shadcn/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/shadcn/sheet'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { Toggle } from '@/shared/shadcn/toggle'
import { CarteCompte, EnTeteCompte, PucesCompte } from '@/shared/blocs/CadreCompte'
import { SymboleYibolo } from '@/shared/blocs/Marque'
import { SkeletonText } from '@/shared/blocs/Squelettes'
import { VisionneuseMedias } from '@/shared/blocs/Visionneuse'
import { Rangee, Section } from './Vitrine'

const VILLES = ['Yaoundé', 'Douala', 'Garoua', 'Bafoussam', 'Bamenda', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Kribi', 'Limbé', 'Ebolowa', 'Buea']

/** Les briques de surface qui manquaient : carte, séparateur, défilement, bascule, bulle, tiroir, liste avec recherche. */
export function SectionComplements() {
  const [ville, setVille] = useState('')
  return (
    <Section id="complements" titre="Cartes, bulles et listes" texte="Carte, séparateur, zone qui défile, bascule, bulle (Popover), tiroir (Sheet) et liste avec recherche (Command).">
      <Rangee nom="Carte" className="items-start">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Institut Professionnel du Centre</CardTitle>
            <CardDescription>IPES · Yaoundé, Mvog-Mbi</CardDescription>
            <CardAction>
              <Button size="sm" variant="outline">
                Voir
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Carte blanche, bordée, arrondie à 10 px, sans ombre.</CardContent>
          <CardFooter className="text-meta text-subtle-foreground">Mis à jour aujourd’hui</CardFooter>
        </Card>
      </Rangee>
      <Rangee nom="Séparateur · défilement" className="items-start">
        <div className="flex h-6 items-center gap-3 text-sm">
          Aperçu
          <Separator orientation="vertical" />
          Formations
          <Separator orientation="vertical" />
          Avis
        </div>
        <ScrollArea className="h-36 w-52 rounded-md border border-border">
          <ul className="p-3 text-sm">
            {VILLES.map((v) => (
              <li key={v} className="py-1">
                {v}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Rangee>
      <Rangee nom="Bascule · bulle · tiroir">
        <Toggle variant="outline" aria-label="Gras">
          <Bold />
        </Toggle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Ouvrir la bulle</Button>
          </PopoverTrigger>
          <PopoverContent className="text-sm">Une bulle posée sous son bouton (ombre « floating »).</PopoverContent>
        </Popover>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Ouvrir le tiroir</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu de l’espace pro</SheetTitle>
              <SheetDescription>Le menu latéral s’ouvre en tiroir sur téléphone.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Rangee>
      <Rangee nom="Liste avec recherche (Command)" className="items-start">
        <Command className="w-72 rounded-md border border-border">
          <CommandInput placeholder="Chercher une ville" />
          <CommandList>
            <CommandEmpty>Aucune ville.</CommandEmpty>
            <CommandGroup heading="Villes">
              {VILLES.slice(0, 6).map((v) => (
                <CommandItem key={v} onSelect={() => setVille(v)}>
                  <Search aria-hidden />
                  {v}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {ville && <span className="text-sm text-muted-foreground">Choisie : {ville}</span>}
      </Rangee>
    </Section>
  )
}

/** Les blocs de cadre et de médias : cartes de compte, symbole, squelette de texte, visionneuse ; les cadres pleine page sont décrits. */
export function SectionCadres() {
  const [vue, setVue] = useState<number | null>(null)
  const medias = [
    { src: '/images/maquette/ae-galerie-1.jpg', alt: 'Façade de l’auto-école' },
    { src: '/images/maquette/ae-galerie-3.jpg', alt: 'Véhicule d’apprentissage' },
  ]
  return (
    <Section id="cadres" titre="Cadres et médias" texte="Blocs des pages de compte, symbole du logo, squelette de texte et visionneuse de photos et vidéos.">
      <Rangee nom="Pages de compte (CadreCompte)" className="items-start">
        <div className="flex w-full max-w-xl flex-col gap-3">
          <PucesCompte
            titre="Mon compte"
            puces={[
              { cle: 'favoris', vers: '/design-system', libelle: 'Mes favoris', actif: true },
              { cle: 'notifications', vers: '/design-system', libelle: 'Notifications' },
              { cle: 'profil', vers: '/design-system', libelle: 'Mon profil' },
            ]}
          />
          <CarteCompte>
            <EnTeteCompte titre="Mon profil" texte="Vos informations personnelles." action={<Button size="sm">Enregistrer</Button>} />
            <SkeletonText lines={2} />
          </CarteCompte>
          <CarteCompte danger>
            <EnTeteCompte titre="Supprimer mon compte" texte="Carte « danger » : bordure rouge." />
          </CarteCompte>
        </div>
      </Rangee>
      <Rangee nom="Symbole · squelette de texte">
        <SymboleYibolo />
        <SymboleYibolo className="size-10" />
        <div className="w-64">
          <SkeletonText lines={3} />
        </div>
        <Skeleton className="size-10 rounded-full" />
      </Rangee>
      <Rangee nom="Visionneuse (VisionneuseMedias)">
        {medias.map((m, i) => (
          <Button key={m.src} variant="ghost" className="h-auto p-0" onClick={() => setVue(i)} aria-label={m.alt}>
            <img src={m.src} alt="" className="h-20 w-32 rounded-md object-cover" />
          </Button>
        ))}
        <VisionneuseMedias medias={medias} index={vue} onClose={() => setVue(null)} />
      </Rangee>
      <Rangee nom="Cadres pleine page">
        <p className="max-w-2xl text-sm text-muted-foreground">
          <b className="text-foreground">CadreConnexion</b> (connexion, inscription, mot de passe oublié ; front et admin), <b className="text-foreground">CadreCompte</b> (pages de compte),{' '}
          <b className="text-foreground">ChargementDonnees</b> (attend les données, squelette puis « Réessayer » en cas d’erreur) et <b className="text-foreground">BandeauHorsLigne</b> (bandeau en bas quand la connexion est coupée) se voient dans l’application.
        </p>
      </Rangee>
    </Section>
  )
}
