/**
 * ObfuscatedMailtoIcon - Minimal obfuscated email icon link
 *
 * Matches FooterBar social link styling. Protects email from scrapers
 * by only rendering the mailto href after JavaScript hydration.
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

interface ObfuscatedMailtoIconProps {
  /** Base64-encoded email address */
  encoded: string;
  /** Icon size in pixels */
  size?: number;
  /** Additional className for the link */
  className?: string;
}

export function ObfuscatedMailtoIcon({ encoded, size = 16, className = "" }: ObfuscatedMailtoIconProps) {
  const isClient = useIsClient();

  // Decode email only on client side
  let email: string | null = null;
  if (isClient) {
    try {
      email = atob(encoded);
    } catch {
      console.error("[ObfuscatedMailtoIcon] Failed to decode email");
    }
  }

  // Base classes matching FooterBar social link styling
  const baseClasses =
    "flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground transition-colors";

  // Server-side / decode failure: render span (no link)
  if (!email) {
    return (
      <span className={`${baseClasses} ${className}`} aria-label="Email" title="Email">
        <Mail size={size} aria-hidden="true" />
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={`${baseClasses} ${className}`} aria-label="Email" title="Email">
      <Mail size={size} aria-hidden="true" />
    </a>
  );
}
