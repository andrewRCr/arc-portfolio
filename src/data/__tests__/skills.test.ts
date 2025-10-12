/**
 * Data validation tests for skills data file
 *
 * These tests verify that:
 * - All 8 skill categories are present and properly structured
 * - Each category has valid skills (non-empty arrays)
 * - Category names match expected structure
 * - All skills are strings and non-empty
 * - No duplicate skills within categories
 * - Skills from new projects are included
 * - Phase 2 migration completeness
 */

import { describe, it, expect } from "vitest";
import { skills } from "@/data/skills";

describe("Skills Data Validation", () => {
  describe("Category Structure", () => {
    it("should have exactly 8 skill categories", () => {
      expect(skills).toBeDefined();
      const categoryCount = Object.keys(skills).length;
      expect(categoryCount).toBe(8);
    });

    it("should have all expected categories", () => {
      const expectedCategories = [
        "Languages",
        "Frontend",
        "Backend",
        "Databases",
        "AI-Assisted Development",
        "DevOps & Infrastructure",
        "Testing & Quality",
        "Methodologies",
      ];

      expectedCategories.forEach((category) => {
        expect(skills).toHaveProperty(category);
      });
    });

    it("should have all categories as arrays", () => {
      Object.values(skills).forEach((categorySkills) => {
        expect(Array.isArray(categorySkills)).toBe(true);
      });
    });

    it("should have non-empty arrays for all categories", () => {
      Object.values(skills).forEach((categorySkills) => {
        expect(categorySkills.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Skill Entry Validation", () => {
    it("should have all skills as non-empty strings", () => {
      Object.values(skills).forEach((categorySkills) => {
        categorySkills.forEach((skill) => {
          expect(typeof skill).toBe("string");
          expect(skill.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have no duplicate skills within each category", () => {
      Object.values(skills).forEach((categorySkills) => {
        const uniqueSkills = new Set(categorySkills);
        expect(uniqueSkills.size).toBe(categorySkills.length);
      });
    });

    it("should have properly formatted skill names (no extra whitespace)", () => {
      Object.values(skills).forEach((categorySkills) => {
        categorySkills.forEach((skill) => {
          expect(skill).toBe(skill.trim());
          expect(skill).not.toContain("  "); // No double spaces
        });
      });
    });
  });

  describe("Languages Category", () => {
    it("should have core programming languages", () => {
      const coreLanguages = ["TypeScript", "JavaScript", "Python", "C#", "C++"];

      coreLanguages.forEach((language) => {
        expect(skills.Languages).toContain(language);
      });
    });

    it("should have web markup and styling languages", () => {
      expect(skills.Languages).toContain("HTML");
      expect(skills.Languages).toContain("CSS");
    });

    it("should have database query language", () => {
      expect(skills.Languages).toContain("SQL");
    });

    it("should have at least 8 languages", () => {
      expect(skills.Languages.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe("Frontend Category", () => {
    it("should have modern JavaScript frameworks", () => {
      expect(skills.Frontend).toContain("React");
      expect(skills.Frontend).toContain("Next.js");
    });

    it("should have CSS frameworks and libraries", () => {
      expect(skills.Frontend).toContain("Tailwind CSS");
      expect(skills.Frontend).toContain("Shadcn/ui");
      expect(skills.Frontend).toContain("Chakra UI");
      expect(skills.Frontend).toContain("Bootstrap");
    });

    it("should have .NET frontend technologies", () => {
      expect(skills.Frontend).toContain("Blazor");
      expect(skills.Frontend).toContain("WPF");
      expect(skills.Frontend).toContain("MudBlazor");
    });

    it("should have at least 10 frontend skills", () => {
      expect(skills.Frontend.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Backend Category", () => {
    it("should have Python backend frameworks", () => {
      expect(skills.Backend).toContain("Django");
      expect(skills.Backend).toContain("Django Ninja");
      expect(skills.Backend).toContain("Pydantic");
    });

    it("should have Node.js and related technologies", () => {
      expect(skills.Backend).toContain("Node.js");
      expect(skills.Backend).toContain("Express.js");
    });

    it("should have .NET backend technologies", () => {
      expect(skills.Backend).toContain(".NET");
      expect(skills.Backend).toContain("Entity Framework");
    });

    it("should have at least 7 backend skills", () => {
      expect(skills.Backend.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe("Databases Category", () => {
    it("should have relational databases", () => {
      expect(skills.Databases).toContain("PostgreSQL");
      expect(skills.Databases).toContain("SQL Server");
      expect(skills.Databases).toContain("MySQL");
    });

    it("should have NoSQL database", () => {
      expect(skills.Databases).toContain("MongoDB");
    });

    it("should have caching/in-memory database", () => {
      expect(skills.Databases).toContain("Redis");
    });

    it("should have at least 5 database technologies", () => {
      expect(skills.Databases.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("AI-Assisted Development Category", () => {
    it("should have AI coding assistants", () => {
      expect(skills["AI-Assisted Development"]).toContain("Claude Code");
      expect(skills["AI-Assisted Development"]).toContain("GitHub Copilot");
    });

    it("should have AI-powered CLI tools", () => {
      expect(skills["AI-Assisted Development"]).toContain("Warp");
      expect(skills["AI-Assisted Development"]).toContain("Gemini CLI");
      expect(skills["AI-Assisted Development"]).toContain("Codex CLI");
    });

    it("should have AI code review tools", () => {
      expect(skills["AI-Assisted Development"]).toContain("CodeRabbit");
    });

    it("should have AI UI generation tools", () => {
      expect(skills["AI-Assisted Development"]).toContain("v0.dev");
    });

    it("should have at least 7 AI development tools", () => {
      expect(skills["AI-Assisted Development"].length).toBeGreaterThanOrEqual(7);
    });
  });

  describe("DevOps & Infrastructure Category", () => {
    it("should have version control systems", () => {
      expect(skills["DevOps & Infrastructure"]).toContain("Git");
      expect(skills["DevOps & Infrastructure"]).toContain("GitHub");
      expect(skills["DevOps & Infrastructure"]).toContain("Azure DevOps");
    });

    it("should have containerization technology", () => {
      expect(skills["DevOps & Infrastructure"]).toContain("Docker");
    });

    it("should have hosting platforms", () => {
      expect(skills["DevOps & Infrastructure"]).toContain("Vercel");
    });

    it("should have CI/CD technologies", () => {
      expect(skills["DevOps & Infrastructure"]).toContain("CI/CD");
      expect(skills["DevOps & Infrastructure"]).toContain("GitHub Actions");
    });

    it("should have at least 8 DevOps skills", () => {
      expect(skills["DevOps & Infrastructure"].length).toBeGreaterThanOrEqual(8);
    });
  });

  describe("Testing & Quality Category", () => {
    it("should have modern JavaScript testing frameworks", () => {
      expect(skills["Testing & Quality"]).toContain("Vitest");
      expect(skills["Testing & Quality"]).toContain("React Testing Library");
    });

    it("should have API testing tools", () => {
      expect(skills["Testing & Quality"]).toContain("Postman");
      expect(skills["Testing & Quality"]).toContain("Swagger");
    });

    it("should have at least 4 testing tools", () => {
      expect(skills["Testing & Quality"].length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Methodologies Category", () => {
    it("should have testing methodologies", () => {
      expect(skills.Methodologies).toContain("Test-Driven Development (TDD)");
    });

    it("should have development methodologies", () => {
      expect(skills.Methodologies).toContain("Spec-Driven Development");
      expect(skills.Methodologies).toContain("Agile");
    });

    it("should have at least 3 methodologies", () => {
      expect(skills.Methodologies.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Phase 2 Migration Completeness", () => {
    it("should have skills from CineXplorer project (Task 3.2)", () => {
      const cinexplorerSkills = ["Next.js", "React", "Tailwind CSS", "TypeScript", "PostgreSQL"];

      cinexplorerSkills.forEach((skill) => {
        const hasSkill = Object.values(skills).some((categorySkills) => categorySkills.includes(skill));
        expect(hasSkill).toBe(true);
      });
    });

    it("should have skills from ARC Framework project (Task 3.2)", () => {
      const arcSkills = ["Python", "Claude Code", "GitHub Actions"];

      arcSkills.forEach((skill) => {
        const hasSkill = Object.values(skills).some((categorySkills) => categorySkills.includes(skill));
        expect(hasSkill).toBe(true);
      });
    });

    it("should have AI development tools category (Task 3.1)", () => {
      expect(skills).toHaveProperty("AI-Assisted Development");
      expect(skills["AI-Assisted Development"].length).toBeGreaterThan(0);
    });

    it("should have modern testing tools (Vitest, React Testing Library)", () => {
      expect(skills["Testing & Quality"]).toContain("Vitest");
      expect(skills["Testing & Quality"]).toContain("React Testing Library");
    });
  });

  describe("Overall Skills Coverage", () => {
    it("should have at least 50 total skills across all categories", () => {
      const totalSkills = Object.values(skills).reduce((sum, categorySkills) => sum + categorySkills.length, 0);
      expect(totalSkills).toBeGreaterThanOrEqual(50);
    });

    it("should have diverse skill set across categories", () => {
      // No category should dominate (> 40% of total skills)
      const totalSkills = Object.values(skills).reduce((sum, categorySkills) => sum + categorySkills.length, 0);

      Object.values(skills).forEach((categorySkills) => {
        const percentage = (categorySkills.length / totalSkills) * 100;
        expect(percentage).toBeLessThan(40);
      });
    });
  });
});
