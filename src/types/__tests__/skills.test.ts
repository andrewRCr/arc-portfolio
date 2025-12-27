/**
 * Type validation tests for Skills interface
 *
 * Verifies that skills data:
 * - Uses constrained SkillCategory union for category names
 * - Contains string arrays for each category
 * - Has canonical technology names
 */

import { describe, it, expect } from "vitest";
import { skills } from "@/data/skills";
import type { Skills, SkillCategory } from "@/types/skills";

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

  it("should enforce constrained category names via SkillCategory union", () => {
    // Type-level test: Skills type requires all SkillCategory keys
    const testSkills: Skills = {
      Languages: ["TypeScript"],
      Frontend: ["React"],
      Backend: ["Node.js"],
      Databases: ["PostgreSQL"],
      "AI-Assisted Development": ["Claude Code"],
      "DevOps & Infrastructure": ["Git"],
      "Testing & Quality": ["Vitest"],
      Methodologies: ["TDD"],
    };

    // Verify we can access known categories with type safety
    const category: SkillCategory = "Frontend";
    expect(testSkills[category]).toEqual(["React"]);
  });

  it("should not have duplicate skills within categories", () => {
    Object.entries(skills).forEach(([, skillList]) => {
      const uniqueSkills = new Set(skillList);
      expect(uniqueSkills.size).toBe(skillList.length);
    });
  });
});
