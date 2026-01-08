import Link from "next/link";
import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { contact } from "@/data/contact";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import type { SocialIcon } from "@/types/contact";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";
import { WindowContainer } from "./WindowContainer";
import { TouchTarget } from "@/components/ui/TouchTarget";

/** Icon component type that accepts size prop */
type IconComponent = LucideIcon | typeof NexusModsIcon;

/**
 * Map of icon identifiers to icon components.
 * Keys must match SocialIcon type from contact types.
 */
const iconMap: Record<SocialIcon, IconComponent> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  nexusmods: NexusModsIcon,
};

export interface FooterBarProps {
  /** Whether this window is currently active (for touch devices) */
  isActive?: boolean;
  /** Callback when window is activated (clicked/tapped) */
  onActivate?: () => void;
}

/**
 * FooterBar Component
 *
 * Minimal footer bar for the TWM (Tiling Window Manager) layout.
 * Features:
 * - Social/contact links with icons (Email, GitHub, LinkedIn, NexusMods)
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
export function FooterBar({ isActive, onActivate }: FooterBarProps) {
  const { windowBorderWidth, contentMaxWidth, footerHeight } = DEFAULT_LAYOUT_TOKENS;
  const innerHeight = footerHeight - windowBorderWidth * 2;
  const isDev = process.env.NODE_ENV === "development";

  return (
    <WindowContainer windowId="footer" isActive={isActive} onActivate={onActivate}>
      <footer
        className="flex items-center justify-between px-4 mx-auto w-full"
        style={{ height: innerHeight, maxWidth: contentMaxWidth }}
      >
        {/* Social Links */}
        <nav aria-label="Social links" className="flex items-center gap-1">
          {contact.socialLinks.map((link, index) => {
            const Icon = iconMap[link.icon];
            const isExternal = !link.url.startsWith("mailto:");
            const isFirst = index === 0;
            return (
              <TouchTarget key={link.platform} align={isFirst ? "start" : "center"}>
                <a
                  href={link.url}
                  {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={link.platform}
                  title={link.platform}
                  className="flex items-center justify-center size-7 rounded-md border border-transparent hover:border-foreground/60 text-muted-foreground hover:text-foreground transition-all"
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
            <nav aria-label="Developer tools" className="hidden md:flex items-center gap-2 font-mono text-xs">
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
            </nav>
          )}

          {/* Attribution */}
          <span className="text-muted-foreground font-mono text-xs">{"</portfolio>"}</span>
        </div>
      </footer>
    </WindowContainer>
  );
}
