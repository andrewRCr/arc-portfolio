"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/site";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useMediaQuery, PHONE_QUERY } from "@/hooks/useMediaQuery";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Navigation Component
 *
 * Responsive navigation that adapts to viewport:
 * - Phone (< 768px): Collapsed dropdown showing current page
 * - Tablet and above: Full horizontal navigation links
 *
 * Features:
 * - ALL CAPS navigation links
 * - Active state indicated by colored background
 * - Terminal-inspired minimal styling
 */
export function Navigation() {
  const pathname = usePathname();
  const isPhone = useMediaQuery(PHONE_QUERY);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Phone: collapsed dropdown navigation
  if (isPhone) {
    return <MobileNavigation />;
  }

  const { navHeight } = DEFAULT_LAYOUT_TOKENS;

  // Tablet and above: full horizontal navigation
  return (
    <nav aria-label="Main navigation" className="flex items-center" style={{ minHeight: navHeight }}>
      {/* Navigation links - inline, no vertical stacking */}
      <ul className="flex gap-1 list-none items-center">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="min-h-11 lg:min-h-0 flex items-center"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`px-2 py-1 text-sm font-mono font-semibold leading-[1.2] transition-colors ${
                    active ? "text-foreground bg-secondary/20" : "text-muted-foreground hover:text-foreground"
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
}
