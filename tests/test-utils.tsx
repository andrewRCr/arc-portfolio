/**
 * Custom test utilities for React Testing Library
 *
 * Provides a custom render function that wraps components with necessary providers.
 * Re-exports everything from @testing-library/react for convenience.
 *
 * Usage:
 *   import { render, screen } from "@tests/test-utils";
 *
 *   render(<MyComponent />);
 */

import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { AxeResults } from "axe-core";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { WallpaperContextProvider } from "@/contexts/WallpaperContext";
import { IntroProvider } from "@/contexts/IntroContext";

/**
 * Test wrapper that provides all necessary context providers.
 *
 * Currently includes:
 * - ThemeContextProvider (for useThemeContext hook)
 * - WallpaperContextProvider (for useWallpaperContext hook)
 * - IntroProvider (for useIntroContext hook)
 *
 * Note: We don't include NextThemesProvider here because it requires
 * browser APIs that don't work well in jsdom. Components that need
 * next-themes should mock it separately.
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContextProvider>
      <WallpaperContextProvider>
        <IntroProvider>{children}</IntroProvider>
      </WallpaperContextProvider>
    </ThemeContextProvider>
  );
}

/**
 * Custom render function that wraps components with test providers.
 *
 * @param ui - The React element to render
 * @param options - Additional render options (wrapper can be overridden)
 * @returns The render result from @testing-library/react
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render with our custom version
export { customRender as render };

// Export the wrapper for cases where manual wrapping is needed
export { AllProviders as TestProviders };

/**
 * Run axe accessibility checks on a rendered component.
 *
 * @param ui - The React element to test
 * @param options - Additional render options
 * @returns Promise resolving to axe results
 */
export async function checkA11y(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">): Promise<AxeResults> {
  const { container } = customRender(ui, options);
  return axe(container);
}

// Re-export axe for direct usage when needed
export { axe };
