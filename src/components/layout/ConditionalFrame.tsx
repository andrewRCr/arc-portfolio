"use client";

import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { FRAME_FADE_DELAY, BORDER_DRAW_DURATION, NAV_FADE_TRANSITION } from "@/lib/intro-timing";
import { useIntroContext } from "@/contexts/IntroContext";
import { Navigation } from "./Navigation";

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
  const { introPhase, isHiddenUntilExpand } = useIntroContext();

  // Ref for measuring container dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, navGapHalf: 0 });

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

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(container);
    updateDimensions(); // Initial measurement

    return () => resizeObserver.disconnect();
  }, []);

  // Track if SVG animation has been triggered - persists until retrigger
  const [svgTriggered, setSvgTriggered] = useState(false);

  // Trigger SVG based on current phase
  // - "entering": Reset for new intro cycle
  // - "expanding": Trigger the border draw animation
  // - other phases: maintain current state
  useEffect(() => {
    if (introPhase === "entering") {
      // New intro cycle starting - reset so border can animate again
      setSvgTriggered(false); // eslint-disable-line react-hooks/set-state-in-effect
    } else if (introPhase === "expanding") {
      // Trigger the border draw animation
      // Dimensions are valid (offsetWidth/offsetHeight ignore parent transforms)
      setSvgTriggered(true);
    }
    // Note: "idle", "complete", etc. don't change svgTriggered
    // Once triggered, stays triggered until next intro cycle
  }, [introPhase]);

  // Show SVG border once triggered
  const showAnimatedBorder = svgTriggered;

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
          {children}
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

  // Estimate path length (roughly half perimeter)
  const halfPerimeter = width > 0 ? width + height : 1000;

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-4 md:py-6 md:px-6">
      <div
        ref={containerRef}
        data-testid="content-wrapper"
        className="relative rounded-lg flex flex-col flex-1 min-h-0 mx-auto w-full"
        style={{ maxWidth: tuiFrameMaxWidth }}
      >
        {/* SVG animated border - draws from notch edges to bottom center */}
        {showAnimatedBorder && width > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            width={width}
            height={height}
            aria-hidden="true"
          >
            {/* Left half - draws from left notch edge to bottom center */}
            <motion.path
              d={leftPath}
              fill="none"
              stroke="rgb(var(--border-strong))"
              strokeWidth={windowBorderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: halfPerimeter, strokeDashoffset: halfPerimeter }}
              animate={{ strokeDasharray: halfPerimeter, strokeDashoffset: 0 }}
              transition={{
                strokeDashoffset: { duration: BORDER_DRAW_DURATION, delay: FRAME_FADE_DELAY, ease: "easeInOut" },
                strokeDasharray: { duration: 0 }, // Instant update on resize
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
              initial={{ strokeDasharray: halfPerimeter, strokeDashoffset: halfPerimeter }}
              animate={{ strokeDasharray: halfPerimeter, strokeDashoffset: 0 }}
              transition={{
                strokeDashoffset: { duration: BORDER_DRAW_DURATION, delay: FRAME_FADE_DELAY, ease: "easeInOut" },
                strokeDasharray: { duration: 0 }, // Instant update on resize
              }}
            />
          </svg>
        )}

        {/* Static CSS border - shown when not animating (or as fallback) */}
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
            initial={false}
            animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
            transition={NAV_FADE_TRANSITION}
            aria-hidden="true"
          />
        )}

        {/* Navigation positioned in the border gap - fades in during intro expansion */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-px -translate-y-1/2 px-6 z-10"
          initial={false}
          animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
          transition={NAV_FADE_TRANSITION}
        >
          <Navigation />
        </motion.div>

        {/* Content area - pages handle scroll via PageLayout */}
        <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-0.5 md:pt-8 md:px-6">{children}</div>
      </div>
    </div>
  );
}
