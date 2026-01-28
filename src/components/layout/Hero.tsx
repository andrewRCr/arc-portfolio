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
  // Shared
  ENTRANCE_BLUR,
  BLUR_NONE,
} from "@/lib/animation-timing";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useIntroContext } from "@/contexts/IntroContext";

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
 * During intro animation, hero elements animate in:
 * - Left bar grows from center (scaleY)
 * - Text elements fade in with stagger
 *
 * Responsive behavior:
 * - Phone (< 640px): Condensed single-line tagline
 * - Tablet: Two-line tagline
 * - Desktop: Single line with pipe separator
 */
export function Hero({ children }: HeroProps) {
  const isPhone = useIsPhone();
  const { isHiddenUntilExpand, shouldShow } = useIntroContext();

  // Route change animation plays when no intro sequence is active.
  // When intro IS playing (shouldShow true), use intro animation props.
  // When intro is NOT playing (refresh, nav from other page), use route animation.
  const isRouteChange = !shouldShow;

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
  // Animation props - route change vs intro sequence
  // ==========================================================================

  // Bar animation
  const barProps = isRouteChange
    ? {
        initial: { scaleY: 0 },
        animate: { scaleY: 1 },
        transition: {
          duration: HERO_BAR_DURATION * ROUTE_TRANSITION_SPEED,
          delay: ROUTE_TRANSITION_DELAY,
          ease: MATERIAL_EASE,
        },
      }
    : {
        initial: false as const,
        animate: { scaleY: isHiddenUntilExpand ? 0 : 1 },
        transition: isHiddenUntilExpand
          ? { duration: HIDE_DURATION }
          : { duration: HERO_BAR_DURATION, delay: HERO_BAR_DELAY, ease: "easeOut" as const },
      };

  // Text animation helper (staggered)
  // Name (index 1) gets blur + slower timing as the hero element
  // Other text uses simple fade
  const textProps = (staggerIndex: number) => {
    const isName = staggerIndex === 1;

    if (isRouteChange) {
      return isName
        ? {
            // Name: scale + blur (origin-left set on element)
            initial: { opacity: 0, scale: 0.95, filter: ENTRANCE_BLUR },
            animate: { opacity: 1, scale: 1, filter: BLUR_NONE },
            transition: {
              duration: 0.3,
              delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_NAME_DELAY_OFFSET,
              ease: MATERIAL_EASE,
            },
          }
        : {
            // Other text: slide + blur, converging simultaneously
            // portfolio.init (0): slide down, tagline (2): slide up
            // Same timing so they complete together
            initial: { opacity: 0, y: staggerIndex === 0 ? -8 : 8, filter: ENTRANCE_BLUR },
            animate: { opacity: 1, y: 0, filter: BLUR_NONE },
            transition: {
              duration: 0.2,
              delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_TEXT_DELAY_OFFSET,
              ease: MATERIAL_EASE,
            },
          };
    }

    // Intro sequence (unchanged)
    return {
      initial: false as const,
      animate: { opacity: isHiddenUntilExpand ? 0 : 1 },
      transition: isHiddenUntilExpand
        ? { duration: HIDE_DURATION }
        : {
            duration: HERO_TEXT_DURATION,
            delay: HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex,
            ease: "easeOut" as const,
          },
    };
  };

  // Secondary content animation
  const secondaryProps = isRouteChange
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
          duration: HERO_SECONDARY_DURATION * ROUTE_TRANSITION_SPEED,
          delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_SECONDARY_DELAY_OFFSET,
          ease: MATERIAL_EASE,
        },
      }
    : {
        initial: false as const,
        animate: { opacity: isHiddenUntilExpand ? 0 : 1 },
        transition: isHiddenUntilExpand
          ? { duration: HIDE_DURATION }
          : { duration: HERO_SECONDARY_DURATION, delay: HERO_SECONDARY_DELAY, ease: "easeOut" as const },
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
