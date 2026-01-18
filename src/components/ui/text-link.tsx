/**
 * TextLink Component
 *
 * Inline text link with subtle underline styling. Underline is muted by default
 * and strengthens on hover for reduced visual noise in link-heavy content.
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
      className={cn("text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent", className)}
      {...props}
      {...externalProps}
    >
      {children}
    </a>
  );
}
