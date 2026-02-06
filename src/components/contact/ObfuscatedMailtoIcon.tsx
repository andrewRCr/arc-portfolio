/**
 * ObfuscatedMailtoIcon - Minimal obfuscated email icon link
 *
 * Matches FooterBar social link styling. Protects email from scrapers
 * by only rendering the mailto href after JavaScript hydration.
 */

"use client";

import { useMemo } from "react";
import { Mail } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";

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

  // Decode email only on client side, memoized to avoid repeated decoding/error logging
  const email = useMemo(() => {
    if (!isClient) return null;
    try {
      return atob(encoded);
    } catch {
      console.error("[ObfuscatedMailtoIcon] Failed to decode email");
      return null;
    }
  }, [isClient, encoded]);

  // Base classes matching FooterBar social link styling
  const baseClasses =
    "flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-accent-mid transition-colors";

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
