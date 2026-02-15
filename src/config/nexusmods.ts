/**
 * NexusMods API configuration and mod registry
 *
 * Uses the GraphQL v2 API (no authentication required for read-only queries).
 * Registry contains only displayed mods; author-level aggregate stats come
 * directly from the User query (no per-mod summation needed).
 */

export const NEXUSMODS_CONFIG = {
  /** GraphQL API endpoint */
  apiUrl: "https://api.nexusmods.com/v2/graphql",

  /** Cache duration in seconds (6 hours = 4 refreshes per day) */
  cacheTtl: 21600,

  /** NexusMods author username (for author-level stats query) */
  authorName: "andrewRCr",
} as const;

/**
 * NexusMods mod entry for API queries
 */
export interface NexusModEntry {
  /** Game domain from URL (e.g., "liesofp" from nexusmods.com/liesofp/mods/304) */
  game: string;
  /** Numeric mod ID */
  modId: number;
  /** Slug to match with portfolio Project data */
  portfolioSlug: string;
}

/**
 * Mods displayed in the portfolio
 *
 * 7 mods with portfolio slugs for matching to project detail pages.
 * Author-level aggregate stats (unique downloads, mod count) come from
 * the GraphQL User query, not from summing across this registry.
 */
export const DISPLAYED_MODS: NexusModEntry[] = [
  {
    game: "liesofp",
    modId: 304,
    portfolioSlug: "lies-of-p-hardcore-mode",
  },
  {
    game: "streetsofrage4",
    modId: 178,
    portfolioSlug: "sor4-improved-movement",
  },
  {
    game: "residentevilvillage",
    modId: 403,
    portfolioSlug: "re8-aim-dependent-crosshair",
  },
  {
    game: "eldenring",
    modId: 5128,
    portfolioSlug: "elden-ring-guard-parry",
  },
  {
    game: "residentevil42023",
    modId: 3016,
    portfolioSlug: "re4r-improved-weapon-balance",
  },
  {
    game: "silenthill2",
    modId: 199,
    portfolioSlug: "sh2r-never-holster-weapons",
  },
  {
    game: "doom",
    modId: 59,
    portfolioSlug: "doom-newgame-plus-customizer",
  },
];

export const DISPLAYED_MOD_COUNT = DISPLAYED_MODS.length;
