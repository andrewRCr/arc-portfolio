/**
 * TextLink Component
 *
 * Inline text link with accent color styling. Uses full accent in light mode,
 * toned-down accent-high in dark mode. Underline appears on hover and keyboard focus.
 */

import { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link destination */
  href: string;
  /** Open in new tab. Defaults to auto-detect: internal paths (starting with /) open same-tab, others open new-tab. */
  external?: boolean;
}

export function TextLink({ href, external, className, children, ...props }: TextLinkProps) {
  const isExternal = external ?? !href.startsWith("/");
  const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a
      href={href}
      className={cn("text-accent dark:text-accent-high hover:underline focus-visible:underline", className)}
      {...props}
      {...externalProps}
    >
      {children}
    </a>
  );
}
