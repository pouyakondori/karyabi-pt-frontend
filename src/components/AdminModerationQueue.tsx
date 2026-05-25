import { t } from "../lib/i18n";
import type { Job } from "../types";

type AdminModerationQueueProps = {
  jobs: Job[];
  onUpdate: (jobId: string, status: "approved" | "rejected") => Promise<void>;
};

export function AdminModerationQueue({ jobs, onUpdate }: AdminModerationQueueProps) {
  if (jobs.length === 0) {
    return <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">{t("admin.empty")}</div>;
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-lg font-bold text-slate-900">{job.title}</div>
              <div className="mt-2 text-sm leading-7 text-slate-600">{job.description}</div>
            </div>
            <div className="flex gap-3">
              <button
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  void onUpdate(job.id, "approved");
                }}
                type="button"
              >
                {t("admin.approve")}
              </button>
              <button
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  void onUpdate(job.id, "rejected");
                }}
                type="button"
              >
                {t("admin.reject")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
