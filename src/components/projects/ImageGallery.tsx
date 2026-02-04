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
import { useIsPhone } from "@/hooks/useMediaQuery";
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
  const [isMounted, setIsMounted] = useState(false);
  const isPhone = useIsPhone();

  // Track mount state to avoid rendering Lightbox during SSR
  // (yet-another-react-lightbox accesses document.body internally)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR guard requires sync state update on mount
    setIsMounted(true);
  }, []);

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

  // Convert our Screenshot format to YARL's slide format (all images for lightbox)
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  // Show max 2 thumbnails on mobile, 3 on desktop
  // "+X more" overlay on last visible when there are additional images
  const maxVisible = isPhone ? 2 : 3;
  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = Math.max(images.length - maxVisible, 0);
  const hasMore = remainingCount > 0;

  return (
    <>
      {/* Thumbnail Row - flex with centering for <3 images, 2 cols mobile / 3 cols desktop */}
      <div data-testid="image-gallery" className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {visibleImages.map((image, index) => {
          const isLastVisible = index === maxVisible - 1;
          const showOverlay = isLastVisible && hasMore;

          return (
            <button
              key={image.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={showOverlay ? `View all ${images.length} images` : `View image: ${image.alt}`}
              className="group relative aspect-video overflow-hidden rounded-md border border-border bg-surface-muted outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[border-color] hover:border-secondary-high w-[calc(50%-6px)] sm:w-[calc(33.333%-10.667px)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
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

      {/* Lightbox Modal - only render client-side (library accesses document.body) */}
      {isMounted && (
        <Lightbox
          index={lightboxIndex}
          slides={slides}
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          plugins={[Counter, Zoom]}
          portal={{ root: portalRoot || document.body }}
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
              // Use surface-card-base (mode-aware) with surface darkening formula
              "--yarl__color_backdrop":
                "color-mix(in srgb, rgb(var(--surface-card-base) / 0.9), black var(--surface-darken))",
              "--yarl__color_button": "rgb(var(--muted-foreground))",
              "--yarl__color_button_active": "rgb(var(--accent))",
            },
          }}
          carousel={{
            finite: true, // Don't wrap around at ends
          }}
        />
      )}
    </>
  );
}
