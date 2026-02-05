"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/config/site";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * MobileNavigation Component
 *
 * Collapsed navigation for phone viewports (< 768px).
 * Displays current page with dropdown to navigate to other pages.
 *
 * Features:
 * - Trigger styled to match desktop nav items (no border, same font/padding)
 * - ChevronDown indicator for expandable state
 * - Dropdown items are navigation links
 * - Active page highlighted in dropdown
 */
export function MobileNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Find current page label
  const currentItem = NAV_ITEMS.find((item) => isActive(item.href));
  const currentLabel = currentItem?.label ?? "MENU";
  const { navHeight } = DEFAULT_LAYOUT_TOKENS;

  return (
    <nav aria-label="Main navigation" className="flex items-center" style={{ minHeight: navHeight }}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          data-mobile-nav
          className="flex items-center gap-1 px-2 py-1 text-sm font-terminal font-semibold leading-[1.2] text-foreground bg-secondary-low outline-none"
          aria-label={`Navigation menu, current page: ${currentLabel}`}
        >
          {currentLabel}
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[120px]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "w-full font-terminal font-semibold text-sm",
                    active ? "text-foreground bg-secondary-low" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
