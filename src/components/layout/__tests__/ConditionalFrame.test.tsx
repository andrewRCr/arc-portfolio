import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { createMediaQueryMock, mockMediaQuery } from "@tests/mocks/use-media-query";
import { ConditionalFrame } from "../ConditionalFrame";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";

vi.mock("next/navigation", () => createNavigationMock());
vi.mock("@/hooks/useMediaQuery", () => createMediaQueryMock());

describe("ConditionalFrame", () => {
  beforeEach(() => {
    mockNavigation.reset();
    mockMediaQuery.reset();
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

      expect(screen.getByRole("navigation")).toBeInTheDocument();
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
    it("uses desktop nav gap on non-phone viewports", () => {
      mockNavigation.setPathname("/");
      mockMediaQuery.setIsPhone(false);
      const { container } = render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      const clipPath = frameBorder?.getAttribute("style") || "";
      expect(clipPath).toContain(`${DEFAULT_LAYOUT_TOKENS.navGapHalf}px`);
    });

    it("uses mobile nav gap on phone viewports", () => {
      mockNavigation.setPathname("/");
      mockMediaQuery.setIsPhone(true);
      const { container } = render(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );

      const frameBorder = container.querySelector("[aria-hidden='true']");
      const clipPath = frameBorder?.getAttribute("style") || "";
      expect(clipPath).toContain(`${DEFAULT_LAYOUT_TOKENS.navGapHalfMobile}px`);
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
      expect(wrapper).toHaveStyle({ maxWidth: `${DEFAULT_LAYOUT_TOKENS.contentMaxWidth}px` });
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations on regular route", async () => {
      mockNavigation.setPathname("/");
      const results = await checkA11y(
        <ConditionalFrame>
          <p>Content</p>
        </ConditionalFrame>
      );
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
