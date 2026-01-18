/**
 * NexusMods API configuration and mod registry
 *
 * Registry contains all mods by this author for aggregate stats calculation.
 * Displayed mods (in portfolio) are a subset; all contribute to totals.
 */

export const NEXUSMODS_CONFIG = {
  /** API base URL */
  baseUrl: "https://api.nexusmods.com/v1",

  /** Cache duration in seconds (6 hours = 4 refreshes per day) */
  cacheTtl: 21600,

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
 * Public mods by author - core registry for portfolio display
 *
 * 35 public mods:
 * - 7 displayed in portfolio (with portfolioSlug for matching)
 * - 28 additional public mods
 *
 * See also: HIDDEN_MODS (3 mods) and ALL_MODS_FOR_AGGREGATE (38 total)
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
 * Hidden mods (no longer public on NexusMods)
 *
 * These mods were once public but are now hidden. They can no longer be
 * downloaded, but their historical downloads still count toward the author
 * profile total. API returns undefined for hidden mods, so we track them
 * separately with manual tallies of frozen historical values.
 */
export const HIDDEN_MODS: NexusModEntry[] = [
  { game: "thefirstberserkerkhazan", modId: 88, displayed: false },
  { game: "eldenringnightreign", modId: 51, displayed: false },
  { game: "doomthedarkages", modId: 34, displayed: false },
];

/**
 * Frozen download tally for hidden mods
 *
 * These are historical values captured when the mods were still public.
 * Since hidden mods cannot be downloaded, these numbers will not change.
 * Included in aggregate stats to match the author profile page total.
 *
 * Breakdown (captured 2026-01-16):
 * - thefirstberserkerkhazan/88: 83 unique, 94 total
 * - eldenringnightreign/51: 672 unique, 992 total
 * - doomthedarkages/34: 123 unique, 235 total
 */
export const HIDDEN_MODS_DOWNLOAD_TALLY = {
  downloads: 1321, // 94 + 992 + 235
  uniqueDownloads: 878, // 83 + 672 + 123
};

// Derived constants
export const DISPLAYED_MODS = MOD_REGISTRY.filter((mod) => mod.displayed);

/** All mods for aggregate stats (registry + hidden) */
export const ALL_MODS_FOR_AGGREGATE = [...MOD_REGISTRY, ...HIDDEN_MODS];

export const TOTAL_MOD_COUNT = ALL_MODS_FOR_AGGREGATE.length;
export const DISPLAYED_MOD_COUNT = DISPLAYED_MODS.length;
