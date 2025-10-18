"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "PROJECTS", href: "/projects" },
    { label: "SKILLS", href: "/skills" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-background">
      {/* Navigation links - inline, no vertical stacking */}
      <ul className="flex gap-1 list-none items-center">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`px-4 py-2 text-sm font-mono font-semibold transition-colors rounded ${
                isActive(item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
