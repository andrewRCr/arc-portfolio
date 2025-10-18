import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AdaptiveHero } from "@/components/AdaptiveHero";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

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
          {/* TUI-style border frame wrapper */}
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] border-2 border-border rounded-lg flex flex-col relative">
              {/* Navigation positioned at top with border break */}
              <div
                className="absolute left-1/2 px-8 z-10"
                style={{
                  top: "var(--nav-offset)", // Browser-specific offset via CSS variable (see globals.css)
                  transform: "translateX(-50%)",
                  backgroundColor: "rgb(var(--background))",
                }}
              >
                <Navigation />
              </div>

              {/* Adaptive Hero - switches between expanded (home) and compact (other pages) */}
              <div className="pt-14">
                <AdaptiveHero />
              </div>

              {/* Main content area */}
              <main className="flex flex-col flex-1 px-6 pb-6">{children}</main>

              {/* Footer at bottom of frame */}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
