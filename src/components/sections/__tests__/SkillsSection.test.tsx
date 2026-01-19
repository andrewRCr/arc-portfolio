import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillsSection } from "../SkillsSection";
import { skills } from "@/data/skills";

const CATEGORY_COUNT = Object.keys(skills).length;

describe("SkillsSection", () => {
  describe("Category Rendering", () => {
    it("renders all skill categories as headings", () => {
      render(<SkillsSection />);

      Object.keys(skills).forEach((category) => {
        expect(screen.getByRole("heading", { name: new RegExp(category, "i") })).toBeInTheDocument();
      });
    });

    it("renders the correct number of category headings", () => {
      render(<SkillsSection />);

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings.length).toBe(CATEGORY_COUNT);
    });
  });

  describe("Skills Rendering", () => {
    it("renders skills from the data source", () => {
      render(<SkillsSection />);

      // Verify a sampling of skills actually render (integration check)
      // Using first skill from each of first 3 categories
      const categoriesToCheck = Object.keys(skills).slice(0, 3);
      categoriesToCheck.forEach((category) => {
        const firstSkill = skills[category as keyof typeof skills][0];
        expect(screen.getByText(firstSkill.name)).toBeInTheDocument();
      });
    });

    it("renders skill count matching data", () => {
      const { container } = render(<SkillsSection />);

      const totalSkills = Object.values(skills).reduce((sum, categorySkills) => sum + categorySkills.length, 0);
      const skillElements = container.querySelectorAll("li");
      expect(skillElements.length).toBe(totalSkills);
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

      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(CATEGORY_COUNT);
    });
  });

  describe("Category Order", () => {
    it("preserves category order from data structure", () => {
      render(<SkillsSection />);

      const headings = screen.getAllByRole("heading", { level: 3 });
      const renderedCategories = headings.map((h) => h.textContent);
      const dataCategories = Object.keys(skills);

      expect(renderedCategories).toEqual(dataCategories);
    });
  });
});
