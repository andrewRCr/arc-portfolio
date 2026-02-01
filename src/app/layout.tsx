import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import {
  PALETTE_STORAGE_KEY,
  PALETTE_COOKIE_NAME,
  WALLPAPER_COOKIE_NAME,
  LAYOUT_MODE_COOKIE_NAME,
} from "@/config/storage";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { ConditionalFrame } from "@/components/layout/ConditionalFrame";
import { ConsoleLoggerInit } from "@/components/dev/ConsoleLoggerInit";
import { HydrationSignal } from "@/components/dev/HydrationSignal";
import { defaultPalette, themes } from "@/data/themes";
import { LAYOUT_MODES } from "@/config/layout";
import { WALLPAPER_OPTIONS } from "@/data/wallpapers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.metaDescription,
};

/**
 * Blocking script to prevent FOUC (flash of unstyled content).
 *
 * Runs synchronously before paint to set theme palette class on <html>
 * (e.g., "remedy", "rose-pine"). next-themes handles light/dark mode separately.
 *
 * Combined with CSS class variants (.remedy.dark, .rose-pine.light, etc.),
 * this ensures correct theme colors render on first paint.
 *
 * Note: Wallpaper preference is handled server-side via cookies (not blocking script)
 * because WallpaperBackground receives serverWallpaper as a prop.
 */
const themeInitScript = `
(function() {
  try {
    var palette = localStorage.getItem('${PALETTE_STORAGE_KEY}') || '${defaultPalette}';
    document.documentElement.classList.add(palette);
  } catch (e) {
    document.documentElement.classList.add('${defaultPalette}');
  }
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read preferences from cookies for SSR (prevents FOUC)
  const cookieStore = await cookies();
  const paletteCookie = cookieStore.get(PALETTE_COOKIE_NAME)?.value;
  const wallpaperCookie = cookieStore.get(WALLPAPER_COOKIE_NAME)?.value;
  const layoutModeCookie = cookieStore.get(LAYOUT_MODE_COOKIE_NAME)?.value;

  // Determine server palette (cookie or default)
  const serverPalette = paletteCookie && paletteCookie in themes ? paletteCookie : defaultPalette;

  // Determine server wallpaper for the user's palette
  let serverWallpaper = themes[serverPalette as keyof typeof themes]?.defaultWallpaper ?? "gradient";
  if (wallpaperCookie) {
    try {
      // Cookie value may be URL-encoded, decode before parsing
      const decoded = decodeURIComponent(wallpaperCookie);
      const prefs = JSON.parse(decoded);
      // Use the user's actual palette (from cookie) to look up their wallpaper
      serverWallpaper = prefs[serverPalette] || serverWallpaper;
    } catch {
      // Invalid JSON, use theme default
    }
  }

  // Determine server layout mode (cookie or undefined to let context default)
  const serverLayoutMode =
    layoutModeCookie && LAYOUT_MODES.includes(layoutModeCookie as (typeof LAYOUT_MODES)[number])
      ? layoutModeCookie
      : undefined;

  // Look up wallpaper image paths for preload link (prevents flicker on page load)
  const wallpaperOption = WALLPAPER_OPTIONS.find((w) => w.id === serverWallpaper);
  const wallpaperSrc = wallpaperOption?.src;
  const wallpaperSrcHiRes = wallpaperOption?.srcHiRes;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload wallpaper image to prevent flicker on page load.
            Starts download before CSS parsing, eliminating the discovery delay.
            Uses imagesrcset/imagesizes for responsive preloading (correct variant for viewport). */}
        {wallpaperSrc && (
          <link
            rel="preload"
            as="image"
            href={wallpaperSrc}
            imageSrcSet={wallpaperSrcHiRes ? `${wallpaperSrc} 1920w, ${wallpaperSrcHiRes} 2560w` : undefined}
            imageSizes={wallpaperSrcHiRes ? "100vw" : undefined}
            fetchPriority="high"
          />
        )}
        {/* Blocking script to set theme class before paint (FOUC prevention).
            Creates unavoidable hydration mismatch on Safari dev mode - this is
            the idiomatic pattern. See: github.com/vercel/next.js/issues/34610 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Disable browser scroll restoration - we handle scroll manually.
            Prevents browser from overriding scroll position on query param changes. */}
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual";` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "rgb(var(--background))" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange={false}
          serverPalette={serverPalette}
          serverWallpaper={serverWallpaper}
          serverLayoutMode={serverLayoutMode}
        >
          <HydrationSignal />
          <ConsoleLoggerInit />
          <LayoutWrapper>
            <ConditionalFrame>{children}</ConditionalFrame>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
