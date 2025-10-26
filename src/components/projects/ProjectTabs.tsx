"use client";

/**
 * ProjectTabs component
 *
 * Provides tab interface for switching between Software and Mods project categories.
 * Uses query parameters (?tab=software or ?tab=mods) for shareable/linkable state.
 */

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type TabValue = "software" | "mods";

export default function ProjectTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current tab from query param, default to 'software'
  const currentTab = (searchParams.get("tab") as TabValue) || "software";

  // Validate and normalize tab value
  const activeTab: TabValue = currentTab === "mods" ? "mods" : "software";

  const handleTabChange = (tab: TabValue) => {
    // Update URL with query parameter
    router.push(`${pathname}?tab=${tab}`);
  };

  const handleKeyDown = (tab: TabValue, event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabChange(tab);
    }
  };

  return (
    <div role="tablist" className="flex gap-2 border-b border-border">
      <button
        role="tab"
        aria-selected={activeTab === "software"}
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
        role="tab"
        aria-selected={activeTab === "mods"}
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
