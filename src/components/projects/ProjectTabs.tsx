"use client";

/**
 * ProjectTabs component
 *
 * Provides tab interface for switching between Software and Mods project categories.
 * Uses query parameters (?tab=software or ?tab=mods) for shareable/linkable state.
 *
 * Implements WAI-ARIA Tabs pattern with arrow key navigation.
 */

import { useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type TabValue = "software" | "mods";

const TABS: TabValue[] = ["software", "mods"];

export default function ProjectTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Refs for focus management
  const tabRefs = useRef<Map<TabValue, HTMLButtonElement | null>>(new Map());

  // Get current tab from query param, default to 'software'
  const currentTab = (searchParams.get("tab") as TabValue) || "software";

  // Validate and normalize tab value
  const activeTab: TabValue = currentTab === "mods" ? "mods" : "software";

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
    <div role="tablist" aria-label="Project categories" className="flex gap-2 border-b border-border">
      <button
        ref={(el) => {
          tabRefs.current.set("software", el);
        }}
        id="tab-software"
        role="tab"
        aria-selected={activeTab === "software"}
        aria-controls="panel-software"
        tabIndex={activeTab === "software" ? 0 : -1}
        onClick={() => handleTabChange("software")}
        onKeyDown={(e) => handleKeyDown("software", e)}
        className={`px-4 py-2 font-medium transition-colors ${
          activeTab === "software"
            ? "border-b-2 border-accent text-accent"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Software
      </button>
      <button
        ref={(el) => {
          tabRefs.current.set("mods", el);
        }}
        id="tab-mods"
        role="tab"
        aria-selected={activeTab === "mods"}
        aria-controls="panel-mods"
        tabIndex={activeTab === "mods" ? 0 : -1}
        onClick={() => handleTabChange("mods")}
        onKeyDown={(e) => handleKeyDown("mods", e)}
        className={`px-4 py-2 font-medium transition-colors ${
          activeTab === "mods" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Mods
      </button>
    </div>
  );
}
