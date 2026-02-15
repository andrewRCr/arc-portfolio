"use server";

/**
 * Server Actions for NexusMods GraphQL API (v2)
 *
 * Fetches mod statistics (downloads, endorsements) and author-level stats
 * via the NexusMods GraphQL endpoint. No authentication required for
 * read-only queries.
 *
 * Uses Next.js caching with 6-hour revalidation to minimize API calls.
 */

import { unstable_cache } from "next/cache";
import { NEXUSMODS_CONFIG, DISPLAYED_MODS } from "@/config/nexusmods";
import { type ModStatsResult, type AuthorStatsResult } from "@/lib/nexusmods-types";

/**
 * Execute a GraphQL query against the NexusMods v2 API
 */
async function graphqlQuery<T>(query: string): Promise<T> {
  const response = await fetch(NEXUSMODS_CONFIG.apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (response.status === 429) {
    throw new GraphQLError("NexusMods API rate limit exceeded", "RATE_LIMITED");
  }

  if (!response.ok) {
    throw new GraphQLError(`NexusMods API error: ${response.status} ${response.statusText}`, "API_ERROR");
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new GraphQLError(`GraphQL error: ${json.errors[0].message}`, "API_ERROR");
  }

  return json.data as T;
}

class GraphQLError extends Error {
  constructor(
    message: string,
    public code: "RATE_LIMITED" | "NOT_FOUND" | "API_ERROR"
  ) {
    super(message);
  }
}

/**
 * GraphQL response types (internal)
 */
interface ModQueryResponse {
  legacyModsByDomain: {
    nodes: Array<{
      modId: number;
      name: string;
      downloads: number;
      endorsements: number;
      updatedAt: string;
    }>;
  };
}

interface AuthorQueryResponse {
  userByName: {
    uniqueModDownloads: number;
    modCount: number;
  };
}

/**
 * Fetch stats for a single mod (uncached - internal use)
 */
async function fetchModStatsInternal(game: string, modId: number): Promise<ModStatsResult> {
  try {
    const data = await graphqlQuery<ModQueryResponse>(
      `{ legacyModsByDomain(ids: [{gameDomain: "${game}", modId: ${modId}}]) { nodes { modId name downloads endorsements updatedAt } } }`
    );

    const mod = data.legacyModsByDomain.nodes[0];

    if (!mod) {
      return {
        error: true,
        message: `Mod not found: ${game}/${modId}`,
        code: "NOT_FOUND",
      };
    }

    return {
      modId: mod.modId,
      name: mod.name,
      downloads: mod.downloads,
      endorsements: mod.endorsements,
      updatedAt: mod.updatedAt,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      return { error: true, message: error.message, code: error.code };
    }
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
  ["nexusmods-mod-stats"], // Args (game, modId) are automatically appended by unstable_cache
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
 * Fetch author-level stats (uncached - internal use)
 */
async function fetchAuthorStatsInternal(): Promise<AuthorStatsResult> {
  try {
    const data = await graphqlQuery<AuthorQueryResponse>(
      `{ userByName(name: "${NEXUSMODS_CONFIG.authorName}") { uniqueModDownloads modCount } }`
    );

    if (!data.userByName) {
      return {
        error: true,
        message: `Author not found: ${NEXUSMODS_CONFIG.authorName}`,
        code: "NOT_FOUND",
      };
    }

    return {
      uniqueDownloads: data.userByName.uniqueModDownloads,
      modCount: data.userByName.modCount,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      return { error: true, message: error.message, code: error.code };
    }
    return {
      error: true,
      message: error instanceof Error ? error.message : "Unknown error fetching author stats",
      code: "API_ERROR",
    };
  }
}

/**
 * Get author-level stats (cached)
 *
 * Returns unique downloads and mod count directly from the NexusMods
 * User profile, matching what's displayed on the author's profile page.
 *
 * @returns Author stats or error
 */
export const getAuthorStats = unstable_cache(
  async (): Promise<AuthorStatsResult> => {
    return fetchAuthorStatsInternal();
  },
  ["nexusmods-author-stats"],
  {
    revalidate: NEXUSMODS_CONFIG.cacheTtl,
    tags: ["nexusmods"],
  }
);
