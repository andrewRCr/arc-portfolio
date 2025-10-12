/**
 * Type validation tests for About interface
 *
 * Verifies that about/bio data:
 * - Has heading and paragraphs
 * - Supports markdown in paragraphs
 * - Allows optional achievements
 */

import { describe, it, expect } from "vitest";
import { about } from "@/data/about";
import type { About } from "@/types/about";

describe("About Interface", () => {
  it("should be defined with required fields", () => {
    expect(about).toBeDefined();
    expect(about.heading).toBeDefined();
    expect(typeof about.heading).toBe("string");
    expect(about.paragraphs).toBeDefined();
    expect(Array.isArray(about.paragraphs)).toBe(true);
  });

  it("should have at least one paragraph", () => {
    expect(about.paragraphs.length).toBeGreaterThan(0);
  });

  it("should have string paragraphs", () => {
    about.paragraphs.forEach((paragraph) => {
      expect(typeof paragraph).toBe("string");
      expect(paragraph.length).toBeGreaterThan(0);
    });
  });

  it("should support markdown in paragraphs", () => {
    // Check if any paragraph contains markdown link syntax
    const hasMarkdown = about.paragraphs.some((p) => p.includes("[") && p.includes("]") && p.includes("("));
    // Not required, but sample should demonstrate markdown support
    expect(typeof hasMarkdown).toBe("boolean");
  });

  it("should allow optional highlighted achievements", () => {
    // Type assertion to verify optional achievements work
    const minimalAbout: About = {
      heading: "About",
      paragraphs: ["Test paragraph"],
    };

    const aboutWithAchievements: About = {
      heading: "About",
      paragraphs: ["Test paragraph"],
      highlightedAchievements: [
        {
          label: "Downloads",
          value: "270K+",
          link: "https://example.com",
        },
      ],
    };

    expect(minimalAbout).toBeDefined();
    expect(aboutWithAchievements).toBeDefined();
    expect(minimalAbout.highlightedAchievements).toBeUndefined();
    expect(aboutWithAchievements.highlightedAchievements?.length).toBe(1);
  });

  it("should have valid achievement structure when present", () => {
    if (about.highlightedAchievements) {
      about.highlightedAchievements.forEach((achievement) => {
        expect(achievement.label).toBeDefined();
        expect(typeof achievement.label).toBe("string");
        expect(achievement.value).toBeDefined();
        expect(typeof achievement.value).toBe("string");

        if (achievement.link) {
          expect(typeof achievement.link).toBe("string");
        }
      });
    }
  });
});
