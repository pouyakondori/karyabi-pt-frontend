import { useEffect, useState } from "react";

import { ApplicantsTracker } from "../components/ApplicantsTracker";
import { SectionCard } from "../components/SectionCard";
import { EmployerJobForm } from "../components/forms/EmployerJobForm";
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
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <SectionCard title={t("employer.postTitle")}>
        <EmployerJobForm
          onSubmit={async (payload) => {
            await api.createEmployerJob(payload);
            await loadJobs();
          }}
        />
      </SectionCard>
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
