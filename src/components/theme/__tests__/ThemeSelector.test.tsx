/**
 * ThemeSelector Component Tests
 *
 * Tests the theme selection panel that displays all available themes
 * with swatch previews and allows theme switching.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { ThemeSelector } from "../ThemeSelector";
import { themes, type ThemeName } from "@/data/themes";

// Get theme names for testing
const themeNames = Object.keys(themes) as ThemeName[];
const themeCount = themeNames.length;

describe("ThemeSelector", () => {
  const defaultProps = {
    selectedTheme: "remedy" as ThemeName,
    onSelect: vi.fn(),
  };

  describe("Rendering", () => {
    it("renders all available themes from registry", () => {
      render(<ThemeSelector {...defaultProps} />);

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(themeCount);
    });

    it("each theme shows name label", () => {
      render(<ThemeSelector {...defaultProps} />);

      // Verify each theme's label is rendered
      Object.values(themes).forEach((theme) => {
        expect(screen.getByText(theme.label)).toBeInTheDocument();
      });
    });

    it("each theme shows ThemeSwatch preview", () => {
      render(<ThemeSelector {...defaultProps} />);

      // Each option should contain a theme swatch
      const options = screen.getAllByRole("option");
      options.forEach((option) => {
        const swatch = within(option).getByTestId("theme-swatch");
        expect(swatch).toBeInTheDocument();
      });
    });

    it("current theme has visual selection indicator (aria-selected)", () => {
      render(<ThemeSelector {...defaultProps} selectedTheme="rose-pine" />);

      const options = screen.getAllByRole("option");

      // Find the rose-pine option and verify it's selected
      const rosePineOption = options.find((option) => within(option).queryByText(themes["rose-pine"].label));
      expect(rosePineOption).toHaveAttribute("aria-selected", "true");

      // Other options should not be selected
      const otherOptions = options.filter((option) => !within(option).queryByText(themes["rose-pine"].label));
      otherOptions.forEach((option) => {
        expect(option).toHaveAttribute("aria-selected", "false");
      });
    });
  });

  describe("Selection", () => {
    it("clicking theme calls onSelect with theme name", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<ThemeSelector {...defaultProps} onSelect={onSelect} />);

      // Click on gruvbox theme
      const gruvboxLabel = screen.getByText(themes.gruvbox.label);
      await user.click(gruvboxLabel);

      expect(onSelect).toHaveBeenCalledWith("gruvbox");
    });

    it("clicking already selected theme still calls onSelect", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<ThemeSelector {...defaultProps} selectedTheme="remedy" onSelect={onSelect} />);

      const remedyLabel = screen.getByText(themes.remedy.label);
      await user.click(remedyLabel);

      expect(onSelect).toHaveBeenCalledWith("remedy");
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowDown moves focus to next option", async () => {
      const user = userEvent.setup();
      render(<ThemeSelector {...defaultProps} />);

      const listbox = screen.getByRole("listbox");
      listbox.focus();

      await user.keyboard("{ArrowDown}");

      // First option should be focused after ArrowDown from listbox
      const options = screen.getAllByRole("option");
      expect(options[0]).toHaveFocus();
    });

    it("ArrowUp moves focus to previous option", async () => {
      const user = userEvent.setup();
      render(<ThemeSelector {...defaultProps} />);

      const options = screen.getAllByRole("option");
      // Start with focus on second option
      options[1].focus();

      await user.keyboard("{ArrowUp}");

      expect(options[0]).toHaveFocus();
    });

    it("ArrowDown wraps from last to first option", async () => {
      const user = userEvent.setup();
      render(<ThemeSelector {...defaultProps} />);

      const options = screen.getAllByRole("option");
      // Start with focus on last option
      options[themeCount - 1].focus();

      await user.keyboard("{ArrowDown}");

      expect(options[0]).toHaveFocus();
    });

    it("ArrowUp wraps from first to last option", async () => {
      const user = userEvent.setup();
      render(<ThemeSelector {...defaultProps} />);

      const options = screen.getAllByRole("option");
      // Start with focus on first option
      options[0].focus();

      await user.keyboard("{ArrowUp}");

      expect(options[themeCount - 1]).toHaveFocus();
    });

    it("Enter key selects focused option", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<ThemeSelector {...defaultProps} onSelect={onSelect} />);

      const options = screen.getAllByRole("option");
      // Focus on gruvbox option (index 2 based on registry order)
      const gruvboxIndex = themeNames.indexOf("gruvbox");
      options[gruvboxIndex].focus();

      await user.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalledWith("gruvbox");
    });

    it("Space key selects focused option", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<ThemeSelector {...defaultProps} onSelect={onSelect} />);

      const options = screen.getAllByRole("option");
      // Focus on rose-pine option
      const rosePineIndex = themeNames.indexOf("rose-pine");
      options[rosePineIndex].focus();

      await user.keyboard(" ");

      expect(onSelect).toHaveBeenCalledWith("rose-pine");
    });
  });

  describe("ARIA Roles", () => {
    it("has listbox role on container", () => {
      render(<ThemeSelector {...defaultProps} />);

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("has option role on each theme item", () => {
      render(<ThemeSelector {...defaultProps} />);

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(themeCount);
    });

    it("listbox has accessible label", () => {
      render(<ThemeSelector {...defaultProps} />);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-label", "Select theme");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<ThemeSelector {...defaultProps} />);
      expect(results).toHaveNoViolations();
    });
  });
});
