/**
 * Behavior tests for ImageGallery component
 *
 * Tests thumbnail grid rendering, click behavior, empty states, and accessibility.
 * Does NOT test yet-another-react-lightbox internals (keyboard nav, etc.) -
 * only tests our wrapper's interface and behavior.
 */

import { render, screen } from "@tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { ImageGallery } from "../ImageGallery";
import type { Screenshot } from "@/types/project";

const mockScreenshots: Screenshot[] = [
  { src: "/projects/test/screenshot-1.webp", alt: "Dashboard view showing analytics" },
  { src: "/projects/test/screenshot-2.webp", alt: "Settings page with options" },
  { src: "/projects/test/screenshot-3.webp", alt: "User profile section" },
];

const singleScreenshot: Screenshot[] = [{ src: "/projects/test/screenshot-1.webp", alt: "Single screenshot" }];

describe("ImageGallery - Behavior Tests", () => {
  describe("Thumbnail Grid Rendering", () => {
    it("renders correct number of thumbnails", () => {
      render(<ImageGallery images={mockScreenshots} />);

      const thumbnails = screen.getAllByRole("button");
      expect(thumbnails).toHaveLength(3);
    });

    it("renders single thumbnail when only one image", () => {
      render(<ImageGallery images={singleScreenshot} />);

      const thumbnails = screen.getAllByRole("button");
      expect(thumbnails).toHaveLength(1);
    });

    it("renders thumbnail images with correct alt text", () => {
      render(<ImageGallery images={mockScreenshots} />);

      expect(screen.getByAltText("Dashboard view showing analytics")).toBeInTheDocument();
      expect(screen.getByAltText("Settings page with options")).toBeInTheDocument();
      expect(screen.getByAltText("User profile section")).toBeInTheDocument();
    });

    it("renders gallery container with test id", () => {
      render(<ImageGallery images={mockScreenshots} />);

      expect(screen.getByTestId("image-gallery")).toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("renders nothing when images array is empty", () => {
      render(<ImageGallery images={[]} />);

      expect(screen.queryByTestId("image-gallery")).not.toBeInTheDocument();
    });

    it("renders nothing when images is undefined", () => {
      render(<ImageGallery images={undefined} />);

      expect(screen.queryByTestId("image-gallery")).not.toBeInTheDocument();
    });
  });

  describe("Lightbox Interaction", () => {
    it("opens lightbox when thumbnail is clicked", async () => {
      const user = userEvent.setup();
      render(<ImageGallery images={mockScreenshots} />);

      const firstThumbnail = screen.getAllByRole("button")[0];
      await user.click(firstThumbnail);

      // Lightbox should be open - YARL renders with specific classes/attributes
      // We check for the lightbox root element
      expect(document.querySelector(".yarl__root")).toBeInTheDocument();
    });

    it("opens lightbox at correct index when clicking second thumbnail", async () => {
      const user = userEvent.setup();
      render(<ImageGallery images={mockScreenshots} />);

      const secondThumbnail = screen.getAllByRole("button")[1];
      await user.click(secondThumbnail);

      // Lightbox should show the second image
      // YARL displays the current slide - we verify it's showing correct content
      const lightboxImage = document.querySelector(".yarl__slide_current img");
      expect(lightboxImage).toHaveAttribute("alt", "Settings page with options");
    });

    it("lightbox has close button", async () => {
      const user = userEvent.setup();
      render(<ImageGallery images={mockScreenshots} />);

      // Open lightbox
      const firstThumbnail = screen.getAllByRole("button")[0];
      await user.click(firstThumbnail);

      // Verify close button exists (YARL handles actual close behavior)
      const closeButton = document.querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations with images", async () => {
      const results = await checkA11y(<ImageGallery images={mockScreenshots} />);
      expect(results).toHaveNoViolations();
    });

    it("thumbnails are visible and rendered as buttons", () => {
      render(<ImageGallery images={mockScreenshots} />);

      const thumbnails = screen.getAllByRole("button");
      thumbnails.forEach((thumb) => {
        expect(thumb).toBeVisible();
      });
    });

    it("thumbnail buttons have accessible labels", () => {
      render(<ImageGallery images={mockScreenshots} />);

      const thumbnails = screen.getAllByRole("button");
      thumbnails.forEach((thumb) => {
        // Button should have aria-label indicating it opens the image
        expect(thumb).toHaveAttribute("aria-label", expect.stringContaining("View"));
      });
    });
  });
});
