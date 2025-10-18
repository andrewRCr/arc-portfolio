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
        <ThemeToggle />
      </div>
    </footer>
  );
}
