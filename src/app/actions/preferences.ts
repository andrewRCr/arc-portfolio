"use server";

/**
 * Server Actions for User Preferences
 *
 * These actions set cookies that the server can read during SSR,
 * enabling FOUC-free rendering of user preferences.
 *
 * Architecture: Cookies are SSR source of truth, localStorage is client cache.
 * Client components call these actions to sync localStorage → cookie.
 */

import { cookies } from "next/headers";
import { PALETTE_COOKIE_NAME, WALLPAPER_COOKIE_NAME } from "@/config/storage";

const COOKIE_OPTIONS = {
  httpOnly: false, // Accessible on client for synchronization
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
};

/**
 * Set the user's palette preference cookie.
 *
 * Called when user changes palette or on mount to sync localStorage → cookie.
 */
export async function setPalettePreference(palette: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PALETTE_COOKIE_NAME, palette, COOKIE_OPTIONS);
}

/**
 * Set the user's wallpaper preference cookie.
 *
 * Stores per-palette wallpaper preferences as JSON object.
 * Called when user changes wallpaper or on mount to sync localStorage → cookie.
 */
export async function setWallpaperPreference(palette: string, wallpaper: string): Promise<void> {
  const cookieStore = await cookies();

  // Decode existing prefs (cookie value may be URL-encoded)
  const existingValue = cookieStore.get(WALLPAPER_COOKIE_NAME)?.value;
  let prefs: Record<string, string> = {};
  if (existingValue) {
    try {
      prefs = JSON.parse(decodeURIComponent(existingValue));
    } catch {
      // Invalid JSON, start fresh
    }
  }
  prefs[palette] = wallpaper;

  cookieStore.set(WALLPAPER_COOKIE_NAME, JSON.stringify(prefs), COOKIE_OPTIONS);
}

/**
 * Set both palette and wallpaper preferences in a single action.
 *
 * More efficient when both need updating (e.g., on initial sync).
 */
export async function setPreferences(palette: string, wallpaper: string): Promise<void> {
  await setPalettePreference(palette);
  await setWallpaperPreference(palette, wallpaper);
}
