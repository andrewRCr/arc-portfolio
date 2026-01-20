import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillLogoGrid } from "../SkillLogoGrid";
import type { Skill } from "@/types/skills";

// Mock skill-icons to control icon availability in tests
vi.mock("@/lib/skill-icons", () => ({
  getSkillIcon: vi.fn((slug: string) => {
    // Return mock icon data for known slugs
    const mockIcons: Record<string, { title: string; slug: string; path: string; hex: string }> = {
      typescript: { title: "TypeScript", slug: "typescript", path: "M0 0h24v24H0z", hex: "3178C6" },
      react: { title: "React", slug: "react", path: "M0 0h24v24H0z", hex: "61DAFB" },
      python: { title: "Python", slug: "python", path: "M0 0h24v24H0z", hex: "3776AB" },
    };
    return mockIcons[slug] ?? null;
  }),
  hasSkillIcon: vi.fn((slug: string) => ["typescript", "react", "python"].includes(slug)),
}));

// Test data
const skillsWithIcons: Skill[] = [
  { name: "TypeScript", iconSlug: "typescript", featured: true },
  { name: "React", iconSlug: "react", featured: true },
  { name: "Python", iconSlug: "python", featured: true },
];

const skillsWithMixedIcons: Skill[] = [
  { name: "TypeScript", iconSlug: "typescript" },
  { name: "JavaScript", iconSlug: "nonexistent" }, // No icon available
  { name: "Go" }, // No iconSlug provided
  { name: "React", iconSlug: "react" },
];

const skillsWithoutIcons: Skill[] = [{ name: "Agile" }, { name: "Scrum" }, { name: "TDD" }];

describe("SkillLogoGrid", () => {
  describe("Logo Rendering", () => {
    it("renders correct number of logos for skills with icons", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} />);

      const logos = container.querySelectorAll("svg");
      expect(logos).toHaveLength(3);
    });

    it("renders SVG elements for each skill with valid icon", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} />);

      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(3);
    });

    it("includes accessible labels when linkToProjects is enabled", () => {
      render(<SkillLogoGrid skills={skillsWithIcons} linkToProjects={true} />);

      expect(screen.getByLabelText("View projects using TypeScript")).toBeInTheDocument();
      expect(screen.getByLabelText("View projects using React")).toBeInTheDocument();
      expect(screen.getByLabelText("View projects using Python")).toBeInTheDocument();
    });
  });

  describe("Layout Prop", () => {
    it("applies row layout class when layout='row'", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} layout="row" />);

      const grid = container.firstElementChild;
      expect(grid).toHaveClass("flex");
    });

    it("applies grid layout class when layout='grid'", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} layout="grid" />);

      const grid = container.firstElementChild;
      expect(grid).toHaveClass("grid");
    });

    it("defaults to row layout when no layout prop provided", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} />);

      const grid = container.firstElementChild;
      expect(grid).toHaveClass("flex");
    });
  });

  describe("Size Prop", () => {
    it("applies small size class when size='sm'", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} size="sm" />);

      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveClass("w-6", "h-6");
      });
    });

    it("applies medium size class when size='md'", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} size="md" />);

      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveClass("w-8", "h-8");
      });
    });

    it("applies large size class when size='lg'", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} size="lg" />);

      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveClass("w-12", "h-12");
      });
    });

    it("defaults to medium size when no size prop provided", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} />);

      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveClass("w-8", "h-8");
      });
    });
  });

  describe("Link Behavior", () => {
    it("wraps logos in links when linkToProjects is true", () => {
      render(<SkillLogoGrid skills={skillsWithIcons} linkToProjects={true} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);
    });

    it("links point to projects page with skill filter", () => {
      render(<SkillLogoGrid skills={skillsWithIcons} linkToProjects={true} />);

      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveAttribute("href", "/projects?skills=TypeScript");
      expect(links[1]).toHaveAttribute("href", "/projects?skills=React");
      expect(links[2]).toHaveAttribute("href", "/projects?skills=Python");
    });

    it("does not wrap logos in links when linkToProjects is false", () => {
      render(<SkillLogoGrid skills={skillsWithIcons} linkToProjects={false} />);

      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(0);
    });

    it("does not wrap logos in links by default", () => {
      render(<SkillLogoGrid skills={skillsWithIcons} />);

      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(0);
    });
  });

  describe("Missing Icons Handling", () => {
    it("only renders logos for skills with valid icons", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithMixedIcons} />);

      // Should only render TypeScript and React (2 valid icons)
      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(2);
    });

    it("renders nothing when no skills have icons", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithoutIcons} />);

      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(0);
    });

    it("renders empty container when given empty skills array", () => {
      const { container } = render(<SkillLogoGrid skills={[]} />);

      expect(container.firstElementChild).toBeInTheDocument();
      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(0);
    });
  });

  describe("Accessibility", () => {
    it("logos have appropriate aria-hidden attribute", () => {
      const { container } = render(<SkillLogoGrid skills={skillsWithIcons} />);

      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("links have accessible names when linkToProjects is true", () => {
      render(<SkillLogoGrid skills={skillsWithIcons} linkToProjects={true} />);

      expect(screen.getByRole("link", { name: /typescript/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /react/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /python/i })).toBeInTheDocument();
    });
  });
});
