"use client";

import { motion } from "framer-motion";
import {
  PAGE_HEADER_TITLE_ANIMATION,
  PAGE_HEADER_SECONDARY_WITH_CHILDREN,
  PAGE_HEADER_SECONDARY_SIMPLE,
  REFRESH_CONTENT_DELAY,
  REFRESH_CONTENT_DURATION,
  SKIP_HERO_TEXT_DELAY,
  SKIP_CONTENT_DURATION,
  HIDE_DURATION,
  MATERIAL_EASE,
  ENTRANCE_BLUR,
  BLUR_NONE,
} from "@/lib/animation-timing";
import { useAnimationContext, type AnimationMode } from "@/contexts/AnimationContext";

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
  const { animationMode, visibility } = useAnimationContext();

  // Use contentVisible - accounts for initialization and intro phases
  const contentVisible = visibility.contentVisible;

  // Check if we have any secondary content (subtitle, children, or divider)
  const hasSecondaryContent = subtitle || children || !hideDivider;

  // Get title timing based on animationMode
  const getTitleTiming = (mode: AnimationMode) => {
    switch (mode) {
      case "instant":
        return { duration: 0 };
      case "refresh":
        return {
          delay: REFRESH_CONTENT_DELAY,
          duration: REFRESH_CONTENT_DURATION,
          ease: MATERIAL_EASE,
        };
      case "skip":
        return {
          delay: SKIP_HERO_TEXT_DELAY,
          duration: SKIP_CONTENT_DURATION,
          ease: MATERIAL_EASE,
        };
      case "route":
      default:
        return PAGE_HEADER_TITLE_ANIMATION.transition;
    }
  };

  // Get secondary content timing
  const getSecondaryTiming = (mode: AnimationMode) => {
    const baseTransition = children
      ? PAGE_HEADER_SECONDARY_WITH_CHILDREN.transition
      : PAGE_HEADER_SECONDARY_SIMPLE.transition;

    switch (mode) {
      case "instant":
        return { duration: 0 };
      case "refresh":
        return {
          delay: REFRESH_CONTENT_DELAY + 0.05,
          duration: REFRESH_CONTENT_DURATION,
          ease: MATERIAL_EASE,
        };
      case "skip":
        return {
          delay: SKIP_HERO_TEXT_DELAY + 0.05,
          duration: SKIP_CONTENT_DURATION,
          ease: MATERIAL_EASE,
        };
      case "route":
      default:
        return baseTransition;
    }
  };

  // showContent uses contentVisible directly (it already handles intro phases)
  // During intro, contentVisible is false until "expanding" phase
  // On non-home pages during intro, this header isn't rendered anyway (Hero is used)
  const showContent = contentVisible;

  // Hide transition
  const hideTransition = { duration: HIDE_DURATION };

  // Title animation - always use initial: {hidden}
  const titleAnimation = {
    initial: { opacity: 0, y: -10, filter: ENTRANCE_BLUR },
    animate: showContent ? { opacity: 1, y: 0, filter: BLUR_NONE } : { opacity: 0, y: -10, filter: ENTRANCE_BLUR },
    transition: showContent ? getTitleTiming(animationMode) : hideTransition,
  };

  // Secondary animation
  const baseSecondary = children ? PAGE_HEADER_SECONDARY_WITH_CHILDREN : PAGE_HEADER_SECONDARY_SIMPLE;
  const secondaryAnimation = {
    initial: baseSecondary.initial,
    animate: showContent ? baseSecondary.animate : baseSecondary.initial,
    transition: showContent ? getSecondaryTiming(animationMode) : hideTransition,
  };

  return (
    <div>
      {/* Title only - slides down from above */}
      {title && (
        <motion.h1
          className="hidden sm:block font-mono text-2xl font-bold text-foreground"
          initial={titleAnimation.initial}
          animate={titleAnimation.animate}
          transition={titleAnimation.transition}
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
          transition={secondaryAnimation.transition}
        >
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {children && <div className={title ? "sm:mt-1" : ""}>{children}</div>}
          {!hideDivider && <div className="mt-3 mx-4 border-b border-border/50" />}
        </motion.div>
      )}
    </div>
  );
}
