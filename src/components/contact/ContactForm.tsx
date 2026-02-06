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
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email"),
  message: z
    .string()
    .trim()
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
  const inputBg = variant === "card" ? "bg-surface-card" : "bg-transparent";
  const [status, setStatus] = useState<FormStatus>("idle");

  // Note: Don't use useForm<ContactFormData> - explicit generic type breaks zod v4 compatibility
  // Let TypeScript infer the type from the resolver instead
  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
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

  const handleSendAnother = () => {
    // Preserve name and email for convenience
    const { name, email } = getValues();
    setStatus("idle");
    reset({ name, email, message: "", website: "" });
  };

  if (status === "success") {
    return (
      <div className="border text-center border-border bg-surface-card p-6 space-y-4">
        <p className="text-foreground">Thank you for your message! I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={handleSendAnother}
          className="bg-primary px-4 py-2 font-terminal font-medium uppercase text-primary-foreground transition-colors hover:bg-primary-hover hover:text-primary-hover-foreground"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 sm:space-y-6">
      {/* Name and Email fields - side by side on md+ */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2">
        {/* Name field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block font-terminal text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? "true" : "false"}
            className={`w-full border border-border ${inputBg} px-4 py-2 font-body text-foreground placeholder:font-terminal placeholder:text-muted-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-mid`}
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
          <label htmlFor="email" className="block font-terminal text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={errors.email ? "true" : "false"}
            className={`w-full border border-border ${inputBg} px-4 py-2 font-body text-foreground placeholder:font-terminal placeholder:text-muted-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-mid`}
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
        <label htmlFor="message" className="block font-terminal text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          rows={isPhone ? 3 : 6}
          maxLength={MESSAGE_MAX_LENGTH}
          aria-required="true"
          aria-describedby={errors.message ? "message-error message-count" : "message-count"}
          aria-invalid={errors.message ? "true" : "false"}
          className={`w-full resize-none border border-border ${inputBg} px-4 py-2 font-body text-foreground placeholder:font-terminal placeholder:text-muted-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-mid`}
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
            className={`font-terminal ${messageLength > MESSAGE_MAX_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
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
        className="w-full bg-primary px-4 py-1.5 font-terminal font-medium uppercase text-primary-foreground transition-colors hover:bg-primary-hover hover:text-primary-hover-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
