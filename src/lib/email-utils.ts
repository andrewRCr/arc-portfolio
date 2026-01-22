/**
 * Email utility functions
 *
 * Server-side utilities for email handling.
 */

/**
 * Encode an email address to base64 for use with ObfuscatedMailtoButton component.
 * This prevents the email from appearing in static HTML.
 */
export function encodeEmail(email: string): string {
  return Buffer.from(email).toString("base64");
}
