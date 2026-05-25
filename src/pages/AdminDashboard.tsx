import { useEffect, useState } from "react";

import { AdminModerationQueue } from "../components/AdminModerationQueue";
import { SectionCard } from "../components/SectionCard";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { Job } from "../types";

export function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { hasConsent } = useGDPR();

  const loadPending = async () => {
    const response = await api.getPendingJobs().catch(() => ({ data: [] as Job[] }));
    setJobs(response.data);
  };

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    void loadPending();
  }, [hasConsent]);

  return (
    <SectionCard title={t("admin.title")}>
      <AdminModerationQueue
        jobs={jobs}
        onUpdate={async (jobId, status) => {
          await api.updateJobStatus(jobId, status);
          await loadPending();
        }}
      />
    </SectionCard>
  );
}
