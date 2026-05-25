import { useEffect, useState } from "react";

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
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
