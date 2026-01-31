"use client";

/**
 * ProjectTabs component
 *
 * Provides tab interface for switching between Software, Games, and Mods project categories.
 * Uses query parameters (?tab=software, ?tab=games, or ?tab=mods) for shareable/linkable state.
 *
 * Implements WAI-ARIA Tabs pattern with arrow key navigation.
 * Features animated tab indicator that slides between tabs using Framer Motion layoutId.
 */

import { useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { TAB_INDICATOR_TRANSITION } from "@/lib/animation-timing";

type TabValue = "software" | "games" | "mods";

const TABS: TabValue[] = ["software", "games", "mods"];

const TAB_LABELS: Record<TabValue, string> = {
  software: "SOFTWARE",
  games: "GAMES",
  mods: "MODS",
};

export default function ProjectTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  // Refs for focus management
  const tabRefs = useRef<Map<TabValue, HTMLButtonElement | null>>(new Map());

  // Get current tab from query param, default to 'software'
  const currentTab = searchParams.get("tab") as TabValue | null;

  // Validate and normalize tab value - only accept valid tab values
  const activeTab: TabValue = TABS.includes(currentTab as TabValue) ? (currentTab as TabValue) : "software";

  const handleTabChange = (tab: TabValue) => {
    // Update URL with query parameter
    router.push(`${pathname}?tab=${tab}`);
  };

  const handleKeyDown = (tab: TabValue, event: React.KeyboardEvent) => {
    const currentIndex = TABS.indexOf(activeTab);
    let newIndex: number | null = null;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        // Wrap to end if at beginning
        newIndex = currentIndex === 0 ? TABS.length - 1 : currentIndex - 1;
        break;
      case "ArrowRight":
        event.preventDefault();
        // Wrap to beginning if at end
        newIndex = currentIndex === TABS.length - 1 ? 0 : currentIndex + 1;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = TABS.length - 1;
        break;
      case "Enter":
      case " ":
        // Activate the focused tab (explicit handling for test compatibility)
        event.preventDefault();
        handleTabChange(tab);
        return;
      default:
        return;
    }

    if (newIndex !== null) {
      const newTab = TABS[newIndex];
      handleTabChange(newTab);
      // Focus the new tab
      tabRefs.current.get(newTab)?.focus();
    }
  };

  return (
    <div className="mx-4 flex justify-center sm:block">
      <div
        role="tablist"
        aria-label="Project categories"
        className="relative inline-flex min-h-11 items-end gap-2 sm:flex sm:w-full after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-border/50 after:via-border/50 after:via-95% after:to-transparent"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current.set(tab, el);
            }}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => handleTabChange(tab)}
            onKeyDown={(e) => handleKeyDown(tab, e)}
            className={`relative min-h-11 lg:min-h-0 px-3 pb-2 pt-3 font-mono text-sm font-semibold transition-colors ${
              activeTab === tab ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[tab]}
            {/* Animated tab indicator - slides between tabs via layoutId */}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                data-tab-indicator
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                transition={shouldReduceMotion ? { duration: 0 } : TAB_INDICATOR_TRANSITION}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
