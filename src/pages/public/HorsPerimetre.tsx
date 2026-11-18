import { useLocation } from 'react-router'
import { Briefcase, GraduationCap, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

/** Consultation et Emploi : présents dans la navigation, pas encore réalisés dans cette démo. */
export default function HorsPerimetre() {
  const { pathname } = useLocation()
  const emploi = pathname.startsWith('/emploi')
  const Icon = emploi ? Briefcase : UserRound
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Card className="p-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-100 text-brand-600">
          <Icon className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl text-navy-900">{emploi ? 'Emploi' : 'Consultation'} — bientôt disponible</h1>
        <p className="mt-2 text-muted">
          Cette démonstration couvre l’univers École. L’espace {emploi ? 'Emploi' : 'Consultation'} arrive dans une prochaine version.
        </p>
        <Button to="/ecoles" className="mt-6">
          <GraduationCap />
          Explorer les écoles
        </Button>
      </Card>
    </div>
  )
}
