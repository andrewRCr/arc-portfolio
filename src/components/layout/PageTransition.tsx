"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * PageTransition Component
 *
 * Wraps page content with opacity fade-in transition during route navigation.
 * Entry-only animation with deliberate delay - creates a brief "beat" before
 * new content fades in, giving transitions an intentional feel.
 *
 * Sequence on route change:
 * 1. Old content unmounts instantly (opacity 0 - no animation)
 * 2. Brief pause (TRANSITION_DELAY) - deliberate empty moment
 * 3. New content fades in (TRANSITION_DURATION)
 *
 * Frame elements (TopBar, FooterBar, Navigation, TUI frame) remain static -
 * only the content passed as children animates.
 *
 * Respects prefers-reduced-motion: when enabled, transitions are instant.
 *
 * Note: Exit animations with AnimatePresence don't work reliably in Next.js
 * App Router due to internal context handling. This entry-only approach with
 * delay provides a similar feel without dependency on internal APIs.
 */

/** Delay before fade-in starts (seconds) - creates deliberate "beat" */
const TRANSITION_DELAY = 0.1;

/** Fade-in duration (seconds) */
const TRANSITION_DURATION = 0.4;

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // With reduced motion (or if still detecting), use instant transitions
  // useReducedMotion returns null during SSR/detection, so we default to instant
  const skipAnimation = shouldReduceMotion !== false;

  return (
    <motion.div
      key={pathname}
      data-testid="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: skipAnimation ? 0 : TRANSITION_DURATION,
        delay: skipAnimation ? 0 : TRANSITION_DELAY,
        ease: "easeInOut",
      }}
      className="flex flex-col flex-1 min-h-0"
    >
      {children}
    </motion.div>
  );
}
