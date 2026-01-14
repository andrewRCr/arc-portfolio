"use client";

/**
 * ImageGallery Component
 *
 * Displays a single row of clickable thumbnail images that open in a lightbox.
 * Shows max 3 thumbnails with "+X more" overlay when additional images exist.
 * Uses yet-another-react-lightbox for the modal with project theme integration.
 *
 * Features:
 * - Single row of up to 3 thumbnails
 * - "+X more" overlay on 3rd thumbnail when >3 images
 * - 16:9 aspect ratio thumbnails
 * - Full-viewport lightbox with navigation
 * - Image counter ("2 of 6")
 * - Zoom support (pinch-to-zoom, double-tap on mobile; scroll/click on desktop)
 * - Keyboard navigation (arrows, escape) via library
 * - Touch support (swipe, pull-down-to-close) via library
 * - Themed to match project design system
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Screenshot } from "@/types/project";

export interface ImageGalleryProps {
  /** Array of screenshots to display */
  images?: Screenshot[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  // Find the main window container for portaling the lightbox
  // This constrains the lightbox to the TWM content window instead of full viewport
  useEffect(() => {
    const mainWindow = document.querySelector<HTMLElement>('[data-window-id="main"]');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM query for portal target must trigger re-render
    setPortalRoot(mainWindow);
  }, []);

  // Don't render anything if no images
  if (!images || images.length === 0) {
    return null;
  }

  // Convert our Screenshot format to YAML's slide format (all images for lightbox)
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  // Show max 3 thumbnails, with "+X more" overlay on the 3rd when there are additional images
  const maxVisible = 3;
  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;
  const hasMore = remainingCount > 0;

  return (
    <>
      {/* Thumbnail Grid - single row, max 3 visible */}
      <div data-testid="image-gallery" className="grid grid-cols-3 gap-3 sm:gap-4">
        {visibleImages.map((image, index) => {
          const isLastVisible = index === maxVisible - 1;
          const showOverlay = isLastVisible && hasMore;

          return (
            <button
              key={image.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={showOverlay ? `View all ${images.length} images` : `View image: ${image.alt}`}
              className="group relative aspect-video overflow-hidden rounded-md bg-muted outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all hover:ring-2 hover:ring-accent/50"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              {/* "+X more" overlay on last thumbnail */}
              {showOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-lg font-semibold text-white">+{remainingCount} more</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        index={lightboxIndex}
        slides={slides}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        plugins={[Counter, Zoom]}
        portal={{ root: portalRoot }}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true,
        }}
        render={{
          iconPrev: () => <ChevronLeft className="h-8 w-8" />,
          iconNext: () => <ChevronRight className="h-8 w-8" />,
          iconClose: () => <X className="h-6 w-6" />,
        }}
        styles={{
          root: {
            "--yarl__color_backdrop": "rgb(var(--card) / 0.9)",
            "--yarl__color_button": "rgb(var(--muted-foreground))",
            "--yarl__color_button_active": "rgb(var(--accent))",
          },
        }}
        carousel={{
          finite: true, // Don't wrap around at ends
        }}
      />
    </>
  );
}
