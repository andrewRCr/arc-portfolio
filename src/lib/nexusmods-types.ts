/**
 * NexusMods types and type guards
 *
 * Separated from server actions to avoid "must be async" constraint.
 */

/**
 * Stats returned from NexusMods API for a single mod
 */
export interface ModStats {
  modId: number;
  name: string;
  downloads: number;
  uniqueDownloads: number;
  endorsements: number;
  /** ISO timestamp of last update */
  updatedAt: string;
}

/**
 * Aggregate stats across all mods
 */
export interface AggregateStats {
  totalDownloads: number;
  totalUniqueDownloads: number;
  totalEndorsements: number;
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
  code: "NO_API_KEY" | "RATE_LIMITED" | "NOT_FOUND" | "API_ERROR";
}

export type ModStatsResult = ModStats | ModStatsError;
export type AggregateStatsResult = AggregateStats | ModStatsError;

/**
 * Check if result is an error
 */
export function isModStatsError(result: ModStatsResult | AggregateStatsResult): result is ModStatsError {
  return "error" in result && result.error === true;
}
