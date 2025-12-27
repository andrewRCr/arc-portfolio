"use client";

import { usePathname } from "next/navigation";
import { motion, type Variants, AnimatePresence } from "framer-motion";

/**
 * AdaptiveHero Component
 *
 * Adapts between two states based on current route:
 * - EXPANDED: Full hero section on home page
 * - COMPACT: Minimal branding header on all other pages
 *
 * Animation: Step 3 - Choreographed sequence with size changes and element motion
 */

// Container animations (padding changes)
const containerVariants: Variants = {
  expanded: {
    paddingTop: "0.5rem",
    paddingBottom: "1rem",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  compact: {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Name animations (size changes)
const nameVariants: Variants = {
  expanded: {
    fontSize: "2.25rem", // text-4xl
    lineHeight: "2.5rem",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  compact: {
    fontSize: "1.5rem", // text-2xl
    lineHeight: "2rem",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Prompt fade out/in animations
const promptVariants: Variants = {
  expanded: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  compact: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Tagline fade out/in animations
const taglineVariants: Variants = {
  expanded: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  compact: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Cursor fade in/out animations
const cursorVariants: Variants = {
  expanded: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  compact: {
    opacity: 1,
    transition: {
      duration: 0.25,
      delay: 0.15, // Appear after name finishes shrinking
    },
  },
};

export function AdaptiveHero() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const variant = isHome ? "expanded" : "compact";

  return (
    <motion.div className="px-14" variants={containerVariants} initial={variant} animate={variant}>
      <div className="border-l-2 border-primary pl-6">
        <AnimatePresence mode="wait">
          {variant === "compact" ? (
            // Compact layout
            <motion.div
              key="compact"
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.h1 className="font-bold font-mono" variants={nameVariants} initial="expanded" animate="compact">
                Andrew Creekmore
              </motion.h1>

              <motion.span
                className="text-primary font-mono"
                variants={cursorVariants}
                initial="expanded"
                animate="compact"
              >
                &gt;_
              </motion.span>
            </motion.div>
          ) : (
            // Expanded layout
            <motion.div
              key="expanded"
              className="space-y-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-2">
                <motion.p
                  className="text-xs font-mono text-muted-foreground"
                  variants={promptVariants}
                  initial="compact"
                  animate="expanded"
                >
                  &gt; portfolio.init()
                </motion.p>

                <motion.h1 className="font-bold font-mono" variants={nameVariants} initial="compact" animate="expanded">
                  Andrew Creekmore
                </motion.h1>

                <motion.p
                  className="text-lg text-muted-foreground"
                  variants={taglineVariants}
                  initial="compact"
                  animate="expanded"
                >
                  Full-stack developer &amp; creative technologist
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
