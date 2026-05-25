import { useEffect, useState } from "react";

import { JobList } from "../components/JobList";
import { SectionCard } from "../components/SectionCard";
import { MultiStepProfileForm } from "../components/forms/MultiStepProfileForm";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { Job, JobSeekerProfile } from "../types";

export function JobSeekerDashboard() {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const { hasConsent } = useGDPR();

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    void api
      .getSeekerProfile()
      .then((response) => setProfile(response.data))
      .catch(() => setProfile(null));
    void api
      .getRecommendedJobs()
      .then((response) => setRecommendedJobs(response.data))
      .catch(() => setRecommendedJobs([]));
  }, [hasConsent]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <SectionCard title={t("seeker.profileTitle")}>
        <MultiStepProfileForm
          initialValue={profile}
          onSubmit={async (payload) => {
            const response = await api.saveSeekerProfile(payload);
            setProfile(response.data);
          }}
        />
      </SectionCard>
      <SectionCard title={t("seeker.recommendedTitle")}>
        <JobList emptyKey="home.empty" jobs={recommendedJobs} onApply={(jobId) => void api.applyToJob(jobId)} />
      </SectionCard>
    </div>
  );
}
