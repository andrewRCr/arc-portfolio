"use client";

import { useState, useEffect } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { MAIN_CONTENT_TWEEN, MAIN_CONTENT_DELAY, HIDE_DURATION, EXPANDING_DURATION } from "@/lib/animation-timing";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { AnimationProvider, useAnimationContext, useAnimationDispatch } from "@/contexts/AnimationContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TopBar } from "./TopBar";
import { FooterBar } from "./FooterBar";
import { WindowContainer } from "./WindowContainer";
import { WallpaperBackground } from "./WallpaperBackground";
import { IntroSequence } from "@/components/intro";
import { IntroStateSignal } from "@/components/dev/IntroStateSignal";

/** Identifiers for the three layout windows */
type WindowId = "top" | "main" | "footer";

/**
 * Props for the LayoutWrapper component.
 */
export interface LayoutWrapperProps {
  /** Main content to render in the central window */
  children: React.ReactNode;
}

/**
 * Inner layout component that renders inside AnimationProvider.
 * Handles intro-aware animation of main content and footer.
 */
function LayoutContent({ children }: LayoutWrapperProps) {
  const { windowGap, windowContainerMaxWidth, topBarHeight } = DEFAULT_LAYOUT_TOKENS;
  const { layoutMode, setLayoutMode, isDrawerOpen } = useLayoutPreferences();
  const { loadMode, animationMode, intro, visibility } = useAnimationContext();
  const dispatch = useAnimationDispatch();
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const isMobile = useIsMobile();

  // Derive values from AnimationContext
  const introPhase = intro.phase;
  // Use new visibility flag that accounts for initialization AND idle phase
  const windowVisible = visibility.windowVisible;

  // shouldShowIntro: true when intro overlay is visible (blocks interaction)
  // When skipped, overlay is gone so interaction should be allowed
  const shouldShowIntro = loadMode === "intro" && intro.phase !== "complete" && !intro.wasSkipped;

  // Handle skip completion: when intro is skipped, IntroSequence unmounts but phase stays at "expanding".
  // After expanding animations complete, dispatch INTRO_COMPLETE to finalize state.
  useEffect(() => {
    if (intro.wasSkipped && intro.phase === "expanding") {
      const timer = setTimeout(() => {
        dispatch({ type: "INTRO_COMPLETE" });
      }, EXPANDING_DURATION * 1000); // Convert seconds to ms
      return () => clearTimeout(timer);
    }
  }, [intro.wasSkipped, intro.phase, dispatch]);

  // Window animation timing based on animationMode
  const getWindowTransition = () => {
    // Hiding: quick fade
    if (!windowVisible) {
      return {
        opacity: { type: "tween" as const, duration: HIDE_DURATION },
        scale: { type: "tween" as const, duration: HIDE_DURATION },
      };
    }
    // Showing: timing depends on mode
    switch (animationMode) {
      case "instant":
        // No animation
        return { duration: 0 };
      case "refresh":
        // Refresh: scale up with standard timing
        return {
          opacity: { duration: 0 },
          scale: { ...MAIN_CONTENT_TWEEN, delay: MAIN_CONTENT_DELAY },
        };
      case "skip":
        // Skip: same as refresh (window scales up while content waits)
        return {
          opacity: { duration: 0 },
          scale: { ...MAIN_CONTENT_TWEEN, delay: MAIN_CONTENT_DELAY },
        };
      case "route":
        // Route: no window animation (already visible)
        return { duration: 0 };
      case "intro":
      default:
        // Intro: standard scale-up timing
        return {
          opacity: { duration: 0 },
          scale: { ...MAIN_CONTENT_TWEEN, delay: MAIN_CONTENT_DELAY },
        };
    }
  };

  // Fullscreen mode: no bars, no gaps, content fills viewport
  const isFullscreen = layoutMode === "full";

  // In fullscreen mode, main window is always active (it's the only visible window)
  // In other modes, respect user interaction state
  const effectiveActiveWindow = isFullscreen ? "main" : activeWindow;

  // Layout toggle button visibility:
  // - Mobile: always visible (toggle between full and boxed), hidden when drawer is open
  // - Desktop: only visible as escape hatch if "full" mode inherited (e.g., from mobile session
  //   or viewport resize). Desktop can't enter fullscreen via ThemeControl, but needs a way out.
  const showLayoutToggle = isMobile ? !isDrawerOpen : isFullscreen && !isDrawerOpen;

  const toggleLayoutMode = () => {
    setLayoutMode(isFullscreen ? "boxed" : "full");
  };

  // Apply max-width only in "boxed" mode (wide and full modes have no max-width constraint)
  const containerMaxWidth = layoutMode === "boxed" ? windowContainerMaxWidth : undefined;

  // In fullscreen mode: no padding/gap; otherwise use standard windowGap
  const layoutPadding = isFullscreen ? 0 : windowGap;
  const layoutGap = isFullscreen ? 0 : windowGap;

  return (
    <>
      {/* Three-window layout - fixed viewport, content scrolls inside */}
      {/* h-dvh uses dynamic viewport height, accounting for mobile browser chrome */}
      {/* Clicking gap areas (outside windows) resets active state */}
      {/* inert: prevents keyboard/screen reader interaction while intro overlay is active */}
      <div
        className="mx-auto h-dvh w-full flex flex-col"
        style={{ padding: `${layoutPadding}px`, gap: `${layoutGap}px`, maxWidth: containerMaxWidth }}
        onPointerDown={() => setActiveWindow(null)}
        inert={shouldShowIntro || undefined}
      >
        {/* Top bar - visually hidden in fullscreen mode (kept mounted so drawer can stay open) */}
        <TopBar
          isActive={effectiveActiveWindow === "top"}
          onActivate={() => setActiveWindow("top")}
          className={isFullscreen ? "hidden" : undefined}
        />

        {/* Main content window - fills remaining space, content scrolls inside */}
        {/* Animated entrance: scales up from center. Timing varies by animationMode. */}
        {/* Always use initial: {hidden} so animation works on all scenarios (intro, refresh, etc.) */}
        <motion.div
          className="flex-1 min-h-0 flex flex-col"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: windowVisible ? 1 : 0,
            scale: windowVisible ? 1 : 0,
          }}
          transition={getWindowTransition()}
          style={{ transformOrigin: "center" }}
        >
          <WindowContainer
            windowId="main"
            className="flex-1 min-h-0 flex flex-col"
            isActive={effectiveActiveWindow === "main"}
            onActivate={() => setActiveWindow("main")}
          >
            {children}
          </WindowContainer>
        </motion.div>

        {/* Footer bar - visually hidden in fullscreen mode */}
        {/* During morph: uses layoutId to morph from CommandWindow shadow element */}
        {/* Pre-morph (including idle): render placeholder to hold space; actual element mounts on morph for layoutId to work */}
        {/* On retrigger: quick fade out via exit animation (no reverse morph) */}
        <AnimatePresence mode="wait">
          {!windowVisible ? (
            <motion.div
              key="footer-placeholder"
              style={{ height: DEFAULT_LAYOUT_TOKENS.footerHeight, flexShrink: 0 }}
              aria-hidden="true"
            />
          ) : (
            <motion.div
              key="footer-actual"
              layoutId={introPhase === "morphing" ? "footer-window" : undefined}
              layout={introPhase === "morphing"}
              exit={{ opacity: 0, transition: { duration: HIDE_DURATION } }}
            >
              <FooterBar
                isActive={effectiveActiveWindow === "footer"}
                onActivate={() => setActiveWindow("footer")}
                className={isFullscreen ? "hidden" : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layout mode toggle button
          - Mobile: always visible, toggles between full and boxed
          - Desktop: only visible in fullscreen mode (exit button)
          - Position: top-right of main content area (accounts for TopBar in boxed mode) */}
      {showLayoutToggle && (
        <button
          type="button"
          onClick={toggleLayoutMode}
          aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
          className="fixed right-4 z-50 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-muted backdrop-blur-sm border border-border shadow-lg [-webkit-tap-highlight-color:transparent] outline-none hover:bg-popover/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          style={{ top: isFullscreen ? 16 : topBarHeight + windowGap + 16 }}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      )}

      {/* Intro animation overlay - renders above layout during animation
          Normal layout renders underneath as morph target for window transition */}
      <IntroSequence />
    </>
  );
}

/**
 * LayoutWrapper Component
 *
 * Orchestrates the TWM (Tiling Window Manager) three-window layout:
 * - WallpaperBackground: Full-viewport background behind everything
 * - TopBar: Fixed header with branding and theme controls
 * - Main content: Scrollable central window
 * - FooterBar: Fixed footer with social links
 *
 * Windows are separated by consistent gaps defined by the `windowGap` layout token.
 *
 * On touch devices, clicking/tapping a window makes it "active" with a highlighted border,
 * replacing the hover effect used on desktop.
 *
 * @example
 * ```tsx
 * <LayoutWrapper>
 *   <MainContent />
 * </LayoutWrapper>
 * ```
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { wallpaperSrc, wallpaperSrcHiRes } = useWallpaperContext();

  return (
    // AnimationProvider: centralized animation state (single source of truth)
    <AnimationProvider>
      {/* Signal for E2E tests to detect intro state */}
      <IntroStateSignal />

      {/* Background layer */}
      <WallpaperBackground imageSrc={wallpaperSrc} imageSrcHiRes={wallpaperSrcHiRes} />

      {/* LayoutGroup enables shared layoutId animations between TopBar and IntroSequence */}
      <LayoutGroup>
        <LayoutContent>{children}</LayoutContent>
      </LayoutGroup>
    </AnimationProvider>
  );
}
