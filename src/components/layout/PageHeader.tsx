"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  PAGE_HEADER_TITLE_ANIMATION,
  PAGE_HEADER_SECONDARY_WITH_CHILDREN,
  PAGE_HEADER_SECONDARY_SIMPLE,
  INSTANT_TRANSITION,
} from "@/lib/animation-timing";
import { useInitialMount } from "@/hooks/useInitialMount";

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
  const isInitialMount = useInitialMount("PageHeader");

  // Skip on initial SSR hydration or reduced motion preference
  const skipAnimation = isInitialMount || shouldReduceMotion !== false;

  // Check if we have any secondary content (subtitle, children, or divider)
  const hasSecondaryContent = subtitle || children || !hideDivider;

  // Use parallax for "heavy" content (tabs, controls), blur-only for "light" content (tagline)
  const secondaryAnimation = children ? PAGE_HEADER_SECONDARY_WITH_CHILDREN : PAGE_HEADER_SECONDARY_SIMPLE;

  return (
    <div>
      {/* Title only - slides down from above */}
      {title && (
        <motion.h1
          className="hidden sm:block font-mono text-2xl font-bold text-foreground"
          initial={PAGE_HEADER_TITLE_ANIMATION.initial}
          animate={PAGE_HEADER_TITLE_ANIMATION.animate}
          transition={skipAnimation ? INSTANT_TRANSITION : PAGE_HEADER_TITLE_ANIMATION.transition}
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
          transition={skipAnimation ? INSTANT_TRANSITION : secondaryAnimation.transition}
        >
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {children && <div className={title ? "sm:mt-1" : ""}>{children}</div>}
          {!hideDivider && <div className="mt-3 mx-4 border-b border-border/50" />}
        </motion.div>
      )}
    </div>
  );
}
