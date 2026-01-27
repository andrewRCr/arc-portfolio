"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * PageHeader Component
 *
 * Fixed header for page content. Used with PageLayout to create consistent
 * page structure where header stays fixed and content scrolls below.
 *
 * Features:
 * - Title and optional subtitle (animates down from above)
 * - Optional children for additional controls (animates up from below)
 * - Bottom border separator
 * - Choreographed entry animation on route changes
 *
 * Width constraint is handled by PageLayout - this component fills available width.
 */

// =============================================================================
// ANIMATION CONFIG
// =============================================================================

/** Track if any PageHeader has mounted (skip animation on initial SSR hydration) */
let hasEverMounted = false;

const TRANSITION_DELAY = 0.1;
const MATERIAL_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Title animation: slides down from above + blur clears (fast) */
const titleAnimation = {
  initial: { opacity: 0, y: -10, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: TRANSITION_DELAY, duration: 0.22, ease: MATERIAL_EASE },
};

/** Secondary content with children (tabs, controls): parallax + blur */
const secondaryWithChildrenAnimation = {
  initial: { opacity: 0, y: 8, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: TRANSITION_DELAY + 0.04, duration: 0.25, ease: MATERIAL_EASE },
};

/** Secondary content without children (tagline, divider only): blur only, no movement */
const secondarySimpleAnimation = {
  initial: { opacity: 0, filter: "blur(3px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  transition: { delay: TRANSITION_DELAY + 0.04, duration: 0.25, ease: MATERIAL_EASE },
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface PageHeaderProps {
  /** Page title (optional if using children for full custom content) */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Content below title (tabs, filters, etc.) OR full custom content if no title */
  children?: React.ReactNode;
  /** Hide the bottom divider (useful when children provide their own divider, e.g., tabs) */
  hideDivider?: boolean;
}

export function PageHeader({ title, subtitle, children, hideDivider = false }: PageHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isInitialMount] = useState(() => !hasEverMounted);

  useEffect(() => {
    hasEverMounted = true;
  }, []);

  // Skip on initial SSR hydration or reduced motion preference
  const skipAnimation = isInitialMount || shouldReduceMotion !== false;
  const instantTransition = { duration: 0 };

  // Check if we have any secondary content (subtitle, children, or divider)
  const hasSecondaryContent = subtitle || children || !hideDivider;

  // Use parallax for "heavy" content (tabs, controls), blur-only for "light" content (tagline)
  const secondaryAnimation = children ? secondaryWithChildrenAnimation : secondarySimpleAnimation;

  return (
    <div>
      {/* Title only - slides down from above */}
      {title && (
        <motion.h1
          className="hidden sm:block font-mono text-2xl font-bold text-foreground"
          initial={titleAnimation.initial}
          animate={titleAnimation.animate}
          transition={skipAnimation ? instantTransition : titleAnimation.transition}
        >
          {title}
        </motion.h1>
      )}

      {/* Secondary content - parallax+blur for children, blur-only for tagline */}
      {hasSecondaryContent && (
        <motion.div
          className={title ? "mt-1" : ""}
          initial={secondaryAnimation.initial}
          animate={secondaryAnimation.animate}
          transition={skipAnimation ? instantTransition : secondaryAnimation.transition}
        >
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {children && <div className={title ? "sm:mt-1" : ""}>{children}</div>}
          {!hideDivider && <div className="mt-3 mx-4 border-b border-border/50" />}
        </motion.div>
      )}
    </div>
  );
}
