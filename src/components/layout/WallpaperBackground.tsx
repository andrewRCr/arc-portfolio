"use client";

import { useState, useCallback } from "react";
import { themes } from "@/data/themes";
import { useThemeContext } from "@/contexts/ThemeContext";
import { buildWallpaperGradient } from "@/lib/theme";

/**
 * Props for the WallpaperBackground component.
 */
export interface WallpaperBackgroundProps {
  /** Optional path to wallpaper image - 1080p (WebP recommended) */
  imageSrc?: string;
  /** Optional path to high-res wallpaper image - 1440p (for large viewports) */
  imageSrcHiRes?: string;
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
 * - Supports custom gradient stops per theme (for neutral themes like Mariana)
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
export function WallpaperBackground({ imageSrc, imageSrcHiRes }: WallpaperBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { activeTheme } = useThemeContext();

  // Callback ref handles SSR race condition: image may load from cache before React hydrates
  // and attaches onLoad handler. Callback refs fire synchronously when DOM mounts.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  // Get custom gradient stops from theme config (if defined)
  const themeConfig = themes[activeTheme];
  const customGradientStops = themeConfig?.gradientStops;

  // Gradient mode: show gradient. Image mode: flat background (image fades in on top)
  const backgroundStyle = imageSrc
    ? { backgroundColor: "rgb(var(--background))" }
    : { background: buildWallpaperGradient(customGradientStops) };

  // Build srcSet if hi-res version available
  const srcSet = imageSrcHiRes ? `${imageSrc} 1920w, ${imageSrcHiRes} 2560w` : undefined;

  return (
    <div className="fixed inset-0 z-[-1]" style={backgroundStyle} aria-hidden="true" data-testid="wallpaper-background">
      {imageSrc && (
        /* eslint-disable-next-line @next/next/no-img-element -- Using native img for srcSet with separate files */
        <img
          ref={imgRef}
          src={imageSrc}
          srcSet={srcSet}
          sizes="100vw"
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          // Eager load for background wallpaper
          loading="eager"
          decoding="async"
        />
      )}
    </div>
  );
}
