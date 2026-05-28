import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useGDPR } from "../contexts/GDPRContext";
import { getDashboardPath } from "../lib/auth";
import { t } from "../lib/i18n";
import type { Role } from "../types";

type LoginOption = {
  role: Role;
  title: string;
  description: string;
  accentClassName: string;
  buttonClassName: string;
  badge: string;
  disabled?: boolean;
  disabledLabel?: string;
};

export function LoginPage() {
  const { session, signIn, isDevAuthMode } = useAuth();
  const { hasConsent } = useGDPR();

  if (session) {
    return <Navigate replace to={getDashboardPath(session.role)} />;
  }

  const options: LoginOption[] = [
    {
      role: "employer",
      title: t("login.employerTitle"),
      description: t("login.employerDescription"),
      accentClassName: "from-emerald-500/20 to-teal-500/5",
      buttonClassName: "bg-emerald-600 hover:bg-emerald-700",
      badge: t(isDevAuthMode ? "login.devModeBadge" : "login.googleModeBadge")
    },
    {
      role: "job_seeker",
      title: t("login.seekerTitle"),
      description: t("login.seekerDescription"),
      accentClassName: "from-sky-500/20 to-indigo-500/5",
      buttonClassName: "bg-sky-600 hover:bg-sky-700",
      badge: t(isDevAuthMode ? "login.devModeBadge" : "login.googleModeBadge")
    },
    {
      role: "admin",
      title: t("login.adminTitle"),
      description: t("login.adminDescription"),
      accentClassName: "from-amber-500/20 to-orange-500/5",
      buttonClassName: "bg-amber-500 hover:bg-amber-600",
      badge: t(isDevAuthMode ? "login.devModeBadge" : "login.adminLimitedBadge"),
      disabled: !isDevAuthMode,
      disabledLabel: t("login.adminDisabled")
    }
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.22),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.16),_transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-100">
              {t("login.kicker")}
            </span>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{t("login.title")}</h1>
            <p className="max-w-2xl text-sm leading-8 text-slate-200 sm:text-base">{t("login.description")}</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="text-sm font-bold text-white">{t("login.noticeTitle")}</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              <li>{t("login.permanentRoleNotice")}</li>
              <li>{t("login.gdprNotice")}</li>
              <li>{t("login.adminNotice")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {options.map((option) => {
          const isDisabled = !hasConsent || option.disabled;
          const buttonLabel = option.disabled ? option.disabledLabel ?? t("login.loginAction") : t("login.loginAction");

          return (
            <article
              key={option.role}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${option.accentClassName}`} />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-slate-900">{option.title}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {option.badge}
                  </span>
                </div>
                <p className="min-h-24 text-sm leading-7 text-slate-600">{option.description}</p>
                <button
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${option.buttonClassName}`}
                  disabled={isDisabled}
                  onClick={() => {
                    void signIn(option.role);
                  }}
                  type="button"
                >
                  {buttonLabel}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-amber-950">{t("login.warningTitle")}</h2>
            <p className="text-sm leading-7 text-amber-900">{t("login.warningDescription")}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-slate-600 shadow-sm sm:max-w-xs">
            {hasConsent ? t("login.readyMessage") : t("login.acceptPrivacyMessage")}
          </div>
        </div>
      </section>
    </div>
  );
}
