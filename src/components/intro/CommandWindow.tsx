"use client";

/**
 * CommandWindow Component
 *
 * The initial window that appears during the intro animation sequence.
 * Displays branding and a terminal-style prompt, matching the TopBar aesthetic.
 *
 * This component will later morph into the TopBar via Framer Motion layoutId.
 *
 * Features:
 * - Entrance animation: scale up, then fade in content
 * - Centered horizontally, offset toward top of viewport
 * - WindowContainer styling for TWM consistency
 * - Branding elements matching TopBar (handle + prompt icon)
 * - Motion wrapper for Framer Motion layout animations
 */

import { motion } from "framer-motion";
import { SITE } from "@/config/site";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { WindowContainer } from "@/components/layout/WindowContainer";

/** Animation timing constants (ms) */
const SCALE_DURATION = 0.3;
const FADE_DURATION = 0.2;

export interface CommandWindowProps {
  /** Text being typed (from useTypingAnimation) */
  typedText?: string;
  /** Whether typing is complete */
  isTypingComplete?: boolean;
  /** Loading spinner content (when typing is complete) */
  loadingContent?: React.ReactNode;
  /** Whether to show branding content - false during scale-in */
  showContent?: boolean;
  /** Whether to show cursor - appears after branding fades in */
  showCursor?: boolean;
  /** Called when entrance animation completes (scale + fade) */
  onEntranceComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CommandWindow displays the intro animation's initial terminal window.
 *
 * Animation sequence:
 * 1. Window scales up from 0.9 to 1.0
 * 2. Content (branding + cursor) fades in
 * 3. onEntranceComplete fires, typing begins
 *
 * Layout:
 * - Left side: branding (handle + prompt icon)
 * - Right side: typed command text + cursor/loading
 */
export function CommandWindow({
  typedText = "",
  isTypingComplete = false,
  loadingContent,
  showContent = true,
  showCursor = true,
  onEntranceComplete,
  className,
}: CommandWindowProps) {
  const { windowBorderWidth, topBarHeight } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = topBarHeight - windowBorderWidth * 2;

  return (
    <motion.div
      className="fixed inset-0 flex items-start justify-center pt-[20vh]"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: SCALE_DURATION, ease: "easeOut" }}
      onAnimationComplete={onEntranceComplete}
      // TODO: Add layoutId for morph transition to TopBar
    >
      <WindowContainer windowId="intro" className={className}>
        <div className="flex items-center gap-4 px-4" style={{ height: innerHeight, minWidth: 320 }}>
          {/* Content fades in after window scales up */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: FADE_DURATION, delay: showContent ? 0 : 0 }}
          >
            {/* Branding - matches TopBar style */}
            <div className="flex items-center gap-3">
              <span className="text-foreground font-mono font-bold">{SITE.handle}</span>
              <span className="text-primary font-mono">&gt;_</span>
            </div>

            {/* Command area - typed text + cursor or loading indicator */}
            <div className="flex items-center gap-1 font-mono text-foreground">
              <span>{typedText}</span>
              {!isTypingComplete && showCursor && <BlinkingCursor />}
              {isTypingComplete && loadingContent}
            </div>
          </motion.div>
        </div>
      </WindowContainer>
    </motion.div>
  );
}

/**
 * BlinkingCursor Component
 *
 * Terminal-style blinking cursor. Respects prefers-reduced-motion.
 */
function BlinkingCursor() {
  return <span className="inline-block w-2 h-4 bg-primary animate-blink" aria-hidden="true" />;
}
