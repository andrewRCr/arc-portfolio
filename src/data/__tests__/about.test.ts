/**
 * Data validation tests for about/bio data file
 *
 * These tests verify structural integrity and format validity.
 * Content quality (wording, tone) is editorial work, not test material.
 */

import { describe, it, expect } from "vitest";
import { about } from "@/data/about";

describe("About/Bio Data Validation", () => {
  describe("Basic Structure", () => {
    it("should have about object defined", () => {
      expect(about).toBeDefined();
    });

    it("should have heading field", () => {
      expect(about.heading).toBeDefined();
      expect(typeof about.heading).toBe("string");
      expect(about.heading.length).toBeGreaterThan(0);
    });

    it("should have paragraphs array", () => {
      expect(about.paragraphs).toBeDefined();
      expect(Array.isArray(about.paragraphs)).toBe(true);
    });
  });

  describe("Paragraphs Structure", () => {
    it("should have at least 3 paragraphs", () => {
      expect(about.paragraphs.length).toBeGreaterThanOrEqual(3);
    });

    it("should have all paragraphs as non-empty strings", () => {
      about.paragraphs.forEach((paragraph) => {
        expect(typeof paragraph).toBe("string");
        expect(paragraph.length).toBeGreaterThan(0);
      });
    });

    it("should have substantial content in each paragraph (minimum 50 characters)", () => {
      about.paragraphs.forEach((paragraph) => {
        expect(paragraph.length).toBeGreaterThanOrEqual(50);
      });
    });
  });

  describe("Markdown Link Validation", () => {
    it("should have valid HTTPS URLs in any markdown links", () => {
      const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const fullBio = about.paragraphs.join(" ");
      const matches = [...fullBio.matchAll(markdownLinkRegex)];

      matches.forEach((match) => {
        const url = match[2];
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it("should have non-empty link text for all markdown links", () => {
      const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const fullBio = about.paragraphs.join(" ");
      const matches = [...fullBio.matchAll(markdownLinkRegex)];

      matches.forEach((match) => {
        expect(match[1].length).toBeGreaterThan(0);
      });
    });
  });

  describe("Data Consistency", () => {
    it("should have no HTML tags in paragraphs (markdown only)", () => {
      about.paragraphs.forEach((paragraph) => {
        expect(paragraph).not.toMatch(/<[^>]+>/);
      });
    });

    it("should have properly formatted strings (no extra whitespace)", () => {
      about.paragraphs.forEach((paragraph) => {
        expect(paragraph).not.toMatch(/\s{2,}/);
        expect(paragraph).toBe(paragraph.trim());
      });
    });

    it("should have properly formatted heading (no extra whitespace)", () => {
      expect(about.heading).toBe(about.heading.trim());
    });
  });
});
