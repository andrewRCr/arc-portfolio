import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { PageLayout } from "../PageLayout";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";

describe("PageLayout", () => {
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

    it("does not render header wrapper when header not provided", () => {
      const { container } = render(
        <PageLayout>
          <p>Page content</p>
        </PageLayout>
      );

      // Only main should be a direct child (no shrink-0 header wrapper)
      const flexContainer = container.firstChild as HTMLElement;
      expect(flexContainer.children).toHaveLength(1);
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
