/**
 * Tests for ContactForm component
 *
 * TDD tests for contact form validation, submission, and honeypot protection.
 * Tests written first - component implementation follows.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContactForm } from "../ContactForm";

// Mock fetch for form submission
const mockFetch = vi.fn();

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Form Rendering", () => {
    it("renders name, email, and message fields", () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it("renders a submit button", () => {
      render(<ContactForm />);

      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("renders honeypot field that is visually hidden", () => {
      const { container } = render(<ContactForm />);

      // Honeypot should exist but be hidden from view
      const honeypot = container.querySelector('input[name="website"]');
      expect(honeypot).toBeInTheDocument();

      // Should have sr-only or similar hidden styling
      const honeypotContainer = honeypot?.closest("div");
      expect(honeypotContainer).toHaveClass("sr-only");
    });
  });

  describe("Validation - Required Fields", () => {
    it("shows error when name is empty on submit", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // Fill only email and message
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it("shows error when email is empty on submit", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it("shows error when message is empty on submit", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("Validation - Email Format", () => {
    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", { name: /send/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "invalid-email");
      await user.type(messageInput, "Hello there");

      // Verify the value was typed correctly
      expect(emailInput).toHaveValue("invalid-email");

      await user.click(submitButton);

      // Form should show error for invalid email
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it("accepts valid email format", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        // Form should submit successfully, showing thank you message
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });
  });

  describe("Honeypot Protection", () => {
    it("silently rejects submission when honeypot is filled", async () => {
      const user = userEvent.setup();
      const { container } = render(<ContactForm />);

      // Fill valid form data
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");

      // Fill honeypot (simulating bot behavior)
      const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement;
      await user.type(honeypot, "https://spam.com");

      await user.click(screen.getByRole("button", { name: /send/i }));

      // Should show success message (silent rejection)
      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // But should NOT have called fetch
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission", () => {
    it("submits form data to API endpoint", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe",
            email: "test@example.com",
            message: "Hello there",
          }),
        });
      });
    });

    it("shows success message after successful submission", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });

    it("shows error message when submission fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Server error" }),
      });

      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("disables submit button while submitting", async () => {
      // Make fetch hang to test loading state
      mockFetch.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      // Button should be disabled during submission
      expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
    });

    it("shows loading indicator while submitting", async () => {
      mockFetch.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there");
      await user.click(screen.getByRole("button", { name: /send/i }));

      // Should show sending state
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("associates error messages with form fields", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        const errorId = nameInput.getAttribute("aria-describedby");
        expect(errorId).toBeTruthy();
        expect(document.getElementById(errorId!)).toHaveTextContent(/name is required/i);
      });
    });

    it("marks required fields with aria-required", () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toHaveAttribute("aria-required", "true");
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-required", "true");
      expect(screen.getByLabelText(/message/i)).toHaveAttribute("aria-required", "true");
    });
  });
});
