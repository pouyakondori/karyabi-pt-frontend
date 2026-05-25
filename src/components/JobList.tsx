import { t } from "../lib/i18n";
import type { Job } from "../types";

type JobListProps = {
  jobs: Job[];
  emptyKey: string;
  onApply?: (jobId: string) => void;
};

export function JobList({ jobs, emptyKey, onApply }: JobListProps) {
  if (jobs.length === 0) {
    return <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">{t(emptyKey)}</div>;
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <article key={job.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{job.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {job.type === "full-time" ? t("filters.fullTime") : t("filters.partTime")}
              </span>
              {job.status ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {t(`labels.${job.status}`)}
                </span>
              ) : null}
            </div>
          </div>
          {typeof job._count?.applications === "number" ? (
            <div className="mt-4 text-xs text-slate-500">
              {t("labels.applicants")}: {job._count.applications}
            </div>
          ) : null}
          {onApply ? (
            <button
              className="mt-4 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => onApply(job.id)}
              type="button"
            >
              {t("home.apply")}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
