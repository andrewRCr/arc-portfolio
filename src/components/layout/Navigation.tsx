"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/site";

/**
 * Navigation Component
 *
 * Minimal terminal-inspired navigation with:
 * - Branding text
 * - ALL CAPS navigation links
 * - Active state indicated by colored background
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

  return (
    <nav>
      {/* Navigation links - inline, no vertical stacking */}
      <ul className="flex gap-1 list-none items-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`px-2 py-1 text-sm font-mono font-semibold leading-[1.2] transition-colors ${
                isActive(item.href) ? "text-foreground bg-secondary/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
