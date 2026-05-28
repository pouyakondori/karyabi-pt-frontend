import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { SectionCard } from "../components/SectionCard";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { CandidateApplication, Job } from "../types";

function formatSalary(job: Job) {
  if (typeof job.salaryMin !== "number" || typeof job.salaryMax !== "number") {
    return "—";
  }

  return `${job.salaryMin.toLocaleString("en-US")} - ${job.salaryMax.toLocaleString("en-US")} €`;
}

function StatusBadge({ status }: { status?: Job["status"] }) {
  if (!status) {
    return null;
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "pending"
          ? "bg-amber-50 text-amber-700"
          : status === "approved"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700"
      }`}
    >
      {t(`labels.${status}`)}
    </span>
  );
}

export function EmployerJobOfferPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { hasConsent } = useGDPR();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!hasConsent || !jobId) {
      return;
    }

    setLoading(true);
    void api
      .getCandidates(jobId)
      .then((response) => {
        setJob(response.data.job);
        setCandidates(response.data.applications);
      })
      .catch(() => {
        setJob(null);
        setCandidates([]);
      })
      .finally(() => setLoading(false));
  }, [hasConsent, jobId]);

  if (loading) {
    return <SectionCard title={t("common.loading")} />;
  }

  if (!job) {
    return (
      <SectionCard title={t("employer.jobOfferNotFoundTitle")}>
        <div className="space-y-4 text-sm text-slate-600">
          <p>{t("employer.jobOfferNotFoundDescription")}</p>
          <Link className="inline-flex rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white" to="/dashboard/employer">
            {t("employer.backToDashboard")}
          </Link>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="inline-flex w-fit rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm" to="/dashboard/employer">
          {t("employer.backToDashboard")}
        </Link>
        <button
          className="inline-flex w-fit rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:bg-slate-300"
          disabled={deleting}
          onClick={async () => {
            if (!jobId) {
              return;
            }

            const confirmed = window.confirm(t("employer.deleteConfirm"));

            if (!confirmed) {
              return;
            }

            setDeleting(true);

            try {
              await api.deleteEmployerJob(jobId);
              navigate("/dashboard/employer", { replace: true });
            } finally {
              setDeleting(false);
            }
          }}
          type="button"
        >
          {deleting ? t("common.loading") : t("employer.deleteJob")}
        </button>
      </div>

      <SectionCard
        title={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{job.title}</span>
            <StatusBadge status={job.status} />
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            {job.companyName ? <span className="rounded-full bg-slate-100 px-3 py-1">{job.companyName}</span> : null}
            {job.location ? <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span> : null}
            {job.type ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {job.type === "full-time" ? t("filters.fullTime") : t("filters.partTime")}
              </span>
            ) : null}
            {job.workplaceType ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">{t(`workplaceTypes.${job.workplaceType}`)}</span>
            ) : null}
            {job.experienceLevel ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">{t(`experienceLevels.${job.experienceLevel}`)}</span>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="text-xs font-semibold text-emerald-700">{t("labels.salaryRange")}</div>
              <div className="mt-1 font-bold text-emerald-900">{formatSalary(job)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">{t("labels.vacancies")}</div>
              <div className="mt-1 font-bold text-slate-900">{job.vacancies ?? "—"}</div>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <div className="text-xs font-semibold text-sky-700">{t("labels.applicationDeadline")}</div>
              <div className="mt-1 font-bold text-sky-900">
                {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString("fa-IR") : "—"}
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="text-xs font-semibold text-amber-700">{t("labels.applicants")}</div>
              <div className="mt-1 font-bold text-amber-900">{job._count?.applications ?? candidates.length}</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">{t("employer.jobDescriptionTitle")}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-slate-600">{job.description}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t("employer.candidatesTitle")}>
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
      </SectionCard>
    </div>
  );
}
