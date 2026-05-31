import { useState } from 'react'

import { t } from '../../lib/i18n'
import { api } from '../../services/api'

type ResumeUploadFieldProps = {
  value?: string
  onChange: (value: string) => void
}

export function ResumeUploadField({ value, onChange }: ResumeUploadFieldProps) {
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
      <label className="block space-y-2 text-sm text-slate-700">
        <span className="font-medium">{t('form.resumeUpload')}</span>
        <input
          accept=".pdf,.doc,.docx"
          disabled={uploading}
          type="file"
          onChange={event => {
            const file = event.target.files?.[0]

            if (!file) {
              return
            }

            setError(null)
            setUploading(true)

            void api
              .uploadSeekerResume(file)
              .then(response => {
                setFileName(response.data.fileName)
                onChange(response.data.url)
              })
              .catch(uploadError => {
                setError(uploadError instanceof Error ? uploadError.message : t('common.retry'))
              })
              .finally(() => {
                setUploading(false)
                event.target.value = ''
              })
          }}
        />
      </label>

      {uploading ? <div className="text-xs text-slate-500">{t('form.resumeUploading')}</div> : null}
      {fileName ? (
        <div className="text-xs text-emerald-700">
          {t('form.resumeUploaded')}: {fileName}
        </div>
      ) : null}
      {value ? (
        <button
          className="inline-flex w-fit text-sm font-medium text-emerald-700 underline underline-offset-4"
          disabled={opening}
          onClick={() => {
            setError(null)
            setOpening(true)

            void api
              .openProtectedFile(value)
              .catch(openError => {
                setError(openError instanceof Error ? openError.message : t('common.retry'))
              })
              .finally(() => setOpening(false))
          }}
          type="button"
        >
          {opening ? t('common.loading') : t('form.resumeDownload')}
        </button>
      ) : null}
      {error ? <div className="text-xs text-rose-600">{error}</div> : null}
    </div>
  )
}
