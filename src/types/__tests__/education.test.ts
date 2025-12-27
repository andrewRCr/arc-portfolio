/**
 * Type-level tests for Education interface
 *
 * Pure type assertions verifying the Education interface structure.
 * Data validation tests live in data/__tests__/education.test.ts.
 */

import { describe, it, expect } from "vitest";
import type { Education } from "@/types/education";

describe("Education Interface", () => {
  it("should require id, degree, major, and institution fields", () => {
    const education: Education = {
      id: "test-id",
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "Test University",
    };

    expect(education.id).toBe("test-id");
    expect(education.degree).toBe("Bachelor of Science");
    expect(education.major).toBe("Computer Science");
    expect(education.institution).toBe("Test University");
  });

  it("should allow optional fields", () => {
    const minimalEducation: Education = {
      id: "test-minimal",
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "Test University",
    };

    const fullEducation: Education = {
      id: "test-full",
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "Test University",
      location: "City, State",
      graduationDate: "2020",
      gpa: "3.8/4.0",
      relevantCoursework: ["Data Structures", "Algorithms"],
    };

    // Minimal has no optional fields
    expect(minimalEducation.location).toBeUndefined();
    expect(minimalEducation.graduationDate).toBeUndefined();
    expect(minimalEducation.gpa).toBeUndefined();
    expect(minimalEducation.relevantCoursework).toBeUndefined();

    // Full has all optional fields
    expect(fullEducation.location).toBe("City, State");
    expect(fullEducation.graduationDate).toBe("2020");
    expect(fullEducation.gpa).toBe("3.8/4.0");
    expect(fullEducation.relevantCoursework).toEqual(["Data Structures", "Algorithms"]);
  });
});
