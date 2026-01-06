import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { render, checkA11y } from "@tests/test-utils";
import { createNextThemesMock } from "@tests/mocks/next-themes";
import { SITE } from "@/config/site";
import { TopBar } from "../TopBar";

vi.mock("next-themes", () => createNextThemesMock());

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

  describe("Theme Controls Placeholder", () => {
    it("has placeholder element for theme controls", () => {
      render(<TopBar />);

      // Theme controls area should exist (identified by data attribute for future integration)
      expect(screen.getByTestId("theme-controls-placeholder")).toBeInTheDocument();
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
