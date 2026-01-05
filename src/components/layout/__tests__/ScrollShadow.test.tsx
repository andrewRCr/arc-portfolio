import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrollShadow } from "../ScrollShadow";

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: "light" })),
}));

import { useTheme } from "next-themes";
const mockUseTheme = vi.mocked(useTheme);

describe("ScrollShadow", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ resolvedTheme: "light" } as ReturnType<typeof useTheme>);
  });

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

    it("has radial gradient background", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow.style.backgroundImage).toContain("radial-gradient");
      expect(shadow.style.backgroundImage).toContain("farthest-side");
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

    it("has radial gradient background", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-bottom");
      expect(shadow.style.backgroundImage).toContain("radial-gradient");
      expect(shadow.style.backgroundImage).toContain("farthest-side");
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

    it("has specified height", () => {
      render(<ScrollShadow position="bottom" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-bottom");
      expect(shadow.style.height).toBe("20px");
    });
  });

  describe("Accessibility", () => {
    it("is aria-hidden (decorative element)", () => {
      render(<ScrollShadow position="top" visible={true} />);

      const shadow = screen.getByTestId("scroll-shadow-top");
      expect(shadow).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Theme-based Opacity", () => {
    it("uses higher opacity in dark mode than light mode", () => {
      // Extract opacity from gradient string
      const extractOpacity = (gradient: string) => {
        const match = gradient.match(/rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/);
        return match ? parseFloat(match[1]) : 0;
      };

      // Render in light mode
      mockUseTheme.mockReturnValue({ resolvedTheme: "light" } as ReturnType<typeof useTheme>);
      const { rerender } = render(<ScrollShadow position="top" visible={true} />);
      const lightOpacity = extractOpacity(screen.getByTestId("scroll-shadow-top").style.backgroundImage);

      // Render in dark mode
      mockUseTheme.mockReturnValue({ resolvedTheme: "dark" } as ReturnType<typeof useTheme>);
      rerender(<ScrollShadow position="top" visible={true} />);
      const darkOpacity = extractOpacity(screen.getByTestId("scroll-shadow-top").style.backgroundImage);

      expect(darkOpacity).toBeGreaterThan(lightOpacity);
    });
  });
});
