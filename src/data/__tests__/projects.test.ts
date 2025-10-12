/**
 * Data validation tests for projects data file
 *
 * These tests verify that:
 * - All 9 projects are present and properly structured
 * - Order fields are unique and sequential (1-9)
 * - URLs are properly formatted and consistent
 * - Featured projects are correctly marked
 * - All required data is present and valid
 * - Phase 2 migration completeness
 */

import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";

describe("Projects Data Validation", () => {
  describe("Basic Structure", () => {
    it("should have at least 9 projects", () => {
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThanOrEqual(9);
    });

    it("should have all projects as valid objects", () => {
      projects.forEach((project) => {
        expect(project).toBeDefined();
        expect(typeof project).toBe("object");
        expect(project).not.toBeNull();
      });
    });
  });

  describe("Order Field Validation", () => {
    it("should have unique order values starting from 1", () => {
      const orderValues = projects.map((p) => p.order);
      const uniqueOrders = new Set(orderValues);

      // All order values should be unique
      expect(uniqueOrders.size).toBe(projects.length);

      // Order values should start at 1
      const sortedOrders = [...orderValues].sort((a, b) => a - b);
      expect(sortedOrders[0]).toBe(1);
    });

    it("should have sequential order values with no gaps", () => {
      const orderValues = projects.map((p) => p.order).sort((a, b) => a - b);

      for (let i = 0; i < orderValues.length; i++) {
        expect(orderValues[i]).toBe(i + 1);
      }
    });

    it("should have projects sorted by order field", () => {
      for (let i = 0; i < projects.length - 1; i++) {
        expect(projects[i].order).toBeLessThan(projects[i + 1].order);
      }
    });
  });

  describe("Required Fields Presence", () => {
    it("should have all core required fields for every project", () => {
      projects.forEach((project) => {
        // Core identification
        expect(project.id).toBeDefined();
        expect(project.id.length).toBeGreaterThan(0);
        expect(project.title).toBeDefined();
        expect(project.title.length).toBeGreaterThan(0);
        expect(project.slug).toBeDefined();
        expect(project.slug.length).toBeGreaterThan(0);

        // Descriptions
        expect(project.description).toBeDefined();
        expect(project.description.length).toBeGreaterThan(0);
        expect(project.shortDescription).toBeDefined();
        expect(project.shortDescription.length).toBeGreaterThan(0);

        // Categorization
        expect(project.category).toBeDefined();
        expect(project.category.length).toBeGreaterThan(0);

        // Display properties
        expect(typeof project.order).toBe("number");
        expect(typeof project.featured).toBe("boolean");
      });
    });

    it("should have non-empty arrays for tags, techStack, and features", () => {
      projects.forEach((project) => {
        expect(Array.isArray(project.tags)).toBe(true);
        expect(project.tags.length).toBeGreaterThan(0);

        expect(Array.isArray(project.techStack)).toBe(true);
        expect(project.techStack.length).toBeGreaterThan(0);

        expect(Array.isArray(project.features)).toBe(true);
        expect(project.features.length).toBeGreaterThan(0);
      });
    });

    it("should have valid images object with required fields", () => {
      projects.forEach((project) => {
        expect(project.images).toBeDefined();
        expect(project.images.thumbnail).toBeDefined();
        expect(typeof project.images.thumbnail).toBe("string");
        expect(project.images.thumbnail.length).toBeGreaterThan(0);

        expect(Array.isArray(project.images.screenshots)).toBe(true);
        expect(Array.isArray(project.images.altTexts)).toBe(true);
        expect(project.images.screenshots.length).toBe(project.images.altTexts.length);
      });
    });

    it("should have links object for every project", () => {
      projects.forEach((project) => {
        expect(project.links).toBeDefined();
        expect(typeof project.links).toBe("object");
      });
    });
  });

  describe("URL Format Validation", () => {
    it("should have valid GitHub URLs for all projects", () => {
      projects.forEach((project) => {
        if (project.links.github) {
          expect(project.links.github).toMatch(/^https:\/\/github\.com\//);
          expect(project.links.github).toContain("andrewRCr");
        }
      });
    });

    it("should have valid live demo URLs when present", () => {
      const projectsWithDemo = projects.filter((p) => p.links.liveDemo);

      projectsWithDemo.forEach((project) => {
        expect(project.links.liveDemo).toMatch(/^https?:\/\//);
      });
    });

    it("should have valid download URLs when present", () => {
      const projectsWithDownload = projects.filter((p) => p.links.download);

      projectsWithDownload.forEach((project) => {
        expect(project.links.download).toMatch(/^https?:\/\//);
      });
    });

    it("should have valid external URLs when present", () => {
      const projectsWithExternal = projects.filter((p) => p.links.external);

      projectsWithExternal.forEach((project) => {
        expect(project.links.external).toMatch(/^https?:\/\//);
      });
    });
  });

  describe("Featured Projects", () => {
    it("should have at least 3 featured projects", () => {
      const featuredProjects = projects.filter((p) => p.featured);
      expect(featuredProjects.length).toBeGreaterThanOrEqual(3);
    });

    it("should have featured projects with lowest order numbers", () => {
      const featuredProjects = projects.filter((p) => p.featured);
      const featuredOrders = featuredProjects.map((p) => p.order).sort((a, b) => a - b);

      // Featured projects should start from order 1
      expect(featuredOrders[0]).toBe(1);

      // Featured projects should have consecutive order values (no gaps)
      for (let i = 0; i < featuredOrders.length - 1; i++) {
        expect(featuredOrders[i + 1] - featuredOrders[i]).toBe(1);
      }
    });

    it("should have CineXplorer, ARC Framework, and arc-portfolio as featured", () => {
      const featuredSlugs = projects
        .filter((p) => p.featured)
        .map((p) => p.slug)
        .sort();

      expect(featuredSlugs).toEqual(["arc-agentic-dev-framework", "arc-portfolio", "cinexplorer"]);
    });
  });

  describe("Project Categories", () => {
    it("should have valid project categories", () => {
      const validCategories = [
        "Web Application",
        "Cross-Platform Application",
        "Development Framework",
        "Game Mod Utility",
        "Game Development",
      ];

      projects.forEach((project) => {
        expect(validCategories).toContain(project.category);
      });
    });

    it("should have reasonable distribution of categories", () => {
      const categoryCounts = projects.reduce(
        (acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Should have at least the baseline counts from current projects
      expect(categoryCounts["Web Application"]).toBeGreaterThanOrEqual(3);
      expect(categoryCounts["Game Development"]).toBeGreaterThanOrEqual(3);
      expect(categoryCounts["Cross-Platform Application"]).toBeGreaterThanOrEqual(1);
      expect(categoryCounts["Development Framework"]).toBeGreaterThanOrEqual(1);
      expect(categoryCounts["Game Mod Utility"]).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Specific Project Validation", () => {
    it("should have CineXplorer as project 1", () => {
      const cinexplorer = projects.find((p) => p.slug === "cinexplorer");
      expect(cinexplorer).toBeDefined();
      expect(cinexplorer?.order).toBe(1);
      expect(cinexplorer?.featured).toBe(true);
      expect(cinexplorer?.category).toBe("Web Application");
    });

    it("should have ARC Framework as project 2", () => {
      const arcFramework = projects.find((p) => p.slug === "arc-agentic-dev-framework");
      expect(arcFramework).toBeDefined();
      expect(arcFramework?.order).toBe(2);
      expect(arcFramework?.featured).toBe(true);
      expect(arcFramework?.category).toBe("Development Framework");
    });

    it("should have arc-portfolio as project 3", () => {
      const arcPortfolio = projects.find((p) => p.slug === "arc-portfolio");
      expect(arcPortfolio).toBeDefined();
      expect(arcPortfolio?.order).toBe(3);
      expect(arcPortfolio?.featured).toBe(true);
      expect(arcPortfolio?.category).toBe("Web Application");
    });

    it("should have Unreal Engine projects with download links", () => {
      const ueProjects = projects.filter(
        (p) => p.techStack.includes("Unreal Engine 4") || p.techStack.includes("Unreal Engine 5")
      );

      ueProjects.forEach((project) => {
        expect(project.links.download).toBeDefined();
        expect(project.links.download).toMatch(/^https:\/\//);
      });
    });

    it("should have PetResort with demo credentials", () => {
      const petresort = projects.find((p) => p.slug === "petresort");
      expect(petresort).toBeDefined();
      expect(petresort?.links.demoCredentials).toBeDefined();
      expect(petresort?.links.demoCredentials?.username).toBe("admin");
      expect(petresort?.links.demoCredentials?.password).toBe("admin");
    });
  });

  describe("Data Consistency", () => {
    it("should have unique project IDs", () => {
      const ids = projects.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(projects.length);
    });

    it("should have unique project slugs", () => {
      const slugs = projects.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(projects.length);
    });

    it("should have id and slug match for all projects", () => {
      projects.forEach((project) => {
        expect(project.id).toBe(project.slug);
      });
    });

    it("should have valid teamSize values when present", () => {
      const projectsWithTeamSize = projects.filter((p) => p.teamSize);

      projectsWithTeamSize.forEach((project) => {
        expect(typeof project.teamSize).toBe("string");
        expect(project.teamSize!.length).toBeGreaterThan(0);
      });
    });

    it("should have valid role values when present", () => {
      const projectsWithRole = projects.filter((p) => p.role);

      projectsWithRole.forEach((project) => {
        expect(typeof project.role).toBe("string");
        expect(project.role!.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Core Projects Validation", () => {
    it("should have core portfolio projects", () => {
      const coreProjectSlugs = [
        "cinexplorer",
        "arc-agentic-dev-framework",
        "arc-portfolio",
        "taskfocus",
        "petresort",
        "doom-newgame-plus-customizer",
        "action-rpg-project",
        "survival-horror-project",
        "pong-clone",
      ];

      coreProjectSlugs.forEach((slug) => {
        const project = projects.find((p) => p.slug === slug);
        expect(project).toBeDefined();
      });
    });

    it("should have all projects with highlights when present", () => {
      const projectsWithHighlights = projects.filter((p) => p.highlights);

      projectsWithHighlights.forEach((project) => {
        expect(Array.isArray(project.highlights)).toBe(true);
        expect(project.highlights!.length).toBeGreaterThan(0);
      });
    });

    it("should have all projects with architectureNotes when present", () => {
      const projectsWithArchNotes = projects.filter((p) => p.architectureNotes);

      projectsWithArchNotes.forEach((project) => {
        expect(Array.isArray(project.architectureNotes)).toBe(true);
        expect(project.architectureNotes!.length).toBeGreaterThan(0);
      });
    });
  });
});
