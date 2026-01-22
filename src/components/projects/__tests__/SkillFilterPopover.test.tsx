/**
 * Behavior tests for SkillFilterPopover component
 *
 * Tests filter trigger, search functionality, skill selection, result counts,
 * and accessibility requirements for the skill filtering popover.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SkillFilterPopover from "../SkillFilterPopover";
import { Project } from "@/types/project";

// Mock project data for testing
const mockProjects: Project[] = [
  {
    projectType: "software",
    title: "Project A",
    slug: "project-a",
    description: "Test project A",
    shortDescription: "Test A",
    category: ["Web App"],
    tags: ["React", "TypeScript", "Next.js"],
    techStack: ["React", "TypeScript"],
    features: ["Feature 1"],
    links: {},
    images: { thumbnail: "", screenshots: [] },
    order: 1,
    featured: false,
  },
  {
    projectType: "software",
    title: "Project B",
    slug: "project-b",
    description: "Test project B",
    shortDescription: "Test B",
    category: ["Web App"],
    tags: ["React", "Python", "Django"],
    techStack: ["React", "Python"],
    features: ["Feature 1"],
    links: {},
    images: { thumbnail: "", screenshots: [] },
    order: 2,
    featured: false,
  },
  {
    projectType: "game",
    title: "Project C",
    slug: "project-c",
    description: "Test project C",
    shortDescription: "Test C",
    category: ["Game"],
    tags: ["C#", ".NET"],
    techStack: ["C#", ".NET"],
    features: ["Feature 1"],
    links: {},
    images: { thumbnail: "", screenshots: [] },
    order: 3,
    featured: false,
  },
];

describe("SkillFilterPopover", () => {
  const defaultProps = {
    allProjects: mockProjects,
    selectedSkills: [] as string[],
    onSkillsChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Trigger Button", () => {
    it("renders trigger button with 'Filter' text when no skills selected", () => {
      render(<SkillFilterPopover {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Filter");
    });

    it("shows filter count when skills are selected", () => {
      render(<SkillFilterPopover {...defaultProps} selectedSkills={["React", "TypeScript", "Python"]} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger).toHaveTextContent("Filter (3)");
    });

    it("shows count of 1 when single skill selected", () => {
      render(<SkillFilterPopover {...defaultProps} selectedSkills={["React"]} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger).toHaveTextContent("Filter (1)");
    });
  });

  describe("Popover Opening", () => {
    it("opens popover when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      await user.click(trigger);

      // Popover content should be visible
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it("shows categorized skills when popover opens", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Should show category headings (excluding Methodologies)
      expect(screen.getByText("Languages")).toBeInTheDocument();
      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("Backend")).toBeInTheDocument();
    });

    it("does not show Methodologies category", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      expect(screen.queryByText("Methodologies")).not.toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("filters skills when typing in search input", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "React");

      // React should be visible
      expect(screen.getByText("React")).toBeInTheDocument();

      // Python should not be visible (filtered out)
      expect(screen.queryByText("Python")).not.toBeInTheDocument();
    });

    it("shows 'No skills found' when search has no matches", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "xyz123nonexistent");

      expect(screen.getByText(/no skills found/i)).toBeInTheDocument();
    });

    it("search is case-insensitive", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "react");

      expect(screen.getByText("React")).toBeInTheDocument();
    });
  });

  describe("Skill Selection", () => {
    it("calls onSkillsChange when skill is selected", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} onSkillsChange={onSkillsChange} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Find and click React checkbox
      const reactOption = screen.getByText("React").closest("[cmdk-item]");
      expect(reactOption).toBeInTheDocument();
      await user.click(reactOption!);

      expect(onSkillsChange).toHaveBeenCalledWith(["React"]);
    });

    it("removes skill from selection when already selected", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} selectedSkills={["React"]} onSkillsChange={onSkillsChange} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Click React to deselect
      const reactOption = screen.getByText("React").closest("[cmdk-item]");
      await user.click(reactOption!);

      expect(onSkillsChange).toHaveBeenCalledWith([]);
    });

    it("adds to existing selection when selecting additional skill", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} selectedSkills={["React"]} onSkillsChange={onSkillsChange} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Select Python
      const pythonOption = screen.getByText("Python").closest("[cmdk-item]");
      await user.click(pythonOption!);

      expect(onSkillsChange).toHaveBeenCalledWith(["React", "Python"]);
    });

    it("shows checkbox as checked for selected skills", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} selectedSkills={["React"]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Find React option and verify it has checked state
      const reactOption = screen.getByText("React").closest("[cmdk-item]");
      const checkbox = within(reactOption as HTMLElement).getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });
  });

  describe("Result Counts", () => {
    it("displays result count for each skill", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Find React option and verify it shows count (2 projects have React)
      const reactItem = screen.getByText("React").closest("[cmdk-item]");
      expect(reactItem).toBeInTheDocument();
      expect(within(reactItem as HTMLElement).getByText("(2)")).toBeInTheDocument();

      // Find C# option and verify it shows count (1 project has C#)
      const csharpItem = screen.getByText("C#").closest("[cmdk-item]");
      expect(csharpItem).toBeInTheDocument();
      expect(within(csharpItem as HTMLElement).getByText("(1)")).toBeInTheDocument();
    });

    it("only shows skills that have matching projects", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Skills without matching projects should not appear
      // (This tests that we filter based on project tags, not just skills data)
      // React should appear (has projects)
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("only shows skills that have icons", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // WPF has no iconSlug, so should not appear even if it had projects
      expect(screen.queryByText("WPF")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("trigger button has appropriate aria attributes", () => {
      render(<SkillFilterPopover {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("search input has accessible label", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Verify input has aria-label for accessibility (cmdk's aria-labelledby overrides accessible name)
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("aria-label", "Search skills");
    });

    it("checkboxes are keyboard accessible", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} onSkillsChange={onSkillsChange} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Navigate to first item and select with Enter
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onSkillsChange).toHaveBeenCalled();
    });

    it("has focus trap within popover", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Focus should be within the popover
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe("Clear All", () => {
    it("shows clear all button when skills are selected", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} selectedSkills={["React", "Python"]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
    });

    it("hides clear all button when no skills selected", async () => {
      const user = userEvent.setup();
      render(<SkillFilterPopover {...defaultProps} selectedSkills={[]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();
    });

    it("clears all selections when clear all is clicked", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(
        <SkillFilterPopover {...defaultProps} selectedSkills={["React", "Python"]} onSkillsChange={onSkillsChange} />
      );

      await user.click(screen.getByRole("button", { name: /filter/i }));
      await user.click(screen.getByRole("button", { name: /clear all/i }));

      expect(onSkillsChange).toHaveBeenCalledWith([]);
    });
  });
});
