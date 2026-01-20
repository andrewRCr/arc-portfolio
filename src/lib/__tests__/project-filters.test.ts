/**
 * Tests for project filtering utilities
 *
 * Verifies skill-based filtering across all project types (software, games, mods).
 */

import { describe, expect, it } from "vitest";
import { filterProjectsBySkill, filterProjectsBySkills } from "../project-filters";
import { Project } from "@/types/project";

// Minimal test fixtures - only the fields needed for filtering
const createTestProject = (
  overrides: Partial<Project> & { title: string; tags: string[]; projectType: Project["projectType"]; order: number }
): Project => ({
  slug: overrides.title.toLowerCase().replace(/\s+/g, "-"),
  description: "Test description",
  shortDescription: "Test short description",
  category: ["Test"],
  techStack: [],
  features: [],
  links: {},
  images: { thumbnail: "", screenshots: [] },
  featured: false,
  ...overrides,
});

const testProjects: Project[] = [
  createTestProject({
    title: "React Web App",
    projectType: "software",
    tags: ["React", "TypeScript", "Next.js"],
    order: 1,
  }),
  createTestProject({
    title: "Python API",
    projectType: "software",
    tags: ["Python", "Django", "PostgreSQL"],
    order: 2,
  }),
  createTestProject({
    title: "Unreal Game",
    projectType: "game",
    tags: ["Unreal Engine 5", "C++", "Blueprint"],
    order: 3,
  }),
  createTestProject({
    title: "Game Mod",
    projectType: "mod",
    tags: ["Game Modding", "Balance Design"],
    order: 4,
  }),
  createTestProject({
    title: "TypeScript CLI",
    projectType: "software",
    tags: ["TypeScript", "Node.js"],
    order: 5,
  }),
];

describe("filterProjectsBySkill", () => {
  describe("basic filtering", () => {
    it("returns projects matching the skill name in tags", () => {
      const result = filterProjectsBySkill(testProjects, "TypeScript");

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toEqual(["React Web App", "TypeScript CLI"]);
    });

    it("matches skill name case-insensitively", () => {
      const result = filterProjectsBySkill(testProjects, "typescript");

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toContain("React Web App");
      expect(result.map((p) => p.title)).toContain("TypeScript CLI");
    });

    it("returns projects sorted by order field", () => {
      const result = filterProjectsBySkill(testProjects, "TypeScript");

      // Order 1 should come before order 5
      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(5);
    });
  });

  describe("cross-project-type filtering", () => {
    it("filters across software projects", () => {
      const result = filterProjectsBySkill(testProjects, "Python");

      expect(result).toHaveLength(1);
      expect(result[0].projectType).toBe("software");
      expect(result[0].title).toBe("Python API");
    });

    it("filters across game projects", () => {
      const result = filterProjectsBySkill(testProjects, "C++");

      expect(result).toHaveLength(1);
      expect(result[0].projectType).toBe("game");
      expect(result[0].title).toBe("Unreal Game");
    });

    it("filters across mod projects", () => {
      const result = filterProjectsBySkill(testProjects, "Game Modding");

      expect(result).toHaveLength(1);
      expect(result[0].projectType).toBe("mod");
      expect(result[0].title).toBe("Game Mod");
    });

    it("returns mixed project types when skill spans categories", () => {
      // Create a scenario where a skill appears in multiple project types
      const mixedProjects: Project[] = [
        createTestProject({
          title: "C++ Software",
          projectType: "software",
          tags: ["C++", "Desktop Application"],
          order: 1,
        }),
        createTestProject({
          title: "C++ Game",
          projectType: "game",
          tags: ["C++", "Unreal Engine 5"],
          order: 2,
        }),
      ];

      const result = filterProjectsBySkill(mixedProjects, "C++");

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.projectType)).toContain("software");
      expect(result.map((p) => p.projectType)).toContain("game");
    });
  });

  describe("empty results handling", () => {
    it("returns empty array when no projects match skill", () => {
      const result = filterProjectsBySkill(testProjects, "Rust");

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("returns empty array when skill is empty string", () => {
      const result = filterProjectsBySkill(testProjects, "");

      expect(result).toEqual([]);
    });

    it("returns empty array when projects array is empty", () => {
      const result = filterProjectsBySkill([], "TypeScript");

      expect(result).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("handles skill names with spaces", () => {
      const result = filterProjectsBySkill(testProjects, "Unreal Engine 5");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Unreal Game");
    });

    it("handles skill names with special characters", () => {
      const projectsWithSpecialTags: Project[] = [
        createTestProject({
          title: "CSharp App",
          projectType: "software",
          tags: ["C#", ".NET"],
          order: 1,
        }),
      ];

      const result = filterProjectsBySkill(projectsWithSpecialTags, "C#");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("CSharp App");
    });

    it("does not match partial skill names", () => {
      // "Type" should not match "TypeScript"
      const result = filterProjectsBySkill(testProjects, "Type");

      expect(result).toEqual([]);
    });

    it("trims whitespace from skill name", () => {
      const result = filterProjectsBySkill(testProjects, "  TypeScript  ");

      expect(result).toHaveLength(2);
    });
  });
});

describe("filterProjectsBySkills (multi-skill OR filtering)", () => {
  describe("OR logic - returns projects matching ANY selected skill", () => {
    it("returns projects matching any of the selected skills", () => {
      // TypeScript appears in "React Web App" and "TypeScript CLI"
      // Python appears in "Python API"
      // Combined with OR: should return all 3
      const result = filterProjectsBySkills(testProjects, ["TypeScript", "Python"]);

      expect(result).toHaveLength(3);
      expect(result.map((p) => p.title)).toContain("React Web App");
      expect(result.map((p) => p.title)).toContain("Python API");
      expect(result.map((p) => p.title)).toContain("TypeScript CLI");
    });

    it("returns projects sorted by order field", () => {
      const result = filterProjectsBySkills(testProjects, ["TypeScript", "Python"]);

      // Order should be: 1, 2, 5
      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(2);
      expect(result[2].order).toBe(5);
    });

    it("handles single skill (equivalent to filterProjectsBySkill)", () => {
      const result = filterProjectsBySkills(testProjects, ["TypeScript"]);

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toEqual(["React Web App", "TypeScript CLI"]);
    });
  });

  describe("empty/no filter behavior", () => {
    it("returns all projects when skills array is empty", () => {
      const result = filterProjectsBySkills(testProjects, []);

      expect(result).toHaveLength(testProjects.length);
      expect(result).toEqual(testProjects);
    });

    it("returns empty array when no projects match any skill", () => {
      const result = filterProjectsBySkills(testProjects, ["Rust", "Go", "Elixir"]);

      expect(result).toEqual([]);
    });

    it("returns empty array when projects array is empty", () => {
      const result = filterProjectsBySkills([], ["TypeScript"]);

      expect(result).toEqual([]);
    });
  });

  describe("deduplication", () => {
    it("returns each project only once even if it matches multiple skills", () => {
      // "React Web App" has tags: ["React", "TypeScript", "Next.js"]
      // Filtering by React AND TypeScript should return it once, not twice
      const result = filterProjectsBySkills(testProjects, ["React", "TypeScript"]);

      const reactWebAppCount = result.filter((p) => p.title === "React Web App").length;
      expect(reactWebAppCount).toBe(1);
    });

    it("maintains correct total count with overlapping skills", () => {
      // React: "React Web App" (order 1)
      // TypeScript: "React Web App" (order 1), "TypeScript CLI" (order 5)
      // Next.js: "React Web App" (order 1)
      // Total unique: 2 projects
      const result = filterProjectsBySkills(testProjects, ["React", "TypeScript", "Next.js"]);

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toEqual(["React Web App", "TypeScript CLI"]);
    });
  });

  describe("cross-project-type filtering", () => {
    it("returns mixed project types when skills span categories", () => {
      // TypeScript: software projects
      // C++: game project
      const result = filterProjectsBySkills(testProjects, ["TypeScript", "C++"]);

      expect(result).toHaveLength(3);
      expect(result.map((p) => p.projectType)).toContain("software");
      expect(result.map((p) => p.projectType)).toContain("game");
    });

    it("includes mods when skill matches", () => {
      const result = filterProjectsBySkills(testProjects, ["Game Modding", "TypeScript"]);

      expect(result).toHaveLength(3);
      expect(result.map((p) => p.projectType)).toContain("mod");
      expect(result.map((p) => p.projectType)).toContain("software");
    });
  });

  describe("edge cases", () => {
    it("handles case-insensitive matching", () => {
      const result = filterProjectsBySkills(testProjects, ["typescript", "PYTHON"]);

      expect(result).toHaveLength(3);
    });

    it("trims whitespace from skill names", () => {
      const result = filterProjectsBySkills(testProjects, ["  TypeScript  ", "  Python  "]);

      expect(result).toHaveLength(3);
    });

    it("ignores empty strings in skills array", () => {
      const result = filterProjectsBySkills(testProjects, ["TypeScript", "", "  "]);

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toEqual(["React Web App", "TypeScript CLI"]);
    });

    it("handles skills with special characters", () => {
      const projectsWithSpecialTags: Project[] = [
        createTestProject({
          title: "DotNet App",
          projectType: "software",
          tags: ["C#", ".NET"],
          order: 1,
        }),
        createTestProject({
          title: "Node App",
          projectType: "software",
          tags: ["Node.js"],
          order: 2,
        }),
      ];

      const result = filterProjectsBySkills(projectsWithSpecialTags, ["C#", "Node.js"]);

      expect(result).toHaveLength(2);
    });
  });
});
