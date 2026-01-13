/**
 * Behavior tests for DetailHeader component
 *
 * Tests title rendering, category badges, back button, hero image,
 * and accessibility. Focuses on behavior/contracts, not styling.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { DetailHeader } from "../DetailHeader";

const defaultProps = {
  title: "Test Project",
  backHref: "/projects",
  backLabel: "Projects",
};

describe("DetailHeader - Behavior Tests", () => {
  describe("Title Rendering", () => {
    it("renders title as heading element", () => {
      render(<DetailHeader {...defaultProps} />);

      expect(screen.getByRole("heading", { name: "Test Project" })).toBeInTheDocument();
    });

    it("renders title as h1 for proper document structure", () => {
      render(<DetailHeader {...defaultProps} />);

      expect(screen.getByRole("heading", { level: 1, name: "Test Project" })).toBeInTheDocument();
    });
  });

  describe("Category Badges", () => {
    it("renders all category badges when provided", () => {
      render(<DetailHeader {...defaultProps} categories={["Web App", "Desktop App"]} />);

      expect(screen.getByText("Web App")).toBeInTheDocument();
      expect(screen.getByText("Desktop App")).toBeInTheDocument();
    });

    it("renders single category badge", () => {
      render(<DetailHeader {...defaultProps} categories={["Game"]} />);

      expect(screen.getByText("Game")).toBeInTheDocument();
    });

    it("does not render category section when categories is empty array", () => {
      render(<DetailHeader {...defaultProps} categories={[]} />);

      // Should not have any badge elements
      expect(screen.queryByTestId("category-badges")).not.toBeInTheDocument();
    });

    it("does not render category section when categories is undefined", () => {
      render(<DetailHeader {...defaultProps} />);

      expect(screen.queryByTestId("category-badges")).not.toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("renders back button with correct href", () => {
      render(<DetailHeader {...defaultProps} backHref="/projects?tab=software" />);

      const backLink = screen.getByRole("link", { name: /back to projects/i });
      expect(backLink).toHaveAttribute("href", "/projects?tab=software");
    });

    it("renders back button with custom label", () => {
      render(<DetailHeader {...defaultProps} backLabel="Home" />);

      expect(screen.getByRole("link", { name: /back to home/i })).toBeInTheDocument();
    });

    it("back button is keyboard accessible", () => {
      render(<DetailHeader {...defaultProps} />);

      const backLink = screen.getByRole("link", { name: /back to projects/i });
      expect(backLink).toBeVisible();
    });
  });

  describe("Hero Image", () => {
    it("renders hero image when provided", () => {
      render(<DetailHeader {...defaultProps} heroImage="/images/project-hero.webp" />);

      const heroImg = screen.getByTestId("hero-image");
      expect(heroImg).toBeInTheDocument();
    });

    it("hero image is decorative (not announced by screen readers)", () => {
      render(<DetailHeader {...defaultProps} heroImage="/images/project-hero.webp" />);

      const heroImg = screen.getByTestId("hero-image");
      // Decorative images should have empty alt or aria-hidden
      const hasEmptyAlt = heroImg.getAttribute("alt") === "";
      const isAriaHidden = heroImg.getAttribute("aria-hidden") === "true";
      expect(hasEmptyAlt || isAriaHidden).toBe(true);
    });

    it("renders fallback background when no hero image provided", () => {
      render(<DetailHeader {...defaultProps} />);

      // Should not have hero image element
      expect(screen.queryByTestId("hero-image")).not.toBeInTheDocument();
      // Container should still render (fallback styling handled by CSS)
      expect(screen.getByTestId("detail-header")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations with all props", async () => {
      const results = await checkA11y(
        <DetailHeader {...defaultProps} categories={["Web App", "Desktop App"]} heroImage="/images/project-hero.webp" />
      );
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with minimal props", async () => {
      const results = await checkA11y(<DetailHeader {...defaultProps} />);
      expect(results).toHaveNoViolations();
    });

    it("maintains heading hierarchy", () => {
      render(<DetailHeader {...defaultProps} />);

      // Title should be the primary heading
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Test Project");
    });
  });
});
