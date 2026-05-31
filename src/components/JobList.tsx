import { t } from '../lib/i18n'
import type { Job } from '../types'

type JobListProps = {
  jobs: Job[]
  emptyKey: string
  onApply?: (jobId: string) => void
  onJobClick?: (job: Job) => void
}

function formatSalary(job: Job) {
  if (typeof job.salaryMin !== 'number' || typeof job.salaryMax !== 'number') {
    return null
  }

  return `${job.salaryMin.toLocaleString('en-US')} - ${job.salaryMax.toLocaleString('en-US')} €`
}

export function JobList({ jobs, emptyKey, onApply, onJobClick }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">{t(emptyKey)}</div>
    )
  }

  return (
    <div className="grid gap-4">
      {jobs.map(job => {
        const salary = formatSalary(job)

        return (
          <article
            key={job.id}
            className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition ${
              onJobClick
                ? 'cursor-pointer hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md'
                : ''
            }`}
            onClick={() => onJobClick?.(job)}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {job.companyName ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{job.companyName}</span>
                  ) : null}
                  {job.location ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
                  ) : null}
                  {job.workplaceType ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {t(`workplaceTypes.${job.workplaceType}`)}
                    </span>
                  ) : null}
                  {job.experienceLevel ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {t(`experienceLevels.${job.experienceLevel}`)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{job.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {job.type === 'full-time' ? t('filters.fullTime') : t('filters.partTime')}
                </span>
                {job.status ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {t(`labels.${job.status}`)}
                  </span>
                ) : null}
              </div>
            </div>

            {salary || job.vacancies || job.applicationDeadline ? (
              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                {salary ? (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">
                    <div className="text-xs font-semibold text-emerald-700">
                      {t('labels.salaryRange')}
                    </div>
                    <div className="mt-1 font-bold">{salary}</div>
                  </div>
                ) : null}
                {typeof job.vacancies === 'number' ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="text-xs font-semibold text-slate-500">
                      {t('labels.vacancies')}
                    </div>
                    <div className="mt-1 font-bold text-slate-900">{job.vacancies}</div>
                  </div>
                ) : null}
                {job.applicationDeadline ? (
                  <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sky-900">
                    <div className="text-xs font-semibold text-sky-700">
                      {t('labels.applicationDeadline')}
                    </div>
                    <div className="mt-1 font-bold">
                      {new Date(job.applicationDeadline).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {typeof job._count?.applications === 'number' ? (
              <div className="mt-4 text-xs text-slate-500">
                {t('labels.applicants')}: {job._count.applications}
              </div>
            ) : null}
            {onApply ? (
              <button
                className="mt-4 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={event => {
                  event.stopPropagation()
                  onApply(job.id)
                }}
                type="button"
              >
                {t('home.apply')}
              </button>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
