import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { SectionCard } from '../components/SectionCard'
import { JobSeekerProfileForm } from '../components/forms/JobSeekerProfileForm'
import { useGDPR } from '../contexts/GDPRContext'
import { t } from '../lib/i18n'
import { api } from '../services/api'
import type { JobSeekerProfile } from '../types'

function formatBoolean(value?: boolean) {
  return value ? t('common.yes') : t('common.no')
}

function formatText(value?: string) {
  return value && value.trim() ? value : '—'
}

function ProfileInfoItem({
  label,
  value,
  href,
  onOpen,
}: {
  label: string
  value: string
  href?: string
  onOpen?: () => void
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-7 text-slate-900">
        {href && onOpen ? (
          <button
            className="text-emerald-700 underline decoration-emerald-300 underline-offset-4"
            onClick={onOpen}
            type="button"
          >
            {value}
          </button>
        ) : href ? (
          <a
            className="text-emerald-700 underline decoration-emerald-300 underline-offset-4"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

export function JobSeekerProfilePage() {
  const { hasConsent } = useGDPR()
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [resumeError, setResumeError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasConsent) {
      return
    }

    setLoading(true)
    void api
      .getSeekerProfile()
      .then(response => {
        setProfile(response.data)
        setEditing(!response.data)
      })
      .catch(() => {
        setProfile(null)
        setEditing(true)
      })
      .finally(() => setLoading(false))
  }, [hasConsent])

  const expertise = useMemo(
    () => profile?.generalExpertise?.join('، ') ?? '—',
    [profile?.generalExpertise]
  )

  if (loading) {
    return <SectionCard title={t('common.loading')} />
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">{t('seeker.profilePageTitle')}</h1>
            <p className="text-sm leading-7 text-slate-600">{t('seeker.profilePageDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              to="/dashboard/job-seeker"
            >
              {t('seeker.backToDashboard')}
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              onClick={() => setEditing(current => !current)}
              type="button"
            >
              {editing ? t('common.cancel') : t('seeker.editProfile')}
            </button>
          </div>
        </div>
      </section>

      {editing ? (
        <SectionCard title={t('seeker.profileEditTitle')}>
          <JobSeekerProfileForm
            initialValue={profile}
            onCancel={profile ? () => setEditing(false) : undefined}
            onSubmit={async payload => {
              const response = await api.saveSeekerProfile(payload)
              setProfile(response.data)
              setEditing(false)
            }}
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard title={t('seeker.profileOverviewTitle')}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ProfileInfoItem label={t('form.fullName')} value={formatText(profile?.fullName)} />
              <ProfileInfoItem
                label={t('form.phoneNumber')}
                value={formatText(profile?.phoneNumber)}
              />
              <ProfileInfoItem
                label={t('form.portugalRegion')}
                value={profile?.portugalRegion ? t(`regions.${profile.portugalRegion}`) : '—'}
              />
              <ProfileInfoItem label={t('form.address')} value={formatText(profile?.address)} />
              <ProfileInfoItem
                label={t('form.residencyPermitType')}
                value={formatText(profile?.residencyPermitType)}
              />
              <ProfileInfoItem
                label={t('form.residencyExpirationDate')}
                value={formatText(profile?.residencyExpirationDate)}
              />
              <ProfileInfoItem
                label={t('form.universityFieldAndDegree')}
                value={formatText(profile?.universityFieldAndDegree)}
              />
              <ProfileInfoItem
                label={t('form.resumeUrl')}
                value={resumeLoading ? t('common.loading') : formatText(profile?.resumeUrl)}
                href={profile?.resumeUrl || undefined}
                onOpen={
                  profile?.resumeUrl
                    ? () => {
                        const resumeUrl = profile.resumeUrl

                        if (!resumeUrl) {
                          return
                        }

                        setResumeError(null)
                        setResumeLoading(true)

                        void api
                          .openProtectedFile(resumeUrl)
                          .catch(error => {
                            setResumeError(
                              error instanceof Error ? error.message : t('common.retry')
                            )
                          })
                          .finally(() => setResumeLoading(false))
                      }
                    : undefined
                }
              />
              <ProfileInfoItem
                label={t('form.linkedinUrl')}
                value={formatText(profile?.linkedinUrl)}
                href={profile?.linkedinUrl || undefined}
              />
            </div>
          </SectionCard>
          {resumeError ? (
            <div className="text-sm font-medium text-rose-600">{resumeError}</div>
          ) : null}

          <SectionCard title={t('seeker.profileQualificationsTitle')}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ProfileInfoItem
                label={t('form.hasResidencePermit')}
                value={formatBoolean(profile?.hasResidencePermit)}
              />
              <ProfileInfoItem
                label={t('form.hasWorkPermit')}
                value={formatBoolean(profile?.hasWorkPermit)}
              />
              <ProfileInfoItem
                label={t('form.canRideBike')}
                value={formatBoolean(profile?.canRideBike)}
              />
              <ProfileInfoItem
                label={t('form.hasPortugueseDrivingLicense')}
                value={formatBoolean(profile?.hasPortugueseDrivingLicense)}
              />
              <ProfileInfoItem
                label={t('form.hasUberExperience')}
                value={formatBoolean(profile?.hasUberExperience)}
              />
              <ProfileInfoItem label={t('form.generalExpertise')} value={expertise} />
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
