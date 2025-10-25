import { ThemeToggle } from "./ThemeToggle";

/**
 * Footer Component
 *
 * Minimal terminal-inspired footer with theme toggle.
 */
export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="flex items-center justify-center p-6">
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground font-mono flex flex-col items-center gap-2">
          <ThemeToggle />
          {"< /portfolio >"}
        </div>
      </div>
    </footer>
  );
}
