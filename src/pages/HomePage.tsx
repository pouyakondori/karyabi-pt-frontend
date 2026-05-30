import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JobFilters } from "../components/JobFilters";
import { JobList } from "../components/JobList";
import { SectionCard } from "../components/SectionCard";
import { useAuth } from "../contexts/AuthContext";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { Job, JobType } from "../types";

export function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [type, setType] = useState<JobType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { session } = useAuth();
  const { hasConsent } = useGDPR();

  useEffect(() => {
    if (!hasConsent) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getPublicJobs(type)
      .then((response) => setJobs(response.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [hasConsent, type]);

  return (
    <>
      <div className="space-y-8">
        <SectionCard title={t("home.heroTitle")}>
          <p className="text-sm leading-7 text-slate-600">{t("home.heroDescription")}</p>
        </SectionCard>
        <SectionCard title={t("home.jobsTitle")}>
          <div className="space-y-4">
            <JobFilters activeType={type} onChange={setType} />
            {loading ? <div className="text-sm text-slate-500">{t("common.loading")}</div> : null}
            {!loading ? (
              <JobList
                emptyKey="home.empty"
                jobs={jobs}
                onApply={session?.role === "job_seeker" ? (jobId) => void api.applyToJob(jobId) : undefined}
                onJobClick={!session ? () => setShowLoginPrompt(true) : undefined}
              />
            ) : null}
          </div>
        </SectionCard>
      </div>

      {showLoginPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="space-y-3">
              <h2 className="text-xl font-black text-slate-900">{t("home.loginPromptTitle")}</h2>
              <p className="text-sm leading-7 text-slate-600">{t("home.loginPromptDescription")}</p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700"
                onClick={() => setShowLoginPrompt(false)}
                type="button"
              >
                {t("common.cancel")}
              </button>
              <Link
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-emerald-700"
                onClick={() => setShowLoginPrompt(false)}
                to="/login"
              >
                {t("home.loginPromptAction")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
