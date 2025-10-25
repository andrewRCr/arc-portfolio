import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Footer Component
 *
 * Minimal terminal-inspired footer with theme toggle.
 * In development mode, includes link to theme showcase page.
 */
export function Footer() {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <footer className="mt-auto">
      <div className="flex items-center justify-center p-6">
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground font-mono flex flex-col items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            {"< /portfolio >"}
            {isDev && (
              <>
                <span className="text-border">|</span>
                <Link
                  href="/theme-showcase"
                  className="text-accent hover:text-accent/80 underline transition-colors"
                  title="Theme showcase (dev only)"
                >
                  [theme-showcase]
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
