import { useEffect, useState } from 'react'

import { SectionCard } from '../components/SectionCard'
import { useGDPR } from '../contexts/GDPRContext'
import { t } from '../lib/i18n'
import { api } from '../services/api'
import type { AdminEmployerSummary, AdminJobSeekerSummary, AdminSummary, Job } from '../types'

function statusChip(isSuspended?: boolean) {
  return isSuspended ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fa-IR')
}

function JobStatusChip({ job }: { job: Job }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        job.isSuspended
          ? 'bg-amber-50 text-amber-700'
          : job.status === 'pending'
          ? 'bg-sky-50 text-sky-700'
          : job.status === 'approved'
          ? 'bg-emerald-50 text-emerald-700'
          : job.status === 'closed'
          ? 'bg-slate-100 text-slate-700'
          : 'bg-rose-50 text-rose-700'
      }`}
    >
      {job.isSuspended ? t('labels.suspended') : t(`labels.${job.status}`)}
    </span>
  )
}

export function AdminDashboard() {
  const { hasConsent } = useGDPR()
  const [admins, setAdmins] = useState<AdminSummary[]>([])
  const [employers, setEmployers] = useState<AdminEmployerSummary[]>([])
  const [jobSeekers, setJobSeekers] = useState<AdminJobSeekerSummary[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [submittingAdmin, setSubmittingAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadOverview = async () => {
    setLoading(true)
    const response = await api
      .getAdminOverview()
      .catch(() => ({ data: { admins: [], employers: [], jobSeekers: [], jobs: [] } }))
    setAdmins(response.data.admins)
    setEmployers(response.data.employers)
    setJobSeekers(response.data.jobSeekers)
    setJobs(response.data.jobs)
    setLoading(false)
  }

  useEffect(() => {
    if (!hasConsent) {
      return
    }

    void loadOverview()
  }, [hasConsent])

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">{t('admin.title')}</h1>
          <p className="text-sm leading-7 text-slate-600">{t('admin.dashboardDescription')}</p>
        </div>
      </section>

      <SectionCard title={t('admin.adminsTitle')}>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
              placeholder={t('admin.addAdminPlaceholder')}
              value={newAdminEmail}
              onChange={event => setNewAdminEmail(event.target.value)}
            />
            <button
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
              disabled={submittingAdmin || !newAdminEmail.trim()}
              onClick={async () => {
                setSubmittingAdmin(true)

                try {
                  await api.createAdminUser(newAdminEmail.trim())
                  setNewAdminEmail('')
                  await loadOverview()
                } finally {
                  setSubmittingAdmin(false)
                }
              }}
              type="button"
            >
              {submittingAdmin ? t('common.loading') : t('admin.addAdmin')}
            </button>
          </div>

          <div className="space-y-3">
            {admins.length === 0 ? (
              <div className="text-sm text-slate-500">{t('admin.emptyAdmins')}</div>
            ) : null}
            {admins.map(admin => (
              <div key={admin.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">{admin.email}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {t('admin.createdAt')}: {formatDate(admin.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChip(
                      admin.isSuspended
                    )}`}
                  >
                    {admin.isSuspended ? t('labels.suspended') : t('labels.active')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {loading ? <SectionCard title={t('common.loading')} /> : null}

      {!loading ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <SectionCard title={t('admin.employersTitle')}>
            <div className="space-y-4">
              {employers.length === 0 ? (
                <div className="text-sm text-slate-500">{t('admin.emptyEmployers')}</div>
              ) : null}
              {employers.map(employer => (
                <div
                  key={employer.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{employer.email}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {t('admin.createdAt')}: {formatDate(employer.createdAt)}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {t('admin.jobsCount')}: {employer._count?.employerJobs ?? 0}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChip(
                        employer.isSuspended
                      )}`}
                    >
                      {employer.isSuspended ? t('labels.suspended') : t('labels.active')}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-2xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() => {
                        void api
                          .suspendAdminUser(employer.id, !employer.isSuspended)
                          .then(loadOverview)
                      }}
                      type="button"
                    >
                      {employer.isSuspended ? t('admin.unsuspend') : t('admin.suspend')}
                    </button>
                    <button
                      className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() => {
                        if (window.confirm(t('admin.deleteEmployerConfirm'))) {
                          void api.deleteAdminUser(employer.id).then(loadOverview)
                        }
                      }}
                      type="button"
                    >
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={t('admin.jobSeekersTitle')}>
            <div className="space-y-4">
              {jobSeekers.length === 0 ? (
                <div className="text-sm text-slate-500">{t('admin.emptyJobSeekers')}</div>
              ) : null}
              {jobSeekers.map(jobSeeker => (
                <div
                  key={jobSeeker.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">
                        {jobSeeker.seekerProfile?.fullName || jobSeeker.email}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{jobSeeker.email}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {t('admin.createdAt')}: {formatDate(jobSeeker.createdAt)}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {t('admin.applicationsCount')}: {jobSeeker._count?.applications ?? 0}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChip(
                        jobSeeker.isSuspended
                      )}`}
                    >
                      {jobSeeker.isSuspended ? t('labels.suspended') : t('labels.active')}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-2xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() => {
                        void api
                          .suspendAdminUser(jobSeeker.id, !jobSeeker.isSuspended)
                          .then(loadOverview)
                      }}
                      type="button"
                    >
                      {jobSeeker.isSuspended ? t('admin.unsuspend') : t('admin.suspend')}
                    </button>
                    <button
                      className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() => {
                        if (window.confirm(t('admin.deleteJobSeekerConfirm'))) {
                          void api.deleteAdminUser(jobSeeker.id).then(loadOverview)
                        }
                      }}
                      type="button"
                    >
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={t('admin.jobVacanciesTitle')}>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-sm text-slate-500">{t('admin.emptyJobsList')}</div>
              ) : null}
              {jobs.map(job => (
                <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {job.companyName ?? t('employer.companyFallback')}
                      </div>
                      <div className="mt-2 line-clamp-3 text-xs leading-6 text-slate-500">
                        {job.description}
                      </div>
                    </div>
                    <JobStatusChip job={job} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.status === 'pending' ? (
                      <>
                        <button
                          className="rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                          onClick={() => {
                            void api.updateJobStatus(job.id, 'approved').then(loadOverview)
                          }}
                          type="button"
                        >
                          {t('admin.approve')}
                        </button>
                        <button
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white"
                          onClick={() => {
                            void api.updateJobStatus(job.id, 'rejected').then(loadOverview)
                          }}
                          type="button"
                        >
                          {t('admin.reject')}
                        </button>
                      </>
                    ) : null}
                    <button
                      className="rounded-2xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() => {
                        void api.suspendAdminJob(job.id, !job.isSuspended).then(loadOverview)
                      }}
                      type="button"
                    >
                      {job.isSuspended ? t('admin.unsuspend') : t('admin.suspend')}
                    </button>
                    <button
                      className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                      onClick={() => {
                        if (window.confirm(t('admin.deleteJobConfirm'))) {
                          void api.deleteAdminJob(job.id).then(loadOverview)
                        }
                      }}
                      type="button"
                    >
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      ) : null}
    </div>
  )
}
