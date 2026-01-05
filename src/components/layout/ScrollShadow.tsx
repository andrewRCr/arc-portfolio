"use client";

import { useTheme } from "next-themes";

/**
 * ScrollShadow Component
 *
 * A visual affordance indicating scrollable content in a direction.
 * Uses radial gradients that are intense at center and fade at edges,
 * creating a subtle shadow effect that works well with bordered containers.
 *
 * Positioned absolutely at the top or bottom of a relative container that
 * wraps the scrollable area (must be placed outside the scroll container).
 *
 * Use with `useScrollShadow` hook which provides visibility booleans:
 *
 * @example
 * ```tsx
 * const { ref, showTopShadow, showBottomShadow } = useScrollShadow();
 *
 * <div className="relative">
 *   <div ref={ref} className="overflow-auto">{content}</div>
 *   <ScrollShadow position="top" visible={showTopShadow} />
 *   <ScrollShadow position="bottom" visible={showBottomShadow} />
 * </div>
 * ```
 */

export interface ScrollShadowProps {
  /** Position of the shadow */
  position: "top" | "bottom";
  /** Whether the shadow is visible */
  visible: boolean;
}

/** Shadow height in pixels */
const SHADOW_HEIGHT = 20;

/** Shadow opacity by mode (0-1) - dark mode needs higher opacity for visibility */
const SHADOW_OPACITY_LIGHT = 0.15;
const SHADOW_OPACITY_DARK = 0.35;

export function ScrollShadow({ position, visible }: ScrollShadowProps) {
  const { resolvedTheme } = useTheme();
  const isTop = position === "top";
  const isDark = resolvedTheme === "dark";
  const opacity = isDark ? SHADOW_OPACITY_DARK : SHADOW_OPACITY_LIGHT;

  // Radial gradient: intense at the edge, fading toward content
  // farthest-side creates an ellipse that extends to the farthest side
  const gradient = isTop
    ? `radial-gradient(farthest-side at 50% 25%, rgba(0, 0, 0, ${opacity}) 0%, transparent 100%)`
    : `radial-gradient(farthest-side at 50% 75%, rgba(0, 0, 0, ${opacity}) 0%, transparent 100%)`;

  return (
    <div
      data-testid={`scroll-shadow-${position}`}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 right-0 transition-opacity duration-250 ${
        isTop ? "top-0" : "bottom-0"
      } ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        height: SHADOW_HEIGHT,
        backgroundImage: gradient,
      }}
    />
  );
}
