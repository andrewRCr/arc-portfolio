/**
 * Featured projects selection utility
 *
 * Provides randomized selection of projects for the Home page Featured section.
 * Pools are derived dynamically from projects/mods with `featured: true`.
 *
 * Slot configuration:
 * - Slot 1: Software (random from featured software, excluding framework)
 * - Slot 2: Framework (ARC Framework - always)
 * - Slot 3: Game (random from featured games)
 * - Slot 4: Mod (random from featured mods)
 */

import { projects } from "@/data/projects";
import { mods } from "@/data/mods";

/** Project type for featured cards */
export type FeaturedProjectType = "software" | "framework" | "game" | "mod";

/** Minimal project reference returned by selection */
export interface FeaturedProject {
  slug: string;
  type: FeaturedProjectType;
}

/** Framework project slug (always shown, has dedicated slot despite being projectType: "software") */
export const FRAMEWORK_SLUG = "arc-agentic-dev-framework";

/** Derive software pool: featured software projects excluding the framework */
export const SOFTWARE_POOL: string[] = projects
  .filter((p) => p.featured && p.projectType === "software" && p.slug !== FRAMEWORK_SLUG)
  .map((p) => p.slug);

/** Derive game pool: featured game projects */
export const GAME_POOL: string[] = projects.filter((p) => p.featured && p.projectType === "game").map((p) => p.slug);

/** Derive mod pool: featured mods */
export const MOD_POOL: string[] = mods.filter((m) => m.featured).map((m) => m.slug);

/** localStorage key for E2E deterministic mode */
export const E2E_DETERMINISTIC_KEY = "e2e-deterministic";

/**
 * Check if deterministic mode is enabled (for E2E visual regression tests).
 * Returns true if localStorage flag is set, false otherwise.
 * Safe to call in SSR context (returns false).
 */
function isDeterministicMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(E2E_DETERMINISTIC_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Selects an item from an array - random normally, first item in deterministic mode.
 * @throws Error if pool is empty
 */
function selectFromPool<T>(pool: T[]): T {
  if (pool.length === 0) {
    throw new Error("selectFromPool called with empty pool");
  }
  if (isDeterministicMode()) {
    return pool[0];
  }
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Selects 4 featured projects for the Home page.
 *
 * Returns one project per category type:
 * - Random software project
 * - ARC Framework (always)
 * - Random game project
 * - Random mod project
 *
 * @returns Array of 4 FeaturedProject objects with slug and type
 */
export function selectFeaturedProjects(): FeaturedProject[] {
  if (SOFTWARE_POOL.length === 0) {
    throw new Error("No featured software projects available");
  }
  if (GAME_POOL.length === 0) {
    throw new Error("No featured game projects available");
  }
  if (MOD_POOL.length === 0) {
    throw new Error("No featured mod projects available");
  }

  return [
    { slug: selectFromPool(SOFTWARE_POOL), type: "software" },
    { slug: FRAMEWORK_SLUG, type: "framework" },
    { slug: selectFromPool(GAME_POOL), type: "game" },
    { slug: selectFromPool(MOD_POOL), type: "mod" },
  ];
}
