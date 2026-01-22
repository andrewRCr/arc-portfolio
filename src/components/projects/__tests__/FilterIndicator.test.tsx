/**
 * Behavior tests for FilterIndicator component
 *
 * Tests the display of active skill filters with dismissible badges
 * and clear all functionality.
 */

import { render, screen } from "@testing-library/react";
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
      render(<FilterIndicator {...defaultProps} skills={["React", "TypeScript", "Python", "Django"]} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Django")).toBeInTheDocument();
    });
  });

  describe("Dismissible Badges", () => {
    it("each badge is clickable to dismiss", () => {
      render(<FilterIndicator {...defaultProps} />);

      // Badges themselves are now buttons
      const dismissButtons = screen.getAllByRole("button", { name: /remove/i });
      expect(dismissButtons).toHaveLength(2); // One for each skill
    });

    it("calls onRemoveSkill with correct skill when badge is clicked", async () => {
      const onRemoveSkill = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onRemoveSkill={onRemoveSkill} />);

      // Click the React badge directly (badge itself is the button)
      await user.click(screen.getByRole("button", { name: /remove react/i }));

      expect(onRemoveSkill).toHaveBeenCalledWith("React");
    });

    it("calls onRemoveSkill with second skill when its badge is clicked", async () => {
      const onRemoveSkill = vi.fn();
      const user = userEvent.setup();
      render(<FilterIndicator {...defaultProps} onRemoveSkill={onRemoveSkill} />);

      // Click the TypeScript badge directly
      await user.click(screen.getByRole("button", { name: /remove typescript/i }));

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
      const { container } = render(<FilterIndicator {...defaultProps} skills={[]} />);

      // Should not render anything
      expect(container.firstChild).toBeNull();
    });
  });
});
