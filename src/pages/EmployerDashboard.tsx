import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { SectionCard } from "../components/SectionCard";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { Job } from "../types";

function formatSalary(job: Job) {
  if (typeof job.salaryMin !== "number" || typeof job.salaryMax !== "number") {
    return null;
  }

  return `${job.salaryMin.toLocaleString("en-US")} - ${job.salaryMax.toLocaleString("en-US")} €`;
}

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { hasConsent } = useGDPR();

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    void api
      .getEmployerJobs()
      .then((response) => setJobs(response.data))
      .catch(() => setJobs([]));
  }, [hasConsent]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">{t("employer.title")}</h1>
            <p className="text-sm leading-7 text-slate-600">{t("employer.dashboardDescription")}</p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            to="/create-job-offer"
          >
            {t("employer.postTitle")}
          </Link>
        </div>
      </section>

      <SectionCard title={t("employer.jobOffersTitle")}>
        <div className="grid gap-4">
          {jobs.length === 0 ? <div className="text-sm text-slate-500">{t("employer.emptyJobs")}</div> : null}
          {jobs.map((job) => {
            const salary = formatSalary(job);

            return (
              <Link
                key={job.id}
                className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                to={`/dashboard/employer/job-offers/${job.id}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      {job.companyName ? <span className="rounded-full bg-slate-100 px-3 py-1">{job.companyName}</span> : null}
                      {job.location ? <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span> : null}
                      {salary ? <span className="rounded-full bg-slate-100 px-3 py-1">{salary}</span> : null}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">{job.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {job.status ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          job.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : job.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {t(`labels.${job.status}`)}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      {t("employer.viewJobOffer")}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  {t("labels.applicants")}: {job._count?.applications ?? 0}
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
