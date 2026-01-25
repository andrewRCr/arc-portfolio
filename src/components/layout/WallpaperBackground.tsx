"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

/** Fade transition duration in seconds */
const FADE_DURATION = 0.5;

/**
 * Inner component for the wallpaper image with fade-in on load and fade-out on exit.
 * Uses key={src} from parent to trigger AnimatePresence crossfade on wallpaper switch.
 */
function WallpaperImage({ src, srcSet }: { src: string; srcSet?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger fade-in with a frame delay to ensure browser paints opacity:0 first.
  // Without this, cached images would change state in the same frame as mount,
  // and the browser would batch them, skipping the transition entirely.
  const triggerFadeIn = useCallback(() => {
    // Double rAF ensures: 1) wait for next frame, 2) wait for paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsLoaded(true);
      });
    });
  }, []);

  // Check if image is loaded on mount (handles cached images)
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      triggerFadeIn();
    }
  }, [triggerFadeIn]);

  // Handle load event for non-cached images
  const handleLoad = useCallback(() => {
    triggerFadeIn();
  }, [triggerFadeIn]);

  return (
    <motion.img
      ref={imgRef}
      src={src}
      srcSet={srcSet}
      sizes="100vw"
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_DURATION, ease: "easeOut" }}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onLoad={handleLoad}
    />
  );
}

/**
 * WallpaperBackground Component
 *
 * Full-viewport background layer for the TWM (Tiling Window Manager) layout.
 * Provides a CSS gradient base with optional image overlay that fades in on load.
 *
 * **Features:**
 * - Fixed positioning behind all content
 * - Theme-aware gradient always visible as base layer (uses CSS custom properties)
 * - Supports custom gradient stops per theme (for neutral themes like Mariana)
 * - Eager-loaded image overlay with JS-driven fade-in when image loads
 * - Decorative element (aria-hidden for accessibility)
 *
 * **Loading Behavior:**
 * - With image: dark base color, image fades in when loaded (0.5s)
 * - Without image (Gradient selected): theme gradient renders immediately
 * - On wallpaper switch: crossfade via AnimatePresence (old fades out, new fades in)
 * - Cached images fade in nearly instantly (after brief rAF delay for transition)
 *
 * **FOUC Prevention:**
 * Solid background color (from theme) renders immediately from SSR, providing a
 * neutral base for the image fade-in. This avoids the "flashbang" effect that
 * occurred when fading from the vibrant theme gradient.
 *
 * @example
 * ```tsx
 * // Gradient only
 * <WallpaperBackground />
 *
 * // With wallpaper image (fades in when loaded)
 * <WallpaperBackground imageSrc="/wallpaper/optimized-1080/example.webp" />
 * ```
 */
export function WallpaperBackground({ imageSrc, imageSrcHiRes }: WallpaperBackgroundProps) {
  const { activeTheme } = useThemeContext();

  // Track if wallpaper was enabled on initial mount (vs toggled on later)
  // This determines whether dark overlay should animate in or appear instantly
  const initialImageSrcRef = useRef<string | undefined>(imageSrc);
  const wasEnabledOnMount = initialImageSrcRef.current !== undefined;

  // Get custom gradient stops from theme config (if defined)
  const themeConfig = themes[activeTheme];
  const customGradientStops = themeConfig?.gradientStops;

  // Background strategy:
  // - Initial load with wallpaper: dark background (no gradient flash), image fades in
  // - Toggle wallpaper on: gradient crossfades to dark+image
  // - Toggle wallpaper off: image+dark crossfades to gradient
  // - Without image: gradient shows (user selected "Gradient" or wallpaper disabled)
  const darkBackground = themeConfig?.dark?.background ?? "0 0 0";
  const darkOverlayColor = `color-mix(in srgb, rgb(${darkBackground}) 60%, black)`;

  // Choose base layer based on initial state:
  // - If wallpaper was enabled on mount: dark background (cinematic initial load)
  // - If wallpaper was disabled on mount: gradient (for smooth toggle-on crossfade)
  const baseStyle = wasEnabledOnMount
    ? { backgroundColor: darkOverlayColor }
    : { background: buildWallpaperGradient(customGradientStops) };

  // Build srcSet if hi-res version available
  const srcSet = imageSrcHiRes ? `${imageSrc} 1920w, ${imageSrcHiRes} 2560w` : undefined;

  return (
    <div className="fixed inset-0 z-[-1]" style={baseStyle} aria-hidden="true" data-testid="wallpaper-background">
      {/* When toggling wallpaper on (wasn't enabled on mount), fade in dark overlay */}
      {!wasEnabledOnMount && (
        <AnimatePresence>
          {imageSrc && (
            <motion.div
              key="dark-overlay"
              className="absolute inset-0"
              style={{ backgroundColor: darkOverlayColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: FADE_DURATION, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      )}
      {/* When toggling wallpaper off (was enabled on mount), fade in gradient */}
      {wasEnabledOnMount && (
        <AnimatePresence>
          {!imageSrc && (
            <motion.div
              key="gradient-overlay"
              className="absolute inset-0"
              style={{ background: buildWallpaperGradient(customGradientStops) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: FADE_DURATION, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      )}
      <AnimatePresence>{imageSrc && <WallpaperImage key={imageSrc} src={imageSrc} srcSet={srcSet} />}</AnimatePresence>
    </div>
  );
}
