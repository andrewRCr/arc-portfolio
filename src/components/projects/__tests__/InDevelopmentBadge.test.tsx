import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InDevelopmentBadge } from "../InDevelopmentBadge";

describe("InDevelopmentBadge", () => {
  it("renders 'In Development' text by default", () => {
    render(<InDevelopmentBadge />);

    expect(screen.getByText("In Development")).toBeInTheDocument();
  });

  it("renders 'In Dev' text when compact", () => {
    render(<InDevelopmentBadge compact />);

    expect(screen.getByText("In Dev")).toBeInTheDocument();
    expect(screen.queryByText("In Development")).not.toBeInTheDocument();
  });

  it("has data-testid for test targeting", () => {
    render(<InDevelopmentBadge />);

    expect(screen.getByTestId("in-development-badge")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<InDevelopmentBadge className="absolute bottom-2 right-2" />);

    const badge = screen.getByTestId("in-development-badge");
    expect(badge).toHaveClass("absolute", "bottom-2", "right-2");
  });
});
