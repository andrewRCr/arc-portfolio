import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillsSection } from "../SkillsSection";
import { skills } from "@/data/skills";

// Categories displayed in DetailCards (excludes Languages and Methodologies)
const CARD_CATEGORIES = Object.keys(skills).filter((cat) => cat !== "Languages" && cat !== "Methodologies");

describe("SkillsSection", () => {
  describe("Languages Hero Row", () => {
    it("renders Languages skills in hero row above cards", () => {
      render(<SkillsSection />);

      // Languages should render but NOT in a DetailCard (no h2 heading for Languages)
      const headings = screen.getAllByRole("heading", { level: 2 });
      const headingTexts = headings.map((h) => h.textContent);
      expect(headingTexts).not.toContain("Languages");

      // But Languages skills should still be present (as SVG icons via SkillLogoGrid)
      const languageSkills = skills.Languages;
      languageSkills.forEach((skill) => {
        if (skill.iconSlug) {
          // Skills with icons render as links with aria-label
          expect(screen.getByLabelText(`View projects using ${skill.name}`)).toBeInTheDocument();
        }
      });
    });
  });

  describe("Category Cards", () => {
    it("renders DetailCards for non-excluded categories", () => {
      render(<SkillsSection />);

      // Each card category should have an h2 heading (from DetailCard)
      CARD_CATEGORIES.forEach((category) => {
        expect(screen.getByRole("heading", { name: category, level: 2 })).toBeInTheDocument();
      });
    });

    it("does not render Methodologies category", () => {
      render(<SkillsSection />);

      expect(screen.queryByRole("heading", { name: "Methodologies" })).not.toBeInTheDocument();
    });

    it("renders correct number of category cards", () => {
      render(<SkillsSection />);

      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings.length).toBe(CARD_CATEGORIES.length);
    });
  });

  describe("Skills Rendering", () => {
    it("renders skills with icons as logo grid links", () => {
      render(<SkillsSection />);

      // Check a sampling of skills with icons render as links
      const skillsWithIcons = ["React", "Django", "PostgreSQL", "Docker"];
      skillsWithIcons.forEach((skillName) => {
        expect(screen.getByLabelText(`View projects using ${skillName}`)).toBeInTheDocument();
      });
    });

    it("renders skills without icons as text links", () => {
      render(<SkillsSection />);

      // Check skills without icons render as text links
      const skillsWithoutIcons = ["WPF", "Entity Framework", "SQL Server"];
      skillsWithoutIcons.forEach((skillName) => {
        const link = screen.getByRole("link", { name: skillName });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", `/projects?skills=${encodeURIComponent(skillName)}`);
      });
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<SkillsSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("uses list structure for secondary skills", () => {
      const { container } = render(<SkillsSection />);

      // ULs are used for secondary (text-only) skills
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe("Category Order", () => {
    it("preserves category order from data structure", () => {
      render(<SkillsSection />);

      const headings = screen.getAllByRole("heading", { level: 2 });
      const renderedCategories = headings.map((h) => h.textContent);

      expect(renderedCategories).toEqual(CARD_CATEGORIES);
    });
  });
});
