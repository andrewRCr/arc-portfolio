"use client";

import { Minimize2, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { MAIN_CONTENT_DELAY, MAIN_CONTENT_DURATION } from "@/lib/animation-timing";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { useAnimationContext } from "@/contexts/AnimationContext";
import { useIsMobile } from "@/hooks/useMediaQuery";

/**
 * LayoutModeToggle - Floating button to toggle between boxed and fullscreen layout.
 *
 * Mobile: always available (primary layout toggle).
 * Desktop: only visible as escape hatch when fullscreen mode is inherited
 * (e.g., from a mobile session or viewport resize).
 *
 * Hidden during intro animation until windows are visible, then fades in.
 */
export function LayoutModeToggle() {
  const { topBarHeight, windowGap } = DEFAULT_LAYOUT_TOKENS;
  const { layoutMode, setLayoutMode, isDrawerOpen, isLightboxOpen } = useLayoutPreferences();
  const { visibility, intro } = useAnimationContext();
  const isMobile = useIsMobile();

  const isFullscreen = layoutMode === "full";

  // Gate on contentVisible (expanding phase) rather than windowVisible (morphing phase)
  // so the button doesn't appear while the window is still scaling up
  const showToggle = visibility.contentVisible && !isDrawerOpen && !isLightboxOpen && (isMobile || isFullscreen);

  // During intro, delay entrance until window scale animation completes.
  // After intro is complete, no delay (e.g., drawer open/close cycles).
  const enterDelay = intro.phase !== "complete" ? MAIN_CONTENT_DELAY + MAIN_CONTENT_DURATION : 0;

  const toggleLayoutMode = () => {
    setLayoutMode(isFullscreen ? "boxed" : "full");
  };

  return (
    <AnimatePresence>
      {showToggle && (
        <motion.button
          type="button"
          onClick={toggleLayoutMode}
          aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
          className="fixed right-4 z-50 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-surface-muted backdrop-blur-sm border border-border shadow-lg [-webkit-tap-highlight-color:transparent] outline-none hover:bg-popover/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          style={{ top: isFullscreen ? 16 : topBarHeight + windowGap + 16 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: enterDelay }}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
