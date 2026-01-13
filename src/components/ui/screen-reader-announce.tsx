/**
 * ScreenReaderAnnounce Component
 *
 * Visually hidden aria-live region for announcing dynamic content changes
 * to screen reader users. Use for state changes that aren't otherwise
 * conveyed (theme selection, mode changes, etc.).
 */

interface ScreenReaderAnnounceProps {
  /** Message to announce. Changes trigger new announcements. */
  message: string;
  /** Politeness level. "polite" waits for idle, "assertive" interrupts. */
  politeness?: "polite" | "assertive";
}

export function ScreenReaderAnnounce({ message, politeness = "polite" }: ScreenReaderAnnounceProps) {
  return (
    <div aria-live={politeness} aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
