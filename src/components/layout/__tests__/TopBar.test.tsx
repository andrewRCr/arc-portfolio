import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { render, checkA11y } from "@tests/test-utils";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { TopBar } from "../TopBar";

// Mock next-themes for ThemeToggle
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: vi.fn(),
  }),
}));

describe("TopBar", () => {
  describe("Branding", () => {
    it("renders logo/branding text", () => {
      render(<TopBar />);

      // Site name should be visible
      expect(screen.getByText(/andrew creekmore/i)).toBeInTheDocument();
    });

    it("branding links to home page", () => {
      render(<TopBar />);

      const brandingLink = screen.getByRole("link", { name: /andrew creekmore/i });
      expect(brandingLink).toHaveAttribute("href", "/");
    });
  });

  describe("Theme Controls Placeholder", () => {
    it("has placeholder element for theme controls", () => {
      const { container } = render(<TopBar />);

      // Theme controls area should exist (identified by data attribute for future integration)
      const themeControlsArea = container.querySelector('[data-testid="theme-controls-placeholder"]');
      expect(themeControlsArea).toBeInTheDocument();
    });
  });

  describe("WindowContainer Styling", () => {
    it("applies WindowContainer border styling", () => {
      const { container } = render(<TopBar />);

      // TopBar wraps in WindowContainer, which applies border
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        borderWidth: `${DEFAULT_LAYOUT_TOKENS.windowBorderWidth}px`,
      });
    });

    it("applies WindowContainer opacity", () => {
      const { container } = render(<TopBar />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        opacity: String(DEFAULT_LAYOUT_TOKENS.windowOpacity),
      });
    });
  });

  describe("Layout Structure", () => {
    it("renders as header element for semantic structure", () => {
      render(<TopBar />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("uses flexbox layout with space-between", () => {
      const { container } = render(<TopBar />);

      // The inner header element should have flex layout
      const header = container.querySelector("header");
      expect(header).toHaveClass("flex");
      expect(header).toHaveClass("justify-between");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<TopBar />);
      expect(results).toHaveNoViolations();
    });

    it("branding link is keyboard accessible", () => {
      render(<TopBar />);

      const brandingLink = screen.getByRole("link", { name: /andrew creekmore/i });
      expect(brandingLink).not.toBeDisabled();
    });
  });
});
