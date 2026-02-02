import Link from "next/link";
import { Github, Linkedin, type LucideIcon } from "lucide-react";
import { contact } from "@/data/contact";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import type { SocialIcon } from "@/types/contact";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";
import { ObfuscatedMailtoIcon } from "@/components/contact/ObfuscatedMailtoIcon";
import { encodeEmail } from "@/lib/email-utils";
import { WindowContainer } from "./WindowContainer";
import { TouchTarget } from "@/components/ui/TouchTarget";

/** Icon component type that accepts size prop */
type IconComponent = LucideIcon | typeof NexusModsIcon;

/**
 * Map of icon identifiers to icon components.
 * Keys must match SocialIcon type from contact types.
 * Note: Email is handled separately via ObfuscatedMailtoIcon for scraper protection.
 */
const iconMap: Partial<Record<SocialIcon, IconComponent>> = {
  github: Github,
  linkedin: Linkedin,
  nexusmods: NexusModsIcon,
};

export interface FooterBarProps {
  /** Whether this window is currently active (for touch devices) */
  isActive?: boolean;
  /** Callback when window is activated (clicked/tapped) */
  onActivate?: () => void;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * FooterBar Component
 *
 * Minimal footer bar for the TWM (Tiling Window Manager) layout.
 * Features:
 * - Social/contact links with icons (Email [obfuscated], GitHub, LinkedIn, NexusMods)
 * - Dev-only debug page links (theme, typography)
 * - Attribution text
 * - Wrapped in WindowContainer for consistent TWM styling
 *
 * Social links are sourced from contact data (single source of truth).
 *
 * @example
 * ```tsx
 * <FooterBar />
 * ```
 */
export function FooterBar({ isActive, onActivate, className }: FooterBarProps) {
  const { windowBorderWidth, contentMaxWidth, footerHeight } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = footerHeight - windowBorderWidth * 2;
  const isDev = process.env.NODE_ENV === "development";

  return (
    <WindowContainer windowId="footer" isActive={isActive} onActivate={onActivate} className={className}>
      <footer
        className="flex items-center justify-between px-4 mx-auto w-full"
        style={{ height: innerHeight, maxWidth: contentMaxWidth }}
      >
        {/* Social Links */}
        <nav aria-label="Social links" className="flex items-center gap-1">
          {/* Email - obfuscated for scraper protection */}
          <TouchTarget>
            <ObfuscatedMailtoIcon encoded={encodeEmail(contact.email)} />
          </TouchTarget>

          {/* Other social links */}
          {contact.socialLinks
            .filter((link) => iconMap[link.icon])
            .map((link) => {
              const Icon = iconMap[link.icon]!;
              return (
                <TouchTarget key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    title={link.platform}
                    className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                </TouchTarget>
              );
            })}
        </nav>

        {/* Right side: Dev links (dev-only) + Attribution */}
        <div className="flex items-center gap-3">
          {isDev && (
            <nav aria-label="Developer tools" className="hidden md:flex items-center gap-2 font-terminal text-xs">
              <span className="text-muted-foreground">dev:</span>
              <Link href="/dev/theme-debug" className="text-accent hover:text-accent/80 transition-colors">
                [theme]
              </Link>
              <Link href="/dev/typography" className="text-accent hover:text-accent/80 transition-colors">
                [type]
              </Link>
              <Link href="/dev/wallpaper-test" className="text-accent hover:text-accent/80 transition-colors">
                [wallpaper]
              </Link>
              <Link href="/dev/sandbox" className="text-accent hover:text-accent/80 transition-colors">
                [sandbox]
              </Link>
            </nav>
          )}

          {/* Attribution */}
          <span className="text-muted-foreground font-terminal text-xs">{"</portfolio>"}</span>
        </div>
      </footer>
    </WindowContainer>
  );
}
