"use client";

import * as React from "react";
import { LAYOUT_MODE_STORAGE_KEY } from "@/config/storage";
import { setLayoutModePreference } from "@/app/actions/layout-preferences";

/** Layout mode: full width or boxed (constrained) */
export type LayoutMode = "full" | "boxed";

const VALID_MODES: LayoutMode[] = ["full", "boxed"];
const DEFAULT_LAYOUT_MODE: LayoutMode = "boxed";

interface LayoutPreferencesContextProviderProps {
  children: React.ReactNode;
  /** Server-rendered layout mode from cookie (prevents layout shift) */
  serverLayoutMode?: string;
}

interface LayoutPreferencesContextValue {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
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

  // After hydration, sync with localStorage (may differ from cookie on first visit)
  React.useEffect(() => {
    const storedMode = getStoredLayoutMode();
    if (storedMode && storedMode !== layoutMode) {
      setLayoutModeInternal(storedMode);
    }
    // Sync current mode to cookie (ensures cookie matches localStorage)
    syncLayoutModeCookie(storedMode ?? layoutMode);
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
    <LayoutPreferencesContext.Provider value={{ layoutMode, setLayoutMode }}>
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
