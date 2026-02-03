import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EducationCard } from "../EducationCard";
import type { Education } from "@/types/education";

// Mock useIsPhone hook
vi.mock("@/hooks/useMediaQuery", () => ({
  useIsPhone: vi.fn(() => false), // Default to desktop
}));

import { useIsPhone } from "@/hooks/useMediaQuery";

const mockEducation: Education = {
  id: "test-degree",
  degree: "Bachelor of Science",
  major: "Computer Science",
  institution: "Test University",
  location: "Portland, Oregon",
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

    it("renders header with correct styling (bg-surface-card)", () => {
      render(<EducationCard education={mockEducation} />);

      const header = screen.getByTestId("education-card-header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("bg-surface-card");
    });
  });

  describe("Body rendering", () => {
    it("renders major with terminal font", () => {
      render(<EducationCard education={mockEducation} />);

      const major = screen.getByText("Computer Science");
      expect(major).toBeInTheDocument();
      expect(major).toHaveClass("font-terminal");
    });

    it("renders degree type with terminal font", () => {
      render(<EducationCard education={mockEducation} />);

      const degree = screen.getByText("Bachelor of Science");
      expect(degree).toBeInTheDocument();
      expect(degree).toHaveClass("font-terminal");
    });

    it("renders full location on desktop", () => {
      render(<EducationCard education={mockEducation} />);

      expect(screen.getByText("Portland, Oregon")).toBeInTheDocument();
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

    it("renders body with correct styling (bg-surface-background)", () => {
      render(<EducationCard education={mockEducation} />);

      const body = screen.getByTestId("education-card-body");
      expect(body).toBeInTheDocument();
      expect(body).toHaveClass("bg-surface-background");
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

  describe("phone viewport", () => {
    beforeEach(() => {
      vi.mocked(useIsPhone).mockReturnValue(true);
    });

    afterEach(() => {
      // Restore to desktop default (mockReset would return undefined, not false)
      vi.mocked(useIsPhone).mockReturnValue(false);
    });

    it("abbreviates state names in location", () => {
      render(<EducationCard education={mockEducation} />);

      // "Portland, Oregon" should become "Portland, OR"
      expect(screen.getByText("Portland, OR")).toBeInTheDocument();
      expect(screen.queryByText("Portland, Oregon")).not.toBeInTheDocument();
    });

    it("removes leading 'The ' from institution name", () => {
      const educationWithThe: Education = {
        ...mockEducation,
        institution: "The Ohio State University",
      };
      render(<EducationCard education={educationWithThe} />);

      expect(screen.getByText("Ohio State University")).toBeInTheDocument();
      expect(screen.queryByText("The Ohio State University")).not.toBeInTheDocument();
    });

    it("keeps institution name without leading 'The ' unchanged", () => {
      render(<EducationCard education={mockEducation} />);

      expect(screen.getByText("Test University")).toBeInTheDocument();
    });
  });
});
