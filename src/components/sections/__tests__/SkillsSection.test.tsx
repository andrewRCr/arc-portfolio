import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillsSection } from "../SkillsSection";
import { skills } from "@/data/skills";

// Categories displayed in DetailCards (excludes Languages and Methodologies)
const CARD_CATEGORIES = Object.keys(skills).filter((cat) => cat !== "Languages" && cat !== "Methodologies");

// DetailCard renders headings in bracket format: [category name]
const toHeadingFormat = (category: string) => `[${category.toLowerCase()}]`;

// Derive skill samples from data for resilient tests
const allSkills = Object.values(skills).flat();
const sampleSkillsWithIcons = allSkills.filter((s) => s.iconSlug).slice(0, 4);
const sampleSkillsWithoutIcons = allSkills.filter((s) => !s.iconSlug).slice(0, 3);

describe("SkillsSection", () => {
  describe("Languages Hero Row", () => {
    it("renders Languages skills in hero row above cards", () => {
      render(<SkillsSection />);

      // Languages should render but NOT in a DetailCard (no h2 heading for Languages)
      const headings = screen.getAllByRole("heading", { level: 2 });
      const headingTexts = headings.map((h) => h.textContent);
      expect(headingTexts).not.toContain(toHeadingFormat("Languages"));

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
        expect(screen.getByRole("heading", { name: toHeadingFormat(category), level: 2 })).toBeInTheDocument();
      });
    });

    it("does not render Methodologies category", () => {
      render(<SkillsSection />);

      expect(screen.queryByRole("heading", { name: toHeadingFormat("Methodologies") })).not.toBeInTheDocument();
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

      // Check a sampling of skills with icons render as links (derived from data)
      sampleSkillsWithIcons.forEach((skill) => {
        expect(screen.getByLabelText(`View projects using ${skill.name}`)).toBeInTheDocument();
      });
    });

    it("renders skills without icons as text links", () => {
      render(<SkillsSection />);

      // Check skills without icons render as text links (derived from data)
      sampleSkillsWithoutIcons.forEach((skill) => {
        const link = screen.getByRole("link", { name: skill.name });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", `/projects?skills=${encodeURIComponent(skill.name)}`);
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

      expect(renderedCategories).toEqual(CARD_CATEGORIES.map(toHeadingFormat));
    });
  });
});
