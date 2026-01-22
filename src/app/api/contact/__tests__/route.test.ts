/**
 * Tests for /api/contact route
 *
 * TDD tests for contact form API endpoint including validation,
 * honeypot protection, rate limiting, and email delivery.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST, _resetRateLimiter } from "../route";

// Mock fetch for Zeptomail API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Store original env
const originalEnv = process.env;

// Helper to create a mock Request
function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Helper to parse response
async function parseResponse(response: Response) {
  const data = await response.json();
  return { status: response.status, data };
}

describe("/api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetRateLimiter(); // Reset rate limiter between tests

    // Mock environment variables
    process.env = {
      ...originalEnv,
      ZEPTOMAIL_API_KEY: "test-api-key",
      CONTACT_EMAIL_TO: "test@example.com",
      CONTACT_EMAIL_FROM: "noreply@example.com",
    };

    // Default: Zeptomail returns success
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "OK" }),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Valid Submission", () => {
    it("returns success for valid data", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a test message.",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("calls Zeptomail API with correct data", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a test message.",
      });

      await POST(request);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("zeptomail"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: expect.any(String),
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });

  describe("Validation Errors", () => {
    it("returns 400 when name is missing", async () => {
      const request = createRequest({
        email: "john@example.com",
        message: "Hello",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.errors.name).toBeDefined();
    });

    it("returns 400 when email is missing", async () => {
      const request = createRequest({
        name: "John Doe",
        message: "Hello",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.errors.email).toBeDefined();
    });

    it("returns 400 when email is invalid format", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "invalid-email",
        message: "Hello",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.errors.email).toBeDefined();
    });

    it("returns 400 when message is missing", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.errors.message).toBeDefined();
    });

    it("does not call Zeptomail for invalid requests", async () => {
      const request = createRequest({
        name: "",
        email: "invalid",
        message: "",
      });

      await POST(request);

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Honeypot Protection", () => {
    it("returns silent success when honeypot is filled", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
        website: "https://spam.com", // Honeypot field filled = bot
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      // Should look like success to the bot
      expect(status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("does not call Zeptomail when honeypot is filled", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
        website: "https://spam.com",
      });

      await POST(request);

      // Should NOT send email
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Rate Limiting", () => {
    it("allows initial requests", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
      });

      const response = await POST(request);
      const { status } = await parseResponse(response);

      expect(status).toBe(200);
    });

    it("blocks rapid successive requests", async () => {
      // Make multiple rapid requests
      const requests = Array.from({ length: 6 }, () =>
        createRequest({
          name: "John Doe",
          email: "john@example.com",
          message: "Hello",
        })
      );

      // Send requests rapidly
      const responses = await Promise.all(requests.map((req) => POST(req)));
      const results = await Promise.all(responses.map(parseResponse));

      // At least one should be rate limited (429)
      const rateLimited = results.filter((r) => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it("returns 429 with appropriate message when rate limited", async () => {
      // Exhaust rate limit
      const requests = Array.from({ length: 10 }, () =>
        createRequest({
          name: "John Doe",
          email: "john@example.com",
          message: "Hello",
        })
      );

      const responses = await Promise.all(requests.map((req) => POST(req)));
      const results = await Promise.all(responses.map(parseResponse));

      const rateLimited = results.find((r) => r.status === 429);
      expect(rateLimited).toBeDefined();
      expect(rateLimited?.data.error).toMatch(/rate limit|too many/i);
    });
  });

  describe("Email Service Errors", () => {
    it("returns 500 when Zeptomail fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Service unavailable" }),
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it("returns 500 when Zeptomail throws", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
      });

      const response = await POST(request);
      const { status, data } = await parseResponse(response);

      expect(status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
});
