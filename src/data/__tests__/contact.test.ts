/**
 * Data validation tests for contact data file
 *
 * These tests verify that:
 * - Contact structure is complete and properly formatted
 * - Email is valid and properly formatted
 * - All social links are present with correct data
 * - URLs are valid and properly formatted
 * - Icons are specified for all links
 */

import { describe, it, expect } from "vitest";
import { contact } from "@/data/contact";

describe("Contact Data Validation", () => {
  describe("Basic Structure", () => {
    it("should have contact object defined", () => {
      expect(contact).toBeDefined();
      expect(typeof contact).toBe("object");
      expect(contact).not.toBeNull();
    });

    it("should have email field", () => {
      expect(contact.email).toBeDefined();
      expect(typeof contact.email).toBe("string");
      expect(contact.email.length).toBeGreaterThan(0);
    });

    it("should have socialLinks array", () => {
      expect(contact.socialLinks).toBeDefined();
      expect(Array.isArray(contact.socialLinks)).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("should have valid email format", () => {
      // Basic email regex: something@something.something
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(contact.email).toMatch(emailRegex);
    });

    it("should be andrew.creekmore@me.com", () => {
      expect(contact.email).toBe("andrew.creekmore@me.com");
    });

    it("should have properly formatted email (no whitespace)", () => {
      expect(contact.email).toBe(contact.email.trim());
      expect(contact.email).not.toContain(" ");
    });

    it("should have lowercase domain", () => {
      const domain = contact.email.split("@")[1];
      expect(domain).toBe(domain.toLowerCase());
    });
  });

  describe("Social Links Structure", () => {
    it("should have at least 3 social links", () => {
      expect(contact.socialLinks.length).toBeGreaterThanOrEqual(3);
    });

    it("should have all links as valid objects", () => {
      contact.socialLinks.forEach((link) => {
        expect(link).toBeDefined();
        expect(typeof link).toBe("object");
        expect(link).not.toBeNull();
      });
    });

    it("should have all required fields for each link", () => {
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
  });

  describe("Platform Validation", () => {
    it("should have GitHub link", () => {
      const githubLink = contact.socialLinks.find((link) => link.platform === "GitHub");
      expect(githubLink).toBeDefined();
    });

    it("should have LinkedIn link", () => {
      const linkedinLink = contact.socialLinks.find((link) => link.platform === "LinkedIn");
      expect(linkedinLink).toBeDefined();
    });

    it("should have NexusMods link", () => {
      const nexusLink = contact.socialLinks.find((link) => link.platform === "NexusMods");
      expect(nexusLink).toBeDefined();
    });

    it("should have unique platform names", () => {
      const platforms = contact.socialLinks.map((link) => link.platform);
      const uniquePlatforms = new Set(platforms);
      expect(uniquePlatforms.size).toBe(contact.socialLinks.length);
    });
  });

  describe("GitHub Link", () => {
    const githubLink = contact.socialLinks.find((link) => link.platform === "GitHub");

    it("should have valid GitHub URL", () => {
      expect(githubLink?.url).toMatch(/^https:\/\/github\.com\//);
    });

    it("should point to andrewRCr profile", () => {
      expect(githubLink?.url).toBe("https://github.com/andrewRCr");
    });

    it("should have github icon", () => {
      expect(githubLink?.icon).toBe("github");
    });
  });

  describe("LinkedIn Link", () => {
    const linkedinLink = contact.socialLinks.find((link) => link.platform === "LinkedIn");

    it("should have valid LinkedIn URL", () => {
      expect(linkedinLink?.url).toMatch(/^https:\/\/www\.linkedin\.com\//);
    });

    it("should point to andrewRCr profile", () => {
      expect(linkedinLink?.url).toBe("https://www.linkedin.com/in/andrewRCr");
    });

    it("should have linkedin icon", () => {
      expect(linkedinLink?.icon).toBe("linkedin");
    });
  });

  describe("NexusMods Link", () => {
    const nexusLink = contact.socialLinks.find((link) => link.platform === "NexusMods");

    it("should have valid NexusMods URL", () => {
      expect(nexusLink?.url).toMatch(/^https:\/\/next\.nexusmods\.com\//);
    });

    it("should point to andrewRCr profile mods page", () => {
      expect(nexusLink?.url).toBe("https://next.nexusmods.com/profile/andrewRCr/mods");
    });

    it("should have valid icon identifier", () => {
      expect(nexusLink?.icon).toBeDefined();
      expect(nexusLink?.icon).toBe("nexusmods");
    });
  });

  describe("URL Format Validation", () => {
    it("should have all URLs starting with https:// or mailto:", () => {
      contact.socialLinks.forEach((link) => {
        expect(link.url).toMatch(/^(https:\/\/|mailto:)/);
      });
    });

    it("should have no trailing slashes on profile URLs", () => {
      contact.socialLinks.forEach((link) => {
        // URLs ending in profile names should not have trailing slashes
        if (!link.url.includes("/mods")) {
          expect(link.url).not.toMatch(/\/$/);
        }
      });
    });

    it("should have properly formatted URLs (no whitespace)", () => {
      contact.socialLinks.forEach((link) => {
        expect(link.url).toBe(link.url.trim());
        expect(link.url).not.toContain(" ");
      });
    });

    it("should have valid domain names or mailto", () => {
      const validDomains = ["github.com", "linkedin.com", "nexusmods.com"];

      contact.socialLinks.forEach((link) => {
        const isMailto = link.url.startsWith("mailto:");
        const hasDomain = validDomains.some((domain) => link.url.includes(domain));
        expect(isMailto || hasDomain).toBe(true);
      });
    });
  });

  describe("Icon Validation", () => {
    it("should have valid lucide-react icon identifiers", () => {
      contact.socialLinks.forEach((link) => {
        expect(typeof link.icon).toBe("string");
        expect(link.icon.length).toBeGreaterThan(0);
      });
    });

    it("should have icon identifiers in lowercase kebab-case", () => {
      contact.socialLinks.forEach((link) => {
        expect(link.icon).toBe(link.icon.toLowerCase());
        expect(link.icon).not.toContain(" ");
        expect(link.icon).not.toContain("_");
      });
    });

    it("should have appropriate icons for each platform", () => {
      const githubLink = contact.socialLinks.find((link) => link.platform === "GitHub");
      const linkedinLink = contact.socialLinks.find((link) => link.platform === "LinkedIn");

      expect(githubLink?.icon).toBe("github");
      expect(linkedinLink?.icon).toBe("linkedin");
    });
  });

  describe("Core Contact Information", () => {
    it("should have primary email address", () => {
      expect(contact.email).toBe("andrew.creekmore@me.com");
    });

    it("should have core social platforms", () => {
      expect(contact.socialLinks.length).toBeGreaterThanOrEqual(3);

      const platforms = contact.socialLinks.map((link) => link.platform);
      expect(platforms).toContain("GitHub");
      expect(platforms).toContain("LinkedIn");
      expect(platforms).toContain("NexusMods");
    });

    it("should have links to andrewRCr profile on external platforms", () => {
      contact.socialLinks
        .filter((link) => !link.url.startsWith("mailto:"))
        .forEach((link) => {
          expect(link.url).toContain("andrewRCr");
        });
    });
  });

  describe("Data Consistency", () => {
    it("should have unique URLs", () => {
      const urls = contact.socialLinks.map((link) => link.url);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(contact.socialLinks.length);
    });

    it("should have consistent URL formatting across all links", () => {
      contact.socialLinks.forEach((link) => {
        // All should use https or mailto
        expect(link.url.startsWith("https://") || link.url.startsWith("mailto:")).toBe(true);

        // External links should have no www except LinkedIn
        if (link.platform !== "LinkedIn" && !link.url.startsWith("mailto:")) {
          expect(link.url.includes("www.")).toBe(false);
        }
      });
    });

    it("should have proper capitalization for platform names", () => {
      // Email is handled separately (contact.email), not in socialLinks
      const properNames = ["GitHub", "LinkedIn", "NexusMods"];

      contact.socialLinks.forEach((link) => {
        expect(properNames).toContain(link.platform);
      });
    });
  });

  describe("Username Consistency", () => {
    it("should use andrewRCr username consistently across external platforms", () => {
      contact.socialLinks
        .filter((link) => !link.url.startsWith("mailto:"))
        .forEach((link) => {
          // All external URLs should contain andrewRCr (case-insensitive for LinkedIn)
          const url = link.url.toLowerCase();
          expect(url).toContain("andrewrcr");
        });
    });

    it("should preserve capitalization in GitHub and NexusMods URLs", () => {
      const githubLink = contact.socialLinks.find((link) => link.platform === "GitHub");
      const nexusLink = contact.socialLinks.find((link) => link.platform === "NexusMods");

      expect(githubLink?.url).toContain("andrewRCr");
      expect(nexusLink?.url).toContain("andrewRCr");
    });
  });

  describe("Accessibility Considerations", () => {
    it("should have descriptive platform names for screen readers", () => {
      contact.socialLinks.forEach((link) => {
        // Platform names should be readable and descriptive
        expect(link.platform.length).toBeGreaterThan(3);
        expect(link.platform).not.toMatch(/^[A-Z]{2,}$/); // Not all caps abbreviations
      });
    });

    it("should have recognizable icon identifiers", () => {
      contact.socialLinks.forEach((link) => {
        // Icons should be common, recognizable identifiers
        expect(link.icon.length).toBeGreaterThan(2);
      });
    });
  });

  describe("Link Order", () => {
    // Note: Email is handled separately via contact.email (for obfuscation)
    // socialLinks contains only external platform links

    it("should have GitHub as first link", () => {
      expect(contact.socialLinks[0].platform).toBe("GitHub");
    });

    it("should have LinkedIn as second link", () => {
      expect(contact.socialLinks[1].platform).toBe("LinkedIn");
    });

    it("should have NexusMods as third link", () => {
      expect(contact.socialLinks[2].platform).toBe("NexusMods");
    });

    it("should have professional links before hobby links", () => {
      // GitHub and LinkedIn (professional) should come before NexusMods (hobby)
      const professionalIndices = contact.socialLinks
        .map((link, index) => (link.platform === "GitHub" || link.platform === "LinkedIn" ? index : -1))
        .filter((i) => i !== -1);

      const hobbyIndices = contact.socialLinks
        .map((link, index) => (link.platform === "NexusMods" ? index : -1))
        .filter((i) => i !== -1);

      const maxProfessional = Math.max(...professionalIndices);
      const minHobby = Math.min(...hobbyIndices);

      expect(maxProfessional).toBeLessThan(minHobby);
    });
  });
});
