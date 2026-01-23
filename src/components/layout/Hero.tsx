"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/config/site";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useIntroContext } from "@/contexts/IntroContext";

interface HeroProps {
  /** Optional content to render between tagline and "Featured Projects" heading */
  children?: ReactNode;
}

/**
 * Hero animation timing constants (seconds)
 * Order: Hero bar (~0.6s) → Frame (~0.95s) → Hero text + Body (~1.1s)
 */
const HERO_ANIMATION = {
  /** When bar starts */
  BAR_DELAY: 0.15,
  /** Duration of bar grow animation */
  BAR_DURATION: 0.45,
  /** When text starts (mid-bar) */
  TEXT_DELAY: 0.35, // Halfway through bar animation
  /** Duration of each text fade */
  TEXT_DURATION: 0.35,
  /** Stagger between text elements */
  TEXT_STAGGER: 0.08,
  /** When secondary content fades (matches body content/nav timing) */
  SECONDARY_DELAY: 0.6,
  /** Duration of secondary fade (matches nav fade) */
  SECONDARY_DURATION: 0.35,
  /** Quick hide duration for retrigger */
  HIDE_DURATION: 0.15,
} as const;

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
  const { introPhase } = useIntroContext();

  // Hero content is hidden during early intro phases AND during morphing
  // Becomes visible starting from "expanding" phase (after wrapper scale starts)
  const isHeroHidden =
    introPhase === "entering" ||
    introPhase === "typing" ||
    introPhase === "loading" ||
    introPhase === "morphing";

  // Secondary content (children, heading) hidden until later in the sequence
  // Matches body content/nav timing - shows during expanding/complete/idle
  const isSecondaryHidden =
    introPhase === "entering" ||
    introPhase === "typing" ||
    introPhase === "loading" ||
    introPhase === "morphing";

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

  return (
    <div className="pt-4 px-2 md:pt-8 md:px-8">
      <div className="pl-0 md:pl-2 pb-2">
        {/* Container with relative positioning for absolute bar */}
        <div className="relative pl-6">
          {/* Animated left bar - separate element for scaleY animation */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary origin-center"
            initial={false}
            animate={{ scaleY: isHeroHidden ? 0 : 1 }}
            transition={
              isHeroHidden
                ? { duration: HERO_ANIMATION.HIDE_DURATION }
                : {
                    duration: HERO_ANIMATION.BAR_DURATION,
                    delay: HERO_ANIMATION.BAR_DELAY,
                    ease: "easeOut",
                  }
            }
          />

          <div className="space-y-4 md:mb-8">
            <div className="space-y-2">
              <motion.p
                className="text-xs font-mono text-muted-foreground"
                initial={false}
                animate={{ opacity: isHeroHidden ? 0 : 1 }}
                transition={
                  isHeroHidden
                    ? { duration: HERO_ANIMATION.HIDE_DURATION }
                    : {
                        duration: HERO_ANIMATION.TEXT_DURATION,
                        delay: HERO_ANIMATION.TEXT_DELAY,
                        ease: "easeOut",
                      }
                }
              >
                &gt; portfolio.init()
              </motion.p>
              <motion.h1
                className="text-4xl font-bold font-mono"
                initial={false}
                animate={{ opacity: isHeroHidden ? 0 : 1 }}
                transition={
                  isHeroHidden
                    ? { duration: HERO_ANIMATION.HIDE_DURATION }
                    : {
                        duration: HERO_ANIMATION.TEXT_DURATION,
                        delay: HERO_ANIMATION.TEXT_DELAY + HERO_ANIMATION.TEXT_STAGGER,
                        ease: "easeOut",
                      }
                }
              >
                {SITE.name}
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground"
                initial={false}
                animate={{ opacity: isHeroHidden ? 0 : 1 }}
                transition={
                  isHeroHidden
                    ? { duration: HERO_ANIMATION.HIDE_DURATION }
                    : {
                        duration: HERO_ANIMATION.TEXT_DURATION,
                        delay: HERO_ANIMATION.TEXT_DELAY + HERO_ANIMATION.TEXT_STAGGER * 2,
                        ease: "easeOut",
                      }
                }
              >
                {renderTagline()}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {children && (
        <motion.div
          className="mt-2 md:mt-0 flex justify-center"
          initial={false}
          animate={{ opacity: isSecondaryHidden ? 0 : 1 }}
          transition={
            isSecondaryHidden
              ? { duration: HERO_ANIMATION.HIDE_DURATION }
              : {
                  duration: HERO_ANIMATION.SECONDARY_DURATION,
                  delay: HERO_ANIMATION.SECONDARY_DELAY,
                  ease: "easeOut",
                }
          }
        >
          {children}
        </motion.div>
      )}

      <motion.h2
        className={`mb-1 md:mx-4 text-sm font-mono text-muted-foreground ${children ? "mt-4 md:mt-8" : "mt-4 md:mt-2"}`}
        initial={false}
        animate={{ opacity: isSecondaryHidden ? 0 : 1 }}
        transition={
          isSecondaryHidden
            ? { duration: HERO_ANIMATION.HIDE_DURATION }
            : {
                duration: HERO_ANIMATION.SECONDARY_DURATION,
                delay: HERO_ANIMATION.SECONDARY_DELAY,
                ease: "easeOut",
              }
        }
      >
        Featured Projects
      </motion.h2>
    </div>
  );
}
