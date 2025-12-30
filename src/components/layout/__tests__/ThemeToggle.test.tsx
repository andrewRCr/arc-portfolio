import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { ThemeToggle } from "../ThemeToggle";

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle - Accessibility Tests", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("has no accessibility violations", async () => {
    const results = await checkA11y(<ThemeToggle />);
    expect(results).toHaveNoViolations();
  });

  it("has accessible button with aria-label", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /current mode:.*click to switch/i });
    expect(button).toBeInTheDocument();
  });

  it("button is keyboard accessible", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /current mode:.*click to switch/i });
    expect(button).not.toBeDisabled();
    expect(button.tagName).toBe("BUTTON");
  });
});
