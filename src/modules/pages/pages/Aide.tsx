import { useState } from 'react'
import { BandeauAide, ContactAide, QuestionsAide, ThemesAide } from '@/modules/pages/components/Aide'
import type { ThemeAide } from '@/modules/pages/pagesContenu'

/** Aide et contact (planches « Aide et contact ») : bandeau et recherche, thèmes, questions fréquentes, formulaire de contact. */
export function Aide() {
  const [recherche, setRecherche] = useState('')
  const [theme, setTheme] = useState<ThemeAide | ''>('')
  return (
    <>
      <BandeauAide recherche={recherche} onRecherche={setRecherche} />
      <div className="mx-auto flex max-w-page flex-col gap-2 pt-4 pb-6 sm:gap-6 sm:px-4 sm:pt-8 sm:pb-12">
        <ThemesAide theme={theme} onTheme={setTheme} />
        <QuestionsAide theme={theme} recherche={recherche} onToutes={() => setTheme('')} />
        <ContactAide />
      </div>
    </>
  )
}
