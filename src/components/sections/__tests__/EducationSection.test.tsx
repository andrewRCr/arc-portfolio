import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EducationSection } from "../EducationSection";

describe("EducationSection - Behavior Tests", () => {
  describe("Degree Rendering", () => {
    it("renders all degrees", () => {
      render(<EducationSection />);

      // Verify both degrees are present
      expect(screen.getByText(/Bachelor of Science/i)).toBeInTheDocument();
      expect(screen.getByText(/Bachelor of Arts/i)).toBeInTheDocument();
    });

    it("renders majors for each degree", () => {
      render(<EducationSection />);

      expect(screen.getByText(/Computer Science/i)).toBeInTheDocument();
      expect(screen.getByText(/Psychology/i)).toBeInTheDocument();
    });

    it("renders institutions for each degree", () => {
      render(<EducationSection />);

      expect(screen.getByText(/Oregon State University/i)).toBeInTheDocument();
      expect(screen.getByText(/The University of Texas at Dallas/i)).toBeInTheDocument();
    });

    it("renders at least 2 education entries", () => {
      const { container } = render(<EducationSection />);

      // Education entries should be list items or similar elements
      const entries = container.querySelectorAll("li");
      expect(entries.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Optional Fields Rendering", () => {
    it("renders locations when provided", () => {
      render(<EducationSection />);

      expect(screen.getByText(/Corvallis, Oregon/i)).toBeInTheDocument();
      expect(screen.getByText(/Richardson, Texas/i)).toBeInTheDocument();
    });

    it("renders graduation dates when provided", () => {
      render(<EducationSection />);

      expect(screen.getByText(/2022/)).toBeInTheDocument();
      expect(screen.getByText(/2011/)).toBeInTheDocument();
    });

    it("renders GPA when provided", () => {
      render(<EducationSection />);

      expect(screen.getByText(/3\.74/)).toBeInTheDocument();
      expect(screen.getByText(/3\.3/)).toBeInTheDocument();
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<EducationSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("uses list structure for education entries", () => {
      const { container } = render(<EducationSection />);

      const ul = container.querySelector("ul");
      expect(ul).toBeInTheDocument();
    });

    it("has a main heading for the section", () => {
      render(<EducationSection />);

      const mainHeading = screen.getByRole("heading", { level: 2, name: /education/i });
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe("Data Integration", () => {
    it("renders actual education data from data/education.ts", () => {
      render(<EducationSection />);

      // Verify specific data from education.ts
      expect(screen.getByText(/Bachelor of Science/i)).toBeInTheDocument();
      expect(screen.getByText(/Computer Science/i)).toBeInTheDocument();
      expect(screen.getByText(/Oregon State University/i)).toBeInTheDocument();
      expect(screen.getByText(/Bachelor of Arts/i)).toBeInTheDocument();
      expect(screen.getByText(/Psychology/i)).toBeInTheDocument();
      expect(screen.getByText(/The University of Texas at Dallas/i)).toBeInTheDocument();
    });

    it("preserves degree order from data structure", () => {
      const { container } = render(<EducationSection />);

      const entries = container.querySelectorAll("li");
      const firstEntry = entries[0];
      const secondEntry = entries[1];

      // First degree should be CS (more recent)
      expect(firstEntry?.textContent).toMatch(/Computer Science/i);
      // Second degree should be Psychology
      expect(secondEntry?.textContent).toMatch(/Psychology/i);
    });
  });
});
