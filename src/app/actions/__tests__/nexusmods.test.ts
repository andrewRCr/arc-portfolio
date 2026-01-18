/**
 * Tests for NexusMods types and type guards
 *
 * Covers the isModStatsError type guard and validates type structures
 * for ModStats, ModStatsError, and AggregateStats.
 */

import { describe, it, expect } from "vitest";
import { isModStatsError, type ModStats, type ModStatsError, type AggregateStats } from "@/lib/nexusmods-types";

describe("isModStatsError", () => {
  it("returns true for error objects", () => {
    const error: ModStatsError = {
      error: true,
      message: "Test error",
      code: "API_ERROR",
    };
    expect(isModStatsError(error)).toBe(true);
  });

  it("returns true for NO_API_KEY error", () => {
    const error: ModStatsError = {
      error: true,
      message: "NexusMods API key not configured",
      code: "NO_API_KEY",
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
      uniqueDownloads: 800,
      endorsements: 50,
      updatedAt: "2024-01-01T00:00:00.000Z",
    };
    expect(isModStatsError(stats)).toBe(false);
  });

  it("returns false for successful AggregateStats", () => {
    const stats: AggregateStats = {
      totalDownloads: 10000,
      totalUniqueDownloads: 8000,
      totalEndorsements: 500,
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
      uniqueDownloads: 12000,
      endorsements: 450,
      updatedAt: "2024-06-15T10:30:00.000Z",
    };

    expect(stats.modId).toBe(304);
    expect(stats.name).toBe("Hardcore Mode");
    expect(stats.downloads).toBe(15000);
    expect(stats.uniqueDownloads).toBe(12000);
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
    const codes: ModStatsError["code"][] = ["NO_API_KEY", "RATE_LIMITED", "NOT_FOUND", "API_ERROR"];

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

describe("AggregateStats type structure", () => {
  it("has required fields for aggregate response", () => {
    const stats: AggregateStats = {
      totalDownloads: 300000,
      totalUniqueDownloads: 250000,
      totalEndorsements: 5000,
      modCount: 35,
      fetchedAt: "2024-06-15T10:30:00.000Z",
    };

    expect(stats.totalDownloads).toBe(300000);
    expect(stats.totalUniqueDownloads).toBe(250000);
    expect(stats.totalEndorsements).toBe(5000);
    expect(stats.modCount).toBe(35);
    expect(stats.fetchedAt).toBe("2024-06-15T10:30:00.000Z");
  });
});
