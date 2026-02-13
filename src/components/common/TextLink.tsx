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
  /** Open in new tab. Defaults to auto-detect: relative/hash/query links open same-tab, absolute URLs open new-tab. */
  external?: boolean;
}

/** External if protocol-relative (//) or has a URI scheme (http:, mailto:, etc.) */
function isExternalHref(href: string): boolean {
  return href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(href);
}

export function TextLink({ href, external, className, children, ...props }: TextLinkProps) {
  const isExternal = external ?? isExternalHref(href);
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
