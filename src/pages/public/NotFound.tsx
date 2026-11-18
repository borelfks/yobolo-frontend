import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Card className="p-10 text-center">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-3 text-2xl text-navy-900">Page introuvable</h1>
        <p className="mt-2 text-muted">Cette page n’existe pas ou a été déplacée.</p>
        <Button to="/" className="mt-6">
          Retour à l’accueil
        </Button>
      </Card>
    </div>
  )
}
