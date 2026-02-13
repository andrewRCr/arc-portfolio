/**
 * Behavior tests for DetailHeaderCompact component
 *
 * Tests title rendering, compactTitle fallback, back button, icon links,
 * and accessibility. Focuses on behavior/contracts, not styling.
 *
 * Note: DetailHeaderCompact uses ResponsiveSwitch to render both mobile and
 * desktop versions in the DOM (CSS controls visibility). Tests use getAllBy*
 * queries to handle multiple matching elements.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { checkA11y } from "@tests/test-utils";
import { DetailHeaderCompact } from "../DetailHeaderCompact";

vi.mock("next/navigation", () => createNavigationMock());

// Mock useHeaderCrossfade hook
vi.mock("@/hooks/useHeaderCrossfade", () => ({
  useHeaderCrossfade: vi.fn(() => ({ opacity: 1, isExpanded: true })),
}));

const defaultProps = {
  title: "Test Project",
  backHref: "/projects",
  backLabel: "Projects",
};

describe("DetailHeaderCompact - Behavior Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigation.reset();
  });

  describe("Title Rendering", () => {
    it("renders title as heading element", () => {
      render(<DetailHeaderCompact {...defaultProps} />);

      // Both mobile and desktop versions render h1
      const headings = screen.getAllByRole("heading", { name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
    });

    it("renders title as h1 for proper document structure", () => {
      render(<DetailHeaderCompact {...defaultProps} />);

      const headings = screen.getAllByRole("heading", { level: 1, name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
    });

    it("uses compactTitle when provided (mobile)", () => {
      render(<DetailHeaderCompact {...defaultProps} compactTitle="Short Title" />);

      // compactTitle appears in mobile version
      expect(screen.getByText("Short Title")).toBeInTheDocument();
    });

    it("falls back to title when compactTitle is not provided", () => {
      render(<DetailHeaderCompact {...defaultProps} />);

      // Title appears in both versions
      const headings = screen.getAllByRole("heading", { name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("Back Button", () => {
    it("renders back button with correct href", () => {
      render(<DetailHeaderCompact {...defaultProps} backHref="/projects?tab=software" />);

      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/projects?tab=software");
      });
    });

    it("renders back button with custom label", () => {
      render(<DetailHeaderCompact {...defaultProps} backLabel="Home" />);

      const backLinks = screen.getAllByRole("link", { name: /back to home/i });
      expect(backLinks.length).toBeGreaterThan(0);
    });

    it("back button is visible and focusable", () => {
      render(<DetailHeaderCompact {...defaultProps} />);

      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toBeVisible();
        // Links are inherently keyboard focusable when visible
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("Icon Links (Desktop)", () => {
    it("renders icon links when provided", () => {
      render(
        <DetailHeaderCompact
          {...defaultProps}
          links={{
            github: "https://github.com/test",
            liveDemo: "https://demo.com",
          }}
        />
      );

      // Desktop version shows icon links
      expect(screen.getByRole("link", { name: "View on GitHub" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "View live demo" })).toBeInTheDocument();
    });

    it("does not render links section when no links provided", () => {
      render(<DetailHeaderCompact {...defaultProps} />);

      expect(screen.queryByRole("link", { name: "View on GitHub" })).not.toBeInTheDocument();
    });

    it("icon links open in new tab", () => {
      render(<DetailHeaderCompact {...defaultProps} links={{ github: "https://github.com/test" }} />);

      const githubLink = screen.getByRole("link", { name: "View on GitHub" });
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations with all props", async () => {
      const results = await checkA11y(
        <DetailHeaderCompact
          {...defaultProps}
          compactTitle="Short"
          links={{
            github: "https://github.com/test",
            liveDemo: "https://demo.com",
          }}
        />
      );
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with minimal props", async () => {
      const results = await checkA11y(<DetailHeaderCompact {...defaultProps} />);
      expect(results).toHaveNoViolations();
    });

    it("maintains heading hierarchy", () => {
      render(<DetailHeaderCompact {...defaultProps} />);

      const headings = screen.getAllByRole("heading", { level: 1, name: "Test Project" });
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
