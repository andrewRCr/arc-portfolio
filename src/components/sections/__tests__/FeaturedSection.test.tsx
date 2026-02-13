/**
 * Tests for FeaturedSection component
 *
 * Verifies structure and behavior:
 * - 4 featured cards render
 * - Each card has required elements (type label, title, description)
 * - Cards link to correct route patterns
 * - Methodology card (ARC Framework) is always present
 *
 * Note: Section heading ("Featured Projects") is rendered in Hero component,
 * not FeaturedSection, for scroll shadow alignment.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FeaturedSection } from "../FeaturedSection";

// Mock the featured-projects module to control randomization
vi.mock("@/lib/featured-projects", async () => {
  const actual = await vi.importActual("@/lib/featured-projects");
  return {
    ...actual,
    selectFeaturedProjects: vi.fn(),
  };
});

import { selectFeaturedProjects } from "@/lib/featured-projects";

describe("FeaturedSection", () => {
  const mockFeaturedProjects = [
    { slug: "cinexplorer", type: "software" as const },
    { slug: "arc-framework", type: "methodology" as const },
    { slug: "action-rpg-project", type: "game" as const },
    { slug: "elden-ring-guard-parry", type: "mod" as const },
  ];

  beforeEach(() => {
    vi.mocked(selectFeaturedProjects).mockReturnValue(mockFeaturedProjects);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("card rendering", () => {
    it("renders exactly 4 featured cards", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(4);
    });

    it("each card contains a title heading", () => {
      render(<FeaturedSection />);

      const headings = screen.getAllByRole("heading", { level: 4 });
      expect(headings).toHaveLength(4);
    });
  });

  describe("card links", () => {
    it("software projects link to /projects/software/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const softwareLink = links.find((link) => link.getAttribute("href")?.includes("/projects/software/cinexplorer"));
      expect(softwareLink).toBeInTheDocument();
    });

    it("methodology projects link to /projects/software/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const frameworkLink = links.find((link) =>
        link.getAttribute("href")?.includes("/projects/software/arc-framework")
      );
      expect(frameworkLink).toBeInTheDocument();
    });

    it("game projects link to /projects/games/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const gameLink = links.find((link) => link.getAttribute("href")?.includes("/projects/games/action-rpg-project"));
      expect(gameLink).toBeInTheDocument();
    });

    it("mod projects link to /projects/mods/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const modLink = links.find((link) =>
        link.getAttribute("href")?.includes("/projects/mods/elden-ring-guard-parry")
      );
      expect(modLink).toBeInTheDocument();
    });

    it("all links include from=home query param", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.getAttribute("href")).toContain("from=home");
      });
    });
  });

  describe("methodology slot", () => {
    it("always includes ARC Framework project", () => {
      render(<FeaturedSection />);

      // ARC Framework title should be present
      expect(screen.getByText("ARC Framework")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("all cards render as visible links", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(4);
      links.forEach((link) => {
        expect(link).toBeVisible();
      });
    });
  });
});
