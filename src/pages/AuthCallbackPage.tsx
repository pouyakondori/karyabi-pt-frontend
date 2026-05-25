import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { SectionCard } from "../components/SectionCard";
import { useAuth } from "../contexts/AuthContext";
import { t } from "../lib/i18n";
import type { Role } from "../types";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const role = searchParams.get("role") as Role | null;
    const email = searchParams.get("email") ?? undefined;

    if (!token || !userId || !role) {
      navigate("/", { replace: true });
      return;
    }

    setSession({ userId, role, email }, token);

    if (role === "job_seeker") {
      navigate("/seeker", { replace: true });
      return;
    }

    if (role === "employer") {
      navigate("/employer", { replace: true });
      return;
    }

    navigate("/admin", { replace: true });
  }, [navigate, searchParams, setSession]);

  return <SectionCard title={t("common.loading")} />;
}
