import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

/**
 * GET /api/dev/wallpapers
 *
 * Returns list of wallpaper files from both directories:
 * - /public/wallpaper/optimized-1080/ (approved wallpapers)
 * - /public/wallpaper/candidates/ (new candidates for testing)
 *
 * Development-only API for the wallpaper test page.
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const wallpaperBase = join(process.cwd(), "public", "wallpaper");

  async function getImageFiles(subdir: string): Promise<string[]> {
    try {
      const files = await readdir(join(wallpaperBase, subdir));
      return files.filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f)).sort();
    } catch (error) {
      console.warn(`[dev/wallpapers] Could not read ${subdir}:`, error);
      return [];
    }
  }

  const [optimized, candidates] = await Promise.all([getImageFiles("optimized-1080"), getImageFiles("candidates")]);

  return NextResponse.json({ optimized, candidates });
}
