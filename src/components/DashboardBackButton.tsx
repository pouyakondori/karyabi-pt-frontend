import { useNavigate } from "react-router-dom";

import { t } from "../lib/i18n";

export function DashboardBackButton() {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
            return;
          }

          navigate("/", { replace: true });
        }}
        type="button"
      >
        <span aria-hidden="true">→</span>
        <span>{t("common.back")}</span>
      </button>
    </div>
  );
}
