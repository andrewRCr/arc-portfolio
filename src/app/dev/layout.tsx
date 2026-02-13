import { notFound } from "next/navigation";

/**
 * Dev pages layout — gates all /dev/* routes from production.
 * In production builds, these routes return 404.
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <>{children}</>;
}
