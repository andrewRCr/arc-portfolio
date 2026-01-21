import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EducationCard } from "../EducationCard";
import type { Education } from "@/types/education";

const mockEducation: Education = {
  id: "test-degree",
  degree: "Bachelor of Science",
  major: "Computer Science",
  institution: "Test University",
  location: "Test City, State",
  graduationDate: "2022",
  gpa: "3.8/4.0",
};

const minimalEducation: Education = {
  id: "minimal-degree",
  degree: "Master of Arts",
  major: "Philosophy",
  institution: "Another University",
};

describe("EducationCard", () => {
  describe("Header rendering", () => {
    it("renders institution in header", () => {
      render(<EducationCard education={mockEducation} />);

      expect(screen.getByText("Test University")).toBeInTheDocument();
    });

    it("renders header with correct styling (bg-card/80)", () => {
      const { container } = render(<EducationCard education={mockEducation} />);

      // Header should have bg-card/80 class
      const header = container.querySelector("[class*='bg-card']");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Body rendering", () => {
    it("renders major with monospace font", () => {
      render(<EducationCard education={mockEducation} />);

      const major = screen.getByText("Computer Science");
      expect(major).toBeInTheDocument();
      expect(major).toHaveClass("font-mono");
    });

    it("renders degree type with monospace font", () => {
      render(<EducationCard education={mockEducation} />);

      const degree = screen.getByText("Bachelor of Science");
      expect(degree).toBeInTheDocument();
      expect(degree).toHaveClass("font-mono");
    });

    it("renders location when provided", () => {
      render(<EducationCard education={mockEducation} />);

      expect(screen.getByText("Test City, State")).toBeInTheDocument();
    });

    it("renders graduation date when provided", () => {
      render(<EducationCard education={mockEducation} />);

      expect(screen.getByText("2022")).toBeInTheDocument();
    });

    it("renders GPA when provided (without /4.0 suffix)", () => {
      render(<EducationCard education={mockEducation} />);

      // GPA "3.8/4.0" should render as "GPA: 3.8"
      expect(screen.getByText("GPA: 3.8")).toBeInTheDocument();
    });

    it("renders body with correct styling (bg-background/80)", () => {
      const { container } = render(<EducationCard education={mockEducation} />);

      // Body should have bg-background/80 class
      const body = container.querySelector("[class*='bg-background']");
      expect(body).toBeInTheDocument();
    });
  });

  describe("Optional fields", () => {
    it("renders without location when not provided", () => {
      render(<EducationCard education={minimalEducation} />);

      expect(screen.getByText("Philosophy")).toBeInTheDocument();
      expect(screen.getByText("Master of Arts")).toBeInTheDocument();
      expect(screen.getByText("Another University")).toBeInTheDocument();
      // Should not crash or show undefined
      expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    });

    it("renders without graduation date when not provided", () => {
      render(<EducationCard education={minimalEducation} />);

      // Component should render without errors
      expect(screen.getByText("Another University")).toBeInTheDocument();
    });

    it("renders without GPA when not provided", () => {
      render(<EducationCard education={minimalEducation} />);

      // Component should render without errors
      expect(screen.getByText("Another University")).toBeInTheDocument();
    });
  });

  describe("Card structure", () => {
    it("has unified border around entire card", () => {
      const { container } = render(<EducationCard education={mockEducation} />);

      // Should have border class on outer container
      const card = container.firstChild;
      expect(card).toHaveClass("border");
    });

    it("has rounded corners", () => {
      const { container } = render(<EducationCard education={mockEducation} />);

      const card = container.firstChild;
      expect(card).toHaveClass("rounded-lg");
    });
  });
});
