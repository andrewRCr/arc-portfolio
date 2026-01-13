"use client";

import { useState, useEffect } from "react";
import { useScrollViewport } from "@/components/layout/ScrollContext";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";

/**
 * Constants for detail header layout
 */
export const DETAIL_HEADER_ASPECT_RATIO = 3.5;

/**
 * Hook for coordinated crossfade between full and compact detail headers.
 *
 * Both headers use the same transition zone (based on full header height),
 * but fade in opposite directions:
 * - 'out': opacity goes 1→0 as scroll increases (for full header)
 * - 'in': opacity goes 0→1 as scroll increases (for compact header)
 *
 * @param direction - 'in' to fade in on scroll, 'out' to fade out on scroll
 * @returns opacity (0-1) and isExpanded (for grid animation threshold)
 */
export function useHeaderCrossfade(direction: "in" | "out") {
  const { viewport } = useScrollViewport();
  const [opacity, setOpacity] = useState(direction === "out" ? 1 : 0);
  const [transitionZone, setTransitionZone] = useState(200);

  const { tuiFrameMaxWidth } = DEFAULT_LAYOUT_TOKENS;

  // Calculate transition zone based on header height (aspect ratio applied to content width)
  useEffect(() => {
    const calculateZone = () => {
      // Horizontal padding: contentPaddingX (8px×2) + ConditionalFrame (16-24px×2)
      // Uses desktop value (64px); mobile (48px) difference is negligible for transition zone
      const contentWidth = Math.min(window.innerWidth - 64, tuiFrameMaxWidth);
      const headerHeight = contentWidth / DETAIL_HEADER_ASPECT_RATIO;
      setTransitionZone(headerHeight);
    };

    calculateZone();
    window.addEventListener("resize", calculateZone);
    return () => window.removeEventListener("resize", calculateZone);
  }, [tuiFrameMaxWidth]);

  // Track scroll position and calculate opacity
  useEffect(() => {
    if (!viewport) return;

    const handleScroll = () => {
      const scrollTop = viewport.scrollTop;
      // Calculate progress through transition zone (0 to 1)
      const progress = Math.max(0, Math.min(1, scrollTop / transitionZone));
      // Apply direction: 'out' inverts progress
      setOpacity(direction === "out" ? 1 - progress : progress);
    };

    handleScroll();
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [viewport, transitionZone, direction]);

  // Threshold for grid expansion (avoid layout shift when nearly invisible)
  const isExpanded = opacity > 0.1;

  return { opacity, isExpanded };
}
