"use client";

import { useLayoutEffect, useState, useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { motion, useReducedMotion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useScrollShadow } from "@/hooks/useScrollShadow";
import { ScrollShadow } from "./ScrollShadow";
import { ScrollProvider } from "./ScrollContext";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import type { HeaderType } from "@/hooks/useHeaderCrossfade";

/**
 * Track if any PageLayout has mounted before.
 * Used to skip animation on initial SSR hydration (avoids hydration mismatch)
 * but animate on subsequent route-change remounts.
 */
let hasEverMounted = false;

// =============================================================================
// PAGE TRANSITION ANIMATION CONFIG
// =============================================================================

/** Delay before animation starts (seconds) - creates deliberate "beat" */
const TRANSITION_DELAY = 0.1;

/** Material Design standard easing */
const MATERIAL_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/**
 * Body transition variant:
 * - "fade": simple opacity fade (header gets the "punch", body is subtle)
 * - "parallax": body also slides up, but no blur (header still more prominent)
 */
type BodyTransitionVariant = "fade" | "parallax";
const BODY_VARIANT: BodyTransitionVariant = "fade";

/** Animation config type */
interface AnimationConfig {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: { delay: number; duration: number; ease: [number, number, number, number] };
}

/** Body animation variants */
const bodyAnimations: Record<BodyTransitionVariant, AnimationConfig> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.25, duration: 0.35, ease: MATERIAL_EASE },
  },
  parallax: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: TRANSITION_DELAY + 0.06, duration: 0.4, ease: MATERIAL_EASE },
  },
};

/**
 * PageLayout Component
 *
 * Provides consistent page structure with optional fixed header and scrollable content.
 * The header stays fixed while content scrolls independently - scrollbar only appears
 * in the content area, not spanning the full page height.
 *
 * Includes scroll shadow affordances: radial gradient shadows at top/bottom edges
 * indicating scrollable content in that direction.
 *
 * Content is centered with a max-width constraint by default (controlled by layout tokens).
 *
 * Usage:
 * - With header: <PageLayout header={<PageHeader title="..." />}>{content}</PageLayout>
 * - Without header: <PageLayout>{content}</PageLayout>
 * - Full width: <PageLayout fullWidth>{content}</PageLayout>
 * - With sticky header in content: <PageLayout stickyHeader>{content with sticky header}</PageLayout>
 */

export interface PageLayoutProps {
  /** Optional fixed header content (PageHeader, DevPageHeader, or custom) */
  header?: React.ReactNode;
  /** Scrollable page content */
  children: React.ReactNode;
  /** Disable content width constraint (default: false) */
  fullWidth?: boolean;
  /** Remove top padding when content includes a sticky header (default: false) */
  stickyHeader?: boolean;
  /** Page identifier for page-specific styling (sets data-page attribute) */
  pageId?: string;
  /** Header type for back-to-top button threshold (inferred from stickyHeader if not set) */
  headerType?: HeaderType;
}

export function PageLayout({
  header,
  children,
  fullWidth = false,
  stickyHeader = false,
  pageId,
  headerType,
}: PageLayoutProps) {
  // Infer header type from stickyHeader if not explicitly set
  const effectiveHeaderType = headerType ?? (stickyHeader ? "detail" : "page");
  const { contentMaxWidth, contentPaddingY, contentPaddingX } = DEFAULT_LAYOUT_TOKENS;
  const shouldReduceMotion = useReducedMotion();

  // Track if this is the first-ever mount (SSR hydration) vs route-change remount
  // Capture at render time before effect runs - stable for this component instance
  const [isInitialMount] = useState(() => !hasEverMounted);

  // After mount, mark that we've mounted (for future route changes)
  useEffect(() => {
    hasEverMounted = true;
  }, []);

  // Skip animations on:
  // - Initial SSR hydration (avoids hydration mismatch)
  // - When user prefers reduced motion
  // - During SSR/detection (useReducedMotion returns null)
  const skipAnimation = isInitialMount || shouldReduceMotion !== false;

  const { ref: scrollShadowRef, showTopShadow, showBottomShadow } = useScrollShadow();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);

  // Initialize OverlayScrollbars and connect its viewport to scroll shadow detection
  // useLayoutEffect ensures viewport is set before paint (avoids flash of missing scroll context)
  useLayoutEffect(() => {
    if (!element) return;

    const instance = OverlayScrollbars(element, {
      scrollbars: {
        theme: "os-theme-dark",
        autoHide: "leave",
        autoHideDelay: 1000,
      },
    });

    // OverlayScrollbars creates its own viewport - use that for scroll detection
    // State propagates viewport to ScrollContext; children's effects depend on re-render.
    // This is a legitimate third-party library initialization pattern.
    const { viewport: osViewport } = instance.elements();
    scrollShadowRef(osViewport);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- viewport must trigger child re-renders
    setViewport(osViewport);

    return () => {
      scrollShadowRef(null);
      setViewport(null);
      instance.destroy();
    };
  }, [element, scrollShadowRef]);

  // Header only needs horizontal padding and max-width (no vertical padding)
  const headerStyle = {
    ...(fullWidth ? {} : { maxWidth: contentMaxWidth }),
    paddingLeft: contentPaddingX,
    paddingRight: contentPaddingX,
  };

  // Scrollable content gets full padding on all sides
  // When stickyHeader is true, skip top padding (sticky header fills that space)
  const contentStyle = {
    ...(fullWidth ? {} : { maxWidth: contentMaxWidth }),
    ...(stickyHeader ? {} : { paddingTop: contentPaddingY }),
    paddingBottom: contentPaddingY,
    paddingLeft: contentPaddingX,
    paddingRight: contentPaddingX,
  };

  // Select body animation based on variant
  const bodyAnimation = bodyAnimations[BODY_VARIANT];

  return (
    <ScrollProvider viewport={viewport}>
      <div className="flex flex-col flex-1 min-h-0" {...(pageId && { "data-page": pageId })}>
        {/* Fixed header area - doesn't scroll, centered with max-width */}
        {/* Animation handled by PageHeader component internally */}
        {header && (
          <div className="shrink-0">
            <div className="mx-auto w-full" style={headerStyle}>
              {header}
            </div>
          </div>
        )}

        {/* Scrollable content area with scroll shadows */}
        {/* Animated: fade or parallax up (subtler than header) */}
        <div className="relative flex-1 min-h-0">
          <main ref={setElement} className="h-full overflow-auto" data-overlayscrollbars-initialize>
            <motion.div
              className="mx-auto w-full min-h-full"
              data-page-content
              style={contentStyle}
              initial={bodyAnimation.initial}
              animate={bodyAnimation.animate}
              transition={skipAnimation ? { duration: 0 } : bodyAnimation.transition}
            >
              {children}
            </motion.div>
          </main>
          <ScrollShadow position="top" visible={showTopShadow} />
          <ScrollShadow position="bottom" visible={showBottomShadow} />
        </div>

        {/* Back to top button - appears when scrolled down */}
        <BackToTopButton headerType={effectiveHeaderType} />
      </div>
    </ScrollProvider>
  );
}
