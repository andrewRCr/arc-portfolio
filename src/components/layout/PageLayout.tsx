"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import {
  PAGE_BODY_FADE_ANIMATION,
  getBodyTiming,
  HIDE_TRANSITION,
  LAYOUT_CONTENT_FADE_DURATION,
} from "@/lib/animation-timing";
import { useScrollShadow } from "@/hooks/useScrollShadow";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useAnimationContext } from "@/contexts/AnimationContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { ScrollShadow } from "./ScrollShadow";
import { ScrollProvider } from "./ScrollContext";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import type { HeaderType } from "@/hooks/useHeaderCrossfade";

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
  /** Vertically center content in viewport (default: false) */
  centerContent?: boolean;
}

export function PageLayout({
  header,
  children,
  fullWidth = false,
  stickyHeader = false,
  pageId,
  headerType,
  centerContent = false,
}: PageLayoutProps) {
  // Infer header type from stickyHeader if not explicitly set
  const effectiveHeaderType = headerType ?? (stickyHeader ? "detail" : "page");
  const { contentMaxWidth, contentPaddingY, contentPaddingX } = DEFAULT_LAYOUT_TOKENS;
  const { animationMode, visibility } = useAnimationContext();
  const { isLayoutTransitioning } = useLayoutPreferences();
  const isPhone = useIsPhone();

  // Only fade content on phone during layout transitions (to hide reflow)
  // Desktop transitions are smooth max-width changes that don't need crossfade
  const shouldFadeContent = isPhone && isLayoutTransitioning;

  // Use contentVisible - accounts for initialization AND intro phase
  // contentVisible is false during intro until "expanding" phase, then true
  const showContent = visibility.contentVisible;

  // Timing logic centralized in animation-timing.ts (SRP compliance)
  const bodyTransition = showContent ? getBodyTiming(animationMode) : HIDE_TRANSITION;

  const { ref: scrollShadowRef, showTopShadow, showBottomShadow } = useScrollShadow();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <ScrollProvider viewport={viewport}>
      <div className="flex flex-col flex-1 min-h-0" {...(pageId && { "data-page": pageId })}>
        {/* Fixed header area - doesn't scroll, centered with max-width */}
        {/* Animation handled by PageHeader component internally */}
        {/* Crossfade wrapper hides content reflow during layout mode transitions */}
        {header && (
          <div
            className={`shrink-0 transition-opacity ${shouldFadeContent ? "opacity-0" : ""}`}
            style={{ transitionDuration: `${LAYOUT_CONTENT_FADE_DURATION}s` }}
          >
            <div className="mx-auto w-full" style={headerStyle}>
              {header}
            </div>
          </div>
        )}

        {/* Scrollable content area with scroll shadows */}
        {/* Animated: fade based on loadMode */}
        <div className="relative flex-1 min-h-0">
          <main ref={setElement} className="h-full overflow-auto" data-overlayscrollbars-initialize>
            {/* Outer div: CSS transition for layout mode crossfade (hides content reflow) */}
            {/* Inner motion.div: Framer Motion for intro/route animations */}
            {/* Separated because FM inline styles override CSS classes */}
            <div
              className={`transition-opacity ${centerContent ? "h-full" : ""} ${shouldFadeContent ? "opacity-0" : ""}`}
              style={{ transitionDuration: `${LAYOUT_CONTENT_FADE_DURATION}s` }}
            >
              <motion.div
                ref={contentRef}
                className={`mx-auto w-full min-h-full ${centerContent ? "flex flex-col justify-center" : ""}`}
                data-page-content
                style={contentStyle}
                initial={PAGE_BODY_FADE_ANIMATION.initial}
                animate={showContent ? PAGE_BODY_FADE_ANIMATION.animate : PAGE_BODY_FADE_ANIMATION.initial}
                transition={bodyTransition}
                onAnimationComplete={() => {
                  // E2E test hook: Signal animation completion for reliable test assertions
                  // Safe: Only sets DOM attribute, no state changes, no logic impact
                  if (showContent && contentRef.current) {
                    contentRef.current.dataset.animationComplete = "true";
                  }
                }}
              >
                {children}
              </motion.div>
            </div>
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
