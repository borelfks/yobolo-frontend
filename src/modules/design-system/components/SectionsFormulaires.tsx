import { useState } from 'react'
import { MessageCircle, ShieldCheck } from 'lucide-react'
import { ChoixLangue } from '@/shared/blocs/ChoixLangue'
import { BarreEtapes, CaseACocher, Champ, ChampMotDePasse, ChampTelephone, ChampTexte, Encadre, JaugeMotDePasse, ListeDeroulante, PieceAJoindre } from '@/shared/blocs/Formulaire'
import { MarqueYibolo } from '@/shared/blocs/Marque'
import { RadioGroup, RadioGroupCard, RadioGroupOption } from '@/shared/shadcn/radio-group'
import { Rangee, Section } from './Vitrine'

/** Marque, langue et blocs de formulaire des écrans de connexion et d'inscription. */
export function SectionFormulaires() {
  const [mdp, setMdp] = useState('Yibolo2026')
  const [civ, setCiv] = useState('Monsieur')
  const [profil, setProfil] = useState('personne')
  const [fonction, setFonction] = useState('')
  const [fichier, setFichier] = useState<string>()
  return (
    <Section id="formulaires" titre="Marque et formulaires" texte="Logo, langue, champs de 48 px, jauge, étapes, encadrés et pièces à joindre (connexion, inscription).">
      <Rangee nom="Marque · langue">
        <MarqueYibolo />
        <MarqueYibolo devise="Apprendre · Évoluer · Réussir" />
        <span className="rounded-lg bg-foreground p-3">
          <MarqueYibolo surFonce devise="Apprendre · Évoluer · Réussir" />
        </span>
        <ChoixLangue />
        <ChoixLangue auth />
      </Rangee>
      <BarreEtapes nombre={4} courante={1} noms={['Profil', 'Vous', 'Votre accès', 'Code']} />
      <BarreEtapes nombre={3} courante={0} />
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Champ id="ds-prenom" label="Prénom" requis>
          <ChampTexte id="ds-prenom" placeholder="Ex. : Aïcha" />
        </Champ>
        <Champ id="ds-email" label="E-mail" facultatif erreur="Adresse e-mail invalide.">
          <ChampTexte id="ds-email" aria-invalid defaultValue="aicha@" />
        </Champ>
        <Champ id="ds-tel" label="Téléphone">
          <ChampTelephone id="ds-tel" />
        </Champ>
        <Champ id="ds-fonction" label="Fonction">
          <ListeDeroulante id="ds-fonction" grand valeur={fonction} onChange={setFonction} placeholder="Choisir votre fonction" options={['Directeur / Directrice', 'Secrétaire'].map((v) => ({ value: v, label: v }))} />
        </Champ>
        <Champ id="ds-mdp" label="Mot de passe">
          <ChampMotDePasse id="ds-mdp" value={mdp} onChange={(e) => setMdp(e.target.value)} />
          <JaugeMotDePasse motDePasse={mdp} aide="8 caractères minimum" />
        </Champ>
      </div>
      <CaseACocher label="Se souvenir de moi" defaultChecked />
      <RadioGroup value={civ} onValueChange={setCiv} className="flex flex-wrap gap-2.5">
        {['Monsieur', 'Madame', 'Mademoiselle'].map((c) => (
          <RadioGroupOption key={c} value={c}>
            {c}
          </RadioGroupOption>
        ))}
      </RadioGroup>
      <RadioGroup value={profil} onValueChange={setProfil} className="grid gap-3 sm:grid-cols-2">
        {['personne', 'ecole'].map((p) => (
          <RadioGroupCard key={p} value={p}>
            <b className="text-base">{p === 'personne' ? 'Personne physique' : 'École / IPES'}</b>
          </RadioGroupCard>
        ))}
      </RadioGroup>
      <Encadre ton="erreur">Identifiant ou mot de passe incorrect.</Encadre>
      <Encadre ton="info" icone={MessageCircle}>
        SMS de YIBOLO : votre code de vérification est <b>482913</b>
      </Encadre>
      <Encadre ton="succes" icone={ShieldCheck}>
        Vos documents sont confidentiels : seule l’équipe YIBOLO peut les consulter.
      </Encadre>
      <PieceAJoindre titre="Certificat du NIU" aide="PDF, JPG ou PNG (max. 3 Mo)" nomFichier={fichier} onFichier={(f) => setFichier(f.name)} />
    </Section>
  )
}
