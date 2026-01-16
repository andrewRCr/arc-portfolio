/**
 * NexusMods API configuration and mod registry
 *
 * Registry contains all mods by this author for aggregate stats calculation.
 * Displayed mods (in portfolio) are a subset; all contribute to totals.
 */

export const NEXUSMODS_CONFIG = {
  /** API base URL */
  baseUrl: "https://api.nexusmods.com/v1",

  /** Cache duration in seconds (24 hours) */
  cacheTtl: 86400,

  /** Application identification for API headers */
  appName: "arc-portfolio",
  appVersion: "1.0.0",
} as const;

/**
 * NexusMods mod entry for API queries
 */
export interface NexusModEntry {
  /** Game domain from URL (e.g., "liesofp" from nexusmods.com/liesofp/mods/304) */
  game: string;
  /** Numeric mod ID */
  modId: number;
  /** Whether this mod is displayed in the portfolio (vs aggregate-only) */
  displayed: boolean;
  /** Optional: slug to match with portfolio Project data */
  portfolioSlug?: string;
}

/**
 * All mods by author - used for aggregate stats calculation
 *
 * 35 total mods:
 * - 7 displayed in portfolio (with portfolioSlug for matching)
 * - 28 additional mods contributing to aggregate totals
 */
export const MOD_REGISTRY: NexusModEntry[] = [
  // ============================================
  // DISPLAYED IN PORTFOLIO (7 mods)
  // ============================================
  {
    game: "liesofp",
    modId: 304,
    displayed: true,
    portfolioSlug: "lies-of-p-hardcore-mode",
  },
  {
    game: "streetsofrage4",
    modId: 178,
    displayed: true,
    portfolioSlug: "sor4-improved-movement",
  },
  {
    game: "residentevilvillage",
    modId: 403,
    displayed: true,
    portfolioSlug: "re8-aim-dependent-crosshair",
  },
  {
    game: "eldenring",
    modId: 5128,
    displayed: true,
    portfolioSlug: "elden-ring-guard-parry",
  },
  {
    game: "residentevil42023",
    modId: 3016,
    displayed: true,
    portfolioSlug: "re4r-improved-weapon-balance",
  },
  {
    game: "silenthill2",
    modId: 199,
    displayed: true,
    portfolioSlug: "sh2r-never-holster-weapons",
  },
  {
    game: "doom",
    modId: 59,
    displayed: true,
    portfolioSlug: "doom-newgame-plus-customizer",
  },

  // ============================================
  // ADDITIONAL MODS (28 mods, aggregate only)
  // ============================================
  { game: "mafiatheoldcountry", modId: 39, displayed: false },
  { game: "mafiatheoldcountry", modId: 27, displayed: false },
  { game: "mafiatheoldcountry", modId: 15, displayed: false },
  { game: "blackmythwukong", modId: 1287, displayed: false },
  { game: "blackmythwukong", modId: 1285, displayed: false },
  { game: "wuchangfallenfeathers", modId: 146, displayed: false },
  { game: "wuchangfallenfeathers", modId: 136, displayed: false },
  { game: "wuchangfallenfeathers", modId: 124, displayed: false },
  { game: "wuchangfallenfeathers", modId: 42, displayed: false },
  { game: "wuchangfallenfeathers", modId: 21, displayed: false },
  { game: "wuchangfallenfeathers", modId: 15, displayed: false },
  { game: "wuchangfallenfeathers", modId: 9, displayed: false },
  { game: "thefirstberserkerkhazan", modId: 108, displayed: false },
  { game: "thefirstberserkerkhazan", modId: 107, displayed: false },
  { game: "liesofp", modId: 308, displayed: false },
  { game: "liesofp", modId: 300, displayed: false },
  { game: "liesofp", modId: 161, displayed: false },
  { game: "doomthedarkages", modId: 36, displayed: false },
  { game: "stellarblade", modId: 1129, displayed: false },
  { game: "stellarblade", modId: 359, displayed: false },
  { game: "stellarblade", modId: 271, displayed: false },
  { game: "stellarblade", modId: 232, displayed: false },
  { game: "streetsofrage4", modId: 192, displayed: false },
  { game: "silenthill2", modId: 220, displayed: false },
  { game: "silenthill2", modId: 152, displayed: false },
  { game: "darksouls3", modId: 1819, displayed: false },
  { game: "darksouls3", modId: 1813, displayed: false },
  { game: "darksoulsremastered", modId: 757, displayed: false },
];

/**
 * Hidden mods (currently not public on NexusMods)
 *
 * These may still contribute to author profile totals on NexusMods.
 * Kept separate for comparison - if our calculated total doesn't match
 * the profile page, we can add these to reconcile.
 */
export const HIDDEN_MODS: Omit<NexusModEntry, "displayed">[] = [
  { game: "thefirstberserkerkhazan", modId: 88 },
  { game: "eldenringnightreign", modId: 51 },
  { game: "doomthedarkages", modId: 34 },
];

// Derived constants
export const DISPLAYED_MODS = MOD_REGISTRY.filter((mod) => mod.displayed);
export const TOTAL_MOD_COUNT = MOD_REGISTRY.length;
export const DISPLAYED_MOD_COUNT = DISPLAYED_MODS.length;
