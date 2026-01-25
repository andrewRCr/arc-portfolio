import Link from "next/link";
import { motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { SITE } from "@/config/site";
import { useIntroContext } from "@/contexts/IntroContext";
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
  /** Additional CSS classes for the container */
  className?: string;
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
export function TopBar({ isActive, onActivate, className }: TopBarProps) {
  const { windowBorderWidth, contentMaxWidth, topBarHeight } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = topBarHeight - windowBorderWidth * 2;
  const { triggerReplay, introPhase, isHiddenUntilMorph, reducedMotion } = useIntroContext();

  // Apply layoutId during morph phase for shared element transition from CommandWindow
  const isMorphing = introPhase === "morphing";

  // Don't render during pre-morph intro - keeps space with placeholder
  // This allows layoutId morph to work (TopBar "mounts" when CommandWindow "unmounts")
  if (isHiddenUntilMorph) {
    return <div className={className} style={{ height: topBarHeight, flexShrink: 0 }} aria-hidden="true" />;
  }

  return (
    <motion.div layoutId={isMorphing ? "topbar-window" : undefined} layout={isMorphing}>
      <WindowContainer windowId="top" isActive={isActive} onActivate={onActivate} className={className}>
        <header
          className="flex items-center justify-between px-4 mx-auto w-full"
          style={{ height: innerHeight, maxWidth: contentMaxWidth }}
        >
          {/* Branding - links to home. With reduced motion disabled, clicking also triggers replay. */}
          {/* On desktop hover (when replay available), shows "reinitialize" with blinking cursor */}
          <div className="group flex items-center gap-3">
            <TouchTarget align="start">
              <Link
                href="/"
                onClick={reducedMotion ? undefined : triggerReplay}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-foreground font-mono font-bold">{SITE.handle}</span>
              </Link>
            </TouchTarget>
            <span className="text-primary font-mono">
              &gt;
              {/* Underscore decoration - fades out on desktop hover when replay available */}
              <span className={reducedMotion ? undefined : "md:group-hover:opacity-0 transition-opacity duration-200"}>
                _
              </span>
            </span>
            {/* Hover hint - desktop only, hidden when reduced motion (no replay available) */}
            {!reducedMotion && (
              <span className="hidden md:inline-flex md:items-baseline md:gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 font-mono text-foreground text-sm -ml-2">
                <span>reinitialize</span>
                <span className="inline-block w-1.5 h-3 bg-primary animate-blink translate-y-0.5" aria-hidden="true" />
              </span>
            )}
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
    </motion.div>
  );
}
