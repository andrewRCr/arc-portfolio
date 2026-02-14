"use client";

import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { getNavBorderTiming, getBorderDrawTiming, HIDE_TRANSITION } from "@/lib/animation-timing";
import { useAnimationContext } from "@/contexts/AnimationContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { Navigation } from "./Navigation";
import { PageTransition } from "./PageTransition";

/**
 * ConditionalFrame Component
 *
 * Conditionally renders the inner TUI frame and Navigation based on route.
 * - For /dev/* routes: Renders children directly (no frame, no nav)
 * - For all other routes: Renders inner TUI frame with Navigation
 *
 * This component provides the frame structure but NOT scrolling.
 * Pages use PageLayout to handle header/content scroll separation.
 *
 * **FOUC Prevention:**
 * The TUI frame border gap uses CSS custom property `--nav-gap-half` which
 * is set via media query in globals.css. This ensures the correct gap width
 * renders on first paint without waiting for JavaScript hydration.
 */

/** Border radius matching rounded-lg */
const BORDER_RADIUS = 8;

/**
 * Generate SVG path for one half of the frame border.
 * Path starts at notch edge (top) and draws along top, down the side, across bottom to center.
 */
function generateHalfPath(
  width: number,
  height: number,
  navGapHalf: number,
  radius: number,
  side: "left" | "right"
): string {
  const centerX = width / 2;

  if (side === "left") {
    // Start at left notch edge (top), draw left along top, down left side, across bottom to center
    const startX = centerX - navGapHalf;
    return `
      M ${startX} 0
      L ${radius} 0
      Q 0 0, 0 ${radius}
      L 0 ${height - radius}
      Q 0 ${height}, ${radius} ${height}
      L ${centerX} ${height}
    `.trim();
  } else {
    // Start at right notch edge (top), draw right along top, down right side, across bottom to center
    const startX = centerX + navGapHalf;
    return `
      M ${startX} 0
      L ${width - radius} 0
      Q ${width} 0, ${width} ${radius}
      L ${width} ${height - radius}
      Q ${width} ${height}, ${width - radius} ${height}
      L ${centerX} ${height}
    `.trim();
  }
}

export function ConditionalFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDevRoute = pathname?.startsWith("/dev");
  const { navGapDepth, windowBorderWidth, contentMaxWidth, tuiFrameMaxWidth } = DEFAULT_LAYOUT_TOKENS;
  const { animationMode, intro, visibility } = useAnimationContext();
  const { layoutMode, isLayoutTransitioning } = useLayoutPreferences();

  // Derive values from AnimationContext
  const introPhase = intro.phase;
  // Use new visibility flag that accounts for initialization
  const contentVisible = visibility.contentVisible;
  const isFullscreen = layoutMode === "full";

  // Timing logic centralized in animation-timing.ts (SRP compliance)
  const navBorderTransition = contentVisible ? getNavBorderTiming(animationMode) : HIDE_TRANSITION;

  // Refs for measuring container and SVG paths
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPathRef = useRef<SVGPathElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, navGapHalf: 0 });
  const [measuredPathLength, setMeasuredPathLength] = useState<number | null>(null);

  // Measure container dimensions using offsetWidth/offsetHeight
  // These return LAYOUT dimensions (before CSS transforms), unlike getBoundingClientRect
  // which returns 0 when parent has scale(0) transform during intro animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      // offsetWidth/offsetHeight ignore CSS transforms, giving us the actual layout size
      // even when the parent is scaled to 0 during intro animation
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const computedStyle = getComputedStyle(container);
      const navGapHalf = parseFloat(computedStyle.getPropertyValue("--nav-gap-half")) || 70;
      setDimensions({ width, height, navGapHalf });
    };

    // Debounce resize updates to avoid excessive state changes
    const debouncedUpdate = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateDimensions, 50);
    };

    const resizeObserver = new ResizeObserver(debouncedUpdate);
    resizeObserver.observe(container);
    updateDimensions(); // Initial measurement (not debounced)

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  // Track if SVG animation has been triggered - persists until retrigger
  const [svgTriggered, setSvgTriggered] = useState(false);

  // Track if SVG draw animation has completed - switches to CSS border for smooth resize tracking
  const [borderDrawComplete, setBorderDrawComplete] = useState(false);

  // Trigger SVG based on current phase
  // - "entering": Reset for new intro cycle
  // - "expanding": Trigger the border draw animation (for both normal intro and skip)
  // - other phases: maintain current state
  useEffect(() => {
    if (introPhase === "entering") {
      // New intro cycle starting - reset so border can animate again
      setSvgTriggered(false); // eslint-disable-line react-hooks/set-state-in-effect
      setBorderDrawComplete(false);
    } else if (introPhase === "expanding") {
      // Trigger the border draw animation
      // Dimensions are valid (offsetWidth/offsetHeight ignore parent transforms)
      setSvgTriggered(true);
    }
    // Note: "idle", "complete", etc. don't change svgTriggered
    // Once triggered, stays triggered until next intro cycle
  }, [introPhase]);

  // Whether this session uses the SVG draw animation (intro/skip modes only)
  const svgMode = svgTriggered && (animationMode === "intro" || animationMode === "skip");

  // Defer SVG return after layout transition ends: the CSS transition may not have fully
  // painted, and the ResizeObserver debounce (50ms) means dimensions could be stale.
  // Keep CSS border briefly, then force a sync measurement before showing SVG.
  const [deferSvgReturn, setDeferSvgReturn] = useState(false);

  useEffect(() => {
    if (isLayoutTransitioning) {
      // Transition started — flag that we need to defer SVG return
      setDeferSvgReturn(true); // eslint-disable-line react-hooks/set-state-in-effect
    } else if (deferSvgReturn) {
      // Transition ended — wait for CSS to settle + ResizeObserver to flush,
      // then force sync measurement and show SVG with correct dimensions
      const timer = setTimeout(() => {
        if (containerRef.current) {
          const container = containerRef.current;
          setDimensions({
            width: container.offsetWidth,
            height: container.offsetHeight,
            navGapHalf: parseFloat(getComputedStyle(container).getPropertyValue("--nav-gap-half")) || 70,
          });
        }
        setDeferSvgReturn(false);
      }, 80); // 50ms debounce + 16ms frame budget + margin
      return () => clearTimeout(timer);
    }
  }, [isLayoutTransitioning, deferSvgReturn]);

  // SVG border: shown in stable boxed mode after intro draw (correct dimensions, no resizing).
  // CSS border: shown during layout transitions, full mode, and brief post-transition buffer
  // (tracks container size natively via absolute inset-0, unlike SVG which uses debounced
  // ResizeObserver dimensions). Swaps happen during transitions when all UI is animating,
  // masking any visual difference. Intro always resets to boxed (LayoutWrapper).
  const useCssBorder = isFullscreen || isLayoutTransitioning || deferSvgReturn;
  const showAnimatedBorder = svgMode && !useCssBorder;

  // Timing logic centralized in animation-timing.ts (SRP compliance)
  const borderDrawTiming = getBorderDrawTiming(animationMode);

  // Measure actual path length after SVG paths render
  // useLayoutEffect runs synchronously after DOM mutations but before paint,
  // ensuring we have accurate length before animation starts
  useLayoutEffect(() => {
    if (showAnimatedBorder && dimensions.width > 0 && leftPathRef.current) {
      const length = leftPathRef.current.getTotalLength();
      setMeasuredPathLength(length);
    }
    // Dependencies: path shape depends on dimensions (width, height, navGapHalf)
  }, [showAnimatedBorder, dimensions]);

  if (isDevRoute) {
    // Dev pages: no inner frame, no navigation
    // Pages handle their own scroll structure via PageLayout
    return (
      <div className="flex flex-col flex-1 min-h-0 p-4 md:p-6">
        <div
          data-testid="content-wrapper"
          className="flex flex-col flex-1 min-h-0 mx-auto w-full"
          style={{ maxWidth: contentMaxWidth }}
        >
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    );
  }

  // Regular pages: inner TUI frame with navigation
  // Outer padding provides space for Navigation to render above border
  // Mobile: extra top padding for nav clearance, tighter sides/bottom
  // Note: --nav-gap-half is defined in globals.css with responsive media query
  const borderClipPath = `polygon(
    0 0,
    calc(50% - var(--nav-gap-half)) 0,
    calc(50% - var(--nav-gap-half)) ${navGapDepth}px,
    calc(50% + var(--nav-gap-half)) ${navGapDepth}px,
    calc(50% + var(--nav-gap-half)) 0,
    100% 0,
    100% 100%,
    0 100%
  )`;

  // Generate paths for SVG border animation
  const { width, height, navGapHalf } = dimensions;
  const leftPath = width > 0 ? generateHalfPath(width, height, navGapHalf, BORDER_RADIUS, "left") : "";
  const rightPath = width > 0 ? generateHalfPath(width, height, navGapHalf, BORDER_RADIUS, "right") : "";

  // Use measured path length if available, otherwise fall back to estimate
  // The estimate (width + height) is a safe overestimate for the half-perimeter
  const pathLength = measuredPathLength ?? (width > 0 ? width + height : 1000);

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-4 md:py-6 md:px-6">
      <div
        ref={containerRef}
        data-testid="content-wrapper"
        className="relative rounded-lg flex flex-col flex-1 min-h-0 mx-auto w-full"
        style={{ maxWidth: tuiFrameMaxWidth }}
      >
        {/* SVG animated border - draws from notch edges to bottom center.
            Shown in stable boxed mode after intro. Swapped to CSS border during layout
            transitions/full mode (CSS tracks resize natively, SVG uses debounced dimensions).
            When remounting after a layout transition, borderDrawComplete skips the draw animation. */}
        {showAnimatedBorder && width > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            width={width}
            height={height}
            aria-hidden="true"
          >
            {/* Left half - draws from left notch edge to bottom center */}
            <motion.path
              ref={leftPathRef}
              d={leftPath}
              fill="none"
              stroke="rgb(var(--border-strong))"
              strokeWidth={windowBorderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{
                strokeDasharray: pathLength,
                strokeDashoffset: borderDrawComplete ? 0 : pathLength,
              }}
              animate={{ strokeDasharray: pathLength, strokeDashoffset: 0 }}
              transition={{
                strokeDashoffset: borderDrawComplete ? { duration: 0 } : borderDrawTiming,
                strokeDasharray: { duration: 0 },
              }}
              onAnimationComplete={() => {
                if (!borderDrawComplete) setBorderDrawComplete(true);
              }}
            />
            {/* Right half - draws from right notch edge to bottom center */}
            <motion.path
              d={rightPath}
              fill="none"
              stroke="rgb(var(--border-strong))"
              strokeWidth={windowBorderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{
                strokeDasharray: pathLength,
                strokeDashoffset: borderDrawComplete ? 0 : pathLength,
              }}
              animate={{ strokeDasharray: pathLength, strokeDashoffset: 0 }}
              transition={{
                strokeDashoffset: borderDrawComplete ? { duration: 0 } : borderDrawTiming,
                strokeDasharray: { duration: 0 },
              }}
            />
          </svg>
        )}

        {/* CSS border - shown during layout transitions and full mode.
            Uses absolute inset-0 so it tracks container size natively.
            When swapping from SVG (svgMode), appears instantly via initial={false}. */}
        {!showAnimatedBorder && (
          <motion.div
            className="absolute inset-0 border-solid border-border-strong rounded-lg pointer-events-none"
            style={
              {
                borderWidth: windowBorderWidth,
                WebkitClipPath: borderClipPath,
                clipPath: borderClipPath,
              } as React.CSSProperties
            }
            initial={svgMode ? false : { opacity: 0 }}
            animate={{ opacity: contentVisible ? 1 : 0 }}
            transition={navBorderTransition}
            aria-hidden="true"
          />
        )}

        {/* Navigation positioned in the border gap - fades in during intro expansion */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-px -translate-y-1/2 px-6 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={navBorderTransition}
        >
          <Navigation />
        </motion.div>

        {/* Content area - pages handle scroll via PageLayout */}
        {/* PageTransition provides opacity fade during route navigation */}
        <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-0.5 md:pt-8 md:px-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
