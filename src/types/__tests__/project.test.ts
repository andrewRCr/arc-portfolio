/**
 * Type validation tests for Project interface
 *
 * These tests verify that:
 * - Sample data correctly implements the Project interface
 * - Required fields are present
 * - Optional fields work as expected
 * - Type safety is maintained
 */

import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

describe("Project Interface", () => {
  it("should have exactly 9 software projects", () => {
    expect(projects).toBeDefined();
    expect(projects.length).toBe(9);
  });

  it("should implement all required Project fields", () => {
    const project = projects[0];

    // Core fields
    expect(project.id).toBeDefined();
    expect(typeof project.id).toBe("string");
    expect(project.title).toBeDefined();
    expect(typeof project.title).toBe("string");
    expect(project.slug).toBeDefined();
    expect(typeof project.slug).toBe("string");
    expect(project.description).toBeDefined();
    expect(typeof project.description).toBe("string");
    expect(project.shortDescription).toBeDefined();
    expect(typeof project.shortDescription).toBe("string");

    // Categorization
    expect(project.category).toBeDefined();
    expect(Array.isArray(project.category)).toBe(true);
    expect(project.category.length).toBeGreaterThanOrEqual(1);
    expect(project.tags).toBeDefined();
    expect(Array.isArray(project.tags)).toBe(true);

    // Technical details
    expect(project.techStack).toBeDefined();
    expect(Array.isArray(project.techStack)).toBe(true);
    expect(project.features).toBeDefined();
    expect(Array.isArray(project.features)).toBe(true);

    // Links object
    expect(project.links).toBeDefined();
    expect(typeof project.links).toBe("object");

    // Images object
    expect(project.images).toBeDefined();
    expect(project.images.thumbnail).toBeDefined();
    expect(Array.isArray(project.images.screenshots)).toBe(true);

    // Display properties
    expect(typeof project.order).toBe("number");
    expect(typeof project.featured).toBe("boolean");
  });

  it("should have screenshots with src and alt properties", () => {
    projects.forEach((project) => {
      project.images.screenshots.forEach((screenshot) => {
        expect(typeof screenshot.src).toBe("string");
        expect(typeof screenshot.alt).toBe("string");
      });
    });
  });

  it("should have valid order numbers", () => {
    projects.forEach((project) => {
      expect(project.order).toBeGreaterThan(0);
      expect(Number.isInteger(project.order)).toBe(true);
    });
  });

  it("should allow optional fields to be undefined", () => {
    // Type assertion to verify optional fields can be undefined
    const minimalProject: Project = {
      id: "test",
      title: "Test",
      slug: "test",
      description: "Test description",
      shortDescription: "Test short",
      category: ["Test"],
      tags: [],
      techStack: [],
      features: [],
      links: {},
      images: {
        thumbnail: "/test.png",
        screenshots: [],
      },
      order: 1,
      featured: false,
      // Optional fields not included
    };

    expect(minimalProject).toBeDefined();
    expect(minimalProject.teamSize).toBeUndefined();
    expect(minimalProject.duration).toBeUndefined();
  });

  it("should have valid demo credentials when present", () => {
    const projectsWithDemo = projects.filter((p) => p.links.demoCredentials);

    projectsWithDemo.forEach((project) => {
      expect(project.links.demoCredentials?.username).toBeDefined();
      expect(project.links.demoCredentials?.password).toBeDefined();
      expect(typeof project.links.demoCredentials?.username).toBe("string");
      expect(typeof project.links.demoCredentials?.password).toBe("string");
    });
  });

  it("should have non-empty arrays for required array fields", () => {
    projects.forEach((project) => {
      expect(project.techStack.length).toBeGreaterThan(0);
      expect(project.features.length).toBeGreaterThan(0);
      expect(project.tags.length).toBeGreaterThan(0);
    });
  });
});
