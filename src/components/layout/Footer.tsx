import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeSwitcher } from "../ThemeSwitcher";

/**
 * Footer Component
 *
 * Minimal terminal-inspired footer with theme controls and theme switcher.
 * In development mode, includes theme switcher and link to theme debug page.
 *
 * ThemeSwitcher serves as functional prototype for more sophisticated
 * theme picker planned in TWM Layout System (top bar).
 */
export function Footer() {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <footer className="mt-auto">
      <div className="flex items-center justify-center p-6">
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground font-mono flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isDev && <ThemeSwitcher />}
          </div>
          <div className="flex items-center gap-3">
            {"< /portfolio >"}
            {isDev && (
              <>
                <span className="text-border">|</span>
                <span>debug:</span>
                <Link
                  href="/dev/theme-debug"
                  className="text-accent hover:text-accent/80 underline transition-colors"
                  title="Theme debug (dev only)"
                >
                  [theme]
                </Link>
                <Link
                  href="/dev/typography"
                  className="text-accent hover:text-accent/80 underline transition-colors"
                  title="Typography debug (dev only)"
                >
                  [typography]
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
