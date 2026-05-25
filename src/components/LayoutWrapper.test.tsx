import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "../contexts/AuthContext";
import { GDPRProvider } from "../contexts/GDPRContext";
import { t } from "../lib/i18n";
import { LayoutWrapper } from "./LayoutWrapper";

describe("LayoutWrapper", () => {
  it("unblocks the layout after accepting gdpr consent", () => {
    window.localStorage.clear();

    render(
      <MemoryRouter>
        <GDPRProvider>
          <AuthProvider>
            <LayoutWrapper>
              <div data-testid="page-content" />
            </LayoutWrapper>
          </AuthProvider>
        </GDPRProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(t("gdpr.title"))).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(t("gdpr.checkbox")));
    fireEvent.click(screen.getByText(t("gdpr.button")));

    expect(screen.queryByText(t("gdpr.title"))).not.toBeInTheDocument();
    expect(window.localStorage.getItem("karyabi-gdpr-consent")).toBe("true");
  });
});
