"use client";

/**
 * ImageGallery Component
 *
 * Displays a grid of clickable thumbnail images that open in a lightbox.
 * Uses yet-another-react-lightbox for the modal with project theme integration.
 *
 * Features:
 * - Responsive thumbnail grid (2 cols mobile, 3 cols desktop)
 * - 16:9 aspect ratio thumbnails
 * - Full-viewport lightbox with navigation
 * - Image counter ("2 of 6")
 * - Keyboard navigation (arrows, escape) via library
 * - Touch support (swipe, pull-down-to-close) via library
 * - Themed to match project design system
 */

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
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

  // Don't render anything if no images
  if (!images || images.length === 0) {
    return null;
  }

  // Convert our Screenshot format to YAML's slide format
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  return (
    <>
      {/* Thumbnail Grid */}
      <div data-testid="image-gallery" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`View image: ${image.alt}`}
            className="group relative aspect-video overflow-hidden rounded-md bg-muted outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all hover:ring-2 hover:ring-accent/50"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        index={lightboxIndex}
        slides={slides}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        plugins={[Counter]}
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
            "--yarl__color_backdrop": "hsl(var(--card) / 0.95)",
            "--yarl__color_button": "hsl(var(--muted-foreground))",
            "--yarl__color_button_active": "hsl(var(--accent))",
          },
        }}
        carousel={{
          finite: true, // Don't wrap around at ends
        }}
      />
    </>
  );
}
