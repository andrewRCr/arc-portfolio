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
  const { triggerReplay, introPhase, shouldShow } = useIntroContext();

  // During intro (before morph), don't render TopBar - this allows layoutId morph to work
  // The morph requires TopBar to "mount" when CommandWindow "unmounts"
  const isPreMorphIntro = shouldShow && introPhase !== "morphing" && introPhase !== "idle";

  // Apply layoutId during morph phase for shared element transition from CommandWindow
  const isMorphing = introPhase === "morphing";

  // Don't render during pre-morph intro - keeps space with placeholder
  if (isPreMorphIntro) {
    return (
      <div
        className={className}
        style={{ height: topBarHeight, flexShrink: 0 }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      layoutId={isMorphing ? "topbar-window" : undefined}
      layout={isMorphing}
    >
      <WindowContainer windowId="top" isActive={isActive} onActivate={onActivate} className={className}>
      <header
        className="flex items-center justify-between px-4 mx-auto w-full"
        style={{ height: innerHeight, maxWidth: contentMaxWidth }}
      >
        {/* Branding - links to home */}
        {/* Branding - links to home, clicking triggers intro animation replay */}
        <div className="flex items-center gap-3">
          <TouchTarget align="start">
            <Link
              href="/"
              onClick={triggerReplay}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
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
    </motion.div>
  );
}
