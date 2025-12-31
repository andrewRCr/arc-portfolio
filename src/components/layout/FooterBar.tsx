import { Github, Linkedin, Package, type LucideIcon } from "lucide-react";
import { contact } from "@/data/contact";
import type { SocialIcon } from "@/types/contact";
import { WindowContainer } from "./WindowContainer";

/**
 * Map of icon identifiers to lucide-react components.
 * Keys must match SocialIcon type from contact types.
 */
const iconMap: Record<SocialIcon, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  package: Package,
};

/**
 * FooterBar Component
 *
 * Minimal footer bar for the TWM (Tiling Window Manager) layout.
 * Features:
 * - Social links with icons (GitHub, LinkedIn, NexusMods)
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
export function FooterBar() {
  return (
    <WindowContainer>
      <footer className="flex items-center justify-between px-4 py-2">
        {/* Social Links */}
        <nav aria-label="Social links" className="flex items-center gap-3">
          {contact.socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            );
          })}
        </nav>

        {/* Attribution */}
        <span className="text-muted-foreground font-mono text-xs">{"</portfolio>"}</span>
      </footer>
    </WindowContainer>
  );
}
