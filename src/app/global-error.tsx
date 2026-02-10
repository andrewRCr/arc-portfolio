"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily: "monospace",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "0 0 0.5rem" }}>Error</h1>
          <p style={{ fontSize: "0.875rem", color: "#888", margin: "0 0 1.5rem" }}>Something went wrong.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                fontSize: "0.875rem",
                color: "#8bb5f0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
                padding: 0,
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- renders outside root layout, no router context */}
            <a
              href="/"
              style={{
                fontSize: "0.875rem",
                color: "#8bb5f0",
                textDecoration: "none",
                fontFamily: "monospace",
              }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
