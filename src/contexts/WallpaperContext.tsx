"use client";

import * as React from "react";

// Available wallpapers for testing
// id/label derived from photographer name
export const WALLPAPER_OPTIONS = [
  { id: "gradient", src: undefined },
  { id: "andrii-butko", src: "/wallpaper/optimized/andrii-butko-7hRB34KdiIs.webp" },
  { id: "anne-nygard", src: "/wallpaper/optimized/anne-nygard-K6FlqZs4Dec.webp" },
  { id: "bernd-dittrich", src: "/wallpaper/optimized/bernd-dittrich-JjJ8HdGCLvw.webp" },
  { id: "dzo", src: "/wallpaper/optimized/dzo-rXCSu_BKfRE.webp" },
  { id: "gabriela-fechet", src: "/wallpaper/optimized/gabriela-fechet-2PCqWxuucg0.webp" },
  { id: "gareth-david", src: "/wallpaper/optimized/gareth-david-v3i1bZ-C13E.webp" },
  { id: "hamed-sadighi", src: "/wallpaper/optimized/hamed-sadighi-hvsj2ErGMog.webp" },
  { id: "jason-leung", src: "/wallpaper/optimized/jason-leung-IGLNYCWJUGI.webp" },
  { id: "jose-ignacio-pompe", src: "/wallpaper/optimized/jose-ignacio-pompe-H1rnAtovsnA.webp" },
  { id: "josh-withers", src: "/wallpaper/optimized/josh-withers-yEjlrUymkN4.webp" },
  { id: "karolis-milisauskas", src: "/wallpaper/optimized/karolis-milisauskas-gg11yRbK4hk.webp" },
  { id: "kristaps-ungurs", src: "/wallpaper/optimized/kristaps-ungurs-VByRsW7uU5M.webp" },
  { id: "maxim-tolchinskiy", src: "/wallpaper/optimized/maxim-tolchinskiy-zwMhwQzYGhc.webp" },
  { id: "olga-safronova", src: "/wallpaper/optimized/olga-safronova-duqq9Hm14s8.webp" },
  { id: "ryan-searle", src: "/wallpaper/optimized/ryan-searle-6b7OGXmF2xY.webp" },
  { id: "sander-traa", src: "/wallpaper/optimized/sander-traa-DEGn08l15vQ.webp" },
  { id: "simone-hutsch", src: "/wallpaper/optimized/simone-hutsch-qp49aKqexrI.webp" },
  { id: "sixteen-miles-out", src: "/wallpaper/optimized/sixteen-miles-out-NCuUExTUN4o.webp" },
  { id: "venti-views", src: "/wallpaper/optimized/venti-views-dI3Ho4afHK4.webp" },
] as const;

export type WallpaperId = (typeof WALLPAPER_OPTIONS)[number]["id"];

interface WallpaperContextValue {
  activeWallpaper: WallpaperId;
  setActiveWallpaper: (id: WallpaperId) => void;
  wallpaperSrc: string | undefined;
}

const WallpaperContext = React.createContext<WallpaperContextValue | undefined>(undefined);

export function WallpaperContextProvider({ children }: { children: React.ReactNode }) {
  const [activeWallpaper, setActiveWallpaper] = React.useState<WallpaperId>("gradient");

  const wallpaperSrc = React.useMemo(() => {
    const option = WALLPAPER_OPTIONS.find((o) => o.id === activeWallpaper);
    return option?.src;
  }, [activeWallpaper]);

  return (
    <WallpaperContext.Provider value={{ activeWallpaper, setActiveWallpaper, wallpaperSrc }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaperContext() {
  const context = React.useContext(WallpaperContext);
  if (context === undefined) {
    throw new Error("useWallpaperContext must be used within a WallpaperContextProvider");
  }
  return context;
}
