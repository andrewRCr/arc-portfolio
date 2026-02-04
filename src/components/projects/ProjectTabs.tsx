"use client";

/**
 * ProjectTabs component
 *
 * Provides tab interface for switching between Software, Games, and Mods project categories.
 * Uses query parameters (?tab=software, ?tab=games, or ?tab=mods) for shareable/linkable state.
 *
 * Implements WAI-ARIA Tabs pattern with arrow key navigation.
 * Features animated tab indicator that slides between tabs using CSS transitions.
 */

import { useRef, useLayoutEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";

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

  // Refs for focus management and indicator positioning
  const tabRefs = useRef<Map<TabValue, HTMLButtonElement | null>>(new Map());
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  // Get current tab from query param, default to 'software'
  const currentTab = searchParams.get("tab") as TabValue | null;

  // Validate and normalize tab value - only accept valid tab values
  const activeTab: TabValue = TABS.includes(currentTab as TabValue) ? (currentTab as TabValue) : "software";

  // Update indicator position directly via ref (bypasses React state)
  // Uses offsetLeft/offsetWidth instead of getBoundingClientRect - works during Suspense hydration
  const updateIndicator = useCallback(() => {
    const activeButton = tabRefs.current.get(activeTab);
    const indicator = indicatorRef.current;
    if (!activeButton || !indicator) return;

    // offsetWidth works during hydration when getBoundingClientRect returns 0
    const width = activeButton.offsetWidth;
    const left = activeButton.offsetLeft;

    if (width > 0) {
      indicator.style.left = `${left}px`;
      indicator.style.width = `${width}px`;
    }
  }, [activeTab]);

  // Update on mount and when active tab changes
  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Update on resize
  useLayoutEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleTabChange = (tab: TabValue) => {
    // Update URL with query parameter (scroll: false - we handle scroll manually)
    router.push(`${pathname}?tab=${tab}`, { scroll: false });
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
            className={`relative min-h-11 lg:min-h-0 px-3 pb-2 pt-3 font-terminal text-sm font-semibold transition-colors ${
              activeTab === tab ? "text-accent dark:text-accent-high" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
        {/* Tab indicator - CSS transition for smooth sliding */}
        <div
          ref={indicatorRef}
          data-tab-indicator
          className="pointer-events-none absolute bottom-0 z-10 h-0.5 bg-accent-high"
          style={{
            transition: shouldReduceMotion ? "none" : "left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}
