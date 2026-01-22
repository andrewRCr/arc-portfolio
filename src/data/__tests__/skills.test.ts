/**
 * Data validation tests for skills data file
 *
 * Tests verify structure and constraints, not specific content.
 * Content changes (adding/removing skills) should not break tests.
 *
 * Validates:
 * - All required categories are present
 * - Each category has valid Skill objects
 * - No duplicate skills within categories
 * - Reasonable distribution across categories
 */

import { describe, it, expect } from "vitest";
import { skills } from "@/data/skills";
import { SKILL_CATEGORIES } from "@/types/skills";

describe("Skills Data Validation", () => {
  describe("Category Structure", () => {
    it("has all required categories", () => {
      SKILL_CATEGORIES.forEach((category) => {
        expect(skills).toHaveProperty(category);
      });
    });

    it("has exactly the expected number of categories", () => {
      expect(Object.keys(skills).length).toBe(SKILL_CATEGORIES.length);
    });

    it("has non-empty arrays for all categories", () => {
      Object.entries(skills).forEach(([category, categorySkills]) => {
        expect(categorySkills.length, `${category} should have skills`).toBeGreaterThan(0);
      });
    });
  });

  describe("Skill Object Validation", () => {
    it("has valid Skill objects with required name property", () => {
      Object.entries(skills).forEach(([category, categorySkills]) => {
        categorySkills.forEach((skill, index) => {
          expect(typeof skill, `${category}[${index}] should be object`).toBe("object");
          expect(typeof skill.name, `${category}[${index}].name should be string`).toBe("string");
          expect(skill.name.length, `${category}[${index}].name should be non-empty`).toBeGreaterThan(0);
        });
      });
    });

    it("has properly formatted skill names (no extra whitespace)", () => {
      Object.entries(skills).forEach(([category, categorySkills]) => {
        categorySkills.forEach((skill) => {
          expect(skill.name, `${category}: "${skill.name}" has leading/trailing whitespace`).toBe(skill.name.trim());
          expect(skill.name, `${category}: "${skill.name}" has double spaces`).not.toContain("  ");
        });
      });
    });

    it("has valid optional properties when present", () => {
      Object.entries(skills).forEach(([category, categorySkills]) => {
        categorySkills.forEach((skill) => {
          if (skill.featured !== undefined) {
            expect(typeof skill.featured, `${category}: ${skill.name}.featured should be boolean`).toBe("boolean");
          }
          if (skill.iconSlug !== undefined) {
            expect(typeof skill.iconSlug, `${category}: ${skill.name}.iconSlug should be string`).toBe("string");
            expect(skill.iconSlug.length, `${category}: ${skill.name}.iconSlug should be non-empty`).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  describe("Data Integrity", () => {
    it("has no duplicate skill names within categories", () => {
      Object.entries(skills).forEach(([category, categorySkills]) => {
        const names = categorySkills.map((s) => s.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size, `${category} has duplicate skills`).toBe(names.length);
      });
    });

    it("has no duplicate skill names across all categories", () => {
      const allNames = Object.values(skills).flatMap((categorySkills) => categorySkills.map((s) => s.name));
      const uniqueNames = new Set(allNames);
      expect(uniqueNames.size, "Duplicate skill names found across categories").toBe(allNames.length);
    });
  });

  describe("Distribution Constraints", () => {
    it("has a reasonable total skill count (40+)", () => {
      const totalSkills = Object.values(skills).reduce((sum, categorySkills) => sum + categorySkills.length, 0);
      expect(totalSkills).toBeGreaterThanOrEqual(40);
    });

    it("has no single category dominating (>40% of total)", () => {
      const totalSkills = Object.values(skills).reduce((sum, categorySkills) => sum + categorySkills.length, 0);

      Object.entries(skills).forEach(([category, categorySkills]) => {
        const percentage = (categorySkills.length / totalSkills) * 100;
        expect(percentage, `${category} has ${percentage.toFixed(1)}% of skills`).toBeLessThan(40);
      });
    });
  });

  describe("Featured Skills", () => {
    it("has at least one featured skill", () => {
      const featuredSkills = Object.values(skills)
        .flat()
        .filter((s) => s.featured);
      expect(featuredSkills.length).toBeGreaterThan(0);
    });

    it("has featured skills with iconSlug for display", () => {
      const featuredSkills = Object.values(skills)
        .flat()
        .filter((s) => s.featured);

      featuredSkills.forEach((skill) => {
        expect(skill.iconSlug, `Featured skill "${skill.name}" should have iconSlug`).toBeDefined();
      });
    });
  });
});
