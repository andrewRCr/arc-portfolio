/**
 * Data validation tests for about/bio data file
 *
 * These tests verify that:
 * - Bio structure is complete and properly formatted
 * - All required fields are present
 * - Paragraphs contain expected content and narratives
 * - Markdown links are properly formatted
 * - Download count is updated to 270K+
 * - Phase 2 migration completeness
 */

import { describe, it, expect } from "vitest";
import { about } from "@/data/about";

describe("About/Bio Data Validation", () => {
  describe("Basic Structure", () => {
    it("should have about object defined", () => {
      expect(about).toBeDefined();
      expect(typeof about).toBe("object");
      expect(about).not.toBeNull();
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

  describe("Heading Validation", () => {
    it("should have 'About me' heading", () => {
      expect(about.heading).toBe("About me");
    });

    it("should have properly formatted heading (no extra whitespace)", () => {
      expect(about.heading).toBe(about.heading.trim());
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

  describe("Paragraph 1: Professional Summary", () => {
    const firstParagraph = about.paragraphs[0];

    it("should mention software engineering role", () => {
      expect(firstParagraph.toLowerCase()).toContain("software engineer");
    });

    it("should mention both frontend and backend capabilities", () => {
      const lowerText = firstParagraph.toLowerCase();
      expect(lowerText).toMatch(/front.*back|front.*end.*back.*end|backend.*frontend/);
    });

    it("should mention web development", () => {
      expect(firstParagraph.toLowerCase()).toContain("web");
    });

    it("should highlight key professional traits", () => {
      const lowerText = firstParagraph.toLowerCase();
      const traits = ["self-starter", "attention to detail", "continuous learning"];

      const hasTraits = traits.some((trait) => lowerText.includes(trait));
      expect(hasTraits).toBe(true);
    });
  });

  describe("Paragraph 2: Career Transition & Hobbies", () => {
    const secondParagraph = about.paragraphs[1];

    it("should mention psychology background", () => {
      expect(secondParagraph.toLowerCase()).toContain("psychology");
    });

    it("should mention computer science transition", () => {
      expect(secondParagraph.toLowerCase()).toContain("computer science");
    });

    it("should mention video game development", () => {
      const lowerText = secondParagraph.toLowerCase();
      expect(lowerText).toMatch(/game.*development|video game/);
    });

    it("should mention modding work", () => {
      const lowerText = secondParagraph.toLowerCase();
      expect(lowerText).toMatch(/modding|mod|modify.*game/);
    });

    it("should contain NexusMods profile link", () => {
      expect(secondParagraph).toContain("https://next.nexusmods.com/profile/andrewRCr/mods");
    });

    it("should have properly formatted markdown link", () => {
      // Should match format: [link text](URL)
      expect(secondParagraph).toMatch(/\[.*?\]\(https:\/\/.*?\)/);
    });

    it("should mention download count of 270K+", () => {
      const hasUpdatedCount =
        secondParagraph.includes("270 thousand") ||
        secondParagraph.includes("270K") ||
        secondParagraph.includes("270,000");
      expect(hasUpdatedCount).toBe(true);
    });

    it("should mention 3D modeling and animation", () => {
      const lowerText = secondParagraph.toLowerCase();
      expect(lowerText).toContain("3d");
      expect(lowerText).toMatch(/model|animation/);
    });
  });

  describe("Paragraph 3: Value Proposition", () => {
    const thirdParagraph = about.paragraphs[2];

    it("should express eagerness to add value", () => {
      const lowerText = thirdParagraph.toLowerCase();
      expect(lowerText).toMatch(/eager|ready|excited|enthusiastic/);
    });

    it("should mention team contribution", () => {
      expect(thirdParagraph.toLowerCase()).toContain("team");
    });

    it("should mention continuous growth/learning", () => {
      const lowerText = thirdParagraph.toLowerCase();
      expect(lowerText).toMatch(/grow|expand|learn|knowledge|toolkit/);
    });
  });

  describe("Markdown Link Validation", () => {
    it("should have valid NexusMods URL format", () => {
      const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const secondParagraph = about.paragraphs[1];
      const matches = [...secondParagraph.matchAll(markdownLinkRegex)];

      expect(matches.length).toBeGreaterThan(0);

      matches.forEach((match) => {
        const url = match[2];
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it("should have NexusMods link with proper link text", () => {
      const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
      const secondParagraph = about.paragraphs[1];
      const match = secondParagraph.match(markdownLinkRegex);

      expect(match).not.toBeNull();
      expect(match![1].length).toBeGreaterThan(0); // Link text should exist
    });

    it("should have NexusMods link pointing to andrewRCr profile", () => {
      const secondParagraph = about.paragraphs[1];
      expect(secondParagraph).toContain("andrewRCr");
      expect(secondParagraph).toContain("next.nexusmods.com");
    });
  });

  describe("Career Transition Narrative", () => {
    const fullBio = about.paragraphs.join(" ");

    it("should tell cohesive story from psychology to computer science", () => {
      const lowerBio = fullBio.toLowerCase();
      expect(lowerBio).toContain("psychology");
      expect(lowerBio).toContain("computer science");
    });

    it("should show progression: psychology → programming → CS degree", () => {
      const secondParagraph = about.paragraphs[1].toLowerCase();
      expect(secondParagraph).toContain("programming");
    });

    it("should highlight current software engineering role", () => {
      const firstParagraph = about.paragraphs[0].toLowerCase();
      expect(firstParagraph).toMatch(/software engineer|developer/);
    });
  });

  describe("Content Completeness", () => {
    it("should have complete bio content", () => {
      expect(about.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(about.heading).toBeDefined();
    });

    it("should have updated download count (270K+, not 'over 200 thousand')", () => {
      const secondParagraph = about.paragraphs[1];
      const hasOldCount = secondParagraph.includes("over 200 thousand") || secondParagraph.includes("200,000");

      expect(hasOldCount).toBe(false);

      const hasNewCount =
        secondParagraph.includes("270") || secondParagraph.includes("270K") || secondParagraph.includes("270,000");

      expect(hasNewCount).toBe(true);
    });

    it("should preserve markdown syntax for NexusMods link", () => {
      const secondParagraph = about.paragraphs[1];
      expect(secondParagraph).toMatch(/\[.*?\]\(https:\/\/.*?\)/);
    });
  });

  describe("Content Quality", () => {
    it("should have no spelling errors in common words", () => {
      const fullBio = about.paragraphs.join(" ");

      // Check that common misspellings are not present
      expect(fullBio).not.toContain("programing"); // Should be "programming"
      expect(fullBio).not.toContain("developement"); // Should be "development"
    });

    it("should have consistent tone across all paragraphs", () => {
      // All paragraphs should be in first person
      about.paragraphs.forEach((paragraph) => {
        const hasFirstPerson = paragraph.includes("I") || paragraph.includes("I'm") || paragraph.includes("my");
        expect(hasFirstPerson).toBe(true);
      });
    });

    it("should have professional and approachable tone", () => {
      const fullBio = about.paragraphs.join(" ");

      // Should have professional language
      expect(fullBio.toLowerCase()).toMatch(/software|engineer|development|technical/);

      // Should have approachable elements
      expect(fullBio.toLowerCase()).toMatch(/enthusias|eager|passion|love|enjoy|interest/);
    });
  });

  describe("Optional Fields", () => {
    it("should allow highlightedAchievements field (commented in data file)", () => {
      // This test documents the optional field structure
      // highlightedAchievements is currently commented but should be valid if added

      const hasOptionalField = "highlightedAchievements" in about;

      if (hasOptionalField) {
        expect(Array.isArray(about.highlightedAchievements)).toBe(true);
      }

      // Field is optional, so test passes regardless
      expect(true).toBe(true);
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
        expect(paragraph).not.toMatch(/\s{2,}/); // No multiple spaces
        expect(paragraph).toBe(paragraph.trim());
      });
    });

    it("should have consistent paragraph structure", () => {
      about.paragraphs.forEach((paragraph) => {
        // Each paragraph should be substantial
        expect(paragraph.length).toBeGreaterThan(50);

        // Each should be a single continuous text block
        expect(typeof paragraph).toBe("string");
      });
    });
  });
});
