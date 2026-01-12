/**
 * usePreferenceAnnouncements Hook
 *
 * Tracks theme, wallpaper, and mode changes and generates screen reader
 * announcement messages. Used by ThemeControl and ThemeControlDrawer
 * to announce preference changes to assistive technology users.
 */

import { useRef, useEffect, useState } from "react";
import type { ThemeName } from "@/data/themes";
import type { WallpaperId } from "@/data/wallpapers";

interface UsePreferenceAnnouncementsProps {
  activeTheme: ThemeName;
  activeWallpaper: WallpaperId;
  mode: string | undefined;
  layoutMode: string;
}

/**
 * Returns the current announcement message for screen readers.
 * Message clears after being set to allow repeated announcements.
 */
export function usePreferenceAnnouncements({
  activeTheme,
  activeWallpaper,
  mode,
  layoutMode,
}: UsePreferenceAnnouncementsProps): string {
  const [announcement, setAnnouncement] = useState("");
  const prevTheme = useRef(activeTheme);
  const prevWallpaper = useRef(activeWallpaper);
  const prevMode = useRef(mode);
  const prevLayout = useRef(layoutMode);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip announcements on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const messages: string[] = [];

    if (prevTheme.current !== activeTheme) {
      messages.push(`Theme changed to ${formatName(activeTheme)}`);
      prevTheme.current = activeTheme;
    }

    if (prevWallpaper.current !== activeWallpaper) {
      messages.push(`Wallpaper changed to ${formatName(activeWallpaper)}`);
      prevWallpaper.current = activeWallpaper;
    }

    if (prevMode.current !== mode && mode) {
      messages.push(`Switched to ${mode} mode`);
      prevMode.current = mode;
    }

    if (prevLayout.current !== layoutMode) {
      messages.push(`Layout changed to ${layoutMode}`);
      prevLayout.current = layoutMode;
    }

    if (messages.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: announcing preference changes to screen readers requires updating state when props change
      setAnnouncement(messages.join(". "));
      // Clear after a short delay to allow repeated announcements of same value
      const timer = setTimeout(() => setAnnouncement(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTheme, activeWallpaper, mode, layoutMode]);

  return announcement;
}

/**
 * Format a kebab-case or camelCase name for display.
 * "rose-pine" -> "Rose Pine", "gruvbox" -> "Gruvbox"
 */
function formatName(name: string): string {
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
