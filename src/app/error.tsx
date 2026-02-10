"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout centerContent pageId="error">
      <div className="flex justify-center pb-[15vh]">
        <div className="flex items-center gap-6">
          <h1 className="text-6xl sm:text-8xl font-bold font-title text-foreground">Error</h1>
          <div className="space-y-2">
            <p className="text-base font-terminal text-muted-foreground">Something went wrong.</p>
            <div className="border-t border-border" />
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={reset}
                className="text-sm font-terminal text-accent dark:text-accent-high hover:underline focus-visible:underline"
              >
                Try again
              </button>
              <span className="text-xs text-border">&#x2022;</span>
              <Link
                href="/"
                className="text-sm font-terminal text-accent dark:text-accent-high hover:underline focus-visible:underline"
              >
                Home
              </Link>
            </div>
            {error.digest && (
              <p className="text-xs font-terminal text-muted-foreground/50 text-center">{error.digest}</p>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
