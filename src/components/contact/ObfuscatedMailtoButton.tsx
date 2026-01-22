/**
 * ObfuscatedMailtoButton - Client-side rendered mailto button
 *
 * Protects email from scrapers by only rendering the mailto href
 * after JavaScript hydration. Styled to match social link buttons.
 */

"use client";

import { useMemo } from "react";
import { Mail } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";

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

  // Decode email only on client side, memoized to avoid repeated decoding/error logging
  const email = useMemo(() => {
    if (!isClient) return null;
    try {
      return atob(encoded);
    } catch {
      console.error("[ObfuscatedMailtoButton] Failed to decode email");
      return null;
    }
  }, [isClient, encoded]);

  // Button styling - compact for icon-only, full for labeled (both use accent)
  const buttonClasses = iconOnly
    ? "rounded-lg border border-accent p-3 text-accent transition-colors hover:bg-accent/10"
    : "flex items-center gap-2 rounded-lg border border-accent px-4 py-3 text-accent transition-colors hover:bg-accent/10";

  // Server-side and decode failure: render disabled-looking button
  if (!email) {
    return (
      <span className={`${buttonClasses} opacity-50 ${className}`} aria-label="Email (loading)" aria-disabled="true">
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
