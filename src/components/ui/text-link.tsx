/**
 * TextLink Component
 *
 * Inline text link with accent color styling. Uses full accent in light mode,
 * toned-down accent-high in dark mode. Underline appears on hover.
 */

import { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link destination */
  href: string;
  /** Open in new tab (default: true for external links) */
  external?: boolean;
}

export function TextLink({ href, external = true, className, children, ...props }: TextLinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a
      href={href}
      className={cn("text-accent dark:text-accent-high hover:underline", className)}
      {...props}
      {...externalProps}
    >
      {children}
    </a>
  );
}
