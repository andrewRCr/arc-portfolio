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

describe("Contact Interface", () => {
  it("should be defined with required fields", () => {
    expect(contact).toBeDefined();
    expect(contact.email).toBeDefined();
    expect(typeof contact.email).toBe("string");
    expect(contact.socialLinks).toBeDefined();
    expect(Array.isArray(contact.socialLinks)).toBe(true);
  });

  it("should have valid email format", () => {
    // Basic email validation (contains @ and .)
    expect(contact.email).toContain("@");
    expect(contact.email).toContain(".");
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
      // URLs should start with http://, https://, or mailto:
      const isValidUrl =
        link.url.startsWith("http://") || link.url.startsWith("https://") || link.url.startsWith("mailto:");
      expect(isValidUrl).toBe(true);
    });
  });

  it("should allow flexible social platform types", () => {
    // Type assertion to verify flexible platform structure
    const customContact: Contact = {
      email: "test@example.com",
      socialLinks: [
        { platform: "Custom Platform", url: "https://example.com", icon: "custom" },
        { platform: "GitHub", url: "https://github.com/user", icon: "github" },
      ],
    };

    expect(customContact).toBeDefined();
    expect(customContact.socialLinks.length).toBe(2);
  });

  it("should not have duplicate platforms", () => {
    const platforms = contact.socialLinks.map((link) => link.platform);
    const uniquePlatforms = new Set(platforms);
    expect(uniquePlatforms.size).toBe(platforms.length);
  });
});
