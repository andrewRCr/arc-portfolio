"use client";

import { useSearchParams } from "next/navigation";
import { getBackDestination } from "@/components/projects/utils";

const validTabs = ["software", "games", "mods"] as const;
type ProjectTab = (typeof validTabs)[number];

/**
 * Reads `tab` and `from` search params client-side to compute back navigation.
 * Avoids server-side `searchParams` access, keeping detail pages SSG-compatible.
 */
export function useBackDestination(defaultTab: ProjectTab) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const from = searchParams.get("from");

  const currentTab = tab && validTabs.includes(tab as ProjectTab) ? (tab as ProjectTab) : defaultTab;

  return getBackDestination(from ?? undefined, currentTab);
}
