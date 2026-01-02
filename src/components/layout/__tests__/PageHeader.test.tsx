import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  describe("Title Rendering", () => {
    it("renders title as h1", () => {
      render(<PageHeader title="Projects" />);

      expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    });

    it("renders subtitle when provided", () => {
      render(<PageHeader title="Projects" subtitle="Browse my work" />);

      expect(screen.getByText("Browse my work")).toBeInTheDocument();
    });

    it("does not render title section when title not provided", () => {
      render(<PageHeader>Custom content</PageHeader>);

      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("renders children below title", () => {
      render(
        <PageHeader title="Projects">
          <div data-testid="controls">Tab controls</div>
        </PageHeader>
      );

      expect(screen.getByTestId("controls")).toBeInTheDocument();
    });

    it("renders children as full content when no title", () => {
      render(
        <PageHeader>
          <h1>Custom Header</h1>
        </PageHeader>
      );

      expect(screen.getByRole("heading", { name: "Custom Header" })).toBeInTheDocument();
    });
  });

  describe("Visual Structure", () => {
    it("has bottom border separator", () => {
      const { container } = render(<PageHeader title="Test" />);

      const separator = container.querySelector(".border-b");
      expect(separator).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations with title", async () => {
      const results = await checkA11y(<PageHeader title="Page Title" subtitle="Description" />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with children only", async () => {
      const results = await checkA11y(
        <PageHeader>
          <h1>Custom Title</h1>
        </PageHeader>
      );
      expect(results).toHaveNoViolations();
    });
  });
});
