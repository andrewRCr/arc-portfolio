/**
 * ContactForm - Contact form with validation and honeypot protection
 *
 * Uses react-hook-form for state management and zod for validation.
 * Includes honeypot field for spam protection.
 */

"use client";
"use no memo"; // react-hook-form's watch() can't be safely memoized by React Compiler

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const MESSAGE_MAX_LENGTH = 2500;

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(MESSAGE_MAX_LENGTH, `Message must be ${MESSAGE_MAX_LENGTH} characters or less`),
  website: z.string().optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  /**
   * Visual variant for different contexts:
   * - "standalone": Transparent field backgrounds (for use without card wrapper)
   * - "card": Tinted field backgrounds (for use inside card context)
   */
  variant?: "standalone" | "card";
}

export function ContactForm({ variant = "standalone" }: ContactFormProps) {
  const isPhone = useIsPhone();
  const inputBg = variant === "card" ? "bg-card/80" : "bg-transparent";
  const [status, setStatus] = useState<FormStatus>("idle");

  // Note: Don't use useForm<ContactFormData> - explicit generic type breaks zod v4 compatibility
  // Let TypeScript infer the type from the resolver instead
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- acknowledged via "use no memo"
  const messageValue = watch("message") ?? "";
  const messageLength = messageValue.length;

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check - silently reject if filled
    if (data.website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border text-center border-border bg-card/80 p-6">
        <p className="text-foreground">Thank you for your message! I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2 sm:space-y-6">
      {/* Name and Email fields - side by side on md+ */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Name field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block font-mono text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? "true" : "false"}
            className={`w-full rounded-md border border-border ${inputBg} px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary`}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block font-mono text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={errors.email ? "true" : "false"}
            className={`w-full rounded-md border border-border ${inputBg} px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary`}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block font-mono text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          rows={isPhone ? 3 : 5}
          maxLength={MESSAGE_MAX_LENGTH}
          aria-required="true"
          aria-describedby={errors.message ? "message-error message-count" : "message-count"}
          aria-invalid={errors.message ? "true" : "false"}
          className={`w-full resize-none rounded-md border border-border ${inputBg} px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary`}
          {...register("message")}
        />
        <div className="flex justify-between text-sm">
          {errors.message ? (
            <p id="message-error" className="text-destructive">
              {errors.message.message}
            </p>
          ) : (
            <span />
          )}
          <span
            id="message-count"
            className={`font-mono ${messageLength > MESSAGE_MAX_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
          >
            {messageLength}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Honeypot field - hidden from users */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* Error message */}
      {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again later.</p>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
