import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { t } from "../lib/i18n";

export function NavBar() {
  const { session, signOut } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="text-lg font-bold text-emerald-700 transition hover:text-emerald-800" to="/">
          {t("app.title")}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-700">
          {session ? (
            <button className="rounded-full bg-slate-900 px-4 py-2 text-white" onClick={signOut} type="button">
              {t("nav.logout")}
            </button>
          ) : (
            <Link className="rounded-full bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700" to="/login">
              {t("nav.login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
