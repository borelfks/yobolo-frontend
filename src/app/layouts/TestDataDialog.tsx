import { useRef, useState } from 'react'
import { Database, Download, RotateCcw, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'

/**
 * Le panneau « Données de test » : chaque testeur a sa propre base (SQLite
 * dans le navigateur). Exporter / importer un fichier permet de partager un
 * état avec un collègue ; réinitialiser revient aux données de départ.
 */
export function TestDataDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation('layout')
  const fileInput = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [busy, setBusy] = useState(false)

  const run = async (action: () => Promise<void>, success: string, failure: string) => {
    setBusy(true)
    try {
      await action()
      toast.success(success)
    } catch {
      toast.error(failure)
    } finally {
      setBusy(false)
    }
  }

  const close = () => {
    setConfirmReset(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={t('testData.title')}
      icon={
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600">
          <Database className="size-5" />
        </span>
      }
    >
      <p className="text-sm text-muted">{t('testData.intro')}</p>
      <p className="mt-2 text-xs text-muted">{t('testData.storage', { name: data.label })}</p>

      <div className="mt-5 space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          disabled={busy || !data.canExport}
          onClick={() => void run(() => data.exportFile(), t('testData.exported'), t('testData.exportFailed'))}
        >
          <Download />
          {t('testData.export')}
        </Button>

        <Button variant="outline" className="w-full justify-start" disabled={busy || !data.canExport} onClick={() => fileInput.current?.click()}>
          <Upload />
          {t('testData.import')}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept=".sqlite,.db,application/vnd.sqlite3,application/x-sqlite3"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) void run(() => data.importFile(file), t('testData.imported'), t('testData.importFailed'))
          }}
        />

        {confirmReset ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm font-semibold text-rose-700">{t('testData.resetConfirm')}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="neutral" size="sm" onClick={() => setConfirmReset(false)}>
                {t('testData.cancel')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={busy}
                onClick={() =>
                  void run(
                    async () => {
                      await data.reset()
                      setConfirmReset(false)
                    },
                    t('testData.resetDone'),
                    t('testData.resetFailed'),
                  )
                }
              >
                {t('testData.resetYes')}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger-outline" className="w-full justify-start" disabled={busy} onClick={() => setConfirmReset(true)}>
            <RotateCcw />
            {t('testData.reset')}
          </Button>
        )}
      </div>
    </Modal>
  )
}
