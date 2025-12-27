/**
 * Shared mock for next/image
 *
 * Replaces Next.js Image component with a standard img element for testing.
 *
 * Usage:
 *   import { createImageMock } from "@tests/mocks/next-image";
 *
 *   vi.mock("next/image", () => createImageMock());
 */

/**
 * Creates the mock object for vi.mock("next/image", () => createImageMock())
 */
export function createImageMock() {
  return {
    default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
      // Filter out Next.js specific props that aren't valid on img elements
      const { fill, priority, quality, placeholder, blurDataURL, loader, ...validProps } = props;

      // Suppress unused variable warnings
      void fill;
      void priority;
      void quality;
      void placeholder;
      void blurDataURL;
      void loader;

      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} {...validProps} />;
    },
  };
}
