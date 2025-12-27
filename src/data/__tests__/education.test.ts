/**
 * Data validation tests for education data file
 *
 * These tests verify that:
 * - Both degrees are present and properly structured
 * - All required fields are present and valid
 * - Optional fields (GPA, dates, location) are properly formatted
 * - Degrees are ordered correctly (most recent first)
 * - Data consistency and uniqueness constraints
 */

import { describe, it, expect } from "vitest";
import { education } from "@/data/education";

describe("Education Data Validation", () => {
  describe("Basic Structure", () => {
    it("should have at least 2 degrees", () => {
      expect(education).toBeDefined();
      expect(Array.isArray(education)).toBe(true);
      expect(education.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Required Fields Presence", () => {
    it("should have all required fields for every degree", () => {
      education.forEach((degree) => {
        // Core fields
        expect(degree.id).toBeDefined();
        expect(typeof degree.id).toBe("string");
        expect(degree.id.length).toBeGreaterThan(0);

        expect(degree.degree).toBeDefined();
        expect(typeof degree.degree).toBe("string");
        expect(degree.degree.length).toBeGreaterThan(0);

        expect(degree.major).toBeDefined();
        expect(typeof degree.major).toBe("string");
        expect(degree.major.length).toBeGreaterThan(0);

        expect(degree.institution).toBeDefined();
        expect(typeof degree.institution).toBe("string");
        expect(degree.institution.length).toBeGreaterThan(0);
      });
    });

    it("should have unique ids", () => {
      const ids = education.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have properly formatted optional fields when populated", () => {
      education.forEach((degree) => {
        if (degree.location) {
          expect(typeof degree.location).toBe("string");
          expect(degree.location.length).toBeGreaterThan(0);
        }

        if (degree.graduationDate) {
          expect(typeof degree.graduationDate).toBe("string");
          expect(degree.graduationDate.length).toBeGreaterThan(0);
        }

        if (degree.gpa) {
          expect(typeof degree.gpa).toBe("string");
          expect(degree.gpa.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("Computer Science Degree (OSU)", () => {
    it("should have Oregon State University Computer Science degree", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree).toBeDefined();
    });

    it("should have correct degree type", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree?.degree).toBe("Bachelor of Science");
    });

    it("should have correct institution", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree?.institution).toBe("Oregon State University");
    });

    it("should have location information", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree?.location).toBe("Corvallis, Oregon");
    });

    it("should have graduation date", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree?.graduationDate).toBe("2022");
    });

    it("should have GPA information", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree?.gpa).toBeDefined();
      expect(csDegree?.gpa).toMatch(/^\d+\.\d+\/\d+\.\d+$/); // Format: X.XX/Y.Y
    });

    it("should have GPA in valid range", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      expect(csDegree?.gpa).toBeDefined();
      expect(csDegree?.gpa).toMatch(/^\d+\.\d+\/\d+\.\d+$/);

      // GPA should be reasonable (between 2.0 and 4.0)
      const [earned] = csDegree!.gpa!.split("/").map((s) => parseFloat(s));
      expect(earned).toBeGreaterThanOrEqual(2.0);
      expect(earned).toBeLessThanOrEqual(4.0);
    });
  });

  describe("Psychology Degree (UTD)", () => {
    it("should have UT Dallas Psychology degree", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree).toBeDefined();
    });

    it("should have correct degree type", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree?.degree).toBe("Bachelor of Arts");
    });

    it("should have correct institution", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree?.institution).toBe("The University of Texas at Dallas");
    });

    it("should have location information", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree?.location).toBe("Richardson, Texas");
    });

    it("should have graduation date", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree?.graduationDate).toBe("2011");
    });

    it("should have GPA information", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree?.gpa).toBeDefined();
      expect(psychDegree?.gpa).toMatch(/^\d+\.\d+\/\d+\.\d+$/); // Format: X.XX/Y.Y
    });

    it("should have GPA in valid range", () => {
      const psychDegree = education.find((d) => d.major === "Psychology");
      expect(psychDegree?.gpa).toBeDefined();
      expect(psychDegree?.gpa).toMatch(/^\d+\.\d+\/\d+\.\d+$/);

      // GPA should be reasonable (between 2.0 and 4.0)
      const [earned] = psychDegree!.gpa!.split("/").map((s) => parseFloat(s));
      expect(earned).toBeGreaterThanOrEqual(2.0);
      expect(earned).toBeLessThanOrEqual(4.0);
    });
  });

  describe("Degree Ordering", () => {
    it("should have degrees ordered by graduation date (most recent first)", () => {
      // Create sorted copy and verify original matches
      const sorted = [...education].sort((a, b) => {
        const yearA = parseInt(a.graduationDate!, 10);
        const yearB = parseInt(b.graduationDate!, 10);
        return yearB - yearA; // Descending
      });

      education.forEach((degree, i) => {
        expect(degree.id).toBe(sorted[i].id);
      });
    });
  });

  describe("Data Format Validation", () => {
    it("should have properly formatted degree names", () => {
      // Current data only has Bachelor degrees; expand when adding Master's
      const validDegrees = ["Bachelor of Science", "Bachelor of Arts"];

      education.forEach((degree) => {
        expect(validDegrees).toContain(degree.degree);
      });
    });

    it("should have properly formatted GPA values", () => {
      education.forEach((degree) => {
        if (degree.gpa) {
          // Should match format: "X.X/Y.Y" or "X.XX/Y.Y"
          expect(degree.gpa).toMatch(/^\d+\.\d+\/\d+\.\d+$/);

          // Extract and validate numeric values
          const [earned, total] = degree.gpa.split("/").map((s) => parseFloat(s));
          expect(earned).toBeGreaterThan(0);
          expect(earned).toBeLessThanOrEqual(total);
          expect(total).toBe(4.0); // Standard 4.0 scale
        }
      });
    });

    it("should have properly formatted graduation dates", () => {
      education.forEach((degree) => {
        if (degree.graduationDate) {
          // Should be a 4-digit year
          expect(degree.graduationDate).toMatch(/^\d{4}$/);

          const year = parseInt(degree.graduationDate, 10);
          // Reasonable lower bound for modern degrees
          expect(year).toBeGreaterThan(1980);
          expect(year).toBeLessThanOrEqual(new Date().getFullYear());
        }
      });
    });

    it("should have properly formatted location strings", () => {
      education.forEach((degree) => {
        if (degree.location) {
          // Should contain city and state (e.g., "City, State")
          expect(degree.location).toContain(",");

          const parts = degree.location.split(",");
          expect(parts.length).toBeGreaterThanOrEqual(2);

          parts.forEach((part) => {
            expect(part.trim().length).toBeGreaterThan(0);
          });
        }
      });
    });
  });

  describe("Core Education Credentials", () => {
    it("should have core degrees", () => {
      const majors = education.map((d) => d.major);
      expect(majors).toContain("Computer Science");
      expect(majors).toContain("Psychology");
    });

    it("should have location, graduationDate, and gpa populated for all current entries", () => {
      // Data completeness check - type allows optional fields, but current dataset should be complete
      education.forEach((degree) => {
        expect(degree.location).toBeDefined();
        expect(degree.graduationDate).toBeDefined();
        expect(degree.gpa).toBeDefined();
      });
    });

    it("should reflect career transition narrative (Psychology → Computer Science)", () => {
      const csDegree = education.find((d) => d.major === "Computer Science");
      const psychDegree = education.find((d) => d.major === "Psychology");

      expect(csDegree).toBeDefined();
      expect(psychDegree).toBeDefined();

      // CS degree should be more recent
      const csYear = parseInt(csDegree!.graduationDate!, 10);
      const psychYear = parseInt(psychDegree!.graduationDate!, 10);
      expect(csYear).toBeGreaterThan(psychYear);
    });
  });

  describe("Data Consistency", () => {
    it("should have no duplicate degrees", () => {
      const degreeKeys = education.map((d) => `${d.degree}-${d.major}-${d.institution}`);
      const uniqueKeys = new Set(degreeKeys);
      expect(uniqueKeys.size).toBe(education.length);
    });
  });
});
