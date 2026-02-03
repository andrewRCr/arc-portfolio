import Link from "next/link";
import { motion } from "framer-motion";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { SITE } from "@/config/site";
import { useAnimationContext } from "@/contexts/AnimationContext";
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
  const { intro, visibility, reducedMotion } = useAnimationContext();

  // Derive values from AnimationContext
  const triggerReplay = intro.triggerReplay;
  const introPhase = intro.phase;
  // Use windowVisible which correctly handles idle phase (unlike legacy isHiddenUntilMorph)
  const windowVisible = visibility.windowVisible;

  // Apply layoutId during morph phase for shared element transition from CommandWindow
  const isMorphing = introPhase === "morphing";

  // Don't render during pre-morph intro (including idle) - keeps space with placeholder
  // This allows layoutId morph to work (TopBar "mounts" when CommandWindow "unmounts")
  // Also prevents flash of TopBar before intro overlay appears
  if (!windowVisible) {
    return <div className={className} style={{ height: topBarHeight, flexShrink: 0 }} aria-hidden="true" />;
  }

  return (
    <motion.div layoutId={isMorphing ? "topbar-window" : undefined} layout={isMorphing} className={className}>
      <WindowContainer windowId="top" isActive={isActive} onActivate={onActivate}>
        <header
          className="flex items-center justify-between px-4 mx-auto w-full"
          style={{ height: innerHeight, maxWidth: contentMaxWidth }}
        >
          {/* Branding - links to home. With reduced motion disabled, clicking also triggers replay. */}
          {/* On desktop hover (when replay available), shows "reinitialize" with blinking cursor */}
          {/* peer on TouchTarget so only branding hover triggers effects, not decorative elements */}
          {/* NOTE: underscore must be direct sibling of peer for peer-hover to work (not nested) */}
          <div className="flex items-center">
            <TouchTarget align="start" className="peer">
              <Link
                href="/"
                onClick={reducedMotion ? undefined : triggerReplay}
                className="flex items-center gap-2 text-foreground hover:text-accent-mid transition-colors"
              >
                <span className="font-title font-bold">{SITE.handle}</span>
              </Link>
            </TouchTarget>
            <span className="ml-3 text-primary font-terminal pointer-events-none">&gt;</span>
            {/* Underscore decoration - fades out on desktop hover when replay available */}
            {/* Must be direct sibling of peer (not nested) for peer-hover to work */}
            <span
              className={
                reducedMotion
                  ? "text-primary font-terminal"
                  : "text-primary font-terminal md:peer-hover:opacity-0 transition-opacity duration-200"
              }
            >
              _
            </span>
            {/* Hover hint - desktop only, hidden when reduced motion (no replay available) */}
            {!reducedMotion && (
              <span className="pointer-events-none hidden md:inline-flex md:items-baseline md:gap-1 md:opacity-0 md:peer-hover:opacity-100 transition-opacity duration-200 font-terminal text-foreground text-sm">
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
