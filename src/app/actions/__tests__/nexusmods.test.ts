/**
 * Tests for NexusMods types and type guards
 *
 * Covers the isModStatsError type guard and validates type structures
 * for ModStats, ModStatsError, and AuthorStats.
 */

import { describe, it, expect } from "vitest";
import { isModStatsError, type ModStats, type ModStatsError, type AuthorStats } from "@/lib/nexusmods-types";

describe("isModStatsError", () => {
  it("returns true for error objects", () => {
    const error: ModStatsError = {
      error: true,
      message: "Test error",
      code: "API_ERROR",
    };
    expect(isModStatsError(error)).toBe(true);
  });

  it("returns true for RATE_LIMITED error", () => {
    const error: ModStatsError = {
      error: true,
      message: "Rate limit exceeded",
      code: "RATE_LIMITED",
    };
    expect(isModStatsError(error)).toBe(true);
  });

  it("returns true for NOT_FOUND error", () => {
    const error: ModStatsError = {
      error: true,
      message: "Mod not found",
      code: "NOT_FOUND",
    };
    expect(isModStatsError(error)).toBe(true);
  });

  it("returns false for successful ModStats", () => {
    const stats: ModStats = {
      modId: 304,
      name: "Test Mod",
      downloads: 1000,
      endorsements: 50,
      updatedAt: "2024-01-01T00:00:00.000Z",
    };
    expect(isModStatsError(stats)).toBe(false);
  });

  it("returns false for successful AuthorStats", () => {
    const stats: AuthorStats = {
      uniqueDownloads: 342314,
      modCount: 35,
      fetchedAt: "2024-01-01T00:00:00.000Z",
    };
    expect(isModStatsError(stats)).toBe(false);
  });
});

describe("ModStats type structure", () => {
  it("has required fields for successful response", () => {
    const stats: ModStats = {
      modId: 304,
      name: "Hardcore Mode",
      downloads: 15000,
      endorsements: 450,
      updatedAt: "2024-06-15T10:30:00.000Z",
    };

    expect(stats.modId).toBe(304);
    expect(stats.name).toBe("Hardcore Mode");
    expect(stats.downloads).toBe(15000);
    expect(stats.endorsements).toBe(450);
    expect(stats.updatedAt).toBe("2024-06-15T10:30:00.000Z");
  });
});

describe("ModStatsError type structure", () => {
  it("has required fields for error response", () => {
    const error: ModStatsError = {
      error: true,
      message: "NexusMods API rate limit exceeded",
      code: "RATE_LIMITED",
    };

    expect(error.error).toBe(true);
    expect(error.message).toBe("NexusMods API rate limit exceeded");
    expect(error.code).toBe("RATE_LIMITED");
  });

  it("supports all error codes", () => {
    const codes: ModStatsError["code"][] = ["RATE_LIMITED", "NOT_FOUND", "API_ERROR"];

    codes.forEach((code) => {
      const error: ModStatsError = {
        error: true,
        message: `Error: ${code}`,
        code,
      };
      expect(error.code).toBe(code);
    });
  });
});

describe("AuthorStats type structure", () => {
  it("has required fields for author response", () => {
    const stats: AuthorStats = {
      uniqueDownloads: 342314,
      modCount: 35,
      fetchedAt: "2024-06-15T10:30:00.000Z",
    };

    expect(stats.uniqueDownloads).toBe(342314);
    expect(stats.modCount).toBe(35);
    expect(stats.fetchedAt).toBe("2024-06-15T10:30:00.000Z");
  });
});
