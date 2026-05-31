import { t } from '../lib/i18n'
import type { Job } from '../types'

type AdminModerationQueueProps = {
  jobs: Job[]
  onUpdate: (jobId: string, status: 'approved' | 'rejected') => Promise<void>
}

function formatSalary(job: Job) {
  if (typeof job.salaryMin !== 'number' || typeof job.salaryMax !== 'number') {
    return null
  }

  return `${job.salaryMin.toLocaleString('en-US')} - ${job.salaryMax.toLocaleString('en-US')} €`
}

export function AdminModerationQueue({ jobs, onUpdate }: AdminModerationQueueProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        {t('admin.empty')}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {jobs.map(job => {
        const salary = formatSalary(job)

        return (
          <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-lg font-bold text-slate-900">{job.title}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {job.companyName ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{job.companyName}</span>
                  ) : null}
                  {job.location ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
                  ) : null}
                  {salary ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{salary}</span>
                  ) : null}
                </div>
                <div className="mt-3 text-sm leading-7 text-slate-600">{job.description}</div>
              </div>
              <div className="flex gap-3">
                <button
                  className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => {
                    void onUpdate(job.id, 'approved')
                  }}
                  type="button"
                >
                  {t('admin.approve')}
                </button>
                <button
                  className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => {
                    void onUpdate(job.id, 'rejected')
                  }}
                  type="button"
                >
                  {t('admin.reject')}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
