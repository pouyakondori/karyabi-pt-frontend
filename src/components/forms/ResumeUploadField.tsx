import { useState } from "react";

import { t } from "../../lib/i18n";

type ResumeUploadFieldProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function ResumeUploadField({ value, onChange }: ResumeUploadFieldProps) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
      <label className="block space-y-2 text-sm text-slate-700">
        <span className="font-medium">{t("form.resumeUpload")}</span>
        <input
          accept=".pdf,.doc,.docx"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) {
              return;
            }

            setFileName(file.name);
            onChange(URL.createObjectURL(file));
          }}
        />
      </label>
      <label className="block space-y-2 text-sm text-slate-700">
        <span className="font-medium">{t("form.resumeUrl")}</span>
        <input value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
      </label>
      {fileName ? <div className="text-xs text-slate-500">{fileName}</div> : null}
    </div>
  );
}
