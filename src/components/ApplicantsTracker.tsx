import type { CandidateApplication, Job } from "../types";
import { t } from "../lib/i18n";

type ApplicantsTrackerProps = {
  jobs: Job[];
  candidates: CandidateApplication[];
  selectedJobId?: string;
  onSelectJob: (jobId: string) => void;
};

function formatSalary(job: Job) {
  if (typeof job.salaryMin !== "number" || typeof job.salaryMax !== "number") {
    return null;
  }

  return `${job.salaryMin.toLocaleString("en-US")} - ${job.salaryMax.toLocaleString("en-US")} €`;
}

export function ApplicantsTracker({ jobs, candidates, selectedJobId, onSelectJob }: ApplicantsTrackerProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3">
        {jobs.length === 0 ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{t("employer.emptyJobs")}</div> : null}
        {jobs.map((job) => {
          const salary = formatSalary(job);

          return (
            <button
              key={job.id}
              className={`w-full rounded-2xl border px-4 py-3 text-start ${
                selectedJobId === job.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
              onClick={() => onSelectJob(job.id)}
              type="button"
            >
              <div className="font-semibold text-slate-900">{job.title}</div>
              <div className="mt-1 text-xs text-slate-500">{job.companyName ?? t("employer.companyFallback")}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                {job.location ? <span className="rounded-full bg-white/80 px-2 py-1">{job.location}</span> : null}
                {salary ? <span className="rounded-full bg-white/80 px-2 py-1">{salary}</span> : null}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {t("labels.applicants")}: {job._count?.applications ?? 0}
              </div>
            </button>
          );
        })}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        {candidates.length === 0 ? <div className="text-sm text-slate-500">{t("employer.emptyCandidates")}</div> : null}
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{candidate.seeker.seekerProfile?.fullName ?? candidate.seeker.email}</div>
              <div className="mt-1 text-sm text-slate-600">
                {t("labels.email")}: {candidate.seeker.email}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {t("labels.appliedAt")}: {new Date(candidate.appliedAt).toLocaleDateString("fa-IR")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
