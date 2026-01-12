import Link from "next/link";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { SITE } from "@/config/site";
import { WindowContainer } from "./WindowContainer";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeControl, ThemeControlDrawer } from "../theme";
import { TouchTarget } from "../ui/TouchTarget";
import { ResponsiveSwitch } from "../ui/ResponsiveSwitch";

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
 * - Theme controls on the right (ThemeControl dropdown + ThemeToggle)
 * - Wrapped in WindowContainer for consistent TWM styling
 *
 * @example
 * ```tsx
 * <TopBar />
 * ```
 */
export function TopBar({ isActive, onActivate }: TopBarProps) {
  const { windowBorderWidth, contentMaxWidth, topBarHeight } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = topBarHeight - windowBorderWidth * 2;

  return (
    <WindowContainer windowId="top" isActive={isActive} onActivate={onActivate}>
      <header
        className="flex items-center justify-between px-4 mx-auto w-full"
        style={{ height: innerHeight, maxWidth: contentMaxWidth }}
      >
        {/* Branding - links to home */}
        <div className="flex items-center gap-3">
          <TouchTarget align="start">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-foreground font-mono font-bold">{SITE.handle}</span>
            </Link>
          </TouchTarget>
          <span className="text-primary font-mono">&gt;_</span>
        </div>

        {/* Theme controls - responsive: drawer on mobile, popover + toggle on desktop */}
        <div data-testid="theme-controls" className="flex items-center">
          <ResponsiveSwitch
            display="flex"
            className="items-center gap-1"
            mobile={<ThemeControlDrawer />}
            desktop={
              <>
                <TouchTarget>
                  <ThemeControl />
                </TouchTarget>
                <TouchTarget align="end">
                  <ThemeToggle />
                </TouchTarget>
              </>
            }
          />
        </div>
      </header>
    </WindowContainer>
  );
}
