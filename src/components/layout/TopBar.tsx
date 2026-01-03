import Link from "next/link";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { SITE } from "@/config/site";
import { WindowContainer } from "./WindowContainer";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { WallpaperSwitcher } from "../WallpaperSwitcher";
import { TouchTarget } from "../ui/TouchTarget";

export interface TopBarProps {
  /** Whether this window is currently active (for touch devices) */
  isActive?: boolean;
  /** Callback when window is activated (clicked/tapped) */
  onActivate?: () => void;
}

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
export function TopBar({ isActive, onActivate }: TopBarProps = {}) {
  const { windowBorderWidth, topBarContentMaxWidth } = DEFAULT_LAYOUT_TOKENS;
  // Touch target evaluation: 48px total matches FooterBar for visual balance
  // Original: topBarHeight (42) - windowBorderWidth * 2 = 38px
  const innerHeight = 48 - windowBorderWidth * 2;

  return (
    <WindowContainer isActive={isActive} onActivate={onActivate}>
      <header
        className="flex items-center justify-between px-4 mx-auto w-full"
        style={{ height: innerHeight, maxWidth: topBarContentMaxWidth }}
      >
        {/* Branding - links to home */}
        <div className="flex items-center gap-3">
          <Link href="/" className="min-h-11 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-foreground font-mono font-bold">{SITE.handle}</span>
          </Link>
          <span className="text-primary font-mono">&gt;_</span>
        </div>

        {/* Theme controls - temporary until ThemePicker is implemented */}
        <div data-testid="theme-controls-placeholder" className="flex items-center">
          <TouchTarget>
            <WallpaperSwitcher />
          </TouchTarget>
          <TouchTarget>
            <ThemeSwitcher />
          </TouchTarget>
          <TouchTarget>
            <ThemeToggle />
          </TouchTarget>
        </div>
      </header>
    </WindowContainer>
  );
}
