import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { PageHeader } from "../PageHeader";

// Mock AnimationContext (PageHeader uses useAnimationContext)
vi.mock("@/contexts/AnimationContext", () => ({
  AnimationProvider: ({ children }: { children: React.ReactNode }) => children,
  useAnimationContext: () => ({
    loadMode: "refresh",
    animationMode: "refresh",
    intro: { phase: "complete", isActive: false, wasSkipped: false, replayCount: 0, triggerReplay: vi.fn() },
    route: { isAnimating: false },
    visibility: { windowVisible: true, contentVisible: true },
    reducedMotion: false,
    isInitialized: true,
  }),
  useAnimationDispatch: () => vi.fn(),
  markIntroSeen: vi.fn(),
  clearIntroCookie: vi.fn(),
}));

describe("PageHeader", () => {
  describe("Title Rendering", () => {
    it("renders title as h1", () => {
      render(<PageHeader title="Projects" />);

      expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    });

    it("renders subtitle when provided", () => {
      render(<PageHeader title="Projects" subtitle="Browse my work" />);

      expect(screen.getByText("Browse my work")).toBeInTheDocument();
    });

    it("does not render title section when title not provided", () => {
      render(<PageHeader>Custom content</PageHeader>);

      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("renders children below title", () => {
      render(
        <PageHeader title="Projects">
          <div data-testid="controls">Tab controls</div>
        </PageHeader>
      );

      expect(screen.getByTestId("controls")).toBeInTheDocument();
    });

    it("renders children as full content when no title", () => {
      render(
        <PageHeader>
          <h1>Custom Header</h1>
        </PageHeader>
      );

      expect(screen.getByRole("heading", { name: "Custom Header" })).toBeInTheDocument();
    });
  });

  describe("Divider", () => {
    it("renders divider by default", () => {
      const { container } = render(<PageHeader title="Projects" />);

      const divider = container.querySelector(".border-b");
      expect(divider).toBeInTheDocument();
    });

    it("hides divider when hideDivider is true", () => {
      const { container } = render(<PageHeader title="Projects" hideDivider />);

      const divider = container.querySelector(".border-b");
      expect(divider).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations with title", async () => {
      const results = await checkA11y(<PageHeader title="Page Title" subtitle="Description" />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with children only", async () => {
      const results = await checkA11y(
        <PageHeader>
          <h1>Custom Title</h1>
        </PageHeader>
      );
      expect(results).toHaveNoViolations();
    });
  });
});
