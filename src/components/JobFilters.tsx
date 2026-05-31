import { t } from '../lib/i18n'
import type { JobType } from '../types'

type JobFiltersProps = {
  activeType?: JobType
  onChange: (value?: JobType) => void
}

export function JobFilters({ activeType, onChange }: JobFiltersProps) {
  const options: Array<{ key: string; value?: JobType }> = [
    { key: 'filters.all', value: undefined },
    { key: 'filters.fullTime', value: 'full-time' },
    { key: 'filters.partTime', value: 'part-time' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {options.map(option => {
        const isActive = option.value === activeType || (!option.value && !activeType)

        return (
          <button
            key={option.key}
            onClick={() => onChange(option.value)}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              isActive
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200'
            }`}
          >
            {t(option.key)}
          </button>
        )
      })}
    </div>
  )
}
