"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/config/site";
import {
  // Intro sequence timing
  HERO_BAR_DELAY,
  HERO_BAR_DURATION,
  HERO_TEXT_DELAY,
  HERO_TEXT_DURATION,
  HERO_TEXT_STAGGER,
  HERO_SECONDARY_DELAY,
  HERO_SECONDARY_DURATION,
  HIDE_DURATION,
  // Route transition timing
  MATERIAL_EASE,
  ROUTE_TRANSITION_DELAY,
  ROUTE_TRANSITION_SPEED,
  ROUTE_HERO_NAME_DELAY_OFFSET,
  ROUTE_HERO_TEXT_DELAY_OFFSET,
  ROUTE_HERO_SECONDARY_DELAY_OFFSET,
  // Refresh timing
  REFRESH_HERO_BAR_DELAY,
  REFRESH_HERO_TEXT_DELAY,
  REFRESH_HERO_SECONDARY_DELAY,
  REFRESH_CONTENT_DURATION,
  // Skip timing
  SKIP_HERO_BAR_DELAY,
  SKIP_HERO_TEXT_DELAY,
  SKIP_HERO_SECONDARY_DELAY,
  SKIP_CONTENT_DURATION,
  // Shared
  ENTRANCE_BLUR,
  BLUR_NONE,
} from "@/lib/animation-timing";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useAnimationContext, type AnimationMode } from "@/contexts/AnimationContext";

interface HeroProps {
  /** Optional content to render between tagline and "Featured Projects" heading */
  children?: ReactNode;
}

/**
 * Hero Component
 *
 * Home page hero with terminal-inspired styling. Rendered in PageLayout's
 * header slot (fixed above scroll area). Includes "Featured Projects" heading
 * to anchor the scroll shadow at the header boundary.
 *
 * Animation timing is determined by AnimationContext's animationMode.
 * Components use initial: {hidden} and animate based on visibility flags.
 *
 * Responsive behavior:
 * - Phone (< 640px): Condensed single-line tagline
 * - Tablet: Two-line tagline
 * - Desktop: Single line with pipe separator
 */
export function Hero({ children }: HeroProps) {
  const isPhone = useIsPhone();
  const { animationMode, visibility } = useAnimationContext();

  // Use new visibility flag that accounts for initialization
  const contentVisible = visibility.contentVisible;

  const renderTagline = () => {
    const parts = SITE.tagline.split(" | ");
    if (parts.length !== 2) {
      return SITE.tagline;
    }

    // Phone: primary tagline only (saves vertical space)
    if (isPhone) {
      return parts[0];
    }

    // Tablet/Desktop: full tagline with responsive formatting
    return (
      <>
        {parts[0]}
        <br className="md:hidden" />
        <span className="hidden md:inline">&nbsp; | &nbsp;</span>
        {parts[1]}
      </>
    );
  };

  // ==========================================================================
  // Animation timing lookup by animationMode
  // ==========================================================================

  // Get timing for bar animation based on animationMode
  const getBarTiming = (mode: AnimationMode) => {
    switch (mode) {
      case "instant":
        return { duration: 0 };
      case "route":
        return {
          duration: HERO_BAR_DURATION * ROUTE_TRANSITION_SPEED,
          delay: ROUTE_TRANSITION_DELAY,
          ease: MATERIAL_EASE,
        };
      case "refresh":
        return {
          duration: HERO_BAR_DURATION,
          delay: REFRESH_HERO_BAR_DELAY,
          ease: MATERIAL_EASE,
        };
      case "skip":
        return {
          duration: SKIP_CONTENT_DURATION,
          delay: SKIP_HERO_BAR_DELAY,
          ease: MATERIAL_EASE,
        };
      case "intro":
      default:
        return {
          duration: HERO_BAR_DURATION,
          delay: HERO_BAR_DELAY,
          ease: "easeOut" as const,
        };
    }
  };

  // Get timing for text animation based on animationMode
  const getTextTiming = (mode: AnimationMode, staggerIndex: number) => {
    switch (mode) {
      case "instant":
        return { duration: 0 };
      case "route":
        return {
          duration: 0.2,
          delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_TEXT_DELAY_OFFSET,
          ease: MATERIAL_EASE,
        };
      case "refresh":
        return {
          duration: REFRESH_CONTENT_DURATION,
          delay: REFRESH_HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex,
          ease: MATERIAL_EASE,
        };
      case "skip":
        return {
          duration: SKIP_CONTENT_DURATION,
          delay: SKIP_HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex * 0.5,
          ease: MATERIAL_EASE,
        };
      case "intro":
      default:
        return {
          duration: HERO_TEXT_DURATION,
          delay: HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex,
          ease: "easeOut" as const,
        };
    }
  };

  // Get timing for name (special case with scale + blur on route)
  const getNameTiming = (mode: AnimationMode) => {
    if (mode === "route") {
      return {
        duration: 0.3,
        delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_NAME_DELAY_OFFSET,
        ease: MATERIAL_EASE,
      };
    }
    // For other modes, use standard text timing
    return getTextTiming(mode, 1);
  };

  // Get timing for secondary content
  const getSecondaryTiming = (mode: AnimationMode) => {
    switch (mode) {
      case "instant":
        return { duration: 0 };
      case "route":
        return {
          duration: HERO_SECONDARY_DURATION * ROUTE_TRANSITION_SPEED,
          delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_SECONDARY_DELAY_OFFSET,
          ease: MATERIAL_EASE,
        };
      case "refresh":
        return {
          duration: REFRESH_CONTENT_DURATION,
          delay: REFRESH_HERO_SECONDARY_DELAY,
          ease: MATERIAL_EASE,
        };
      case "skip":
        return {
          duration: SKIP_CONTENT_DURATION,
          delay: SKIP_HERO_SECONDARY_DELAY,
          ease: MATERIAL_EASE,
        };
      case "intro":
      default:
        return {
          duration: HERO_SECONDARY_DURATION,
          delay: HERO_SECONDARY_DELAY,
          ease: "easeOut" as const,
        };
    }
  };

  // ==========================================================================
  // Animation props - always use initial: {hidden}, animate based on visibility
  // ==========================================================================

  // When hiding (for retrigger), use quick transition
  const hideTransition = { duration: HIDE_DURATION };

  // Bar animation
  const barProps = {
    initial: { scaleY: 0 },
    animate: { scaleY: contentVisible ? 1 : 0 },
    transition: contentVisible ? getBarTiming(animationMode) : hideTransition,
  };

  // Text animation helper
  const textProps = (staggerIndex: number) => {
    const isName = staggerIndex === 1;

    // Name gets special treatment on route (scale + blur)
    if (isName && animationMode === "route") {
      return {
        initial: { opacity: 0, scale: 0.95, filter: ENTRANCE_BLUR },
        animate: contentVisible
          ? { opacity: 1, scale: 1, filter: BLUR_NONE }
          : { opacity: 0, scale: 0.95, filter: ENTRANCE_BLUR },
        transition: contentVisible ? getNameTiming(animationMode) : hideTransition,
      };
    }

    // Route: slide + blur for non-name text
    if (animationMode === "route") {
      const yOffset = staggerIndex === 0 ? -8 : 8;
      return {
        initial: { opacity: 0, y: yOffset, filter: ENTRANCE_BLUR },
        animate: contentVisible
          ? { opacity: 1, y: 0, filter: BLUR_NONE }
          : { opacity: 0, y: yOffset, filter: ENTRANCE_BLUR },
        transition: contentVisible ? getTextTiming(animationMode, staggerIndex) : hideTransition,
      };
    }

    // Refresh: fade with blur
    if (animationMode === "refresh") {
      return {
        initial: { opacity: 0, filter: ENTRANCE_BLUR },
        animate: contentVisible ? { opacity: 1, filter: BLUR_NONE } : { opacity: 0, filter: ENTRANCE_BLUR },
        transition: contentVisible ? getTextTiming(animationMode, staggerIndex) : hideTransition,
      };
    }

    // Other modes: simple fade
    return {
      initial: { opacity: 0 },
      animate: { opacity: contentVisible ? 1 : 0 },
      transition: contentVisible ? getTextTiming(animationMode, staggerIndex) : hideTransition,
    };
  };

  // Secondary content animation
  const secondaryProps = {
    initial: { opacity: 0 },
    animate: { opacity: contentVisible ? 1 : 0 },
    transition: contentVisible ? getSecondaryTiming(animationMode) : hideTransition,
  };

  return (
    <div className="pt-4 px-2 md:pt-8 md:px-8">
      <div className="pl-0 md:pl-2 pb-2">
        {/* Container with relative positioning for absolute bar */}
        <div className="relative pl-6">
          {/* Animated left bar - separate element for scaleY animation */}
          <motion.div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary origin-center" {...barProps} />

          <div className="space-y-4 md:mb-8">
            <div className="space-y-2">
              <motion.p className="text-xs font-mono text-muted-foreground" {...textProps(0)}>
                &gt; portfolio.init()
              </motion.p>
              <motion.h1 className="text-4xl font-bold font-mono origin-left" {...textProps(1)}>
                {SITE.name}
              </motion.h1>
              <motion.p className="text-lg text-muted-foreground" {...textProps(2)}>
                {renderTagline()}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {children && (
        <motion.div className="mt-2 md:mt-0 flex justify-center" {...secondaryProps}>
          {children}
        </motion.div>
      )}

      <motion.h2
        className={`mb-1 md:mx-4 text-sm font-mono text-muted-foreground ${children ? "mt-4 md:mt-8" : "mt-4 md:mt-2"}`}
        {...secondaryProps}
      >
        Featured Projects
      </motion.h2>
    </div>
  );
}
