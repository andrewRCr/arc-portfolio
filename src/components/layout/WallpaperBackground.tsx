"use client";

import { useState } from "react";
import Image from "next/image";
import { buildWallpaperGradient } from "@/lib/theme";

/**
 * Props for the WallpaperBackground component.
 */
export interface WallpaperBackgroundProps {
  /** Optional path to wallpaper image (WebP recommended) */
  imageSrc?: string;
}

/**
 * WallpaperBackground Component
 *
 * Full-viewport background layer for the TWM (Tiling Window Manager) layout.
 * Provides a CSS gradient fallback with optional image overlay.
 *
 * **Features:**
 * - Fixed positioning behind all content
 * - Theme-aware gradient fallback (uses CSS custom properties)
 * - Priority-loaded image when provided (via Next.js Image)
 * - Smooth fade-in transition when image loads
 * - Decorative element (aria-hidden for accessibility)
 *
 * **Loading Behavior:**
 * - Gradient mode: Shows theme-aware gradient immediately
 * - Image mode: Shows flat theme background color, then fades in image when loaded
 *
 * **FOUC Prevention:**
 * Server reads wallpaper preference from cookie. The body already has
 * `backgroundColor: rgb(var(--background))` and the blocking script sets
 * the theme class, so the correct background color renders on first paint.
 *
 * @example
 * ```tsx
 * // Gradient only
 * <WallpaperBackground />
 *
 * // With wallpaper image (fades in when loaded)
 * <WallpaperBackground imageSrc="/wallpaper/optimized/example.webp" />
 * ```
 */
export function WallpaperBackground({ imageSrc }: WallpaperBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Gradient mode: show gradient. Image mode: flat background (image fades in on top)
  const backgroundStyle = imageSrc
    ? { backgroundColor: "rgb(var(--background))" }
    : { background: buildWallpaperGradient() };

  return (
    <div
      className="fixed inset-0 z-[-1]"
      style={backgroundStyle}
      aria-hidden="true"
      data-testid="wallpaper-background"
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          className={`object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
