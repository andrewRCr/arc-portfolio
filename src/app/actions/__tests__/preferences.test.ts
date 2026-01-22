/**
 * Tests for preferences server action
 *
 * Tests palette preference cookie setting with mocked next/headers.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { setPalettePreference } from "../preferences";
import { PALETTE_COOKIE_NAME } from "@/config/storage";

// Mock cookie store
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

describe("setPalettePreference", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("valid palettes", () => {
    it("sets cookie for valid palette (remedy)", async () => {
      await setPalettePreference("remedy");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        PALETTE_COOKIE_NAME,
        "remedy",
        expect.objectContaining({
          httpOnly: false,
          sameSite: "strict",
          path: "/",
        })
      );
    });

    it("sets cookie for valid palette (gruvbox)", async () => {
      await setPalettePreference("gruvbox");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        PALETTE_COOKIE_NAME,
        "gruvbox",
        expect.any(Object)
      );
    });

    it("sets cookie for valid palette (rose-pine)", async () => {
      await setPalettePreference("rose-pine");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        PALETTE_COOKIE_NAME,
        "rose-pine",
        expect.any(Object)
      );
    });

    it("sets cookie with 1-year maxAge", async () => {
      await setPalettePreference("remedy");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        PALETTE_COOKIE_NAME,
        "remedy",
        expect.objectContaining({
          maxAge: 60 * 60 * 24 * 365, // 1 year
        })
      );
    });
  });

  describe("invalid palettes", () => {
    it("does not set cookie for invalid palette", async () => {
      await setPalettePreference("invalid-palette");

      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("does not set cookie for empty string", async () => {
      await setPalettePreference("");

      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("silently ignores invalid palette without throwing", async () => {
      await expect(setPalettePreference("nonexistent")).resolves.toBeUndefined();
    });
  });
});
