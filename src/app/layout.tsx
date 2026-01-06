import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import { PALETTE_STORAGE_KEY } from "@/config/storage";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { ConditionalFrame } from "@/components/layout/ConditionalFrame";
import { ConsoleLoggerInit } from "@/components/dev/ConsoleLoggerInit";
import { defaultPalette } from "@/data/themes";

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
 * Runs synchronously before paint to set the theme palette class on <html>.
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
  } catch (e) {
    document.documentElement.classList.add('${defaultPalette}');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ConsoleLoggerInit />
          <LayoutWrapper>
            <ConditionalFrame>{children}</ConditionalFrame>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
