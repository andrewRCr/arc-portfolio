import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EducationSection } from "../EducationSection";
import { education } from "@/data/education";

describe("EducationSection", () => {
  describe("Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<EducationSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("has a main heading for the section", () => {
      render(<EducationSection />);

      const mainHeading = screen.getByRole("heading", { level: 2, name: /education/i });
      expect(mainHeading).toBeInTheDocument();
    });

    it("renders education entries in a grid container", () => {
      const { container } = render(<EducationSection />);

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Data rendering", () => {
    it("renders one EducationCard per education entry", () => {
      const { container } = render(<EducationSection />);

      // Each EducationCard has border-border-strong class
      const cards = container.querySelectorAll(".border-border-strong");
      expect(cards.length).toBe(education.length);
    });

    it("renders degree headings for each education entry", () => {
      render(<EducationSection />);

      // EducationCard renders degrees as h3 headings
      const degreeHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(degreeHeadings.length).toBe(education.length);
    });

    it("renders institution in header for each entry", () => {
      render(<EducationSection />);

      // Each education entry should have its institution rendered in heading
      education.forEach((edu) => {
        expect(screen.getByText(edu.institution)).toBeInTheDocument();
      });
    });

    it("renders major and degree as separate badges for each entry", () => {
      render(<EducationSection />);

      // Each entry should have major (accent badge) and degree (secondary pill) separately
      education.forEach((edu) => {
        expect(screen.getByText(edu.major)).toBeInTheDocument();
        expect(screen.getByText(edu.degree)).toBeInTheDocument();
      });
    });
  });

  describe("Optional fields", () => {
    it("renders location badges when provided", () => {
      render(<EducationSection />);

      const entriesWithLocation = education.filter((edu) => edu.location);
      entriesWithLocation.forEach((edu) => {
        expect(screen.getByText(edu.location!)).toBeInTheDocument();
      });
    });

    it("renders graduation year badges when provided", () => {
      render(<EducationSection />);

      const entriesWithDate = education.filter((edu) => edu.graduationDate);
      entriesWithDate.forEach((edu) => {
        expect(screen.getByText(edu.graduationDate!)).toBeInTheDocument();
      });
    });

    it("renders GPA badges when provided", () => {
      render(<EducationSection />);

      const entriesWithGpa = education.filter((edu) => edu.gpa);
      entriesWithGpa.forEach((edu) => {
        // GPA renders as "GPA: X.XX" (without /4.0)
        const gpaValue = edu.gpa!.split("/")[0];
        expect(screen.getByText(`GPA: ${gpaValue}`)).toBeInTheDocument();
      });
    });
  });
});
