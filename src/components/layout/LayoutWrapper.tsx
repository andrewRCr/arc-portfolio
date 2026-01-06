"use client";

import { useState } from "react";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
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
  const { windowGap } = DEFAULT_LAYOUT_TOKENS;
  const { wallpaperSrc } = useWallpaperContext();
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);

  return (
    <>
      {/* Background layer */}
      <WallpaperBackground imageSrc={wallpaperSrc} />

      {/* Three-window layout - fixed viewport, content scrolls inside */}
      {/* h-dvh uses dynamic viewport height, accounting for mobile browser chrome */}
      {/* Clicking gap areas (outside windows) resets active state */}
      <div
        className="h-dvh flex flex-col"
        style={{ padding: `${windowGap}px`, gap: `${windowGap}px` }}
        onClick={() => setActiveWindow(null)}
      >
        {/* Top bar - fixed height */}
        <TopBar isActive={activeWindow === "top"} onActivate={() => setActiveWindow("top")} />

        {/* Main content window - fills remaining space, content scrolls inside */}
        <WindowContainer
          windowId="main"
          className="flex-1 min-h-0 flex flex-col"
          isActive={activeWindow === "main"}
          onActivate={() => setActiveWindow("main")}
        >
          {children}
        </WindowContainer>

        {/* Footer bar - fixed height */}
        <FooterBar isActive={activeWindow === "footer"} onActivate={() => setActiveWindow("footer")} />
      </div>
    </>
  );
}
