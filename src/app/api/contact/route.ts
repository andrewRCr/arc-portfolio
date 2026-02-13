/**
 * POST /api/contact
 *
 * Handles contact form submissions with validation, honeypot protection,
 * rate limiting, and email delivery via Zeptomail.
 */

import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { Redis } from "@upstash/redis";

// Validation schema (matches client-side)
const MESSAGE_MAX_LENGTH = 2500;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(MESSAGE_MAX_LENGTH, `Message must be ${MESSAGE_MAX_LENGTH} characters or less`),
  website: z.string().optional(), // Honeypot field
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

// In-memory fallback for local development (when Upstash Redis is not configured)
const localRateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Lazy-initialized Upstash Redis client (module-scoped singleton)
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return redisClient;
}

// Export for testing - allows resetting rate limiter between tests
export function _resetRateLimiter() {
  localRateLimitMap.clear();
}

/**
 * Check rate limit using Upstash Redis (production) or in-memory fallback (local dev)
 * Returns true if request is allowed, false if rate limited
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate_limit:contact:${ip}`;

  // Try Upstash Redis first (production — env vars auto-injected by Vercel Marketplace integration)
  const redis = getRedisClient();
  if (redis) {
    try {
      const count = await redis.incr(key);

      // Set expiry on first request in window
      if (count === 1) {
        await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
      }

      return count <= RATE_LIMIT_MAX_REQUESTS;
    } catch (error) {
      console.error("[contact] Upstash Redis error, falling back to in-memory:", error);
      // Fall through to in-memory fallback
    }
  }

  // In-memory fallback for local development or KV failures
  const now = Date.now();
  const record = localRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    localRateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_SECONDS * 1000,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Get client IP from request headers
function getClientIP(request: Request): string {
  // Try common headers used by proxies/Vercel
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback for local development
  return "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const allowed = await checkRateLimit(clientIP);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // Validate with zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      // Convert zod errors to a simpler format
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, email, message, website } = result.data;

    // Honeypot check - silently accept but don't send email
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Send email via Zeptomail
    const apiKey = process.env.ZEPTOMAIL_API_KEY;
    const emailTo = process.env.CONTACT_EMAIL_TO;
    const emailFrom = process.env.CONTACT_EMAIL_FROM;
    const emailFromName = process.env.CONTACT_EMAIL_FROM_NAME || "Portfolio Contact Form";

    if (!apiKey || !emailTo || !emailFrom) {
      console.error("[contact] Email configuration missing:", {
        hasApiKey: !!apiKey,
        hasEmailTo: !!emailTo,
        hasEmailFrom: !!emailFrom,
      });
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // Timeout to prevent indefinite hangs if Zeptomail is unresponsive
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const zeptomailResponse = await fetch("https://api.zeptomail.com/v1.1/email", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          from: {
            address: emailFrom,
            name: emailFromName,
          },
          to: [
            {
              email_address: {
                address: emailTo,
                name: "Andrew Creekmore",
              },
            },
          ],
          subject: `Portfolio Contact: ${sanitizeHeaderValue(name)}`,
          htmlbody: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
          textbody: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}
        `.trim(),
        }),
      });

      if (!zeptomailResponse.ok) {
        const errorData = await zeptomailResponse.json().catch(() => ({}));
        console.error("[contact] Zeptomail error:", errorData);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      // Should be caught by safeParse above, but handle just in case
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    console.error("[contact] Unexpected error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// Helper to escape HTML to prevent XSS in email content
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper to sanitize text for use in email headers (prevents header injection)
function sanitizeHeaderValue(text: string, maxLength = 100): string {
  return (
    text
      .replace(/[\r\n\t]/g, " ") // Replace control characters with space
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim()
      .slice(0, maxLength) || "Unknown"
  );
}
