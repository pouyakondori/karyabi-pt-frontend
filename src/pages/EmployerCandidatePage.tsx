import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import { SectionCard } from "../components/SectionCard";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { api } from "../services/api";
import type { CandidateApplication, Job, JobSeekerProfile } from "../types";

type ActiveModal = "accept" | "reject" | null;

function formatValue(value: string | boolean | undefined | null) {
  if (typeof value === "boolean") {
    return value ? t("common.yes") : t("common.no");
  }

  return value && value.trim() ? value : "—";
}

function formatSalary(job: Job) {
  if (typeof job.salaryMin !== "number" || typeof job.salaryMax !== "number") {
    return "—";
  }

  return `${job.salaryMin.toLocaleString("en-US")} - ${job.salaryMax.toLocaleString("en-US")} €`;
}

function StatusBadge({ status }: { status?: Job["status"] | CandidateApplication["status"] }) {
  if (!status) {
    return null;
  }

  const palette =
    status === "pending"
      ? "bg-amber-50 text-amber-700"
      : status === "approved" || status === "accepted"
        ? "bg-emerald-50 text-emerald-700"
        : status === "closed"
          ? "bg-slate-100 text-slate-700"
          : "bg-rose-50 text-rose-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${palette}`}>{t(`labels.${status}`)}</span>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Modal({
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  confirmClassName = "bg-emerald-600 hover:bg-emerald-700",
  disabled = false
}: {
  title: string;
  description: string;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmClassName?: string;
  disabled?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <p className="text-sm leading-7 text-slate-600">{description}</p>
          {children}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700" onClick={onClose} type="button">
            {cancelLabel}
          </button>
          <button
            className={`rounded-2xl px-4 py-2 font-semibold text-white transition disabled:bg-slate-300 ${confirmClassName}`}
            disabled={disabled}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmployerCandidatePage() {
  const { jobId, candidateId } = useParams();
  const { hasConsent } = useGDPR();
  const [job, setJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<CandidateApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reasonError, setReasonError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasConsent || !jobId || !candidateId) {
      return;
    }

    setLoading(true);
    void api
      .getEmployerCandidate(jobId, candidateId)
      .then((response) => {
        setJob(response.data.job);
        setApplication(response.data.application);
      })
      .catch(() => {
        setJob(null);
        setApplication(null);
      })
      .finally(() => setLoading(false));
  }, [candidateId, hasConsent, jobId]);

  const profile = application?.seeker.seekerProfile;
  const canReview = application?.status === "pending";
  const jobOfferPath = jobId ? `/dashboard/employer/job-offers/${jobId}` : "/dashboard/employer";

  const contactItems = useMemo(
    () => [
      { label: t("labels.email"), value: application?.seeker.email ?? "—" },
      { label: t("form.phoneNumber"), value: formatValue(profile?.phoneNumber) },
      {
        label: t("form.portugalRegion"),
        value: profile?.portugalRegion ? t(`regions.${profile.portugalRegion}`) : "—"
      },
      { label: t("form.address"), value: formatValue(profile?.address) }
    ],
    [application?.seeker.email, profile?.address, profile?.phoneNumber, profile?.portugalRegion]
  );

  const qualificationItems = useMemo(
    () => [
      { label: t("form.hasResidencePermit"), value: formatValue(profile?.hasResidencePermit) },
      {
        label: t("form.residencyExpirationDate"),
        value: profile?.residencyExpirationDate ? new Date(profile.residencyExpirationDate).toLocaleDateString("fa-IR") : "—"
      },
      { label: t("form.hasWorkPermit"), value: formatValue(profile?.hasWorkPermit) },
      { label: t("form.residencyPermitType"), value: formatValue(profile?.residencyPermitType) },
      { label: t("form.canRideBike"), value: formatValue(profile?.canRideBike) },
      {
        label: t("form.hasPortugueseDrivingLicense"),
        value: formatValue(profile?.hasPortugueseDrivingLicense)
      },
      { label: t("form.hasUberExperience"), value: formatValue(profile?.hasUberExperience) },
      {
        label: t("form.universityFieldAndDegree"),
        value: formatValue(profile?.universityFieldAndDegree)
      }
    ],
    [
      profile?.canRideBike,
      profile?.hasPortugueseDrivingLicense,
      profile?.hasResidencePermit,
      profile?.hasUberExperience,
      profile?.hasWorkPermit,
      profile?.residencyExpirationDate,
      profile?.residencyPermitType,
      profile?.universityFieldAndDegree
    ]
  );

  if (loading) {
    return <SectionCard title={t("common.loading")} />;
  }

  if (!job || !application) {
    return (
      <SectionCard title={t("employer.candidateNotFoundTitle")}>
        <div className="space-y-4 text-sm text-slate-600">
          <p>{t("employer.candidateNotFoundDescription")}</p>
          <Link className="inline-flex rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white" to={jobOfferPath}>
            {t("employer.backToJobOffer")}
          </Link>
        </div>
      </SectionCard>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link className="inline-flex w-fit rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm" to={jobOfferPath}>
            {t("employer.backToJobOffer")}
          </Link>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={application.status} />
            {job.status ? <StatusBadge status={job.status} /> : null}
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-4">
              <h1 className="text-3xl font-black">
                {profile?.fullName ?? application.seeker.email}
              </h1>
              <p className="text-sm leading-8 text-slate-200">{t("employer.candidateProfileTitle")}</p>
              {profile?.generalExpertise?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.generalExpertise.map((item) => (
                    <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-emerald-100">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-sm font-bold text-white">{t("employer.candidateStatusTitle")}</div>
              <div className="mt-4 grid gap-3 text-sm text-slate-200">
                <div>
                  <div className="text-xs text-slate-300">{t("labels.appliedAt")}</div>
                  <div className="mt-1 font-semibold">{new Date(application.appliedAt).toLocaleDateString("fa-IR")}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-300">{t("labels.status")}</div>
                  <div className="mt-2"><StatusBadge status={application.status} /></div>
                </div>
                {application.reviewedAt ? (
                  <div>
                    <div className="text-xs text-slate-300">{t("labels.reviewedAt")}</div>
                    <div className="mt-1 font-semibold">{new Date(application.reviewedAt).toLocaleDateString("fa-IR")}</div>
                  </div>
                ) : null}
                {application.rejectionReason ? (
                  <div>
                    <div className="text-xs text-slate-300">{t("labels.rejectionReason")}</div>
                    <div className="mt-1 leading-7">{application.rejectionReason}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {canReview ? (
          <SectionCard title={t("employer.candidateStatusTitle")}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
                onClick={() => setActiveModal("accept")}
                type="button"
              >
                {t("employer.acceptCandidate")}
              </button>
              <button
                className="rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white transition hover:bg-rose-700"
                onClick={() => setActiveModal("reject")}
                type="button"
              >
                {t("employer.rejectCandidate")}
              </button>
            </div>
          </SectionCard>
        ) : (
          <SectionCard title={t("employer.candidateStatusTitle")}>
            <div className="text-sm text-slate-600">{t("employer.decisionCompleted")}</div>
          </SectionCard>
        )}

        <SectionCard title={t("employer.candidateJobContextTitle")}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-black text-slate-900">{job.title}</span>
              {job.status ? <StatusBadge status={job.status} /> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DetailItem label={t("form.companyName")} value={job.companyName ?? "—"} />
              <DetailItem label={t("form.location")} value={job.location ?? "—"} />
              <DetailItem label={t("labels.salaryRange")} value={formatSalary(job)} />
              <DetailItem label={t("labels.vacancies")} value={String(job.vacancies ?? "—")} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("employer.candidateContactTitle")}>
          <div className="grid gap-4 md:grid-cols-2">{contactItems.map((item) => <DetailItem key={item.label} {...item} />)}</div>
        </SectionCard>

        <SectionCard title={t("employer.candidateQualificationsTitle")}>
          <div className="grid gap-4 md:grid-cols-2">{qualificationItems.map((item) => <DetailItem key={item.label} {...item} />)}</div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-500">{t("form.generalExpertise")}</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {profile?.generalExpertise?.length ? profile.generalExpertise.join("، ") : "—"}
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("employer.candidateLinksTitle")}>
          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem label={t("form.resumeUrl")} value={profile?.resumeUrl ?? "—"} />
            <DetailItem label={t("form.linkedinUrl")} value={profile?.linkedinUrl ?? "—"} />
          </div>
          {(profile?.resumeUrl || profile?.linkedinUrl) ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {profile?.resumeUrl ? (
                <a className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href={profile.resumeUrl} rel="noreferrer" target="_blank">
                  {t("form.resumeUpload")}
                </a>
              ) : null}
              {profile?.linkedinUrl ? (
                <a className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href={profile.linkedinUrl} rel="noreferrer" target="_blank">
                  LinkedIn
                </a>
              ) : null}
            </div>
          ) : null}
        </SectionCard>
      </div>

      {activeModal === "accept" ? (
        <Modal
          cancelLabel={t("common.cancel")}
          confirmLabel={submitting ? t("common.loading") : t("employer.acceptCandidate")}
          description={t("employer.acceptModalDescription")}
          disabled={submitting}
          title={t("employer.acceptModalTitle")}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            if (!jobId || !candidateId) {
              return;
            }

            setSubmitting(true);
            void api
              .reviewEmployerCandidate(jobId, candidateId, { decision: "accepted" })
              .then((response) => {
                setApplication(response.data.application);
                setJob(response.data.job);
                setActiveModal(null);
              })
              .finally(() => setSubmitting(false));
          }}
        />
      ) : null}

      {activeModal === "reject" ? (
        <Modal
          cancelLabel={t("common.cancel")}
          confirmClassName="bg-rose-600 hover:bg-rose-700"
          confirmLabel={submitting ? t("common.loading") : t("employer.rejectCandidate")}
          description={t("employer.rejectModalDescription")}
          disabled={submitting}
          title={t("employer.rejectModalTitle")}
          onClose={() => {
            setActiveModal(null);
            setReasonError(null);
          }}
          onConfirm={() => {
            if (!jobId || !candidateId) {
              return;
            }

            if (!rejectionReason.trim()) {
              setReasonError(t("validation.requiredField"));
              return;
            }

            setSubmitting(true);
            void api
              .reviewEmployerCandidate(jobId, candidateId, {
                decision: "rejected",
                rejectionReason
              })
              .then((response) => {
                setApplication(response.data.application);
                setJob(response.data.job);
                setActiveModal(null);
                setRejectionReason("");
                setReasonError(null);
              })
              .finally(() => setSubmitting(false));
          }}
        >
          <div className="mt-4 space-y-2">
            <textarea
              className={`min-h-32 w-full rounded-2xl border px-4 py-3 outline-none transition ${
                reasonError ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-emerald-500"
              }`}
              placeholder={t("employer.rejectionReasonPlaceholder")}
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);
                if (reasonError) {
                  setReasonError(null);
                }
              }}
            />
            {reasonError ? <div className="text-xs font-medium text-rose-600">{reasonError}</div> : null}
          </div>
        </Modal>
      ) : null}
    </>
  );
}
