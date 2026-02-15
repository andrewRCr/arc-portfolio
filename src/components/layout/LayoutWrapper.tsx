"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import {
  getWindowTransition,
  HIDE_DURATION,
  EXPANDING_DURATION,
  LAYOUT_MODE_DURATION_DESKTOP,
  LAYOUT_MODE_DURATION_MOBILE,
} from "@/lib/animation-timing";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { AnimationProvider, useAnimationContext, useAnimationDispatch } from "@/contexts/AnimationContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TopBar } from "./TopBar";
import { FooterBar } from "./FooterBar";
import { WindowContainer } from "./WindowContainer";
import { LayoutModeToggle } from "./LayoutModeToggle";
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
  /** First visit (no intro cookie) — defers wallpaper loading priority so CSS paints faster */
  isFirstVisit?: boolean;
}

/**
 * Inner layout component that renders inside AnimationProvider.
 * Handles intro-aware animation of main content and footer.
 */
function LayoutContent({ children }: LayoutWrapperProps) {
  const { windowGap, windowContainerMaxWidth, topBarHeight, footerHeight } = DEFAULT_LAYOUT_TOKENS;
  const { layoutMode, setLayoutMode } = useLayoutPreferences();
  const { loadMode, animationMode, intro, visibility, reducedMotion, isInitialized } = useAnimationContext();
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

  // Reset layout mode to boxed when intro plays to ensure bars are visible for morph animation.
  // Handles edge case: user in fullscreen mode, intro cookie expires, user revisits site.
  // Without this, TopBar/FooterBar would be at height=0, breaking the morph animation.
  // Note: Must check isInitialized to avoid race condition where loadMode defaults to "intro"
  // before cookie check completes.
  useEffect(() => {
    if (
      isInitialized &&
      loadMode === "intro" &&
      intro.phase !== "complete" &&
      !intro.wasSkipped &&
      layoutMode !== "boxed"
    ) {
      setLayoutMode("boxed");
    }
  }, [isInitialized, loadMode, intro.phase, intro.wasSkipped, layoutMode, setLayoutMode]);

  // Timing logic centralized in animation-timing.ts (SRP compliance)
  const windowTransition = getWindowTransition(animationMode, windowVisible);

  // Fullscreen mode: no bars, no gaps, content fills viewport
  const isFullscreen = layoutMode === "full";

  // In fullscreen mode, main window is always active (it's the only visible window)
  // In other modes, respect user interaction state
  const effectiveActiveWindow = isFullscreen ? "main" : activeWindow;

  // Apply max-width in "boxed" mode, use 100% for wide/full (enables CSS transition interpolation)
  const containerMaxWidth = layoutMode === "boxed" ? windowContainerMaxWidth : "100%";

  // In fullscreen mode: no padding/gap; otherwise use standard windowGap
  const layoutPadding = isFullscreen ? 0 : windowGap;
  const layoutGap = isFullscreen ? 0 : windowGap;

  // Fullscreen bar animation: synced with container transition, disabled for reduced motion
  const fullscreenBarDuration = reducedMotion
    ? 0
    : isMobile
      ? LAYOUT_MODE_DURATION_MOBILE
      : LAYOUT_MODE_DURATION_DESKTOP;

  return (
    <>
      {/* Three-window layout - fixed viewport, content scrolls inside */}
      {/* h-dvh uses dynamic viewport height, accounting for mobile browser chrome */}
      {/* Clicking gap areas (outside windows) resets active state */}
      {/* inert: prevents keyboard/screen reader interaction while intro overlay is active */}
      <div
        className="mx-auto h-dvh w-full flex flex-col transition-[padding,gap,max-width] ease-in-out motion-reduce:transition-none"
        style={{
          padding: `${layoutPadding}px`,
          gap: `${layoutGap}px`,
          maxWidth: containerMaxWidth,
          transitionDuration: reducedMotion
            ? "0s"
            : `${isMobile ? LAYOUT_MODE_DURATION_MOBILE : LAYOUT_MODE_DURATION_DESKTOP}s`,
        }}
        onPointerDown={() => setActiveWindow(null)}
        inert={shouldShowIntro || undefined}
      >
        {/* TopBar wrapper - animates height for fullscreen mode (isolated from intro animation)
            Note: opacity intentionally NOT animated here — animating opacity on a parent of
            backdrop-blur causes the blur to snap on/off instead of transitioning smoothly.
            Height + overflow:hidden provides a clean clip reveal without the blur artifact. */}
        <motion.div
          animate={{ height: isFullscreen ? 0 : topBarHeight }}
          transition={{ duration: fullscreenBarDuration, ease: "easeInOut" }}
          style={{ overflow: "hidden", flexShrink: 0 }}
        >
          <TopBar isActive={effectiveActiveWindow === "top"} onActivate={() => setActiveWindow("top")} />
        </motion.div>

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
          transition={windowTransition}
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

        {/* FooterBar wrapper - animates height/opacity for fullscreen mode (isolated from intro animation) */}
        {/* During morph: uses layoutId to morph from CommandWindow shadow element */}
        {/* Pre-morph (including idle): render placeholder to hold space; actual element mounts on morph for layoutId to work */}
        {/* On retrigger: quick fade out via exit animation (no reverse morph) */}
        <AnimatePresence mode="wait">
          {!windowVisible ? (
            <motion.div key="footer-placeholder" style={{ height: footerHeight, flexShrink: 0 }} aria-hidden="true" />
          ) : (
            <motion.div
              key="footer-actual"
              layoutId={introPhase === "morphing" ? "footer-window" : undefined}
              layout={introPhase === "morphing"}
              animate={{ height: isFullscreen ? 0 : footerHeight }}
              transition={{ duration: fullscreenBarDuration, ease: "easeInOut" }}
              exit={{ opacity: 0, transition: { duration: HIDE_DURATION } }}
              style={{ overflow: "hidden", flexShrink: 0 }}
            >
              <FooterBar isActive={effectiveActiveWindow === "footer"} onActivate={() => setActiveWindow("footer")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LayoutModeToggle />

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
export function LayoutWrapper({ children, isFirstVisit }: LayoutWrapperProps) {
  const { wallpaperSrc, wallpaperSrcHiRes, wallpaperSrcMobile } = useWallpaperContext();

  return (
    // AnimationProvider: centralized animation state (single source of truth)
    <AnimationProvider>
      {/* Signal for E2E tests to detect intro state */}
      <IntroStateSignal />

      {/* Background layer */}
      <WallpaperBackground
        imageSrc={wallpaperSrc}
        imageSrcHiRes={wallpaperSrcHiRes}
        imageSrcMobile={wallpaperSrcMobile}
        deferLoading={isFirstVisit}
      />

      {/* LayoutGroup enables shared layoutId animations between TopBar and IntroSequence */}
      <LayoutGroup>
        <LayoutContent>{children}</LayoutContent>
      </LayoutGroup>
    </AnimationProvider>
  );
}
