/**
 * NexusMods types and type guards
 *
 * Separated from server actions to avoid "must be async" constraint.
 */

/**
 * Stats returned from NexusMods GraphQL API for a single mod
 */
export interface ModStats {
  modId: number;
  name: string;
  downloads: number;
  endorsements: number;
  /** ISO timestamp of last update */
  updatedAt: string;
}

/**
 * Author-level stats from NexusMods User query
 */
export interface AuthorStats {
  uniqueDownloads: number;
  modCount: number;
  /** ISO timestamp when stats were fetched */
  fetchedAt: string;
}

/**
 * Error response when API call fails
 */
export interface ModStatsError {
  error: true;
  message: string;
  code: "RATE_LIMITED" | "NOT_FOUND" | "API_ERROR";
}

export type ModStatsResult = ModStats | ModStatsError;
export type AuthorStatsResult = AuthorStats | ModStatsError;

/**
 * Check if result is an error
 */
export function isModStatsError(result: ModStatsResult | AuthorStatsResult): result is ModStatsError {
  return "error" in result && result.error === true;
}
