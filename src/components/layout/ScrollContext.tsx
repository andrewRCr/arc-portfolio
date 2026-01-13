"use client";

import { createContext, useContext } from "react";

/**
 * Context for sharing the scroll viewport element from PageLayout.
 * Used by components that need to track scroll position (e.g., collapsing headers).
 */

type ScrollContextValue = {
  viewport: HTMLElement | null;
};

const ScrollContext = createContext<ScrollContextValue>({ viewport: null });

export function ScrollProvider({ children, viewport }: { children: React.ReactNode; viewport: HTMLElement | null }) {
  return <ScrollContext.Provider value={{ viewport }}>{children}</ScrollContext.Provider>;
}

export function useScrollViewport() {
  return useContext(ScrollContext);
}
