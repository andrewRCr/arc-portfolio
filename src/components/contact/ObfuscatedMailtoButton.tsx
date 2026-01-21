/**
 * ObfuscatedMailtoButton - Client-side rendered mailto button
 *
 * Protects email from scrapers by only rendering the mailto href
 * after JavaScript hydration. Styled to match social link buttons.
 */

"use client";

import { useSyncExternalStore } from "react";
import { Mail } from "lucide-react";

// Hydration detection using useSyncExternalStore (React 18+ recommended pattern)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

interface ObfuscatedMailtoButtonProps {
  /** Base64-encoded email address */
  encoded: string;
  /** Optional className for additional styling */
  className?: string;
  /** Render as icon-only button (for compact layouts) */
  iconOnly?: boolean;
}

export function ObfuscatedMailtoButton({ encoded, className = "", iconOnly = false }: ObfuscatedMailtoButtonProps) {
  const isClient = useIsClient();

  // Decode email only on client side
  let email: string | null = null;
  if (isClient) {
    try {
      email = atob(encoded);
    } catch {
      console.error("[ObfuscatedMailtoButton] Failed to decode email");
    }
  }

  // Button styling - compact for icon-only, full for labeled (both use accent)
  const buttonClasses = iconOnly
    ? "rounded-lg border border-accent p-3 text-accent transition-colors hover:bg-accent/10"
    : "flex items-center gap-2 rounded-lg border border-accent px-4 py-3 text-accent transition-colors hover:bg-accent/10";

  // Server-side and decode failure: render disabled-looking button
  if (!email) {
    return (
      <span className={`${buttonClasses} opacity-50 ${className}`} aria-label="Email">
        <Mail className="h-5 w-5" />
        {!iconOnly && <span className="font-medium">Email</span>}
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={`${buttonClasses} ${className}`} aria-label="Email">
      <Mail className="h-5 w-5" />
      {!iconOnly && <span className="font-medium">Email</span>}
    </a>
  );
}
