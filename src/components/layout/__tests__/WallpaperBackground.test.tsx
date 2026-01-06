import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { WallpaperBackground } from "../WallpaperBackground";

describe("WallpaperBackground", () => {
  describe("Gradient Fallback", () => {
    it("renders gradient background by default", () => {
      const { container } = render(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      const style = wrapper.getAttribute("style") || "";
      // Should have a linear-gradient background
      expect(style).toContain("linear-gradient");
    });

    it("uses theme-aware gradient colors via CSS variables", () => {
      const { container } = render(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      const style = wrapper.getAttribute("style") || "";
      // Gradient should reference CSS custom properties for theme awareness
      expect(style).toContain("var(--");
    });
  });

  describe("Positioning", () => {
    it("has fixed positioning", () => {
      const { container } = render(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("fixed");
    });

    it("covers full viewport", () => {
      const { container } = render(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("inset-0");
    });

    it("has z-index below content (negative or zero)", () => {
      const { container } = render(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      // Should use a negative z-index class or z-0
      expect(wrapper.className).toMatch(/z-\[-?\d+\]|-z-|z-0/);
    });
  });

  describe("Image Loading", () => {
    it("renders without image when src not provided", () => {
      const { container } = render(<WallpaperBackground />);

      const img = container.querySelector("img");
      expect(img).not.toBeInTheDocument();
    });

    it("renders image when src is provided", () => {
      const { container } = render(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      // Next.js Image transforms src, so check it contains the path
      expect(img?.getAttribute("src")).toContain("test.webp");
    });

    it("image has lazy loading attribute", () => {
      const { container } = render(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it("image has object-cover for full coverage", () => {
      const { container } = render(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      // Next.js Image with fill uses object-cover class
      expect(img).toHaveClass("object-cover");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations (gradient only)", async () => {
      const results = await checkA11y(<WallpaperBackground />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with image)", async () => {
      const results = await checkA11y(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);
      expect(results).toHaveNoViolations();
    });

    it("image is decorative (empty alt)", () => {
      const { container } = render(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
    });

    it("container has aria-hidden for screen readers", () => {
      const { container } = render(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute("aria-hidden", "true");
    });
  });
});
