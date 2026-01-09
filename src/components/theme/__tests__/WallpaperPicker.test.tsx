/**
 * WallpaperPicker Component Tests
 *
 * Tests the wallpaper carousel picker with prev/next navigation
 * and thumbnail preview.
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { WallpaperPicker, formatAttribution } from "../WallpaperPicker";

// Mock useCompatibleWallpapers hook
const mockWallpapers = [
  { id: "gradient", src: undefined, compatibleThemes: "universal" as const },
  { id: "wallpaper-1", src: "/test/wallpaper-1.webp", compatibleThemes: "universal" as const },
  { id: "wallpaper-2", src: "/test/wallpaper-2.webp", compatibleThemes: "universal" as const },
  { id: "wallpaper-3", src: "/test/wallpaper-3.webp", compatibleThemes: "universal" as const },
];

vi.mock("@/hooks/useCompatibleWallpapers", () => ({
  useCompatibleWallpapers: () => mockWallpapers,
}));

// Mock next/image for testing
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} data-testid="wallpaper-image" />
  ),
}));

describe("WallpaperPicker", () => {
  const defaultProps = {
    selectedWallpaper: "gradient",
    onSelect: vi.fn(),
    isEnabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Thumbnail Display", () => {
    it("shows thumbnail preview area", () => {
      render(<WallpaperPicker {...defaultProps} />);

      expect(screen.getByTestId("wallpaper-preview")).toBeInTheDocument();
    });

    it("shows gradient indicator when gradient is selected", () => {
      render(<WallpaperPicker {...defaultProps} selectedWallpaper="gradient" />);

      // Should show gradient preview, not an image
      expect(screen.getByTestId("gradient-preview")).toBeInTheDocument();
    });

    it("shows wallpaper thumbnail when image wallpaper is selected", () => {
      render(<WallpaperPicker {...defaultProps} selectedWallpaper="wallpaper-1" />);

      const image = screen.getByTestId("wallpaper-image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/test/wallpaper-1.webp");
    });

    it("thumbnail has minimum size of approximately 200x150", () => {
      render(<WallpaperPicker {...defaultProps} />);

      const preview = screen.getByTestId("wallpaper-preview");
      // Check for min-width and min-height classes or styles
      expect(preview.className).toMatch(/min-w|w-\[?2/);
    });
  });

  describe("Navigation Controls", () => {
    it("shows prev and next navigation buttons", () => {
      render(<WallpaperPicker {...defaultProps} />);

      expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("clicking next cycles to next wallpaper", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} selectedWallpaper="gradient" onSelect={onSelect} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      // Should select next wallpaper (wallpaper-1)
      expect(onSelect).toHaveBeenCalledWith("wallpaper-1");
    });

    it("clicking prev cycles to previous wallpaper", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} selectedWallpaper="wallpaper-1" onSelect={onSelect} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });
      await user.click(prevButton);

      // Should select previous wallpaper (gradient)
      expect(onSelect).toHaveBeenCalledWith("gradient");
    });

    it("next wraps from last to first wallpaper", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} selectedWallpaper="wallpaper-3" onSelect={onSelect} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      // Should wrap to gradient (first)
      expect(onSelect).toHaveBeenCalledWith("gradient");
    });

    it("prev wraps from first to last wallpaper", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} selectedWallpaper="gradient" onSelect={onSelect} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });
      await user.click(prevButton);

      // Should wrap to wallpaper-3 (last)
      expect(onSelect).toHaveBeenCalledWith("wallpaper-3");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Left arrow key selects previous wallpaper", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} selectedWallpaper="wallpaper-1" onSelect={onSelect} />);

      const preview = screen.getByTestId("wallpaper-preview");
      preview.focus();
      await user.keyboard("{ArrowLeft}");

      expect(onSelect).toHaveBeenCalledWith("gradient");
    });

    it("Right arrow key selects next wallpaper", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} selectedWallpaper="gradient" onSelect={onSelect} />);

      const preview = screen.getByTestId("wallpaper-preview");
      preview.focus();
      await user.keyboard("{ArrowRight}");

      expect(onSelect).toHaveBeenCalledWith("wallpaper-1");
    });
  });

  describe("Wallpaper Counter", () => {
    it("shows current position indicator", () => {
      render(<WallpaperPicker {...defaultProps} selectedWallpaper="wallpaper-1" />);

      // Should show something like "2 / 4" (index 1 of 4 wallpapers)
      expect(screen.getByText(/2.*\/.*4|2 of 4/i)).toBeInTheDocument();
    });
  });

  describe("Selection Callback", () => {
    it("calls onSelect when wallpaper is selected", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} onSelect={onSelect} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("wallpaper-1");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<WallpaperPicker {...defaultProps} />);
      expect(results).toHaveNoViolations();
    });

    it("navigation buttons have accessible labels", () => {
      render(<WallpaperPicker {...defaultProps} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });
      const nextButton = screen.getByRole("button", { name: /next/i });

      expect(prevButton).toHaveAccessibleName();
      expect(nextButton).toHaveAccessibleName();
    });

    it("preview area is focusable when enabled", () => {
      render(<WallpaperPicker {...defaultProps} isEnabled={true} />);

      const preview = screen.getByTestId("wallpaper-preview");
      expect(preview).toHaveAttribute("tabIndex", "0");
    });

    it("preview area is not focusable when disabled", () => {
      render(<WallpaperPicker {...defaultProps} isEnabled={false} />);

      const preview = screen.getByTestId("wallpaper-preview");
      expect(preview).toHaveAttribute("tabIndex", "-1");
    });

  });

  describe("Disabled State", () => {
    it("dims controls when disabled", () => {
      render(<WallpaperPicker {...defaultProps} isEnabled={false} />);

      const preview = screen.getByTestId("wallpaper-preview");
      expect(preview.className).toMatch(/opacity-40/);
    });

    it("disables navigation buttons when disabled", () => {
      render(<WallpaperPicker {...defaultProps} isEnabled={false} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });
      const nextButton = screen.getByRole("button", { name: /next/i });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("prevents keyboard navigation when disabled", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      render(<WallpaperPicker {...defaultProps} isEnabled={false} onSelect={onSelect} />);

      const preview = screen.getByTestId("wallpaper-preview");
      preview.focus();
      await user.keyboard("{ArrowRight}");

      // onSelect should NOT be called when disabled
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});

describe("formatAttribution", () => {
  it("returns 'Gradient' for gradient id", () => {
    expect(formatAttribution("gradient")).toBe("Gradient");
  });

  it("formats hyphenated names with capitalized words", () => {
    expect(formatAttribution("kevin-grieve")).toBe("Kevin Grieve");
  });

  it("strips trailing numbers from photographer names", () => {
    expect(formatAttribution("jr-korpa-1")).toBe("Jr Korpa");
    expect(formatAttribution("jr-korpa-2")).toBe("Jr Korpa");
    expect(formatAttribution("jr-korpa-3")).toBe("Jr Korpa");
  });

  it("handles simple hyphenated names", () => {
    expect(formatAttribution("anne-nygard")).toBe("Anne Nygard");
  });

  it("handles multi-part names", () => {
    expect(formatAttribution("jose-ignacio-pompe")).toBe("Jose Ignacio Pompe");
  });
});
