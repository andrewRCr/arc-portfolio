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
import { ThemeContextProvider } from "@/contexts/ThemeContext";

/**
 * Test wrapper that provides all necessary context providers.
 *
 * Currently includes:
 * - ThemeContextProvider (for useThemeContext hook)
 *
 * Note: We don't include NextThemesProvider here because it requires
 * browser APIs that don't work well in jsdom. Components that need
 * next-themes should mock it separately.
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
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
