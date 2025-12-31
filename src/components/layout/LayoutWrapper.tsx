import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
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
  /** Optional wallpaper image path */
  wallpaperSrc?: string;
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
 * <LayoutWrapper wallpaperSrc="/wallpaper/abstract.webp">
 *   <MainContent />
 * </LayoutWrapper>
 * ```
 */
export function LayoutWrapper({ children, wallpaperSrc }: LayoutWrapperProps) {
  const { windowGap } = DEFAULT_LAYOUT_TOKENS;

  return (
    <>
      {/* Background layer */}
      <WallpaperBackground imageSrc={wallpaperSrc} />

      {/* Three-window layout */}
      <div className="min-h-screen flex flex-col" style={{ padding: `${windowGap}px`, gap: `${windowGap}px` }}>
        {/* Top bar - fixed height */}
        <TopBar />

        {/* Main content window - fills remaining space, scrollable */}
        <WindowContainer className="flex-1 flex flex-col overflow-auto">
          <main className="flex flex-col flex-1 p-4 md:p-6">{children}</main>
        </WindowContainer>

        {/* Footer bar - fixed height */}
        <FooterBar />
      </div>
    </>
  );
}
