import Link from "next/link";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { WindowContainer } from "./WindowContainer";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { WallpaperSwitcher } from "../WallpaperSwitcher";

/**
 * TopBar Component
 *
 * Minimal header bar for the TWM (Tiling Window Manager) layout.
 * Features:
 * - Logo/branding on the left (links to home)
 * - Theme controls on the right (ThemeSwitcher + ThemeToggle)
 * - Wrapped in WindowContainer for consistent TWM styling
 *
 * @example
 * ```tsx
 * <TopBar />
 * ```
 */
export function TopBar() {
  const { topBarHeight, windowBorderWidth, topBarContentMaxWidth } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = topBarHeight - windowBorderWidth * 2;

  return (
    <WindowContainer>
      <header
        className="flex items-center justify-between px-4 mx-auto w-full"
        style={{ height: innerHeight, maxWidth: topBarContentMaxWidth }}
      >
        {/* Branding - links to home */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-foreground font-mono font-bold">andrewRCr</span>
          </Link>
          <span className="text-primary font-mono">&gt;_</span>
        </div>

        {/* Theme controls - temporary until ThemePicker is implemented */}
        <div data-testid="theme-controls-placeholder" className="flex items-center gap-3">
          <WallpaperSwitcher />
          <ThemeSwitcher />
          <ThemeToggle />
        </div>
      </header>
    </WindowContainer>
  );
}
