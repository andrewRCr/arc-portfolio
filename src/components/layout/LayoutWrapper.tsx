"use client";

import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { TopBar } from "./TopBar";
import { FooterBar } from "./FooterBar";
import { WindowContainer } from "./WindowContainer";
import { WallpaperBackground } from "./WallpaperBackground";

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

  return (
    <>
      {/* Background layer */}
      <WallpaperBackground imageSrc={wallpaperSrc} />

      {/* Three-window layout - fixed viewport, content scrolls inside */}
      <div className="h-screen flex flex-col" style={{ padding: `${windowGap}px`, gap: `${windowGap}px` }}>
        {/* Top bar - fixed height */}
        <TopBar />

        {/* Main content window - fills remaining space, content scrolls inside */}
        <WindowContainer className="flex-1 min-h-0 flex flex-col">{children}</WindowContainer>

        {/* Footer bar - fixed height */}
        <FooterBar />
      </div>
    </>
  );
}
