import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollShadow } from "../ScrollShadow";

describe("ScrollShadow", () => {
  describe("Top Shadow", () => {
    it("renders with correct test id", () => {
      render(<ScrollShadow position="top" visible={true} />);

      expect(screen.getByTestId("scroll-shadow-top")).toBeInTheDocument();
    });

    it("positions at top of container", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveClass("absolute", "top-0", "left-0", "right-0");
    });

    it("has data attribute for CSS gradient styling", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveAttribute("data-scroll-shadow", "top");
    });
  });

  describe("Bottom Shadow", () => {
    it("renders with correct test id", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      expect(screen.getByTestId("scroll-shadow-bottom")).toBeInTheDocument();
    });

    it("positions at bottom of container", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-bottom");
      expect(shadow).toHaveClass("absolute", "bottom-0", "left-0", "right-0");
    });

    it("has data attribute for CSS gradient styling", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-bottom");
      expect(shadow).toHaveAttribute("data-scroll-shadow", "bottom");
    });
  });

  describe("Visibility", () => {
    it("has opacity-100 when visible", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveClass("opacity-100");
      expect(shadow).not.toHaveClass("opacity-0");
    });

    it("has opacity-0 when not visible", () => {
      render(<ScrollShadow position="top" visible={false} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveClass("opacity-0");
      expect(shadow).not.toHaveClass("opacity-100");
    });

    it("has transition for smooth fade", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-bottom");
      expect(shadow).toHaveClass("transition-opacity");
    });
  });

  describe("Styling", () => {
    it("uses pointer-events-none for non-blocking interaction", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveClass("pointer-events-none");
    });

    it("has height class for shadow size", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-bottom");
      // h-5 = 20px (1.25rem)
      expect(shadow).toHaveClass("h-5");
    });
  });

  describe("Accessibility", () => {
    it("is aria-hidden (decorative element)", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("CSS-based Theme Support", () => {
    it("uses data attribute for CSS selector targeting", () => {
      // The gradient styling is handled via CSS using [data-scroll-shadow] selectors
      // with .dark class variations for theme-aware opacity.
      // This test verifies the correct data attribute is set for CSS to work.
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveAttribute("data-scroll-shadow", "top");
    });
  });
});
