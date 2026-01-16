/**
 * Tests for FeaturedSection component
 *
 * Verifies structure and behavior:
 * - 4 featured cards render
 * - Each card has required elements (type label, title, description)
 * - Cards link to correct route patterns
 * - Framework card is always present
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
    { slug: "arc-agentic-dev-framework", type: "framework" as const },
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

    it("renders a heading element", () => {
      render(<FeaturedSection />);

      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
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
      expect(softwareLink).toBeDefined();
    });

    it("framework projects link to /projects/software/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const frameworkLink = links.find((link) =>
        link.getAttribute("href")?.includes("/projects/software/arc-agentic-dev-framework")
      );
      expect(frameworkLink).toBeDefined();
    });

    it("game projects link to /projects/games/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const gameLink = links.find((link) => link.getAttribute("href")?.includes("/projects/games/action-rpg-project"));
      expect(gameLink).toBeDefined();
    });

    it("mod projects link to /projects/mods/", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      const modLink = links.find((link) =>
        link.getAttribute("href")?.includes("/projects/mods/elden-ring-guard-parry")
      );
      expect(modLink).toBeDefined();
    });

    it("all links include from=home query param", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.getAttribute("href")).toContain("from=home");
      });
    });
  });

  describe("framework slot", () => {
    it("always includes framework project", () => {
      render(<FeaturedSection />);

      // ARC Agentic Toolkit title should be present
      expect(screen.getByText("ARC Agentic Toolkit")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("all cards are keyboard accessible links", () => {
      render(<FeaturedSection />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(4);
      links.forEach((link) => {
        expect(link).toBeVisible();
      });
    });
  });
});
