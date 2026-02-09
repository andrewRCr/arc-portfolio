/**
 * Tests for featured projects selection utility
 *
 * Slot configuration:
 * - Slot 1: Software (random from featured software, excluding methodology)
 * - Slot 2: Framework (ARC Framework - always)
 * - Slot 3: Game (random from featured games)
 * - Slot 4: Mod (random from featured mods)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  selectFeaturedProjects,
  SOFTWARE_POOL,
  FRAMEWORK_SLUG,
  GAME_POOL,
  MOD_POOL,
  E2E_DETERMINISTIC_KEY,
} from "../featured-projects";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";

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
      const validTypes = ["software", "methodology", "game", "mod"];
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

    it("slot 2 is methodology type", () => {
      const result = selectFeaturedProjects();
      expect(result[1].type).toBe("methodology");
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

  describe("methodology slot (slot 2)", () => {
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

  describe("E2E deterministic mode", () => {
    afterEach(() => {
      localStorage.removeItem(E2E_DETERMINISTIC_KEY);
    });

    it("returns first item from each pool when deterministic mode enabled", () => {
      localStorage.setItem(E2E_DETERMINISTIC_KEY, "true");

      const result = selectFeaturedProjects();

      expect(result[0].slug).toBe(SOFTWARE_POOL[0]);
      expect(result[1].slug).toBe(FRAMEWORK_SLUG);
      expect(result[2].slug).toBe(GAME_POOL[0]);
      expect(result[3].slug).toBe(MOD_POOL[0]);
    });

    it("returns consistent results across multiple calls in deterministic mode", () => {
      localStorage.setItem(E2E_DETERMINISTIC_KEY, "true");

      const result1 = selectFeaturedProjects();
      const result2 = selectFeaturedProjects();
      const result3 = selectFeaturedProjects();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it("uses random selection when deterministic mode not set", () => {
      // Don't set localStorage - should use random
      vi.mocked(Math.random).mockReturnValue(0.99);

      const result = selectFeaturedProjects();

      // Should pick last items due to mocked random
      expect(result[0].slug).toBe(SOFTWARE_POOL[SOFTWARE_POOL.length - 1]);
      expect(result[2].slug).toBe(GAME_POOL[GAME_POOL.length - 1]);
      expect(result[3].slug).toBe(MOD_POOL[MOD_POOL.length - 1]);
    });

    it("ignores random mock when deterministic mode enabled", () => {
      localStorage.setItem(E2E_DETERMINISTIC_KEY, "true");
      vi.mocked(Math.random).mockReturnValue(0.99);

      const result = selectFeaturedProjects();

      // Should still pick first items despite random mock
      expect(result[0].slug).toBe(SOFTWARE_POOL[0]);
      expect(result[2].slug).toBe(GAME_POOL[0]);
      expect(result[3].slug).toBe(MOD_POOL[0]);
    });
  });

  describe("pool definitions (structural invariants)", () => {
    it("software pool contains only featured software projects, excludes methodology", () => {
      expect(SOFTWARE_POOL.length).toBeGreaterThan(0);

      SOFTWARE_POOL.forEach((slug) => {
        const project = projects.find((p) => p.slug === slug);
        expect(project).toBeDefined();
        expect(project?.featured).toBe(true);
        expect(project?.projectType).toBe("software");
        expect(slug).not.toBe(FRAMEWORK_SLUG);
      });
    });

    it("methodology slug references a valid featured software project", () => {
      const methodology = projects.find((p) => p.slug === FRAMEWORK_SLUG);
      expect(methodology).toBeDefined();
      expect(methodology?.featured).toBe(true);
      expect(methodology?.projectType).toBe("software");
    });

    it("game pool contains only featured game projects", () => {
      expect(GAME_POOL.length).toBeGreaterThan(0);

      GAME_POOL.forEach((slug) => {
        const project = projects.find((p) => p.slug === slug);
        expect(project).toBeDefined();
        expect(project?.featured).toBe(true);
        expect(project?.projectType).toBe("game");
      });
    });

    it("mod pool contains only featured mods", () => {
      expect(MOD_POOL.length).toBeGreaterThan(0);

      MOD_POOL.forEach((slug) => {
        const mod = mods.find((m) => m.slug === slug);
        expect(mod).toBeDefined();
        expect(mod?.featured).toBe(true);
      });
    });

    it("mod pool excludes non-featured mods", () => {
      const nonFeaturedMods = mods.filter((m) => !m.featured);
      nonFeaturedMods.forEach((mod) => {
        expect(MOD_POOL).not.toContain(mod.slug);
      });
    });
  });
});
