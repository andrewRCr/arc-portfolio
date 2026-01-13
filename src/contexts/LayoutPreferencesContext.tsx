"use client";

import * as React from "react";
import { LAYOUT_MODE_STORAGE_KEY } from "@/config/storage";
import { setLayoutModePreference } from "@/app/actions/layout-preferences";

/**
 * Layout mode options:
 * - "wide": Full-width containers with border gaps (desktop only)
 * - "boxed": Constrained max-width containers (default)
 * - "full": True fullscreen - no gaps, no bars (mobile only)
 */
export type LayoutMode = "wide" | "boxed" | "full";

const VALID_MODES: LayoutMode[] = ["wide", "boxed", "full"];
const DEFAULT_LAYOUT_MODE: LayoutMode = "boxed";

interface LayoutPreferencesContextProviderProps {
  children: React.ReactNode;
  /** Server-rendered layout mode from cookie (prevents layout shift) */
  serverLayoutMode?: string;
}

interface LayoutPreferencesContextValue {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  /** Whether the mobile theme control drawer is open (for coordinating UI elements) */
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const LayoutPreferencesContext = React.createContext<LayoutPreferencesContextValue | undefined>(undefined);

function isValidLayoutMode(value: string | null | undefined): value is LayoutMode {
  return typeof value === "string" && VALID_MODES.includes(value as LayoutMode);
}

function getStoredLayoutMode(): LayoutMode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LAYOUT_MODE_STORAGE_KEY);
  if (isValidLayoutMode(stored)) {
    return stored;
  }
  return null;
}

/**
 * Sync layout mode to cookie (fire-and-forget).
 * Silent failure - cookie sync is best-effort for SSR optimization.
 */
function syncLayoutModeCookie(mode: string): void {
  setLayoutModePreference(mode).catch(() => {
    // Silent fail - cookie sync is best-effort
  });
}

export function LayoutPreferencesContextProvider({
  children,
  serverLayoutMode,
}: LayoutPreferencesContextProviderProps) {
  // Initialize with server value (SSR consistency) or default
  const [layoutMode, setLayoutModeInternal] = React.useState<LayoutMode>(() => {
    if (isValidLayoutMode(serverLayoutMode)) {
      return serverLayoutMode;
    }
    return DEFAULT_LAYOUT_MODE;
  });

  // Drawer open state (ephemeral, for UI coordination)
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  // After hydration, sync with localStorage (may differ from cookie on first visit)
  React.useEffect(() => {
    const storedMode = getStoredLayoutMode();
    if (storedMode && storedMode !== layoutMode) {
      setLayoutModeInternal(storedMode);
      // Sync localStorage value to cookie since it differs from server
      syncLayoutModeCookie(storedMode);
    } else if (!storedMode && layoutMode !== DEFAULT_LAYOUT_MODE) {
      // Server had a non-default value but localStorage is empty - sync server value
      syncLayoutModeCookie(layoutMode);
    }
    // If storedMode matches layoutMode, no sync needed (already in sync)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrapped setter that updates localStorage immediately and syncs to cookie
  const setLayoutMode = React.useCallback((mode: LayoutMode) => {
    setLayoutModeInternal(mode);
    // localStorage update (immediate)
    if (typeof window !== "undefined") {
      localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, mode);
    }
    // Cookie sync (async, fire-and-forget)
    syncLayoutModeCookie(mode);
  }, []);

  // Sync across tabs via storage event
  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === LAYOUT_MODE_STORAGE_KEY && isValidLayoutMode(event.newValue)) {
        setLayoutModeInternal(event.newValue);
        syncLayoutModeCookie(event.newValue);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <LayoutPreferencesContext.Provider value={{ layoutMode, setLayoutMode, isDrawerOpen, setDrawerOpen }}>
      {children}
    </LayoutPreferencesContext.Provider>
  );
}

export function useLayoutPreferences() {
  const context = React.useContext(LayoutPreferencesContext);
  if (context === undefined) {
    throw new Error("useLayoutPreferences must be used within a LayoutPreferencesContextProvider");
  }
  return context;
}
