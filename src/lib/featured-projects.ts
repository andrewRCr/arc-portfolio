/**
 * Featured projects selection utility
 *
 * Provides randomized selection of projects for the Home page Featured section.
 *
 * Slot configuration:
 * - Slot 1: Software (random from pool)
 * - Slot 2: Framework (ARC Framework - always)
 * - Slot 3: Game (random from pool)
 * - Slot 4: Mod (random from pool)
 */

/** Project type for featured cards */
export type FeaturedProjectType = "software" | "framework" | "game" | "mod";

/** Minimal project reference returned by selection */
export interface FeaturedProject {
  slug: string;
  type: FeaturedProjectType;
}

/** Software projects eligible for featured slot */
export const SOFTWARE_POOL: string[] = ["cinexplorer", "taskfocus"];

/** Framework project (always shown) */
export const FRAMEWORK_SLUG = "arc-agentic-dev-framework";

/** Game projects eligible for featured slot */
export const GAME_POOL: string[] = ["action-rpg-project", "survival-horror-project"];

/** Mod projects eligible for featured slot */
export const MOD_POOL: string[] = [
  "lies-of-p-hardcore-mode",
  "sor4-improved-movement",
  "re8-aim-dependent-crosshair",
  "elden-ring-guard-parry",
  "re4r-improved-weapon-balance",
];

/**
 * Selects a random item from an array
 */
function selectRandom<T>(pool: T[]): T {
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
  return [
    { slug: selectRandom(SOFTWARE_POOL), type: "software" },
    { slug: FRAMEWORK_SLUG, type: "framework" },
    { slug: selectRandom(GAME_POOL), type: "game" },
    { slug: selectRandom(MOD_POOL), type: "mod" },
  ];
}
