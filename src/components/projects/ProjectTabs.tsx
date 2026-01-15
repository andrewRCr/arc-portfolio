"use client";

/**
 * ProjectTabs component
 *
 * Provides tab interface for switching between Software, Games, and Mods project categories.
 * Uses query parameters (?tab=software, ?tab=games, or ?tab=mods) for shareable/linkable state.
 *
 * Implements WAI-ARIA Tabs pattern with arrow key navigation.
 */

import { useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
    <div role="tablist" aria-label="Project categories" className="mx-4 flex items-end gap-2 border-b border-border/50">
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
          className={`min-h-11 lg:min-h-0 px-3 pb-2 pt-3 font-mono text-sm font-semibold transition-colors ${
            activeTab === tab ? "border-b-2 border-secondary text-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
