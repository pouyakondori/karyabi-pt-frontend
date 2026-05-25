import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useGDPR } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";

export function NavBar() {
  const { session, signIn, signOut, isDevAuthMode } = useAuth();
  const { hasConsent } = useGDPR();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-emerald-700">{t("app.title")}</div>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" to="/">
            {t("nav.home")}
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" to="/seeker">
            {t("nav.seeker")}
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" to="/employer">
            {t("nav.employer")}
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" to="/admin">
            {t("nav.admin")}
          </Link>
          {session ? (
            <button className="rounded-full bg-slate-900 px-4 py-2 text-white" onClick={signOut} type="button">
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <button
                className="rounded-full bg-emerald-600 px-4 py-2 text-white disabled:bg-slate-300"
                disabled={!hasConsent}
                onClick={() => {
                  void signIn("job_seeker");
                }}
                type="button"
              >
                {t(isDevAuthMode ? "nav.seekerDevLogin" : "nav.seekerLogin")}
              </button>
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-white disabled:bg-slate-300"
                disabled={!hasConsent}
                onClick={() => {
                  void signIn("employer");
                }}
                type="button"
              >
                {t(isDevAuthMode ? "nav.employerDevLogin" : "nav.employerLogin")}
              </button>
              {isDevAuthMode ? (
                <button
                  className="rounded-full bg-amber-600 px-4 py-2 text-white disabled:bg-slate-300"
                  disabled={!hasConsent}
                  onClick={() => {
                    void signIn("admin");
                  }}
                  type="button"
                >
                  {t("nav.adminDevLogin")}
                </button>
              ) : null}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
