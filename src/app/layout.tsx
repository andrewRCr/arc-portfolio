import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import {
  PALETTE_STORAGE_KEY,
  PALETTE_COOKIE_NAME,
  WALLPAPER_PREFS_STORAGE_KEY,
  WALLPAPER_COOKIE_NAME,
} from "@/config/storage";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { ConditionalFrame } from "@/components/layout/ConditionalFrame";
import { ConsoleLoggerInit } from "@/components/dev/ConsoleLoggerInit";
import { defaultPalette, themes } from "@/data/themes";

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
 * Runs synchronously before paint to set:
 * 1. Theme palette class on <html> (e.g., "remedy", "rose-pine")
 * 2. Wallpaper data attribute for per-theme wallpaper persistence
 *
 * next-themes handles the light/dark mode class separately.
 *
 * Combined with CSS class variants (.remedy.dark, .rose-pine.light, etc.),
 * this ensures correct theme colors render on first paint.
 */
const themeInitScript = `
(function() {
  try {
    var palette = localStorage.getItem('${PALETTE_STORAGE_KEY}') || '${defaultPalette}';
    document.documentElement.classList.add(palette);

    // Set wallpaper for current palette (WallpaperContext reads this)
    var wallpaperPrefs = JSON.parse(localStorage.getItem('${WALLPAPER_PREFS_STORAGE_KEY}') || '{}');
    var wallpaper = wallpaperPrefs[palette] || 'gradient';
    document.documentElement.dataset.wallpaper = wallpaper;
  } catch (e) {
    document.documentElement.classList.add('${defaultPalette}');
    document.documentElement.dataset.wallpaper = 'gradient';
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script to set theme class before paint (FOUC prevention).
            Creates unavoidable hydration mismatch on Safari dev mode - this is
            the idiomatic pattern. See: github.com/vercel/next.js/issues/34610 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "rgb(var(--background))" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          serverPalette={serverPalette}
          serverWallpaper={serverWallpaper}
        >
          <ConsoleLoggerInit />
          <LayoutWrapper>
            <ConditionalFrame>{children}</ConditionalFrame>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
