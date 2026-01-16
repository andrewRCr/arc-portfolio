/**
 * Tests for featured projects selection utility
 *
 * Option B slot configuration:
 * - Slot 1: Software (CineXplorer or TaskFocus)
 * - Slot 2: Framework (ARC Framework - always)
 * - Slot 3: Game (Action RPG or Survival Horror)
 * - Slot 4: Mod (from 5-mod pool)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { selectFeaturedProjects, SOFTWARE_POOL, FRAMEWORK_SLUG, GAME_POOL, MOD_POOL } from "../featured-projects";

describe("selectFeaturedProjects", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("returns correct structure", () => {
    it("returns exactly 4 projects", () => {
      const result = selectFeaturedProjects();
      expect(result).toHaveLength(4);
    });

    it("returns projects with required properties", () => {
      const result = selectFeaturedProjects();
      result.forEach((project) => {
        expect(project).toHaveProperty("slug");
        expect(project).toHaveProperty("type");
        expect(typeof project.slug).toBe("string");
        expect(typeof project.type).toBe("string");
      });
    });

    it("returns projects with valid type labels", () => {
      const validTypes = ["software", "framework", "game", "mod"];
      const result = selectFeaturedProjects();
      result.forEach((project) => {
        expect(validTypes).toContain(project.type);
      });
    });
  });

  describe("slot configuration (Option B)", () => {
    it("slot 1 is software type", () => {
      const result = selectFeaturedProjects();
      expect(result[0].type).toBe("software");
    });

    it("slot 2 is framework type", () => {
      const result = selectFeaturedProjects();
      expect(result[1].type).toBe("framework");
    });

    it("slot 3 is game type", () => {
      const result = selectFeaturedProjects();
      expect(result[2].type).toBe("game");
    });

    it("slot 4 is mod type", () => {
      const result = selectFeaturedProjects();
      expect(result[3].type).toBe("mod");
    });
  });

  describe("software slot (slot 1)", () => {
    it("draws from software pool", () => {
      const result = selectFeaturedProjects();
      expect(SOFTWARE_POOL).toContain(result[0].slug);
    });

    it("respects deterministic random for selection", () => {
      // Mock random to return 0 (selects first item)
      vi.mocked(Math.random).mockReturnValue(0);
      const result1 = selectFeaturedProjects();
      expect(result1[0].slug).toBe(SOFTWARE_POOL[0]);

      // Reset and mock to return 0.99 (selects last item)
      vi.mocked(Math.random).mockReturnValue(0.99);
      const result2 = selectFeaturedProjects();
      expect(result2[0].slug).toBe(SOFTWARE_POOL[SOFTWARE_POOL.length - 1]);
    });
  });

  describe("framework slot (slot 2)", () => {
    it("always returns ARC Framework", () => {
      // Run multiple times to verify consistency
      for (let i = 0; i < 10; i++) {
        const result = selectFeaturedProjects();
        expect(result[1].slug).toBe(FRAMEWORK_SLUG);
      }
    });
  });

  describe("game slot (slot 3)", () => {
    it("draws from game pool", () => {
      const result = selectFeaturedProjects();
      expect(GAME_POOL).toContain(result[2].slug);
    });

    it("respects deterministic random for selection", () => {
      vi.mocked(Math.random).mockReturnValue(0);
      const result1 = selectFeaturedProjects();
      expect(result1[2].slug).toBe(GAME_POOL[0]);

      vi.mocked(Math.random).mockReturnValue(0.99);
      const result2 = selectFeaturedProjects();
      expect(result2[2].slug).toBe(GAME_POOL[GAME_POOL.length - 1]);
    });
  });

  describe("mod slot (slot 4)", () => {
    it("draws from mod pool", () => {
      const result = selectFeaturedProjects();
      expect(MOD_POOL).toContain(result[3].slug);
    });

    it("respects deterministic random for selection", () => {
      vi.mocked(Math.random).mockReturnValue(0);
      const result1 = selectFeaturedProjects();
      expect(result1[3].slug).toBe(MOD_POOL[0]);

      vi.mocked(Math.random).mockReturnValue(0.99);
      const result2 = selectFeaturedProjects();
      expect(result2[3].slug).toBe(MOD_POOL[MOD_POOL.length - 1]);
    });
  });

  describe("pool definitions", () => {
    it("software pool contains expected projects", () => {
      expect(SOFTWARE_POOL).toContain("cinexplorer");
      expect(SOFTWARE_POOL).toContain("taskfocus");
      expect(SOFTWARE_POOL).toHaveLength(2);
    });

    it("framework slug is arc-agentic-dev-framework", () => {
      expect(FRAMEWORK_SLUG).toBe("arc-agentic-dev-framework");
    });

    it("game pool contains expected projects", () => {
      expect(GAME_POOL).toContain("action-rpg-project");
      expect(GAME_POOL).toContain("survival-horror-project");
      expect(GAME_POOL).toHaveLength(2);
    });

    it("mod pool contains expected projects (5 mods)", () => {
      expect(MOD_POOL).toContain("lies-of-p-hardcore-mode");
      expect(MOD_POOL).toContain("sor4-improved-movement");
      expect(MOD_POOL).toContain("re8-aim-dependent-crosshair");
      expect(MOD_POOL).toContain("elden-ring-guard-parry");
      expect(MOD_POOL).toContain("re4r-improved-weapon-balance");
      expect(MOD_POOL).toHaveLength(5);
    });

    it("mod pool excludes silent hill 2 never holster weapons", () => {
      expect(MOD_POOL).not.toContain("sh2r-never-holster-weapons");
    });
  });
});
