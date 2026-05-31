import { useNavigate } from 'react-router-dom'

import { SectionCard } from '../components/SectionCard'
import { EmployerJobForm } from '../components/forms/EmployerJobForm'
import { t } from '../lib/i18n'
import { api } from '../services/api'

export function CreateJobOfficePage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-sm">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-100">
            {t('employer.createPageKicker')}
          </span>
          <h1 className="text-3xl font-black leading-tight sm:text-4xl">
            {t('employer.createPageHeroTitle')}
          </h1>
          <p className="max-w-3xl text-sm leading-8 text-slate-200 sm:text-base">
            {t('employer.createPageHeroDescription')}
          </p>
        </div>
      </section>

      <SectionCard title={t('employer.createTipsTitle')}>
        <ul className="list-disc space-y-3 ps-6 text-sm leading-7 text-slate-600 marker:text-emerald-600">
          <li>{t('employer.createTipOne')}</li>
          <li>{t('employer.createTipTwo')}</li>
          <li>{t('employer.createTipThree')}</li>
          <li>{t('employer.createTipFour')}</li>
        </ul>
      </SectionCard>

      <SectionCard title={t('employer.createPageTitle')}>
        <EmployerJobForm
          submitLabel={t('employer.publishAction')}
          onSubmit={async payload => {
            await api.createEmployerJob(payload)
            navigate('/dashboard/employer', { replace: true })
          }}
        />
      </SectionCard>
    </div>
  )
}
