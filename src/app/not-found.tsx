import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export default function NotFound() {
  return (
    <PageLayout centerContent pageId="not-found">
      <div className="flex justify-center pb-[15vh]">
        <div className="flex items-center gap-6">
          <h1 className="text-6xl sm:text-8xl font-bold font-title text-foreground">404</h1>
          <div className="space-y-2">
            <p className="text-base font-terminal text-muted-foreground">Page not found.</p>
            <div className="border-t border-border" />
            <nav aria-label="Not found navigation" className="flex justify-center items-center gap-3">
              <Link
                href="/"
                className="text-sm font-terminal text-accent dark:text-accent-high hover:underline focus-visible:underline"
              >
                Home
              </Link>
              <span className="text-xs text-border">&#x2022;</span>
              <Link
                href="/projects"
                className="text-sm font-terminal text-accent dark:text-accent-high hover:underline focus-visible:underline"
              >
                Projects
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
