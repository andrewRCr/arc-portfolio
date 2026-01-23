"use client";

import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
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

/** Shared timing for frame elements fade-in */
const FRAME_FADE_DELAY = 0.15; // seconds - starts partway through expansion
const FRAME_FADE_DURATION = 0.35;

/** Border draw animation duration */
const BORDER_DRAW_DURATION = 0.6; // seconds

/** Nav starts slightly before border completes (overlapping finish) */
const NAV_FADE_DELAY = FRAME_FADE_DELAY + BORDER_DRAW_DURATION - 0.15;

/** Border radius matching rounded-lg */
const BORDER_RADIUS = 8;

/** Navigation fade-in animation config - starts after border completes */
const navFadeTransition = {
  type: "tween" as const,
  duration: FRAME_FADE_DURATION,
  delay: NAV_FADE_DELAY,
  ease: "easeOut" as const,
};

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
  const { introPhase, shouldShow } = useIntroContext();

  // Ref for measuring container dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, navGapHalf: 0 });

  // Measure container and nav gap on mount/resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const computedStyle = getComputedStyle(containerRef.current);
        const navGapHalf = parseFloat(computedStyle.getPropertyValue("--nav-gap-half")) || 70;
        setDimensions({ width: rect.width, height: rect.height, navGapHalf });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Frame elements hidden during intro until expansion phase (delays handle timing)
  const isFrameHidden = shouldShow && introPhase !== "expanding" && introPhase !== "complete" && introPhase !== "idle";

  // Track if SVG animation has been triggered - persists until retrigger
  // Using lazy initial state to check if we should skip animation entirely
  const [svgTriggered, setSvgTriggered] = useState(false);

  // Trigger SVG when entering expanding phase, reset on retrigger
  // This is a valid state machine transition pattern - setState based on phase changes
  const prevPhaseRef = useRef(introPhase);
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    prevPhaseRef.current = introPhase;

    // Trigger when transitioning INTO expanding
    if (introPhase === "expanding" && prevPhase !== "expanding") {
      setSvgTriggered(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
    // Reset when transitioning INTO entering (retrigger)
    if (introPhase === "entering" && prevPhase !== "entering") {
      setSvgTriggered(false);
    }
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
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: BORDER_DRAW_DURATION,
                delay: FRAME_FADE_DELAY,
                ease: "easeInOut",
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
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: BORDER_DRAW_DURATION,
                delay: FRAME_FADE_DELAY,
                ease: "easeInOut",
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
            animate={{ opacity: isFrameHidden ? 0 : 1 }}
            transition={navFadeTransition}
            aria-hidden="true"
          />
        )}

        {/* Navigation positioned in the border gap - fades in during intro expansion */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-px -translate-y-1/2 px-6 z-10"
          initial={false}
          animate={{ opacity: isFrameHidden ? 0 : 1 }}
          transition={navFadeTransition}
        >
          <Navigation />
        </motion.div>

        {/* Content area - pages handle scroll via PageLayout */}
        <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-0.5 md:pt-8 md:px-6">{children}</div>
      </div>
    </div>
  );
}
