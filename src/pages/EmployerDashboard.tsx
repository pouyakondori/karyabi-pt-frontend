import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ApplicantsTracker } from "../components/ApplicantsTracker";
import { SectionCard } from "../components/SectionCard";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { CandidateApplication, Job } from "../types";

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const { hasConsent } = useGDPR();

  const loadJobs = async () => {
    const response = await api.getEmployerJobs().catch(() => ({ data: [] as Job[] }));
    setJobs(response.data);

    if (response.data.length === 0) {
      setSelectedJobId(undefined);
      return;
    }

    setSelectedJobId((current) => current ?? response.data[0].id);
  };

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    void loadJobs();
  }, [hasConsent]);

  useEffect(() => {
    if (!hasConsent || !selectedJobId) {
      setCandidates([]);
      return;
    }

    void api
      .getCandidates(selectedJobId)
      .then((response) => setCandidates(response.data.applications))
      .catch(() => setCandidates([]));
  }, [hasConsent, selectedJobId]);

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

      <SectionCard title={t("employer.trackerTitle")}>
        <ApplicantsTracker
          candidates={candidates}
          jobs={jobs}
          onSelectJob={setSelectedJobId}
          selectedJobId={selectedJobId}
        />
      </SectionCard>
    </div>
  );
}
