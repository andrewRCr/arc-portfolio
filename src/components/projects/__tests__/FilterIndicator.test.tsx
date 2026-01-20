/**
 * Behavior tests for FilterIndicator component
 *
 * Tests the display of active skill filters with dismissible badges
 * and clear all functionality.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterIndicator from "../FilterIndicator";

describe("FilterIndicator", () => {
  const defaultProps = {
    skills: ["React", "TypeScript"],
    onRemoveSkill: vi.fn(),
    onClearAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders 'Filtering by:' label", () => {
      render(<FilterIndicator {...defaultProps} />);

      expect(screen.getByText("Filtering by:")).toBeInTheDocument();
    });

    it("renders badge for each selected skill", () => {
      render(<FilterIndicator {...defaultProps} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("renders single badge when one skill selected", () => {
      render(<FilterIndicator {...defaultProps} skills={["Python"]} />);

      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("renders multiple badges when many skills selected", () => {
      render(
        <FilterIndicator
          {...defaultProps}
          skills={["React", "TypeScript", "Python", "Django"]}
        />
      );

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Django")).toBeInTheDocument();
    });
  });

  describe("Dismiss Buttons", () => {
    it("each badge has a dismiss button", () => {
      render(<FilterIndicator {...defaultProps} />);

      // Find all dismiss buttons (× icons)
      const dismissButtons = screen.getAllByRole("button", { name: /remove/i });
      expect(dismissButtons).toHaveLength(2); // One for each skill
    });

    it("calls onRemoveSkill with correct skill when dismiss is clicked", async () => {
      const onRemoveSkill = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onRemoveSkill={onRemoveSkill} />);

      // Find React badge and click its dismiss button
      const reactBadge = screen.getByText("React").closest("[data-slot='badge']");
      const dismissButton = within(reactBadge as HTMLElement).getByRole("button");
      await user.click(dismissButton);

      expect(onRemoveSkill).toHaveBeenCalledWith("React");
    });

    it("calls onRemoveSkill with second skill when its dismiss is clicked", async () => {
      const onRemoveSkill = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onRemoveSkill={onRemoveSkill} />);

      // Find TypeScript badge and click its dismiss button
      const tsBadge = screen.getByText("TypeScript").closest("[data-slot='badge']");
      const dismissButton = within(tsBadge as HTMLElement).getByRole("button");
      await user.click(dismissButton);

      expect(onRemoveSkill).toHaveBeenCalledWith("TypeScript");
    });
  });

  describe("Clear All", () => {
    it("renders clear all button", () => {
      render(<FilterIndicator {...defaultProps} />);

      expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
    });

    it("calls onClearAll when clear all is clicked", async () => {
      const onClearAll = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onClearAll={onClearAll} />);

      await user.click(screen.getByRole("button", { name: /clear all/i }));

      expect(onClearAll).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("dismiss buttons have accessible labels", () => {
      render(<FilterIndicator {...defaultProps} />);

      // Dismiss buttons should have accessible names
      expect(screen.getByRole("button", { name: /remove react/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /remove typescript/i })).toBeInTheDocument();
    });

    it("dismiss buttons are keyboard accessible", async () => {
      const onRemoveSkill = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onRemoveSkill={onRemoveSkill} />);

      // Tab to first dismiss button and press Enter
      const firstDismiss = screen.getByRole("button", { name: /remove react/i });
      firstDismiss.focus();
      await user.keyboard("{Enter}");

      expect(onRemoveSkill).toHaveBeenCalledWith("React");
    });

    it("clear all button is keyboard accessible", async () => {
      const onClearAll = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onClearAll={onClearAll} />);

      const clearAllButton = screen.getByRole("button", { name: /clear all/i });
      clearAllButton.focus();
      await user.keyboard("{Enter}");

      expect(onClearAll).toHaveBeenCalled();
    });
  });

  describe("Empty State", () => {
    it("does not render when skills array is empty", () => {
      const { container } = render(
        <FilterIndicator {...defaultProps} skills={[]} />
      );

      // Should not render anything
      expect(container.firstChild).toBeNull();
    });
  });
});
