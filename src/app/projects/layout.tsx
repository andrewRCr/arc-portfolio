import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "Projects",
    template: `%s - ${SITE.name}`,
  },
  description:
    "Browse software, game, and modding projects with live demos, source code, and technical breakdowns of architecture and design decisions.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
