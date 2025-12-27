/**
 * Type validation tests for Contact interface
 *
 * Verifies that contact data:
 * - Has email and social links
 * - Social links have required fields
 * - Icon identifiers are present
 */

import { describe, it, expect } from "vitest";
import { contact } from "@/data/contact";
import type { Contact } from "@/types/contact";

/** Basic RFC-like email pattern: non-whitespace@non-whitespace.non-whitespace */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Check if URL starts with a valid protocol (http://, https://, or mailto:) */
function isValidUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:");
}

describe("Contact Interface", () => {
  it("should be defined with required fields", () => {
    expect(contact).toBeDefined();
    expect(contact.email).toBeDefined();
    expect(typeof contact.email).toBe("string");
    expect(contact.socialLinks).toBeDefined();
    expect(Array.isArray(contact.socialLinks)).toBe(true);
  });

  it("should have valid email format", () => {
    expect(contact.email.length).toBeGreaterThan(0);
    expect(contact.email).toMatch(EMAIL_PATTERN);
  });

  it("should have at least one social link", () => {
    expect(contact.socialLinks.length).toBeGreaterThan(0);
  });

  it("should have valid social link structure", () => {
    contact.socialLinks.forEach((link) => {
      expect(link.platform).toBeDefined();
      expect(typeof link.platform).toBe("string");
      expect(link.platform.length).toBeGreaterThan(0);

      expect(link.url).toBeDefined();
      expect(typeof link.url).toBe("string");
      expect(link.url.length).toBeGreaterThan(0);

      expect(link.icon).toBeDefined();
      expect(typeof link.icon).toBe("string");
      expect(link.icon.length).toBeGreaterThan(0);
    });
  });

  it("should have valid URL format in social links", () => {
    contact.socialLinks.forEach((link) => {
      expect(isValidUrl(link.url)).toBe(true);
    });
  });

  it("should use constrained icon types for social links", () => {
    // Type assertion verifies icon field accepts valid SocialIcon values
    const customContact: Contact = {
      email: "test@example.com",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/user", icon: "github" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/user", icon: "linkedin" },
        { platform: "NexusMods", url: "https://nexusmods.com/user", icon: "package" },
      ],
    };

    expect(customContact).toBeDefined();
    expect(customContact.socialLinks.length).toBe(3);
  });

  it("should not have duplicate platforms", () => {
    const platforms = contact.socialLinks.map((link) => link.platform);
    const uniquePlatforms = new Set(platforms);
    expect(uniquePlatforms.size).toBe(platforms.length);
  });
});
