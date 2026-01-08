import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y, axe, TestProviders } from "@tests/test-utils";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { ConditionalFrame } from "../ConditionalFrame";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";

vi.mock("next/navigation", () => createNavigationMock());

describe("ConditionalFrame", () => {
  beforeEach(() => {
    mockNavigation.reset();
  });

  describe("Dev Route Rendering", () => {
    it("renders children without frame border for /dev routes", () => {
      mockNavigation.setPathname("/dev/test");
      const { container } = render(
        <ConditionalFrame>
          <p>Dev content</p>
        </ConditionalFrame>
      );

      expect(screen.getByText("Dev content")).toBeInTheDocument();
      // No TUI frame border on dev routes
      const frameBorder = container.querySelector("[aria-hidden='true']");
      expect(frameBorder).not.toBeInTheDocument();
    });

    it("does not render Navigation for /dev routes", () => {
      mockNavigation.setPathname("/dev/components");
      render(
        <ConditionalFrame>
          <p>Dev content</p>
        </ConditionalFrame>
      );

      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("Regular Route Rendering", () => {
    it("renders TUI frame border for regular routes", () => {
      mockNavigation.setPathname("/");
      const { container } = render(
        <ConditionalFrame>
          <p>Home content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      expect(frameBorder).toBeInTheDocument();
      expect(frameBorder).toHaveClass("border-border-strong");
    });

    it("renders Navigation for regular routes", () => {
      mockNavigation.setPathname("/about");
      render(
        <ConditionalFrame>
          <p>About content</p>
        </ConditionalFrame>
      );

      // Navigation renders both mobile and desktop navs (CSS controls visibility)
      const navElements = screen.getAllByRole("navigation");
      expect(navElements.length).toBeGreaterThan(0);
    });

    it("renders children within frame", () => {
      mockNavigation.setPathname("/projects");
      render(
        <ConditionalFrame>
          <p>Projects content</p>
        </ConditionalFrame>
      );

      expect(screen.getByText("Projects content")).toBeInTheDocument();
    });
  });

  describe("Responsive Nav Gap", () => {
    // Nav gap is now handled via CSS custom property --nav-gap-half
    // defined in globals.css with media query. No JS-based switching.
    it("uses CSS variable for responsive nav gap", () => {
      mockNavigation.setPathname("/");
      const { container } = render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      const clipPath = frameBorder?.getAttribute("style") || "";
      // Should use CSS variable instead of hardcoded pixel values
      expect(clipPath).toContain("var(--nav-gap-half)");
    });
  });

  describe("Frame Border Styling", () => {
    it("applies border width from layout tokens", () => {
      mockNavigation.setPathname("/");
      const { container } = render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      const style = frameBorder?.getAttribute("style") || "";
      expect(style).toContain(`border-width: ${DEFAULT_LAYOUT_TOKENS.windowBorderWidth}px`);
    });

    it("uses clip-path for navigation gap", () => {
      mockNavigation.setPathname("/");
      const { container } = render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      const style = frameBorder?.getAttribute("style") || "";
      expect(style).toContain("clip-path: polygon");
    });
  });

  describe("Content Constraints", () => {
    it("applies max-width from layout tokens", () => {
      mockNavigation.setPathname("/");
      render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const wrapper = screen.getByTestId("content-wrapper");
      // TUI frame uses 1120px (smaller than contentMaxWidth to allow centering with padding)
      expect(wrapper).toHaveStyle({ maxWidth: "1120px" });
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations on regular route", async () => {
      mockNavigation.setPathname("/");
      // Navigation renders both mobile and desktop navs (CSS-hidden switching).
      // JSDOM doesn't apply CSS, so axe sees duplicate landmarks.
      // In real browsers, display:none removes from accessibility tree.
      // Disable landmark-unique rule for this false positive.
      const { container } = render(
        <TestProviders>
          <ConditionalFrame>
            <p>Content</p>
          </ConditionalFrame>
        </TestProviders>
      );
      const results = await axe(container, {
        rules: { "landmark-unique": { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations on dev route", async () => {
      mockNavigation.setPathname("/dev/test");
      const results = await checkA11y(
        <ConditionalFrame>
          <p>Dev content</p>
        </ConditionalFrame>
      );
      expect(results).toHaveNoViolations();
    });

    it("frame border is hidden from screen readers", () => {
      mockNavigation.setPathname("/");
      const { container } = render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      expect(frameBorder).toHaveAttribute("aria-hidden", "true");
    });
  });
});
