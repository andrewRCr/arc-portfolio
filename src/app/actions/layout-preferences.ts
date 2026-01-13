"use server";

/**
 * Server Action for Layout Mode Preference
 *
 * Sets layout mode cookie so the server can read it during SSR,
 * enabling consistent layout rendering without shift.
 */

import { cookies } from "next/headers";
import { LAYOUT_MODE_COOKIE_NAME } from "@/config/storage";
import { LAYOUT_MODES, type LayoutMode } from "@/config/layout";

const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
};

/**
 * Set the user's layout mode preference cookie.
 */
export async function setLayoutModePreference(mode: string): Promise<void> {
  if (!LAYOUT_MODES.includes(mode as LayoutMode)) {
    return; // Silently ignore invalid modes
  }
  const cookieStore = await cookies();
  cookieStore.set(LAYOUT_MODE_COOKIE_NAME, mode, COOKIE_OPTIONS);
}
