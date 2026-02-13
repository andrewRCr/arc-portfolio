/**
 * Data validation tests for projects data file
 *
 * Tests meaningful invariants:
 * - Required fields present and correctly typed
 * - Referential integrity (unique IDs, slugs, valid URLs)
 * - Business rules (order sequencing, featured project constraints)
 *
 * Does NOT test brittle implementation details like exact category names,
 * specific project positions, or exact counts that change with content updates.
 */

import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";

describe("Projects Data Validation", () => {
  describe("Required Fields", () => {
    it("should have all core required fields for every project", () => {
      projects.forEach((project) => {
        // Core identification
        expect(project.title).toBeDefined();
        expect(project.title.length).toBeGreaterThan(0);
        expect(project.slug).toBeDefined();
        expect(project.slug.length).toBeGreaterThan(0);

        // Descriptions
        expect(project.description).toBeDefined();
        expect(project.description.length).toBeGreaterThan(0);
        expect(project.shortDescription).toBeDefined();
        expect(project.shortDescription.length).toBeGreaterThan(0);

        // Categorization - at least one category
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

    it("should have valid images object structure", () => {
      projects.forEach((project) => {
        expect(project.images).toBeDefined();
        expect(typeof project.images.thumbnail).toBe("string");
        expect(Array.isArray(project.images.screenshots)).toBe(true);

        // Each screenshot should have src and alt
        project.images.screenshots.forEach((screenshot) => {
          expect(typeof screenshot.src).toBe("string");
          expect(typeof screenshot.alt).toBe("string");
        });
      });
    });

    it("should have links object for every project", () => {
      projects.forEach((project) => {
        expect(project.links).toBeDefined();
        expect(typeof project.links).toBe("object");
      });
    });
  });

  describe("Referential Integrity", () => {
    it("should have unique project slugs", () => {
      const slugs = projects.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(projects.length);
    });

    it("should have unique order values", () => {
      const orderValues = projects.map((p) => p.order);
      const uniqueOrders = new Set(orderValues);
      expect(uniqueOrders.size).toBe(projects.length);
    });

    it("should have sequential order values starting from 1", () => {
      const orderValues = projects.map((p) => p.order).sort((a, b) => a - b);
      for (let i = 0; i < orderValues.length; i++) {
        expect(orderValues[i]).toBe(i + 1);
      }
    });
  });

  describe("URL Format Validation", () => {
    it("should have valid GitHub URLs when present", () => {
      projects.forEach((project) => {
        if (project.links.github) {
          expect(project.links.github).toMatch(/^https:\/\/github\.com\//);
        }
      });
    });

    it("should have valid URLs for all link types when present", () => {
      projects.forEach((project) => {
        if (project.links.liveDemo) {
          expect(project.links.liveDemo).toMatch(/^https?:\/\//);
        }
        if (project.links.download) {
          expect(project.links.download).toMatch(/^https?:\/\//);
        }
        if (project.links.nexusmods) {
          expect(project.links.nexusmods).toMatch(/^https?:\/\//);
        }
      });
    });
  });

  describe("Business Rules", () => {
    it("should have at least one featured project", () => {
      const featuredProjects = projects.filter((p) => p.featured);
      expect(featuredProjects.length).toBeGreaterThanOrEqual(1);
    });

    it("should have valid optional fields when present", () => {
      projects.forEach((project) => {
        if (project.teamRole) {
          expect(typeof project.teamRole).toBe("string");
          expect(project.teamRole.length).toBeGreaterThan(0);
        }
        if (project.details) {
          expect(Array.isArray(project.details)).toBe(true);
          expect(project.details.length).toBeGreaterThan(0);
        }
        if (project.compactTitle) {
          expect(typeof project.compactTitle).toBe("string");
          expect(project.compactTitle.length).toBeGreaterThan(0);
        }
      });
    });
  });
});
