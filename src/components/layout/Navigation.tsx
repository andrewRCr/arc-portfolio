"use client";

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
 */
export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const { navHeight } = DEFAULT_LAYOUT_TOKENS;

  const desktopNav = (
    <nav aria-label="Main navigation" className="flex items-center" style={{ minHeight: navHeight }}>
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

  return <ResponsiveSwitch mobile={<MobileNavigation />} desktop={desktopNav} />;
}
