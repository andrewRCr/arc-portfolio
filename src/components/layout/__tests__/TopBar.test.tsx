import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { render, checkA11y } from "@tests/test-utils";
import { createNextThemesMock } from "@tests/mocks/next-themes";
import { SITE } from "@/config/site";
import { TopBar } from "../TopBar";

vi.mock("next-themes", () => createNextThemesMock());

// Mock LayoutPreferencesContext (required by ThemeControl)
vi.mock("@/contexts/LayoutPreferencesContext", () => ({
  useLayoutPreferences: () => ({
    layoutMode: "boxed",
    setLayoutMode: vi.fn(),
    isDrawerOpen: false,
    setDrawerOpen: vi.fn(),
  }),
}));

// Mock IntroContext (TopBar uses triggerReplay for branding click)
vi.mock("@/contexts/IntroContext", () => ({
  useIntroContext: () => ({
    state: "complete",
    shouldShow: false,
    reducedMotion: false,
    introPhase: "idle",
    setIntroPhase: vi.fn(),
    replayCount: 0,
    startAnimation: vi.fn(),
    skipAnimation: vi.fn(),
    completeAnimation: vi.fn(),
    triggerReplay: vi.fn(),
  }),
  IntroProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("TopBar", () => {
  describe("Branding", () => {
    it("renders site handle from config", () => {
      render(<TopBar />);

      // Site handle should be visible (from SITE config)
      expect(screen.getByText(SITE.handle)).toBeInTheDocument();
    });

    it("branding links to home page", () => {
      render(<TopBar />);

      const brandingLink = screen.getByRole("link", { name: new RegExp(SITE.handle, "i") });
      expect(brandingLink).toHaveAttribute("href", "/");
    });
  });

  describe("Theme Controls", () => {
    it("has theme controls area", () => {
      render(<TopBar />);

      // Theme controls area should exist
      expect(screen.getByTestId("theme-controls")).toBeInTheDocument();
    });

    it("renders ThemeControl component", async () => {
      render(<TopBar />);

      // ThemeControl renders the swatch trigger after delayed show (hydration safety)
      // ResponsiveSwitch renders both mobile (drawer) and desktop (popover) in DOM
      const swatches = await screen.findAllByTestId("theme-swatch");
      expect(swatches.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Layout Structure", () => {
    it("renders as header element for semantic structure", () => {
      render(<TopBar />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<TopBar />);
      expect(results).toHaveNoViolations();
    });

    it("branding link is keyboard accessible", () => {
      render(<TopBar />);

      const brandingLink = screen.getByRole("link", { name: new RegExp(SITE.handle, "i") });
      // Links are focusable by default unless explicitly excluded with tabIndex="-1"
      expect(brandingLink).not.toHaveAttribute("tabindex", "-1");
      // Verify link can receive focus
      brandingLink.focus();
      expect(brandingLink).toHaveFocus();
    });
  });
});
