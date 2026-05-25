import type { PropsWithChildren } from "react";

import { useGDPR } from "../contexts/GDPRContext";
import { GdprModal } from "./GdprModal";
import { NavBar } from "./NavBar";

export function LayoutWrapper({ children }: PropsWithChildren) {
  const { hasConsent } = useGDPR();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      {!hasConsent ? <GdprModal /> : null}
    </div>
  );
}
