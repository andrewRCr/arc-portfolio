"use client";

/**
 * ExternalLinksToolbar Component
 *
 * Bordered box with "Links" label and icon buttons for external project links.
 * Used in project detail headers (desktop) and below banner (mobile).
 *
 * Variants:
 * - desktop: 40px buttons, no internal borders (DetailHeaderDesktop)
 * - touch: 44px touch targets with internal borders (mobile ProjectDetail)
 */

import { cn } from "@/lib/utils";
import { buildIconLinkItems } from "./utils/buildLinkItems";
import type { ProjectLinks } from "@/types/project";
import type { ReactNode } from "react";

type ToolbarVariant = "desktop" | "touch";

interface ExternalLinksToolbarProps {
  /** Project links to display */
  links?: ProjectLinks;
  /** Size variant */
  variant?: ToolbarVariant;
  /** Stretch to full width (label left, icons right) */
  fullWidth?: boolean;
  /** Custom label text (defaults to "Links") */
  label?: string;
  /** Custom label content (overrides label prop) */
  labelContent?: ReactNode;
  /** Maximum number of links to show (useful for mobile) */
  maxLinks?: number;
  /** Additional class names for the container */
  className?: string;
}

const variantStyles: Record<ToolbarVariant, { size: string; iconSize: number; showDividers: boolean }> = {
  desktop: {
    size: "h-10 w-10",
    iconSize: 18,
    showDividers: false,
  },
  touch: {
    size: "h-9 w-9",
    iconSize: 18,
    showDividers: true,
  },
};

export function ExternalLinksToolbar({
  links,
  variant = "desktop",
  fullWidth = false,
  label = "Links",
  labelContent,
  maxLinks,
  className,
}: ExternalLinksToolbarProps) {
  const allLinks = buildIconLinkItems(links);
  const iconLinks = maxLinks ? allLinks.slice(0, maxLinks) : allLinks;

  if (iconLinks.length === 0) {
    return null;
  }

  const styles = variantStyles[variant];
  const isDefaultLabel = !labelContent && label === "Links";

  return (
    <div
      data-testid="header-links"
      className={cn("items-stretch border border-border", fullWidth ? "flex" : "inline-flex", className)}
    >
      <div
        className={cn(
          "flex items-center bg-muted px-3",
          isDefaultLabel && "font-terminal text-xs text-muted-foreground uppercase tracking-wider",
          fullWidth && "flex-1"
        )}
      >
        {labelContent ?? label}
      </div>
      <div className="flex bg-background">
        {iconLinks.map((link, index) => {
          const Icon = link.icon;
          const isLast = index === iconLinks.length - 1;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className={cn(
                "flex items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                styles.size,
                styles.showDividers && !isLast && "border-r border-border"
              )}
            >
              <Icon size={styles.iconSize} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
