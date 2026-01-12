"use client";

import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { TopBar } from "./TopBar";
import { FooterBar } from "./FooterBar";
import { WindowContainer } from "./WindowContainer";
import { WallpaperBackground } from "./WallpaperBackground";

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
  const { windowGap, windowContainerMaxWidth } = DEFAULT_LAYOUT_TOKENS;
  const { wallpaperSrc, wallpaperSrcHiRes } = useWallpaperContext();
  const { layoutMode, setLayoutMode, isDrawerOpen } = useLayoutPreferences();
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);

  // Fullscreen mode: no bars, no gaps, content fills viewport
  const isFullscreen = layoutMode === "full";

  // Show exit button only in fullscreen when drawer is closed
  const showExitButton = isFullscreen && !isDrawerOpen;

  const exitFullscreen = () => {
    setLayoutMode("boxed"); // Return to default mobile layout
  };

  // Apply max-width only in "boxed" mode (wide and full modes have no max-width constraint)
  const containerMaxWidth = layoutMode === "boxed" ? windowContainerMaxWidth : undefined;

  // In fullscreen mode: no padding/gap; otherwise use standard windowGap
  const layoutPadding = isFullscreen ? 0 : windowGap;
  const layoutGap = isFullscreen ? 0 : windowGap;

  return (
    <>
      {/* Background layer */}
      <WallpaperBackground imageSrc={wallpaperSrc} imageSrcHiRes={wallpaperSrcHiRes} />

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
          isActive={activeWindow === "top"}
          onActivate={() => setActiveWindow("top")}
          className={isFullscreen ? "hidden" : undefined}
        />

        {/* Main content window - fills remaining space, content scrolls inside */}
        <WindowContainer
          windowId="main"
          className="flex-1 min-h-0 flex flex-col"
          isActive={activeWindow === "main"}
          onActivate={() => setActiveWindow("main")}
        >
          {children}
        </WindowContainer>

        {/* Footer bar - visually hidden in fullscreen mode */}
        <FooterBar
          isActive={activeWindow === "footer"}
          onActivate={() => setActiveWindow("footer")}
          className={isFullscreen ? "hidden" : undefined}
        />
      </div>

      {/* Exit fullscreen button - visible in fullscreen mode when drawer is closed */}
      {showExitButton && (
        <button
          type="button"
          onClick={exitFullscreen}
          aria-label="Exit fullscreen mode"
          className="fixed top-4 right-4 z-50 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg [-webkit-tap-highlight-color:transparent] outline-none hover:bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Minimize2 className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
