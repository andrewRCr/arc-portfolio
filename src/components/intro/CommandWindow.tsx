"use client";

/**
 * CommandWindow Component
 *
 * The initial window that appears during the intro animation sequence.
 * Displays branding and a terminal-style prompt, matching the TopBar aesthetic.
 *
 * Morphs into TopBar via Framer Motion layoutId during the intro animation.
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
import { WINDOW_SCALE_DURATION, CONTENT_FADE_DURATION, MORPH_SPRING } from "@/lib/intro-timing";
import { WindowContainer } from "@/components/layout/WindowContainer";

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
  /** Whether morph transition is active - fades out command content */
  isMorphing?: boolean;
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
  isMorphing = false,
  onEntranceComplete,
  className,
}: CommandWindowProps) {
  const { windowBorderWidth, topBarHeight } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = topBarHeight - windowBorderWidth * 2;

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-[20vh]">
      {/* Footer morph target - positioned behind main window, morphs to FooterBar */}
      <motion.div
        layoutId="footer-window"
        layout
        className="absolute"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: isMorphing ? 1 : 0 }}
        transition={{
          layout: MORPH_SPRING,
          scale: { duration: WINDOW_SCALE_DURATION, ease: "easeOut" },
          opacity: { duration: isMorphing ? 0.1 : WINDOW_SCALE_DURATION },
        }}
      >
        <WindowContainer windowId="intro-footer" className={className}>
          <div className="flex items-center gap-4 px-4" style={{ height: innerHeight, minWidth: 320 }} />
        </WindowContainer>
      </motion.div>

      {/* Main window - morphs to TopBar */}
      <motion.div
        layoutId="topbar-window"
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          layout: MORPH_SPRING,
          scale: { duration: WINDOW_SCALE_DURATION, ease: "easeOut" },
          opacity: { duration: WINDOW_SCALE_DURATION },
        }}
        onAnimationComplete={() => {
          if (!isMorphing) {
            onEntranceComplete?.();
          }
        }}
      >
        <WindowContainer windowId="intro" className={className}>
          <div className="flex items-center gap-4 px-4" style={{ height: innerHeight, minWidth: 320 }}>
            {/* All content disappears instantly when morph starts, fades in during entrance */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent && !isMorphing ? 1 : 0 }}
              transition={{ duration: isMorphing ? 0 : CONTENT_FADE_DURATION }}
            >
              {/* Branding - matches TopBar style */}
              <div className="flex items-center gap-3">
                <span className="text-foreground font-mono font-bold">{SITE.handle}</span>
                <span className="text-primary font-mono">&gt;</span>
              </div>

              {/* Command area - typed text + cursor or loading indicator */}
              <div className="flex items-center font-mono text-foreground">
                <span>
                  {typedText}
                  {!isTypingComplete && showCursor && <BlinkingCursor />}
                </span>
                {isTypingComplete && <span className="ml-2">{loadingContent}</span>}
              </div>
            </motion.div>
          </div>
        </WindowContainer>
      </motion.div>
    </div>
  );
}

/**
 * BlinkingCursor Component
 *
 * Terminal-style blinking cursor. Respects prefers-reduced-motion.
 */
function BlinkingCursor() {
  return <span className="inline-block w-2 h-4 bg-primary animate-blink translate-y-0.5" aria-hidden="true" />;
}
