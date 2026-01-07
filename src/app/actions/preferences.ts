"use server";

/**
 * Server Action for Palette Preference
 *
 * Sets palette cookie so the server can read it during SSR,
 * enabling FOUC-free rendering of the user's theme palette.
 *
 * Architecture: Cookie is SSR source of truth, localStorage is client cache.
 * ThemeContext calls this action to sync localStorage → cookie.
 *
 * Note: Wallpaper preference uses a separate Server Action in wallpaper.ts
 * (separated due to Turbopack module resolution issues).
 */

import { cookies } from "next/headers";
import { PALETTE_COOKIE_NAME } from "@/config/storage";

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
