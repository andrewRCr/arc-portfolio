import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { PageLayout } from "../PageLayout";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";

describe("PageLayout", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  describe("Content Rendering", () => {
    it("renders children in main element", () => {
      render(
        <PageLayout>
          <p>Page content</p>
        </PageLayout>
      );

      expect(screen.getByRole("main")).toContainElement(screen.getByText("Page content"));
    });

    it("renders header when provided", () => {
      render(
        <PageLayout header={<div data-testid="header">Header content</div>}>
          <p>Page content</p>
        </PageLayout>
      );

      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
  });

  describe("Content Width Constraint", () => {
    it("applies max-width from layout tokens by default", () => {
      const { container } = render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );

      const contentWrapper = container.querySelector(
        `[style*="max-width: ${DEFAULT_LAYOUT_TOKENS.contentMaxWidth}px"]`
      );
      expect(contentWrapper).toBeInTheDocument();
    });

    it("removes max-width constraint when fullWidth is true", () => {
      const { container } = render(
        <PageLayout fullWidth>
          <p>Content</p>
        </PageLayout>
      );

      const contentWrapper = container.querySelector(`[style*="max-width"]`);
      expect(contentWrapper).not.toBeInTheDocument();
    });
  });

  describe("Scrolling Behavior", () => {
    it("main element has overflow-auto for scrolling", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );

      expect(screen.getByRole("main")).toHaveClass("overflow-auto");
    });

    it("renders scroll shadow elements", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );

      expect(screen.getByTestId("scroll-shadow-top")).toBeInTheDocument();
      expect(screen.getByTestId("scroll-shadow-bottom")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(
        <PageLayout header={<h1>Page Title</h1>}>
          <p>Page content</p>
        </PageLayout>
      );
      expect(results).toHaveNoViolations();
    });

    it("uses main landmark for content", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
