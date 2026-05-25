import { useState } from "react";

import { t } from "../../lib/i18n";
import type { JobType } from "../../types";

type EmployerJobFormProps = {
  onSubmit: (payload: { title: string; description: string; type: JobType }) => Promise<void>;
};

export function EmployerJobForm({ onSubmit }: EmployerJobFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<JobType>("full-time");

  return (
    <div className="grid gap-4">
      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">{t("form.title")}</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">{t("form.description")}</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <div className="space-y-2 text-sm text-slate-700">
        <div className="font-medium">{t("form.type")}</div>
        <div className="flex gap-3">
          <button
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              type === "full-time" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
            onClick={() => setType("full-time")}
            type="button"
          >
            {t("filters.fullTime")}
          </button>
          <button
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              type === "part-time" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
            onClick={() => setType("part-time")}
            type="button"
          >
            {t("filters.partTime")}
          </button>
        </div>
      </div>
      <button
        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
        onClick={() => {
          void onSubmit({ title, description, type });
        }}
        type="button"
      >
        {t("common.submit")}
      </button>
    </div>
  );
}
