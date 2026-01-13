/**
 * ThemeSwatch Component Tests
 *
 * Tests the neofetch-inspired color swatch grid used for theme previews.
 * ThemeSwatch is a decorative component displaying 8 theme-representative colors.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { ThemeSwatch } from "../ThemeSwatch";

// Sample swatch colors for testing (8 hex colors)
const TEST_COLORS = [
  "#F7E8C8", // muted
  "#EB684B", // primary
  "#DE935F", // secondary
  "#5E8D87", // accent
  "#A54242", // other-1
  "#8C9440", // other-2
  "#85678F", // other-3
  "#5C4D2E", // foreground
];

describe("ThemeSwatch", () => {
  describe("Rendering", () => {
    it("renders 8 color squares", () => {
      render(<ThemeSwatch colors={TEST_COLORS} />);

      const squares = screen.getAllByTestId("swatch-square");
      expect(squares).toHaveLength(8);
    });

    it("each square has correct background color from swatch array", () => {
      render(<ThemeSwatch colors={TEST_COLORS} />);

      const squares = screen.getAllByTestId("swatch-square");
      squares.forEach((square, index) => {
        expect(square).toHaveStyle({ backgroundColor: TEST_COLORS[index] });
      });
    });
  });

  describe("Size Prop", () => {
    it("default size is 16px", () => {
      render(<ThemeSwatch colors={TEST_COLORS} />);

      const squares = screen.getAllByTestId("swatch-square");
      squares.forEach((square) => {
        expect(square).toHaveStyle({ width: "16px", height: "16px" });
      });
    });

    it("supports size prop of 20", () => {
      render(<ThemeSwatch colors={TEST_COLORS} size={20} />);

      const squares = screen.getAllByTestId("swatch-square");
      squares.forEach((square) => {
        expect(square).toHaveStyle({ width: "20px", height: "20px" });
      });
    });

    it("supports size prop of 24", () => {
      render(<ThemeSwatch colors={TEST_COLORS} size={24} />);

      const squares = screen.getAllByTestId("swatch-square");
      squares.forEach((square) => {
        expect(square).toHaveStyle({ width: "24px", height: "24px" });
      });
    });

    it("supports size prop of 32", () => {
      render(<ThemeSwatch colors={TEST_COLORS} size={32} />);

      const squares = screen.getAllByTestId("swatch-square");
      squares.forEach((square) => {
        expect(square).toHaveStyle({ width: "32px", height: "32px" });
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-hidden attribute (decorative element)", () => {
      render(<ThemeSwatch colors={TEST_COLORS} />);

      const container = screen.getByTestId("theme-swatch");
      expect(container).toHaveAttribute("aria-hidden", "true");
    });

    it("has no accessibility violations", async () => {
      const results = await checkA11y(<ThemeSwatch colors={TEST_COLORS} />);
      expect(results).toHaveNoViolations();
    });
  });
});
