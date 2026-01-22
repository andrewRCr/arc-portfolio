/**
 * Tests for wallpaper server action
 *
 * Tests wallpaper preference cookie setting with mocked next/headers.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncWallpaperToCookie } from "../wallpaper";
import { WALLPAPER_COOKIE_NAME } from "@/config/storage";

// Use vi.hoisted to create mock at hoist-time, avoiding TDZ with vi.mock factory
const mockCookieStore = vi.hoisted(() => ({
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

describe("syncWallpaperToCookie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieStore.get.mockReturnValue(undefined);
  });

  describe("new preferences", () => {
    it("creates new preference object when no existing cookie", async () => {
      await syncWallpaperToCookie("remedy", "gradient");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        JSON.stringify({ remedy: "gradient" }),
        expect.any(Object)
      );
    });

    it("sets cookie with correct options", async () => {
      await syncWallpaperToCookie("remedy", "gradient");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({
          httpOnly: false,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
        })
      );
    });
  });

  describe("merging with existing preferences", () => {
    it("merges new palette into existing preferences", async () => {
      mockCookieStore.get.mockReturnValue({
        value: JSON.stringify({ remedy: "gradient" }),
      });

      await syncWallpaperToCookie("gruvbox", "noise-1");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        JSON.stringify({ remedy: "gradient", gruvbox: "noise-1" }),
        expect.any(Object)
      );
    });

    it("updates existing palette preference", async () => {
      mockCookieStore.get.mockReturnValue({
        value: JSON.stringify({ remedy: "gradient" }),
      });

      await syncWallpaperToCookie("remedy", "noise-2");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        JSON.stringify({ remedy: "noise-2" }),
        expect.any(Object)
      );
    });

    it("handles URL-encoded cookie values", async () => {
      // URL-encoded JSON
      mockCookieStore.get.mockReturnValue({
        value: encodeURIComponent(JSON.stringify({ remedy: "gradient" })),
      });

      await syncWallpaperToCookie("gruvbox", "noise-1");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        JSON.stringify({ remedy: "gradient", gruvbox: "noise-1" }),
        expect.any(Object)
      );
    });
  });

  describe("invalid existing cookie handling", () => {
    it("starts fresh when existing cookie contains invalid JSON", async () => {
      mockCookieStore.get.mockReturnValue({
        value: "not-valid-json",
      });

      await syncWallpaperToCookie("remedy", "gradient");

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        JSON.stringify({ remedy: "gradient" }),
        expect.any(Object)
      );
    });

    it("starts fresh when existing cookie is corrupted URL-encoded value", async () => {
      mockCookieStore.get.mockReturnValue({
        value: "%invalid%encoding",
      });

      await syncWallpaperToCookie("remedy", "gradient");

      // Should not throw and should set fresh preferences
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        WALLPAPER_COOKIE_NAME,
        JSON.stringify({ remedy: "gradient" }),
        expect.any(Object)
      );
    });
  });

  describe("multiple palettes", () => {
    it("preserves all palette preferences when adding new one", async () => {
      mockCookieStore.get.mockReturnValue({
        value: JSON.stringify({
          remedy: "gradient",
          gruvbox: "noise-1",
          "rose-pine": "noise-2",
        }),
      });

      await syncWallpaperToCookie("ayu", "img-1");

      const setCall = mockCookieStore.set.mock.calls[0];
      const savedPrefs = JSON.parse(setCall[1]);

      expect(savedPrefs).toEqual({
        remedy: "gradient",
        gruvbox: "noise-1",
        "rose-pine": "noise-2",
        ayu: "img-1",
      });
    });
  });
});
