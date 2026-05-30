import { useEffect, useState, type ReactNode } from "react";

import { t } from "../../lib/i18n";
import type { JobSeekerProfile, PortugalRegion } from "../../types";
import { ResumeUploadField } from "./ResumeUploadField";

const regions: PortugalRegion[] = [
  "aveiro",
  "beja",
  "braga",
  "braganca",
  "castelo_branco",
  "coimbra",
  "evora",
  "faro",
  "guarda",
  "leiria",
  "lisboa",
  "portalegre",
  "porto",
  "santarem",
  "setubal",
  "viana_do_castelo",
  "vila_real",
  "viseu",
  "azores",
  "madeira"
];

const defaultProfile: JobSeekerProfile = {
  fullName: "",
  hasResidencePermit: false,
  residencyExpirationDate: "",
  hasWorkPermit: false,
  residencyPermitType: "",
  canRideBike: false,
  universityFieldAndDegree: "",
  hasPortugueseDrivingLicense: false,
  hasUberExperience: false,
  generalExpertise: [],
  portugalRegion: "lisboa",
  phoneNumber: "",
  address: "",
  resumeUrl: "",
  linkedinUrl: ""
};

type JobSeekerProfileFormProps = {
  initialValue?: Partial<JobSeekerProfile> | null;
  onSubmit: (payload: JobSeekerProfile) => Promise<void>;
  onCancel?: () => void;
};

export function JobSeekerProfileForm({ initialValue, onSubmit, onCancel }: JobSeekerProfileFormProps) {
  const [form, setForm] = useState<JobSeekerProfile>({
    ...defaultProfile,
    ...initialValue,
    generalExpertise: initialValue?.generalExpertise ?? []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      ...defaultProfile,
      ...initialValue,
      generalExpertise: initialValue?.generalExpertise ?? []
    });
  }, [initialValue]);

  const setField = <K extends keyof JobSeekerProfile>(field: K, value: JobSeekerProfile[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Field labelKey="form.fullName">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
          />
        </Field>
        <Field labelKey="form.phoneNumber">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.phoneNumber}
            onChange={(event) => setField("phoneNumber", event.target.value)}
          />
        </Field>
        <Field className="md:col-span-2" labelKey="form.address">
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.address}
            onChange={(event) => setField("address", event.target.value)}
          />
        </Field>
        <Field labelKey="form.portugalRegion">
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.portugalRegion}
            onChange={(event) => setField("portugalRegion", event.target.value as PortugalRegion)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {t(`regions.${region}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleField
          checked={form.hasResidencePermit}
          labelKey="form.hasResidencePermit"
          onChange={(value) => setField("hasResidencePermit", value)}
        />
        <ToggleField checked={form.hasWorkPermit} labelKey="form.hasWorkPermit" onChange={(value) => setField("hasWorkPermit", value)} />
        <ToggleField checked={form.canRideBike} labelKey="form.canRideBike" onChange={(value) => setField("canRideBike", value)} />
        <ToggleField
          checked={form.hasPortugueseDrivingLicense}
          labelKey="form.hasPortugueseDrivingLicense"
          onChange={(value) => setField("hasPortugueseDrivingLicense", value)}
        />
        <ToggleField
          checked={form.hasUberExperience}
          labelKey="form.hasUberExperience"
          onChange={(value) => setField("hasUberExperience", value)}
        />
        <Field labelKey="form.residencyExpirationDate">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            type="date"
            value={form.residencyExpirationDate ?? ""}
            onChange={(event) => setField("residencyExpirationDate", event.target.value)}
          />
        </Field>
        <Field labelKey="form.residencyPermitType">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.residencyPermitType}
            onChange={(event) => setField("residencyPermitType", event.target.value)}
          />
        </Field>
        <Field labelKey="form.universityFieldAndDegree">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.universityFieldAndDegree}
            onChange={(event) => setField("universityFieldAndDegree", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field className="md:col-span-2" labelKey="form.generalExpertise">
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.generalExpertise.join(", ")}
            onChange={(event) =>
              setField(
                "generalExpertise",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
          />
        </Field>
        <div className="md:col-span-2">
          <ResumeUploadField value={form.resumeUrl} onChange={(value) => setField("resumeUrl", value)} />
        </div>
        <Field className="md:col-span-2" labelKey="form.linkedinUrl">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            value={form.linkedinUrl ?? ""}
            onChange={(event) => setField("linkedinUrl", event.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
          disabled={saving}
          onClick={async () => {
            setSaving(true);

            try {
              await onSubmit(form);
            } finally {
              setSaving(false);
            }
          }}
          type="button"
        >
          {saving ? t("common.loading") : t("common.save")}
        </button>
        {onCancel ? (
          <button
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onCancel}
            type="button"
          >
            {t("common.cancel")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

type FieldProps = {
  labelKey: string;
  children: ReactNode;
  className?: string;
};

function Field({ labelKey, children, className }: FieldProps) {
  return (
    <label className={`block space-y-2 text-sm text-slate-700 ${className ?? ""}`}>
      <span className="font-medium">{t(labelKey)}</span>
      {children}
    </label>
  );
}

type ToggleFieldProps = {
  labelKey: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ToggleField({ labelKey, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
      <span>{t(labelKey)}</span>
      <input checked={checked} className="h-4 w-4" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
    </label>
  );
}
