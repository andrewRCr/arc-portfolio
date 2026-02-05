/**
 * Behavior tests for DetailHeader component
 *
 * Tests title rendering, category badges, back button, hero image,
 * and accessibility. Focuses on behavior/contracts, not styling.
 *
 * Note: DetailHeader uses ResponsiveSwitch to render both mobile and desktop
 * versions in the DOM (CSS controls visibility). Tests use getAllBy* queries
 * to handle multiple matching elements.
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

      // Both mobile and desktop versions render h1
      const headings = screen.getAllByRole("heading", { name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
    });

    it("renders title as h1 for proper document structure", () => {
      render(<DetailHeader {...defaultProps} />);

      const headings = screen.getAllByRole("heading", { level: 1, name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("Category Badges", () => {
    it("renders all category badges when provided", () => {
      render(<DetailHeader {...defaultProps} categories={["Web App", "Desktop App"]} />);

      // Both versions render badges
      expect(screen.getAllByText("Web App").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Desktop App").length).toBeGreaterThan(0);
    });

    it("renders single category badge", () => {
      render(<DetailHeader {...defaultProps} categories={["Game"]} />);

      expect(screen.getAllByText("Game").length).toBeGreaterThan(0);
    });

    it("does not render category badges when categories is empty array", () => {
      render(<DetailHeader {...defaultProps} categories={[]} />);

      // No badge text should render (container may still exist for metadata)
      expect(screen.queryByText("Web App")).not.toBeInTheDocument();
      expect(screen.queryByText("Desktop App")).not.toBeInTheDocument();
    });

    it("does not render category badges when categories is undefined", () => {
      render(<DetailHeader {...defaultProps} />);

      expect(screen.queryByText("Web App")).not.toBeInTheDocument();
      expect(screen.queryByText("Desktop App")).not.toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("renders back button with correct href", () => {
      render(<DetailHeader {...defaultProps} backHref="/projects?tab=software" />);

      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/projects?tab=software");
      });
    });

    it("renders back button with custom label", () => {
      render(<DetailHeader {...defaultProps} backLabel="Home" />);

      const backLinks = screen.getAllByRole("link", { name: /back to home/i });
      expect(backLinks.length).toBeGreaterThan(0);
    });

    it("back button is visible", () => {
      render(<DetailHeader {...defaultProps} />);

      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toBeVisible();
      });
    });
  });

  describe("Hero Image", () => {
    it("renders hero image when provided", () => {
      render(<DetailHeader {...defaultProps} heroImage="/images/project-hero.webp" />);

      const heroImages = screen.getAllByTestId("hero-image");
      expect(heroImages.length).toBeGreaterThan(0);
    });

    it("hero image is decorative (not announced by screen readers)", () => {
      render(<DetailHeader {...defaultProps} heroImage="/images/project-hero.webp" />);

      const heroImages = screen.getAllByTestId("hero-image");
      heroImages.forEach((heroImg) => {
        // Decorative images should have empty alt or aria-hidden
        const hasEmptyAlt = heroImg.getAttribute("alt") === "";
        const isAriaHidden = heroImg.getAttribute("aria-hidden") === "true";
        expect(hasEmptyAlt || isAriaHidden).toBe(true);
      });
    });

    it("renders fallback background when no hero image provided", () => {
      render(<DetailHeader {...defaultProps} />);

      // Should not have hero image element in either version
      expect(screen.queryAllByTestId("hero-image")).toHaveLength(0);
      // Containers should still render (fallback styling handled by CSS)
      const headers = screen.getAllByTestId("detail-header");
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  describe("Icon Links", () => {
    it("renders icon links when provided", () => {
      render(
        <DetailHeader
          {...defaultProps}
          links={{
            github: "https://github.com/test",
            liveDemo: "https://demo.com",
          }}
        />
      );

      // Both mobile and desktop versions render icon links
      const githubLinks = screen.getAllByRole("link", { name: "View on GitHub" });
      const demoLinks = screen.getAllByRole("link", { name: "View live demo" });
      expect(githubLinks.length).toBeGreaterThan(0);
      expect(demoLinks.length).toBeGreaterThan(0);
    });

    it("icon links open in new tab with security attributes", () => {
      render(<DetailHeader {...defaultProps} links={{ github: "https://github.com/test" }} />);

      const githubLinks = screen.getAllByRole("link", { name: "View on GitHub" });
      githubLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("renders links without categories (spacer case)", () => {
      render(<DetailHeader {...defaultProps} links={{ github: "https://github.com/test" }} />);

      // Links should render even without categories
      const githubLinks = screen.getAllByRole("link", { name: "View on GitHub" });
      expect(githubLinks.length).toBeGreaterThan(0);
      // No category badge text should render
      expect(screen.queryByText("Web App")).not.toBeInTheDocument();
    });

    it("renders all link types", () => {
      render(
        <DetailHeader
          {...defaultProps}
          links={{
            github: "https://github.com/test",
            liveDemo: "https://demo.com",
            download: "https://download.com",
            nexusmods: "https://nexusmods.com",
          }}
        />
      );

      expect(screen.getAllByRole("link", { name: "View on GitHub" }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("link", { name: "View live demo" }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("link", { name: "Download app" }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("link", { name: "View on NexusMods" }).length).toBeGreaterThan(0);
    });

    it("does not render links section when no links provided", () => {
      render(<DetailHeader {...defaultProps} />);

      expect(screen.queryAllByTestId("header-links")).toHaveLength(0);
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

      // Title should be the primary heading (both mobile and desktop versions have h1)
      const headings = screen.getAllByRole("heading", { level: 1, name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
      headings.forEach((heading) => {
        expect(heading).toHaveTextContent("Test Project");
      });
    });
  });
});
