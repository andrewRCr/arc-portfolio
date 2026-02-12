import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../not-found";
import Error from "../error";

// Mock PageLayout as passthrough — avoids animation context and scroll dependencies
vi.mock("@/components/layout/PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("NotFound (404)", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
  });

  it("renders page not found message", () => {
    render(<NotFound />);
    expect(screen.getByText("Page not found.")).toBeInTheDocument();
  });

  it("renders Home link pointing to /", () => {
    render(<NotFound />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders Projects link pointing to /projects", () => {
    render(<NotFound />);
    const projectsLink = screen.getByRole("link", { name: "Projects" });
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });
});

describe("Error Boundary", () => {
  const mockReset = vi.fn();
  const mockError = Object.assign(new window.Error("Test error"), { digest: "test-digest-123" });

  beforeEach(() => {
    mockReset.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders error heading", () => {
    render(<Error error={mockError} reset={mockReset} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Error");
  });

  it("renders error message", () => {
    render(<Error error={mockError} reset={mockReset} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders Try again button", () => {
    render(<Error error={mockError} reset={mockReset} />);
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("calls reset when Try again is clicked", async () => {
    const user = userEvent.setup();
    render(<Error error={mockError} reset={mockReset} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(mockReset).toHaveBeenCalledOnce();
  });

  it("renders Home link", () => {
    render(<Error error={mockError} reset={mockReset} />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("displays error digest when present", () => {
    render(<Error error={mockError} reset={mockReset} />);
    expect(screen.getByText("test-digest-123")).toBeInTheDocument();
  });

  it("logs error to console", () => {
    render(<Error error={mockError} reset={mockReset} />);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
