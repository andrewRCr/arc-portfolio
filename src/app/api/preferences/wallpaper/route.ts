/**
 * Wallpaper Preference API Route
 *
 * Sets the wallpaper preference cookie so the server can render
 * the correct wallpaper on initial page load (prevents FOUC).
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WALLPAPER_COOKIE_NAME } from "@/config/storage";

export async function POST(request: Request) {
  try {
    const { palette, wallpaper } = await request.json();

    if (!palette || !wallpaper) {
      return NextResponse.json({ error: "Missing palette or wallpaper" }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Store as JSON object keyed by palette (same structure as localStorage)
    const existingPrefs = cookieStore.get(WALLPAPER_COOKIE_NAME)?.value;
    const prefs = existingPrefs ? JSON.parse(existingPrefs) : {};
    prefs[palette] = wallpaper;

    cookieStore.set(WALLPAPER_COOKIE_NAME, JSON.stringify(prefs), {
      httpOnly: false, // Accessible on client for synchronization
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to set preference" }, { status: 500 });
  }
}
