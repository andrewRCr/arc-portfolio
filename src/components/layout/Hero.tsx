"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/config/site";
import {
  HERO_BAR_DELAY,
  HERO_BAR_DURATION,
  HERO_TEXT_DELAY,
  HERO_TEXT_DURATION,
  HERO_TEXT_STAGGER,
  HERO_SECONDARY_DELAY,
  HERO_SECONDARY_DURATION,
  HIDE_DURATION,
} from "@/lib/intro-timing";
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
  const { isHiddenUntilExpand } = useIntroContext();

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
            animate={{ scaleY: isHiddenUntilExpand ? 0 : 1 }}
            transition={
              isHiddenUntilExpand
                ? { duration: HIDE_DURATION }
                : {
                    duration: HERO_BAR_DURATION,
                    delay: HERO_BAR_DELAY,
                    ease: "easeOut",
                  }
            }
          />

          <div className="space-y-4 md:mb-8">
            <div className="space-y-2">
              <motion.p
                className="text-xs font-mono text-muted-foreground"
                initial={false}
                animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
                transition={
                  isHiddenUntilExpand
                    ? { duration: HIDE_DURATION }
                    : {
                        duration: HERO_TEXT_DURATION,
                        delay: HERO_TEXT_DELAY,
                        ease: "easeOut",
                      }
                }
              >
                &gt; portfolio.init()
              </motion.p>
              <motion.h1
                className="text-4xl font-bold font-mono"
                initial={false}
                animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
                transition={
                  isHiddenUntilExpand
                    ? { duration: HIDE_DURATION }
                    : {
                        duration: HERO_TEXT_DURATION,
                        delay: HERO_TEXT_DELAY + HERO_TEXT_STAGGER,
                        ease: "easeOut",
                      }
                }
              >
                {SITE.name}
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground"
                initial={false}
                animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
                transition={
                  isHiddenUntilExpand
                    ? { duration: HIDE_DURATION }
                    : {
                        duration: HERO_TEXT_DURATION,
                        delay: HERO_TEXT_DELAY + HERO_TEXT_STAGGER * 2,
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
          animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
          transition={
            isHiddenUntilExpand
              ? { duration: HIDE_DURATION }
              : {
                  duration: HERO_SECONDARY_DURATION,
                  delay: HERO_SECONDARY_DELAY,
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
        animate={{ opacity: isHiddenUntilExpand ? 0 : 1 }}
        transition={
          isHiddenUntilExpand
            ? { duration: HIDE_DURATION }
            : {
                duration: HERO_SECONDARY_DURATION,
                delay: HERO_SECONDARY_DELAY,
                ease: "easeOut",
              }
        }
      >
        Featured Projects
      </motion.h2>
    </div>
  );
}
