/**
 * TextLink Component
 *
 * Inline text link with accent color styling. Uses accent-mid by default,
 * accent-high on hover for clear interactive feedback without underline noise.
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
      className={cn("text-accent-high transition-colors hover:text-accent-mid", className)}
      {...props}
      {...externalProps}
    >
      {children}
    </a>
  );
}
