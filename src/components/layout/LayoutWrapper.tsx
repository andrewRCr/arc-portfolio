"use client";

import { useState } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { LayoutGroup } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { IntroProvider } from "@/contexts/IntroContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TopBar } from "./TopBar";
import { FooterBar } from "./FooterBar";
import { WindowContainer } from "./WindowContainer";
import { WallpaperBackground } from "./WallpaperBackground";
import { IntroSequence } from "@/components/intro";

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
  const { windowGap, windowContainerMaxWidth, topBarHeight } = DEFAULT_LAYOUT_TOKENS;
  const { wallpaperSrc, wallpaperSrcHiRes } = useWallpaperContext();
  const { layoutMode, setLayoutMode, isDrawerOpen } = useLayoutPreferences();
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const isMobile = useIsMobile();

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
    <IntroProvider>
      {/* Background layer */}
      <WallpaperBackground imageSrc={wallpaperSrc} imageSrcHiRes={wallpaperSrcHiRes} />

      {/* LayoutGroup enables shared layoutId animations between TopBar and IntroSequence */}
      <LayoutGroup>
        {/* Three-window layout - fixed viewport, content scrolls inside */}
        {/* h-dvh uses dynamic viewport height, accounting for mobile browser chrome */}
        {/* Clicking gap areas (outside windows) resets active state */}
        <div
          className="mx-auto h-dvh w-full flex flex-col"
          style={{ padding: `${layoutPadding}px`, gap: `${layoutGap}px`, maxWidth: containerMaxWidth }}
          onPointerDown={() => setActiveWindow(null)}
        >
          {/* Top bar - visually hidden in fullscreen mode (kept mounted so drawer can stay open) */}
          <TopBar
            isActive={effectiveActiveWindow === "top"}
            onActivate={() => setActiveWindow("top")}
            className={isFullscreen ? "hidden" : undefined}
          />

        {/* Main content window - fills remaining space, content scrolls inside */}
        <WindowContainer
          windowId="main"
          className="flex-1 min-h-0 flex flex-col"
          isActive={effectiveActiveWindow === "main"}
          onActivate={() => setActiveWindow("main")}
        >
          {children}
        </WindowContainer>

        {/* Footer bar - visually hidden in fullscreen mode */}
        <FooterBar
          isActive={effectiveActiveWindow === "footer"}
          onActivate={() => setActiveWindow("footer")}
          className={isFullscreen ? "hidden" : undefined}
        />
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
      </LayoutGroup>
    </IntroProvider>
  );
}
