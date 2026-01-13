import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { WallpaperBackground } from "../WallpaperBackground";

/**
 * Wrapper that provides required context for WallpaperBackground.
 */
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeContextProvider>{ui}</ThemeContextProvider>);
}

describe("WallpaperBackground", () => {
  describe("Gradient Fallback", () => {
    it("renders gradient background by default", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      const style = wrapper.getAttribute("style") || "";
      // Should have a linear-gradient background
      expect(style).toContain("linear-gradient");
    });

    it("uses theme-aware gradient colors via CSS variables", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      const style = wrapper.getAttribute("style") || "";
      // Gradient should reference CSS custom properties for theme awareness
      expect(style).toContain("var(--");
    });
  });

  describe("Positioning", () => {
    it("has fixed positioning", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("fixed");
    });

    it("covers full viewport", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("inset-0");
    });

    it("has z-index below content (negative or zero)", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      // Should use a negative z-index class or z-0
      expect(wrapper.className).toMatch(/z-\[-?\d+\]|-z-|z-0/);
    });
  });

  describe("Image Loading", () => {
    it("renders without image when src not provided", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const img = container.querySelector("img");
      expect(img).not.toBeInTheDocument();
    });

    it("renders image when src is provided", () => {
      const { container } = renderWithTheme(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      // Next.js Image transforms src, so check it contains the path
      expect(img?.getAttribute("src")).toContain("test.webp");
    });

    it("image does not have lazy loading (uses priority)", () => {
      const { container } = renderWithTheme(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      // Priority images should not have loading="lazy"
      // Note: fetchpriority="high" is added at runtime by Next.js, not in test mock
      expect(img).not.toHaveAttribute("loading", "lazy");
    });

    it("image has object-cover for full coverage", () => {
      const { container } = renderWithTheme(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      // Next.js Image with fill uses object-cover class
      expect(img).toHaveClass("object-cover");
    });
  });

  describe("Responsive Images", () => {
    it("renders img with srcset when imageSrcHiRes provided", () => {
      const { container } = renderWithTheme(
        <WallpaperBackground imageSrc="/wallpaper/test.webp" imageSrcHiRes="/wallpaper/test-1440.webp" />
      );

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("srcset");
    });

    it("renders img without srcset when only imageSrc provided", () => {
      const { container } = renderWithTheme(<WallpaperBackground imageSrc="/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      expect(img).not.toHaveAttribute("srcset");
    });

    it("srcset contains correct width descriptors (1920w, 2560w)", () => {
      const { container } = renderWithTheme(
        <WallpaperBackground imageSrc="/wallpaper/test.webp" imageSrcHiRes="/wallpaper/test-1440.webp" />
      );

      const img = container.querySelector("img");
      const srcset = img?.getAttribute("srcset") ?? "";
      expect(srcset).toContain("/wallpaper/test.webp 1920w");
      expect(srcset).toContain("/wallpaper/test-1440.webp 2560w");
    });

    it("sets sizes attribute for responsive selection", () => {
      const { container } = renderWithTheme(
        <WallpaperBackground imageSrc="/wallpaper/test.webp" imageSrcHiRes="/wallpaper/test-1440.webp" />
      );

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("sizes", "100vw");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations (gradient only)", async () => {
      const results = await checkA11y(
        <ThemeContextProvider>
          <WallpaperBackground />
        </ThemeContextProvider>
      );
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with image)", async () => {
      const results = await checkA11y(
        <ThemeContextProvider>
          <WallpaperBackground imageSrc="/images/wallpaper/test.webp" />
        </ThemeContextProvider>
      );
      expect(results).toHaveNoViolations();
    });

    it("image is decorative (empty alt)", () => {
      const { container } = renderWithTheme(<WallpaperBackground imageSrc="/images/wallpaper/test.webp" />);

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
    });

    it("container has aria-hidden for screen readers", () => {
      const { container } = renderWithTheme(<WallpaperBackground />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute("aria-hidden", "true");
    });
  });
});
