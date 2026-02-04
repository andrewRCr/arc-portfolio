"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/site";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Navigation Component
 *
 * Responsive navigation that adapts to viewport:
 * - Phone (< 768px): Collapsed dropdown showing current page
 * - Tablet and above: Full horizontal navigation links
 *
 * Uses ResponsiveSwitch for FOUC-free viewport switching via CSS media queries.
 *
 * Features:
 * - ALL CAPS navigation links
 * - Active state indicated by colored background
 * - Terminal-inspired minimal styling
 * - Pending state maintains hover effect while navigating (prevents flash)
 */
export function Navigation() {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  // State derivation pattern: reset pending state when pathname changes
  // Setting state during render (not in effect) is the React-recommended approach
  // See: https://react.dev/learn/you-might-not-need-an-effect
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (pendingHref !== null) {
      setPendingHref(null);
    }
  }

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const { navHeight } = DEFAULT_LAYOUT_TOKENS;

  const desktopNav = (
    <nav
      aria-label="Main navigation"
      data-testid="desktop-nav"
      className="flex items-center"
      style={{ minHeight: navHeight }}
    >
      <ul className="flex gap-1 list-none items-center">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const isPending = pendingHref === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="min-h-11 lg:min-h-0 flex items-center"
                aria-current={active ? "page" : undefined}
                onClick={() => !active && setPendingHref(item.href)}
              >
                <span
                  className={`px-2 py-1 text-sm font-terminal font-semibold leading-[1.2] transition-colors ${
                    active
                      ? "text-secondary-foreground bg-secondary-mid dark:text-foreground"
                      : isPending
                        ? "text-secondary-foreground bg-secondary-low dark:text-muted-foreground"
                        : "text-muted-foreground hover:text-secondary-foreground dark:hover:text-foreground hover:bg-secondary-low"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return <ResponsiveSwitch mobile={<MobileNavigation />} desktop={desktopNav} />;
}
