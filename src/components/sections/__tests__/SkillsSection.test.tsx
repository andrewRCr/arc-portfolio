import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillsSection } from "../SkillsSection";
import { skills } from "@/data/skills";

/**
 * Expected category count derived from SkillCategory union type.
 * Update if categories are added/removed in types/skills.ts.
 */
const EXPECTED_CATEGORIES = Object.keys(skills).length;

describe("SkillsSection - Behavior Tests", () => {
  describe("Category Rendering", () => {
    it("renders all skill categories as headings", () => {
      render(<SkillsSection />);

      // Verify category headings are present
      expect(screen.getByRole("heading", { name: /languages/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /frontend/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /backend/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /databases/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /ai-assisted development/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /devops & infrastructure/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /testing & quality/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /methodologies/i })).toBeInTheDocument();
    });

    it("renders all skill categories", () => {
      render(<SkillsSection />);

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings.length).toBe(EXPECTED_CATEGORIES);
    });
  });

  describe("Skills Rendering", () => {
    it("renders skills for Languages category", () => {
      render(<SkillsSection />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("C#")).toBeInTheDocument();
    });

    it("renders skills for Frontend category", () => {
      render(<SkillsSection />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
    });

    it("renders skills for Backend category", () => {
      render(<SkillsSection />);

      expect(screen.getByText("Django")).toBeInTheDocument();
      expect(screen.getByText("Django Ninja")).toBeInTheDocument();
      expect(screen.getByText(".NET")).toBeInTheDocument();
    });

    it("renders skills for Databases category", () => {
      render(<SkillsSection />);

      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("MongoDB")).toBeInTheDocument();
    });

    it("renders at least 40 total skills across all categories", () => {
      const { container } = render(<SkillsSection />);

      // Current data contains 40+ skills across 8 categories.
      // Update threshold if skills data changes significantly.
      const skillElements = container.querySelectorAll("li");
      expect(skillElements.length).toBeGreaterThanOrEqual(40);
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<SkillsSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("uses list structure for skills within categories", () => {
      const { container } = render(<SkillsSection />);

      // One list per category
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(EXPECTED_CATEGORIES);
    });

    it("has a main heading for the section", () => {
      render(<SkillsSection />);

      const mainHeading = screen.getByRole("heading", { level: 2, name: /skills/i });
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe("Data Integration", () => {
    it("renders actual skills data from data/skills.ts", () => {
      render(<SkillsSection />);

      // Verify some specific skills from each category to ensure data integration
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Django")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("Claude Code")).toBeInTheDocument();
      expect(screen.getByText("Git")).toBeInTheDocument();
      expect(screen.getByText("Vitest")).toBeInTheDocument();
      expect(screen.getByText("Test-Driven Development (TDD)")).toBeInTheDocument();
    });

    it("preserves category order from data structure", () => {
      render(<SkillsSection />);

      const headings = screen.getAllByRole("heading", { level: 3 });
      const categoryNames = headings.map((h) => h.textContent);

      // First category should be Languages
      expect(categoryNames[0]).toMatch(/languages/i);
      // Second category should be Frontend
      expect(categoryNames[1]).toMatch(/frontend/i);
      // Third category should be Backend
      expect(categoryNames[2]).toMatch(/backend/i);
    });
  });
});
