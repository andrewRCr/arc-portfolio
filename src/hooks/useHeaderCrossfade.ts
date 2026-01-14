"use client";

import { useState, useEffect } from "react";
import { useScrollViewport } from "@/components/layout/ScrollContext";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { BREAKPOINTS } from "@/config/breakpoints";

/**
 * Header types for scroll-based fade calculations
 * - "detail": DetailHeader with hero image (aspect-ratio based threshold)
 * - "page": PageHeader (fixed threshold)
 * - "hero": Home Hero section (fixed threshold, tuned for hero height)
 */
export type HeaderType = "detail" | "page" | "hero";

/**
 * Constants for detail header layout
 */
export const DETAIL_HEADER_ASPECT_RATIO = 3.5;

/**
 * Extra height for mobile card layout (metadata sections below hero)
 * Includes: title section (~90px) + links section (~50px)
 */
const MOBILE_METADATA_HEIGHT = 140;

/** Fixed thresholds for non-detail headers */
const PAGE_HEADER_THRESHOLD = 100;
const HERO_THRESHOLD = 150;

/**
 * Hook for coordinated crossfade between full and compact detail headers.
 *
 * Both headers use the same transition zone (based on full header height),
 * but fade in opposite directions:
 * - 'out': opacity goes 1→0 as scroll increases (for full header)
 * - 'in': opacity goes 0→1 as scroll increases (for compact header)
 *
 * @param direction - 'in' to fade in on scroll, 'out' to fade out on scroll
 * @param headerType - Type of header to calculate threshold for (default: "detail")
 * @returns opacity (0-1) and isExpanded (for grid animation threshold)
 */
export function useHeaderCrossfade(direction: "in" | "out", headerType: HeaderType = "detail") {
  const { viewport } = useScrollViewport();
  const [opacity, setOpacity] = useState(direction === "out" ? 1 : 0);
  const [transitionZone, setTransitionZone] = useState(200);

  const { tuiFrameMaxWidth } = DEFAULT_LAYOUT_TOKENS;

  // Calculate transition zone based on header type
  useEffect(() => {
    const calculateZone = () => {
      if (headerType === "page") {
        setTransitionZone(PAGE_HEADER_THRESHOLD);
        return;
      }

      if (headerType === "hero") {
        setTransitionZone(HERO_THRESHOLD);
        return;
      }

      // "detail" type: aspect-ratio based calculation
      const isPhone = window.innerWidth < BREAKPOINTS.sm;
      // Horizontal padding: contentPaddingX (8px×2) + ConditionalFrame (16-24px×2)
      const horizontalPadding = isPhone ? 48 : 64;
      const contentWidth = Math.min(window.innerWidth - horizontalPadding, tuiFrameMaxWidth);
      const heroHeight = contentWidth / DETAIL_HEADER_ASPECT_RATIO;
      // Mobile card layout has metadata sections below hero
      const totalHeight = isPhone ? heroHeight + MOBILE_METADATA_HEIGHT : heroHeight;
      setTransitionZone(totalHeight);
    };

    calculateZone();
    window.addEventListener("resize", calculateZone);
    return () => window.removeEventListener("resize", calculateZone);
  }, [tuiFrameMaxWidth, headerType]);

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
