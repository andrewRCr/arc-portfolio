"use server";

/**
 * Server Actions for NexusMods API
 *
 * Fetches mod statistics (downloads, endorsements) from NexusMods API.
 * Uses Next.js caching with 24-hour revalidation to minimize API calls.
 *
 * API key must be set in NEXUSMODS_API_KEY environment variable.
 */

import { unstable_cache } from "next/cache";
import {
  NEXUSMODS_CONFIG,
  ALL_MODS_FOR_AGGREGATE,
  DISPLAYED_MODS,
  HIDDEN_MODS_DOWNLOAD_TALLY,
  type NexusModEntry,
} from "@/config/nexusmods";
import { isModStatsError, type ModStatsResult, type AggregateStatsResult } from "@/lib/nexusmods-types";

/**
 * Build headers required by NexusMods API
 */
function getApiHeaders(): HeadersInit | null {
  const apiKey = process.env.NEXUSMODS_API_KEY;
  if (!apiKey) {
    return null;
  }

  return {
    apikey: apiKey,
    "Application-Name": NEXUSMODS_CONFIG.appName,
    "Application-Version": NEXUSMODS_CONFIG.appVersion,
  };
}

/**
 * Raw API response from NexusMods mod info endpoint
 */
interface NexusModsApiResponse {
  mod_id: number;
  name: string;
  mod_downloads: number;
  mod_unique_downloads: number;
  endorsement_count: number;
  updated_timestamp: number;
}

/**
 * Fetch stats for a single mod (uncached - internal use)
 */
async function fetchModStatsInternal(game: string, modId: number): Promise<ModStatsResult> {
  const headers = getApiHeaders();
  if (!headers) {
    return {
      error: true,
      message: "NexusMods API key not configured",
      code: "NO_API_KEY",
    };
  }

  const url = `${NEXUSMODS_CONFIG.baseUrl}/games/${game}/mods/${modId}.json`;

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: NEXUSMODS_CONFIG.cacheTtl },
    });

    if (response.status === 429) {
      return {
        error: true,
        message: "NexusMods API rate limit exceeded",
        code: "RATE_LIMITED",
      };
    }

    if (response.status === 404) {
      return {
        error: true,
        message: `Mod not found: ${game}/${modId}`,
        code: "NOT_FOUND",
      };
    }

    if (!response.ok) {
      return {
        error: true,
        message: `NexusMods API error: ${response.status} ${response.statusText}`,
        code: "API_ERROR",
      };
    }

    const data: NexusModsApiResponse = await response.json();

    return {
      modId: data.mod_id,
      name: data.name,
      downloads: data.mod_downloads,
      uniqueDownloads: data.mod_unique_downloads,
      endorsements: data.endorsement_count,
      updatedAt: new Date(data.updated_timestamp * 1000).toISOString(),
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Unknown error fetching mod",
      code: "API_ERROR",
    };
  }
}

/**
 * Get stats for a single mod (cached)
 *
 * @param game - Game domain from NexusMods URL (e.g., "liesofp")
 * @param modId - Numeric mod ID
 * @returns Mod stats or error
 */
export const getModStats = unstable_cache(
  async (game: string, modId: number): Promise<ModStatsResult> => {
    return fetchModStatsInternal(game, modId);
  },
  ["nexusmods-mod-stats"],
  {
    revalidate: NEXUSMODS_CONFIG.cacheTtl,
    tags: ["nexusmods"],
  }
);

/**
 * Get stats for a displayed mod by portfolio slug
 *
 * Convenience function that looks up the NexusMods game/modId from the registry.
 *
 * @param portfolioSlug - Slug from portfolio project data
 * @returns Mod stats or error
 */
export async function getModStatsBySlug(portfolioSlug: string): Promise<ModStatsResult> {
  const entry = DISPLAYED_MODS.find((mod) => mod.portfolioSlug === portfolioSlug);

  if (!entry) {
    return {
      error: true,
      message: `No NexusMods entry found for slug: ${portfolioSlug}`,
      code: "NOT_FOUND",
    };
  }

  return getModStats(entry.game, entry.modId);
}

/**
 * Fetch aggregate stats across all mods in registry (uncached - internal use)
 */
async function fetchAggregateStatsInternal(): Promise<AggregateStatsResult> {
  const headers = getApiHeaders();
  if (!headers) {
    return {
      error: true,
      message: "NexusMods API key not configured",
      code: "NO_API_KEY",
    };
  }

  let totalDownloads = 0;
  let totalUniqueDownloads = 0;
  let totalEndorsements = 0;
  let successCount = 0;

  // Fetch all mods in parallel (respecting that we have 600 request quota)
  // Includes hidden mods to match NexusMods profile page total
  const results = await Promise.all(ALL_MODS_FOR_AGGREGATE.map((mod) => fetchModStatsInternal(mod.game, mod.modId)));

  for (const result of results) {
    if (!isModStatsError(result)) {
      // Hidden mods return undefined for downloads - skip those values
      totalDownloads += result.downloads ?? 0;
      totalUniqueDownloads += result.uniqueDownloads ?? 0;
      totalEndorsements += result.endorsements ?? 0;
      successCount++;
    }
  }

  // If we couldn't fetch any mods, return error
  if (successCount === 0) {
    return {
      error: true,
      message: "Failed to fetch any mod stats",
      code: "API_ERROR",
    };
  }

  // Add manual tally for hidden mods (API returns undefined for their downloads)
  // These values captured manually from NexusMods before mods were hidden
  totalDownloads += HIDDEN_MODS_DOWNLOAD_TALLY.downloads;
  totalUniqueDownloads += HIDDEN_MODS_DOWNLOAD_TALLY.uniqueDownloads;

  return {
    totalDownloads,
    totalUniqueDownloads,
    totalEndorsements,
    modCount: successCount,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get aggregate stats across all mods (cached)
 *
 * Sums downloads, unique downloads, and endorsements across all 38 mods
 * (35 registry + 3 hidden mods).
 *
 * @returns Aggregate stats or error
 */
export const getAggregateStats = unstable_cache(
  async (): Promise<AggregateStatsResult> => {
    return fetchAggregateStatsInternal();
  },
  ["nexusmods-aggregate-stats"],
  {
    revalidate: NEXUSMODS_CONFIG.cacheTtl,
    tags: ["nexusmods"],
  }
);

/**
 * Get stats for all displayed mods (cached)
 *
 * Returns stats for the 7 mods shown in the portfolio.
 * Useful for batch fetching on pages that show multiple mods.
 *
 * @returns Array of mod stats (including any errors)
 */
export const getDisplayedModStats = unstable_cache(
  async (): Promise<Array<{ entry: NexusModEntry; stats: ModStatsResult }>> => {
    const results = await Promise.all(
      DISPLAYED_MODS.map(async (entry) => ({
        entry,
        stats: await fetchModStatsInternal(entry.game, entry.modId),
      }))
    );
    return results;
  },
  ["nexusmods-displayed-stats"],
  {
    revalidate: NEXUSMODS_CONFIG.cacheTtl,
    tags: ["nexusmods"],
  }
);
