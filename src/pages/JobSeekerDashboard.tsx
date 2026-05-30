import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JobList } from "../components/JobList";
import { SectionCard } from "../components/SectionCard";
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
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title={t("seeker.profileCardTitle")}>
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-600">{t("seeker.profileCardDescription")}</p>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">{profile?.fullName || t("seeker.profileIncompleteTitle")}</div>
            <div className="mt-2 text-slate-600">
              {profile ? t("seeker.profileAvailableDescription") : t("seeker.profileIncompleteDescription")}
            </div>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            to="/dashboard/job-seeker/profile"
          >
            {profile ? t("seeker.viewProfile") : t("seeker.completeProfile")}
          </Link>
        </div>
      </SectionCard>
      <SectionCard title={t("seeker.recommendedTitle")}>
        <JobList emptyKey="home.empty" jobs={recommendedJobs} onApply={(jobId) => void api.applyToJob(jobId)} />
      </SectionCard>
    </div>
  );
}
