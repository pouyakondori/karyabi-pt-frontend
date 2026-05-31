import { useState } from 'react'

import { useGDPR } from '../contexts/GDPRContext'
import { t } from '../lib/i18n'

export function GdprModal() {
  const { acceptConsent } = useGDPR()
  const [checked, setChecked] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900">{t('gdpr.title')}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{t('gdpr.description')}</p>
        <label className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <input
            checked={checked}
            onChange={event => setChecked(event.target.checked)}
            type="checkbox"
            className="mt-1 h-4 w-4"
          />
          <span>{t('gdpr.checkbox')}</span>
        </label>
        <button
          disabled={!checked}
          onClick={acceptConsent}
          className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {t('gdpr.button')}
        </button>
      </div>
    </div>
  )
}
