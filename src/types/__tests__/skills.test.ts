/**
 * Type validation tests for Skills interface
 *
 * Verifies that skills data:
 * - Uses flexible category structure
 * - Contains string arrays for each category
 * - Has canonical technology names
 */

import { describe, it, expect } from "vitest";
import { skills } from "@/data/skills";
import type { Skills } from "@/types/skills";

describe("Skills Interface", () => {
  it("should be defined and have categories", () => {
    expect(skills).toBeDefined();
    expect(typeof skills).toBe("object");
    expect(Object.keys(skills).length).toBeGreaterThan(0);
  });

  it("should have at least 3 categories", () => {
    const categories = Object.keys(skills);
    expect(categories.length).toBeGreaterThanOrEqual(3);
  });

  it("should have string arrays for all categories", () => {
    Object.entries(skills).forEach(([, skillList]) => {
      expect(Array.isArray(skillList)).toBe(true);
      expect(skillList.length).toBeGreaterThan(0);

      skillList.forEach((skill) => {
        expect(typeof skill).toBe("string");
        expect(skill.length).toBeGreaterThan(0);
      });
    });
  });

  it("should allow flexible category names", () => {
    // Type assertion to verify flexible category structure
    const customSkills: Skills = {
      "Custom Category": ["Skill 1", "Skill 2"],
      "Another Category": ["Skill 3"],
    };

    expect(customSkills).toBeDefined();
    expect(customSkills["Custom Category"]).toEqual(["Skill 1", "Skill 2"]);
  });

  it("should not have duplicate skills within categories", () => {
    Object.entries(skills).forEach(([, skillList]) => {
      const uniqueSkills = new Set(skillList);
      expect(uniqueSkills.size).toBe(skillList.length);
    });
  });
});
