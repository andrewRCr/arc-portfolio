import { ThemeToggle } from './ThemeToggle';

/**
 * Footer Component
 *
 * Simple footer with theme toggle.
 *
 * NOTE: Placeholder component - minimal styling.
 * Visual design will be enhanced during design phase.
 */
export function Footer() {
  return (
    <footer className="flex items-center justify-center p-4 border-t">
      <ThemeToggle />
    </footer>
  );
}
