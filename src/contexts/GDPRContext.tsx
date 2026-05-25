import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { gdprStorageKey } from "../services/api";

type GdprContextValue = {
  hasConsent: boolean;
  acceptConsent: () => void;
};

const GdprContext = createContext<GdprContextValue | undefined>(undefined);

export function GDPRProvider({ children }: PropsWithChildren) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(window.localStorage.getItem(gdprStorageKey) === "true");
  }, []);

  const value = useMemo<GdprContextValue>(
    () => ({
      hasConsent,
      acceptConsent: () => {
        window.localStorage.setItem(gdprStorageKey, "true");
        document.cookie = "karyabi_gdpr_consented=true; path=/; SameSite=Lax";
        setHasConsent(true);
      }
    }),
    [hasConsent]
  );

  return <GdprContext.Provider value={value}>{children}</GdprContext.Provider>;
}

export function useGDPR() {
  const context = useContext(GdprContext);

  if (!context) {
    throw new Error("gdpr_context_missing");
  }

  return context;
}
