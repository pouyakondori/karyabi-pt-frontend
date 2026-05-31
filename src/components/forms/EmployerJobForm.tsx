import { useEffect, useMemo, useRef, useState } from 'react'

import { t } from '../../lib/i18n'
import type { CreateEmployerJobPayload, ExperienceLevel, JobType, WorkplaceType } from '../../types'

type EmployerJobFormProps = {
  onSubmit: (payload: CreateEmployerJobPayload) => Promise<void>
  submitLabel?: string
}

type DropdownOption<T extends string> = {
  value: T
  label: string
}

type FormField = keyof CreateEmployerJobPayload
type FormErrors = Partial<Record<FormField, string>>
type TouchedFields = Partial<Record<FormField, boolean>>

const workplaceTypes: WorkplaceType[] = ['on_site', 'hybrid', 'remote']
const experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior']
const portugueseCities = [
  'Lisboa',
  'Porto',
  'Braga',
  'Coimbra',
  'Aveiro',
  'Faro',
  'Setúbal',
  'Leiria',
  'Évora',
  'Viseu',
  'Guarda',
  'Santarém',
  'Viana do Castelo',
  'Vila Real',
  'Bragança',
  'Castelo Branco',
  'Portalegre',
  'Beja',
  'Funchal',
  'Ponta Delgada',
]
const fieldsWithRequiredBadge: FormField[] = [
  'title',
  'companyName',
  'description',
  'applicationDeadline',
]
const validatedFields: FormField[] = [
  'title',
  'companyName',
  'description',
  'applicationDeadline',
  'salaryMin',
  'salaryMax',
  'vacancies',
]

const initialState: CreateEmployerJobPayload = {
  title: '',
  description: '',
  companyName: '',
  location: 'Lisboa',
  salaryMin: 900,
  salaryMax: 1200,
  workplaceType: 'on_site',
  experienceLevel: 'entry',
  vacancies: 1,
  applicationDeadline: '',
  type: 'full-time',
}

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <span className={`text-xs text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
  )
}

function RequiredBadge() {
  return (
    <span className="ms-2 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
      {t('common.required')}
    </span>
  )
}

function SelectDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
  required = false,
}: {
  label: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  error?: string
  required?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="space-y-2 text-sm text-slate-700" ref={containerRef}>
      <div className="flex items-center font-medium">
        <span>{label}</span>
        {required ? <RequiredBadge /> : null}
      </div>
      <div className="relative">
        <button
          className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-right outline-none transition hover:border-slate-300 ${
            error
              ? 'border-rose-300 focus:border-rose-500'
              : 'border-slate-200 focus:border-emerald-500'
          }`}
          onClick={() => setIsOpen(current => !current)}
          type="button"
        >
          <span>{selectedOption?.label}</span>
          <Chevron isOpen={isOpen} />
        </button>

        {isOpen ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="max-h-72 overflow-y-auto p-2">
              {options.map(option => (
                <button
                  key={option.value}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-right text-sm transition ${
                    option.value === value
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  type="button"
                >
                  <span>{option.label}</span>
                  {option.value === value ? <span className="text-xs">✓</span> : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <div className="text-xs font-medium text-rose-600">{error}</div> : null}
    </div>
  )
}

function SearchableDropdown({
  label,
  value,
  options,
  placeholder,
  onChange,
  error,
  required = false,
}: {
  label: string
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())

    if (!normalizedQuery) {
      return options
    }

    return options.filter(option => normalizeText(option).includes(normalizedQuery))
  }, [options, query])

  return (
    <div className="space-y-2 text-sm text-slate-700" ref={containerRef}>
      <div className="flex items-center font-medium">
        <span>{label}</span>
        {required ? <RequiredBadge /> : null}
      </div>
      <div className="relative">
        <button
          className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-right outline-none transition hover:border-slate-300 ${
            error
              ? 'border-rose-300 focus:border-rose-500'
              : 'border-slate-200 focus:border-emerald-500'
          }`}
          onClick={() => setIsOpen(current => !current)}
          type="button"
        >
          <span>{value || placeholder}</span>
          <Chevron isOpen={isOpen} />
        </button>

        {isOpen ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-emerald-500"
                placeholder={t('form.searchLocation')}
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-right text-sm transition ${
                      option === value
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    type="button"
                  >
                    <span>{option}</span>
                    {option === value ? <span className="text-xs">✓</span> : null}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-slate-500">
                  {t('form.noLocationResults')}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <div className="text-xs font-medium text-rose-600">{error}</div> : null}
    </div>
  )
}

function validateField(field: FormField, form: CreateEmployerJobPayload): string | undefined {
  switch (field) {
    case 'title':
    case 'description':
    case 'companyName':
      return form[field].trim() ? undefined : t('validation.requiredField')
    case 'applicationDeadline':
      if (!form.applicationDeadline?.trim()) {
        return t('validation.requiredField')
      }

      return Number.isNaN(Date.parse(form.applicationDeadline))
        ? t('validation.requiredField')
        : undefined
    case 'salaryMin':
      return form.salaryMin > 0 ? undefined : t('validation.positiveNumber')
    case 'salaryMax':
      if (form.salaryMax <= 0) {
        return t('validation.positiveNumber')
      }

      return form.salaryMax >= form.salaryMin ? undefined : t('validation.salaryRange')
    case 'vacancies':
      return form.vacancies > 0 ? undefined : t('validation.positiveNumber')
    default:
      return undefined
  }
}

function validateForm(form: CreateEmployerJobPayload): FormErrors {
  return validatedFields.reduce<FormErrors>((accumulator, field) => {
    const error = validateField(field, form)

    if (error) {
      accumulator[field] = error
    }

    return accumulator
  }, {})
}

export function EmployerJobForm({ onSubmit, submitLabel }: EmployerJobFormProps) {
  const [form, setForm] = useState<CreateEmployerJobPayload>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<TouchedFields>({})
  const [submitting, setSubmitting] = useState(false)

  const updateField = <Key extends FormField>(field: Key, value: CreateEmployerJobPayload[Key]) => {
    const nextForm = { ...form, [field]: value }
    setForm(nextForm)

    if (touched[field]) {
      setErrors(current => ({
        ...current,
        [field]: validateField(field, nextForm),
      }))
    }

    if (
      (field === 'salaryMin' || field === 'salaryMax') &&
      (touched.salaryMin || touched.salaryMax)
    ) {
      setErrors(current => ({
        ...current,
        salaryMin: touched.salaryMin ? validateField('salaryMin', nextForm) : current.salaryMin,
        salaryMax: touched.salaryMax ? validateField('salaryMax', nextForm) : current.salaryMax,
      }))
    }
  }

  const markTouched = (field: FormField) => {
    setTouched(current => ({ ...current, [field]: true }))
    setErrors(current => ({
      ...current,
      [field]: validateField(field, form),
    }))
  }

  const workplaceOptions: DropdownOption<WorkplaceType>[] = workplaceTypes.map(workplaceType => ({
    value: workplaceType,
    label: t(`workplaceTypes.${workplaceType}`),
  }))

  const experienceOptions: DropdownOption<ExperienceLevel>[] = experienceLevels.map(
    experienceLevel => ({
      value: experienceLevel,
      label: t(`experienceLevels.${experienceLevel}`),
    })
  )

  const hasRequiredBadge = (field: FormField) => fieldsWithRequiredBadge.includes(field)

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="flex items-center font-medium">
            <span>{t('form.title')}</span>
            {hasRequiredBadge('title') ? <RequiredBadge /> : null}
          </span>
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              errors.title
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-emerald-500'
            }`}
            required
            value={form.title}
            onBlur={() => markTouched('title')}
            onChange={event => updateField('title', event.target.value)}
          />
          {errors.title ? (
            <span className="text-xs font-medium text-rose-600">{errors.title}</span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="flex items-center font-medium">
            <span>{t('form.companyName')}</span>
            {hasRequiredBadge('companyName') ? <RequiredBadge /> : null}
          </span>
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              errors.companyName
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-emerald-500'
            }`}
            required
            value={form.companyName}
            onBlur={() => markTouched('companyName')}
            onChange={event => updateField('companyName', event.target.value)}
          />
          {errors.companyName ? (
            <span className="text-xs font-medium text-rose-600">{errors.companyName}</span>
          ) : null}
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="flex items-center font-medium">
          <span>{t('form.description')}</span>
          {hasRequiredBadge('description') ? <RequiredBadge /> : null}
        </span>
        <textarea
          className={`min-h-36 w-full rounded-2xl border px-4 py-3 outline-none transition ${
            errors.description
              ? 'border-rose-300 focus:border-rose-500'
              : 'border-slate-200 focus:border-emerald-500'
          }`}
          required
          value={form.description}
          onBlur={() => markTouched('description')}
          onChange={event => updateField('description', event.target.value)}
        />
        {errors.description ? (
          <span className="text-xs font-medium text-rose-600">{errors.description}</span>
        ) : null}
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <SearchableDropdown
          label={t('form.location')}
          options={portugueseCities}
          placeholder={t('form.locationPlaceholder')}
          value={form.location}
          onChange={value => updateField('location', value)}
        />
        <label className="space-y-2 text-sm text-slate-700">
          <span className="flex items-center font-medium">
            <span>{t('form.applicationDeadline')}</span>
            {hasRequiredBadge('applicationDeadline') ? <RequiredBadge /> : null}
          </span>
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              errors.applicationDeadline
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-emerald-500'
            }`}
            required
            type="date"
            value={form.applicationDeadline ?? ''}
            onBlur={() => markTouched('applicationDeadline')}
            onChange={event => updateField('applicationDeadline', event.target.value)}
          />
          {errors.applicationDeadline ? (
            <span className="text-xs font-medium text-rose-600">{errors.applicationDeadline}</span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">{t('form.salaryMin')}</span>
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              errors.salaryMin
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-emerald-500'
            }`}
            min={0}
            type="number"
            value={form.salaryMin || ''}
            onBlur={() => markTouched('salaryMin')}
            onChange={event => updateField('salaryMin', Number(event.target.value || 0))}
          />
          {errors.salaryMin ? (
            <span className="text-xs font-medium text-rose-600">{errors.salaryMin}</span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">{t('form.salaryMax')}</span>
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              errors.salaryMax
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-emerald-500'
            }`}
            min={0}
            type="number"
            value={form.salaryMax || ''}
            onBlur={() => markTouched('salaryMax')}
            onChange={event => updateField('salaryMax', Number(event.target.value || 0))}
          />
          {errors.salaryMax ? (
            <span className="text-xs font-medium text-rose-600">{errors.salaryMax}</span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">{t('form.vacancies')}</span>
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              errors.vacancies
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-emerald-500'
            }`}
            min={1}
            type="number"
            value={form.vacancies || ''}
            onBlur={() => markTouched('vacancies')}
            onChange={event => updateField('vacancies', Number(event.target.value || 0))}
          />
          {errors.vacancies ? (
            <span className="text-xs font-medium text-rose-600">{errors.vacancies}</span>
          ) : null}
        </label>
        <div className="space-y-2 text-sm text-slate-700">
          <div className="font-medium">{t('form.type')}</div>
          <div className="flex gap-3">
            {(['full-time', 'part-time'] as JobType[]).map(jobType => (
              <button
                key={jobType}
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  form.type === jobType
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-transparent bg-slate-100 text-slate-700'
                }`}
                onClick={() => updateField('type', jobType)}
                type="button"
              >
                {jobType === 'full-time' ? t('filters.fullTime') : t('filters.partTime')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SelectDropdown
          label={t('form.workplaceType')}
          options={workplaceOptions}
          value={form.workplaceType}
          onChange={value => updateField('workplaceType', value)}
        />
        <SelectDropdown
          label={t('form.experienceLevel')}
          options={experienceOptions}
          value={form.experienceLevel}
          onChange={value => updateField('experienceLevel', value)}
        />
      </div>

      <button
        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
        disabled={submitting}
        onClick={async () => {
          const nextErrors = validateForm(form)
          const hasErrors = Object.values(nextErrors).some(Boolean)

          setTouched(
            validatedFields.reduce<TouchedFields>((accumulator, field) => {
              accumulator[field] = true
              return accumulator
            }, {})
          )
          setErrors(nextErrors)

          if (hasErrors) {
            return
          }

          setSubmitting(true)

          try {
            await onSubmit({
              ...form,
              applicationDeadline: form.applicationDeadline || undefined,
            })
            setForm(initialState)
            setErrors({})
            setTouched({})
          } finally {
            setSubmitting(false)
          }
        }}
        type="button"
      >
        {submitting ? t('common.loading') : submitLabel ?? t('common.submit')}
      </button>
    </div>
  )
}
