"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/config/site";
import {
  // Timing functions (centralized mode lookup)
  getHeroBarTiming,
  getHeroTextTiming,
  getHeroNameTiming,
  getHeroSecondaryTiming,
  // Shared constants
  HIDE_TRANSITION,
  ENTRANCE_BLUR,
  BLUR_NONE,
} from "@/lib/animation-timing";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useAnimationContext } from "@/contexts/AnimationContext";

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
  // Animation props - always use initial: {hidden}, animate based on visibility
  // ==========================================================================
  // Timing logic is centralized in animation-timing.ts (SRP compliance).
  // This component just renders with the appropriate timing for each mode.

  // Bar animation
  const barProps = {
    initial: { scaleY: 0 },
    animate: { scaleY: contentVisible ? 1 : 0 },
    transition: contentVisible ? getHeroBarTiming(animationMode) : HIDE_TRANSITION,
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
        transition: contentVisible ? getHeroNameTiming(animationMode) : HIDE_TRANSITION,
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
        transition: contentVisible ? getHeroTextTiming(animationMode, staggerIndex) : HIDE_TRANSITION,
      };
    }

    // Refresh: fade with blur
    if (animationMode === "refresh") {
      return {
        initial: { opacity: 0, filter: ENTRANCE_BLUR },
        animate: contentVisible ? { opacity: 1, filter: BLUR_NONE } : { opacity: 0, filter: ENTRANCE_BLUR },
        transition: contentVisible ? getHeroTextTiming(animationMode, staggerIndex) : HIDE_TRANSITION,
      };
    }

    // Other modes: simple fade
    return {
      initial: { opacity: 0 },
      animate: { opacity: contentVisible ? 1 : 0 },
      transition: contentVisible ? getHeroTextTiming(animationMode, staggerIndex) : HIDE_TRANSITION,
    };
  };

  // Secondary content animation
  const secondaryProps = {
    initial: { opacity: 0 },
    animate: { opacity: contentVisible ? 1 : 0 },
    transition: contentVisible ? getHeroSecondaryTiming(animationMode) : HIDE_TRANSITION,
  };

  return (
    <div className="pt-4 px-2 md:pt-8 md:px-8">
      <div className="pl-0 md:pl-2 pb-2">
        {/* Container with relative positioning for absolute bar */}
        <div className="relative pl-6">
          {/* Animated left bar - separate element for scaleY animation */}
          {/* will-change-transform stabilizes sub-pixel rendering during layout transitions */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary origin-center will-change-transform"
            {...barProps}
          />

          <div className="space-y-4 md:mb-8">
            <div className="space-y-2">
              <motion.p className="text-xs font-terminal text-muted-foreground" {...textProps(0)}>
                &gt; portfolio.init()
              </motion.p>
              <motion.h1 className="text-4xl font-bold font-title origin-left" {...textProps(1)}>
                {SITE.name}
              </motion.h1>
              <motion.p className="text-lg font-body text-muted-foreground" {...textProps(2)}>
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
        className={`mb-1 md:mx-4 text-sm font-terminal text-muted-foreground ${children ? "mt-4 md:mt-8" : "mt-4 md:mt-2"}`}
        {...secondaryProps}
      >
        Featured Projects
      </motion.h2>
    </div>
  );
}
