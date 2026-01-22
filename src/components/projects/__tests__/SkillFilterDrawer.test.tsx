/**
 * SkillFilterDrawer Component Tests (TDD)
 *
 * Tests the mobile bottom sheet variant of the skill filter.
 * Mirrors SkillFilterPopover behavior but adapted for touch interaction.
 * TDD approach - tests written before implementation.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y, axe } from "@tests/test-utils";
import SkillFilterDrawer from "../SkillFilterDrawer";
import { Project } from "@/types/project";

// Mock project data for testing (same as SkillFilterPopover tests)
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

describe("SkillFilterDrawer", () => {
  const defaultProps = {
    allProjects: mockProjects,
    selectedSkills: [] as string[],
    onSkillsChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Trigger Button", () => {
    it("renders trigger button with filter icon", () => {
      render(<SkillFilterDrawer {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger).toBeInTheDocument();
    });

    it("shows filter count when skills are selected", () => {
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={["React", "TypeScript", "Python"]} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger).toHaveTextContent("Filter (3)");
    });
  });

  describe("Drawer Opening", () => {
    it("opens drawer on trigger click", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      await user.click(trigger);

      // Drawer content should be visible (sheet content element)
      const sheetContent = document.querySelector('[data-slot="sheet-content"]');
      expect(sheetContent).toBeInTheDocument();
    });

    it("displays 'Filter Skills' title in drawer header", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      expect(screen.getByText("Filter Skills")).toBeInTheDocument();
    });
  });

  describe("Categorized Skills", () => {
    it("displays categorized skill list", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Should show category headings
      expect(screen.getByText("Languages")).toBeInTheDocument();
      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("Backend")).toBeInTheDocument();
    });

    it("displays skills within categories", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Skills should be visible
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("displays result count for each skill", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // React has 2 projects
      const reactItem = screen.getByText("React").closest("[data-skill-item]");
      expect(reactItem).not.toBeNull();
      expect(within(reactItem as HTMLElement).getByText("(2)")).toBeInTheDocument();
    });
  });

  describe("Skill Selection", () => {
    it("toggles skill selection on click", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} onSkillsChange={onSkillsChange} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Find and click React skill
      const reactItem = screen.getByText("React").closest("[data-skill-item]");
      expect(reactItem).not.toBeNull();
      await user.click(reactItem!);

      expect(onSkillsChange).toHaveBeenCalledWith(["React"]);
    });

    it("removes skill from selection when already selected", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={["React"]} onSkillsChange={onSkillsChange} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Click React to deselect
      const reactItem = screen.getByText("React").closest("[data-skill-item]");
      expect(reactItem).not.toBeNull();
      await user.click(reactItem!);

      expect(onSkillsChange).toHaveBeenCalledWith([]);
    });

    it("shows checkbox as checked for selected skills", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={["React"]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // CommandItem has aria-checked - find by text and verify attribute
      const reactOption = screen.getByText("React").closest("[data-skill-item]");
      expect(reactOption).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Clear All", () => {
    it("enables clear all button when skills are selected", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={["React", "Python"]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      const clearButton = screen.getByRole("button", { name: /clear all/i });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toBeEnabled();
    });

    it("disables clear all button when no skills selected", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={[]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Clear all is always visible for stable height, but disabled when empty
      const clearButton = screen.getByRole("button", { name: /clear all/i });
      expect(clearButton).toBeDisabled();
    });

    it("clears all selections when clear all is clicked", async () => {
      const onSkillsChange = vi.fn();
      const user = userEvent.setup();
      render(
        <SkillFilterDrawer {...defaultProps} selectedSkills={["React", "Python"]} onSkillsChange={onSkillsChange} />
      );

      await user.click(screen.getByRole("button", { name: /filter/i }));
      await user.click(screen.getByRole("button", { name: /clear all/i }));

      expect(onSkillsChange).toHaveBeenCalledWith([]);
    });
  });

  describe("Close Behavior", () => {
    it("close button closes the drawer", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      // Open drawer
      await user.click(screen.getByRole("button", { name: /filter/i }));
      expect(screen.getByText("Filter Skills")).toBeInTheDocument();

      // Close via close button
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // Drawer should be closed
      expect(screen.queryByText("Filter Skills")).not.toBeInTheDocument();
    });
  });

  describe("Touch Targets", () => {
    it("trigger button has 44px minimum touch target", () => {
      render(<SkillFilterDrawer {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /filter/i });
      expect(trigger.className).toMatch(/min-h-11/);
      expect(trigger.className).toMatch(/min-w-11/);
    });

    it("skill items have 44px minimum touch target height", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      const reactItem = screen.getByText("React").closest("[data-skill-item]");
      expect(reactItem).not.toBeNull();
      expect(reactItem!.className).toMatch(/min-h-11/);
    });

    it("clear all button has 44px minimum touch target", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={["React"]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      const clearButton = screen.getByRole("button", { name: /clear all/i });
      expect(clearButton.className).toMatch(/min-h-11/);
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations when closed", async () => {
      const results = await checkA11y(<SkillFilterDrawer {...defaultProps} />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = render(<SkillFilterDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Verify drawer is open
      expect(screen.getByText("Filter Skills")).toBeInTheDocument();

      // Run a11y check on the open state
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("skill checkboxes have appropriate aria-checked state", async () => {
      const user = userEvent.setup();
      render(<SkillFilterDrawer {...defaultProps} selectedSkills={["React"]} />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // CommandItem has aria-checked - find by text and verify attribute
      const reactOption = screen.getByText("React").closest("[data-skill-item]");
      expect(reactOption).toHaveAttribute("aria-checked", "true");
    });
  });
});
