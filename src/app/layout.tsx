import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { AdaptiveHero } from "@/components/layout/AdaptiveHero";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { ConsoleLoggerInit } from "@/components/dev/ConsoleLoggerInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrew Creekmore - Portfolio",
  description: "Portfolio showcasing full-stack development projects and technical expertise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "rgb(var(--background))" }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ConsoleLoggerInit />
          <LayoutWrapper>
            {/* Inner TUI-style frame with rounded border - fills full height */}
            <div className="relative border-2 border-border rounded-lg flex flex-col flex-1 min-h-0">
              {/* Navigation positioned to intersect the border */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-px -translate-y-1/2 bg-card px-6 z-10">
                <Navigation />
              </div>

              {/* Content area with top padding for nav clearance */}
              <div className="flex flex-col flex-1 pt-8 px-4 pb-4 md:px-6 md:pb-6">
                {/* Adaptive Hero - switches between expanded (home) and compact (other pages) */}
                <AdaptiveHero />

                {/* Page content */}
                {children}
              </div>
            </div>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
