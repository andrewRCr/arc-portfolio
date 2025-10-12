/**
 * Type validation tests for Education interface
 *
 * Verifies that education data:
 * - Has required core fields
 * - Supports optional expansion fields
 * - Maintains type safety
 */

import { describe, it, expect } from "vitest";
import { education } from "@/data/education";
import type { Education } from "@/types/education";

describe("Education Interface", () => {
  it("should have education entries", () => {
    expect(education).toBeDefined();
    expect(Array.isArray(education)).toBe(true);
    expect(education.length).toBeGreaterThan(0);
  });

  it("should have all required fields", () => {
    education.forEach((entry) => {
      expect(entry.degree).toBeDefined();
      expect(typeof entry.degree).toBe("string");
      expect(entry.degree.length).toBeGreaterThan(0);

      expect(entry.major).toBeDefined();
      expect(typeof entry.major).toBe("string");
      expect(entry.major.length).toBeGreaterThan(0);

      expect(entry.institution).toBeDefined();
      expect(typeof entry.institution).toBe("string");
      expect(entry.institution.length).toBeGreaterThan(0);
    });
  });

  it("should allow optional fields", () => {
    // Type assertion to verify optional fields work
    const minimalEducation: Education = {
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "Test University",
    };

    const fullEducation: Education = {
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "Test University",
      location: "City, State",
      graduationDate: "2020",
      gpa: "3.8/4.0",
      honors: ["Dean's List"],
      relevantCoursework: ["Data Structures"],
    };

    expect(minimalEducation).toBeDefined();
    expect(fullEducation).toBeDefined();
    expect(minimalEducation.location).toBeUndefined();
    expect(fullEducation.location).toBe("City, State");
  });

  it("should have valid optional field types when present", () => {
    education.forEach((entry) => {
      if (entry.location) {
        expect(typeof entry.location).toBe("string");
      }
      if (entry.graduationDate) {
        expect(typeof entry.graduationDate).toBe("string");
      }
      if (entry.gpa) {
        expect(typeof entry.gpa).toBe("string");
      }
      if (entry.honors) {
        expect(Array.isArray(entry.honors)).toBe(true);
      }
      if (entry.relevantCoursework) {
        expect(Array.isArray(entry.relevantCoursework)).toBe(true);
      }
    });
  });
});
