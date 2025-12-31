import Image from "next/image";

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
 * - Lazy-loaded image when provided (via Next.js Image)
 * - Decorative element (aria-hidden for accessibility)
 *
 * **Usage:**
 * - Without image: Displays gradient fallback
 * - With image: Displays image over gradient (gradient shows during load)
 *
 * @example
 * ```tsx
 * // Gradient only
 * <WallpaperBackground />
 *
 * // With wallpaper image
 * <WallpaperBackground imageSrc="/images/wallpaper/abstract.webp" />
 * ```
 */
export function WallpaperBackground({ imageSrc }: WallpaperBackgroundProps) {
  // Theme-aware gradient using CSS custom properties
  // Uses muted colors for subtle background that works with any theme
  // Note: CSS variables store RGB triplets (e.g., "60 56 54"), not HSL
  const gradientStyle = {
    background: `linear-gradient(
      135deg,
      rgb(var(--accent)) 0%,
      rgb(var(--background)) 50%,
      rgb(var(--primary)) 100%
    )`,
  };

  return (
    <div className="fixed inset-0 z-[-1]" style={gradientStyle} aria-hidden="true">
      {imageSrc && <Image src={imageSrc} alt="" fill loading="lazy" className="object-cover" sizes="100vw" />}
    </div>
  );
}
