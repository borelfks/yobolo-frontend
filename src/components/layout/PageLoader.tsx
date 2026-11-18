export function PageLoader() {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-label="Chargement">
      <span className="size-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
    </div>
  )
}
