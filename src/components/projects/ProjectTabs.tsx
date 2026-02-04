"use client";

/**
 * ProjectTabs component
 *
 * Provides tab interface for switching between Software, Games, and Mods project categories.
 * Uses query parameters (?tab=software, ?tab=games, or ?tab=mods) for shareable/linkable state.
 *
 * Implements WAI-ARIA Tabs pattern with arrow key navigation.
 * Features animated tab indicator that slides between tabs.
 */

import { useRef, useState, useEffect, useCallback } from "react";
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

  // Refs for focus management and position measurement
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<TabValue, HTMLButtonElement | null>>(new Map());

  // Indicator position state
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Get current tab from query param, default to 'software'
  const currentTab = searchParams.get("tab") as TabValue | null;

  // Validate and normalize tab value - only accept valid tab values
  const activeTab: TabValue = TABS.includes(currentTab as TabValue) ? (currentTab as TabValue) : "software";

  // Measure and update indicator position
  const updateIndicatorPosition = useCallback(() => {
    const tablist = tablistRef.current;
    const activeButton = tabRefs.current.get(activeTab);
    if (!tablist || !activeButton) return;

    const tablistRect = tablist.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorStyle({
      left: buttonRect.left - tablistRect.left,
      width: buttonRect.width,
    });
  }, [activeTab]);

  // Update indicator on tab change and resize
  useEffect(() => {
    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);
    return () => window.removeEventListener("resize", updateIndicatorPosition);
  }, [updateIndicatorPosition]);

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
        ref={tablistRef}
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
        {/* Animated tab indicator - single element that slides between tabs */}
        <motion.div
          data-tab-indicator
          className="pointer-events-none absolute bottom-0 z-10 h-0.5 bg-accent-high"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={shouldReduceMotion ? { duration: 0 } : TAB_INDICATOR_TRANSITION}
        />
      </div>
    </div>
  );
}
