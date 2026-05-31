import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { t } from '../../lib/i18n'
import type { JobSeekerProfile, PortugalRegion } from '../../types'
import { ResumeUploadField } from './ResumeUploadField'

const regions: PortugalRegion[] = [
  'aveiro',
  'beja',
  'braga',
  'braganca',
  'castelo_branco',
  'coimbra',
  'evora',
  'faro',
  'guarda',
  'leiria',
  'lisboa',
  'portalegre',
  'porto',
  'santarem',
  'setubal',
  'viana_do_castelo',
  'vila_real',
  'viseu',
  'azores',
  'madeira',
]

type MultiStepProfileFormProps = {
  initialValue?: Partial<JobSeekerProfile> | null
  onSubmit: (payload: JobSeekerProfile) => Promise<void>
}

const defaultProfile: JobSeekerProfile = {
  fullName: '',
  hasResidencePermit: false,
  residencyExpirationDate: '',
  hasWorkPermit: false,
  residencyPermitType: '',
  canRideBike: false,
  universityFieldAndDegree: '',
  hasPortugueseDrivingLicense: false,
  hasUberExperience: false,
  generalExpertise: [],
  portugalRegion: 'lisboa',
  phoneNumber: '',
  address: '',
  resumeUrl: '',
  linkedinUrl: '',
}

export function MultiStepProfileForm({ initialValue, onSubmit }: MultiStepProfileFormProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<JobSeekerProfile>({
    ...defaultProfile,
    ...initialValue,
    generalExpertise: initialValue?.generalExpertise ?? [],
  })

  const steps = useMemo(() => [t('seeker.stepOne'), t('seeker.stepTwo'), t('seeker.stepThree')], [])

  useEffect(() => {
    if (!initialValue) {
      return
    }

    setForm({
      ...defaultProfile,
      ...initialValue,
      generalExpertise: initialValue.generalExpertise ?? [],
    })
  }, [initialValue])

  const setField = <K extends keyof JobSeekerProfile>(field: K, value: JobSeekerProfile[K]) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <span
            key={label}
            className={`rounded-full px-3 py-2 text-xs font-medium ${
              index === step ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {step === 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field labelKey="form.fullName">
            <input
              value={form.fullName}
              onChange={event => setField('fullName', event.target.value)}
            />
          </Field>
          <Field labelKey="form.phoneNumber">
            <input
              value={form.phoneNumber}
              onChange={event => setField('phoneNumber', event.target.value)}
            />
          </Field>
          <Field labelKey="form.address">
            <textarea
              value={form.address}
              onChange={event => setField('address', event.target.value)}
            />
          </Field>
          <Field labelKey="form.portugalRegion">
            <select
              value={form.portugalRegion}
              onChange={event => setField('portugalRegion', event.target.value as PortugalRegion)}
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {t(`regions.${region}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            checked={form.hasResidencePermit}
            labelKey="form.hasResidencePermit"
            onChange={value => setField('hasResidencePermit', value)}
          />
          <ToggleField
            checked={form.hasWorkPermit}
            labelKey="form.hasWorkPermit"
            onChange={value => setField('hasWorkPermit', value)}
          />
          <ToggleField
            checked={form.canRideBike}
            labelKey="form.canRideBike"
            onChange={value => setField('canRideBike', value)}
          />
          <ToggleField
            checked={form.hasPortugueseDrivingLicense}
            labelKey="form.hasPortugueseDrivingLicense"
            onChange={value => setField('hasPortugueseDrivingLicense', value)}
          />
          <ToggleField
            checked={form.hasUberExperience}
            labelKey="form.hasUberExperience"
            onChange={value => setField('hasUberExperience', value)}
          />
          <Field labelKey="form.residencyExpirationDate">
            <input
              type="date"
              value={form.residencyExpirationDate}
              onChange={event => setField('residencyExpirationDate', event.target.value)}
            />
          </Field>
          <Field labelKey="form.residencyPermitType">
            <input
              value={form.residencyPermitType}
              onChange={event => setField('residencyPermitType', event.target.value)}
            />
          </Field>
          <Field labelKey="form.universityFieldAndDegree">
            <input
              value={form.universityFieldAndDegree}
              onChange={event => setField('universityFieldAndDegree', event.target.value)}
            />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field labelKey="form.generalExpertise">
            <textarea
              value={form.generalExpertise.join(', ')}
              onChange={event =>
                setField(
                  'generalExpertise',
                  event.target.value
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
                )
              }
            />
          </Field>
          <ResumeUploadField
            value={form.resumeUrl}
            onChange={value => setField('resumeUrl', value)}
          />
          <Field labelKey="form.linkedinUrl">
            <input
              value={form.linkedinUrl}
              onChange={event => setField('linkedinUrl', event.target.value)}
            />
          </Field>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            onClick={() => setStep(step - 1)}
            type="button"
          >
            {t('common.previous')}
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <button
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
            onClick={() => setStep(step + 1)}
            type="button"
          >
            {t('common.next')}
          </button>
        ) : (
          <button
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
            onClick={() => {
              void onSubmit(form)
            }}
            type="button"
          >
            {t('common.save')}
          </button>
        )}
      </div>
    </div>
  )
}

type FieldProps = {
  labelKey: string
  children: ReactNode
}

function Field({ labelKey, children }: FieldProps) {
  return (
    <label className="block space-y-2 text-sm text-slate-700">
      <span className="font-medium">{t(labelKey)}</span>
      {children}
    </label>
  )
}

type ToggleFieldProps = {
  labelKey: string
  checked: boolean
  onChange: (value: boolean) => void
}

function ToggleField({ labelKey, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
      <span>{t(labelKey)}</span>
      <input
        checked={checked}
        className="h-4 w-4"
        onChange={event => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  )
}
