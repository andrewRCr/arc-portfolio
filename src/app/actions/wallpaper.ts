"use server";

/**
 * Server Action for Wallpaper Preference
 *
 * Separated from preferences.ts to avoid Turbopack module resolution
 * issues when importing into WallpaperContext client component.
 */

import { cookies } from "next/headers";
import { WALLPAPER_COOKIE_NAME } from "@/config/storage";

const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
};

/**
 * Set the user's wallpaper preference cookie.
 */
export async function syncWallpaperToCookie(palette: string, wallpaper: string): Promise<void> {
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
