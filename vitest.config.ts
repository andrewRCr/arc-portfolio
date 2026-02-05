import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/", "e2e/"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData/",
        "dist/",
        // Shadcn/ui vendor components (lowercase filenames)
        "src/components/ui/alert.tsx",
        "src/components/ui/badge.tsx",
        "src/components/ui/button.tsx",
        "src/components/ui/card.tsx",
        "src/components/ui/checkbox.tsx",
        "src/components/ui/collapsible.tsx",
        "src/components/ui/command.tsx",
        "src/components/ui/dialog.tsx",
        "src/components/ui/dropdown-menu.tsx",
        "src/components/ui/input.tsx",
        "src/components/ui/label.tsx",
        "src/components/ui/popover.tsx",
        "src/components/ui/separator.tsx",
        "src/components/ui/sheet.tsx",
        "src/components/ui/switch.tsx",
        "src/components/ui/textarea.tsx",
        "src/components/ui/tooltip.tsx",
        // Dev-only utilities
        "src/lib/console-logger.ts",
        "src/app/dev/**",
        // Config that's not logic
        "src/config/nexusmods.ts",
        // Next.js pages/layouts (tested via E2E)
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/**/route.ts",
        // Generated files
        "src/app/css-defaults.ts",
        "src/components/projects/thumbnails.ts",
        // Pure type definition files (no runtime code)
        "src/types/about.ts",
        "src/types/contact.ts",
        "src/types/education.ts",
        "src/types/project.ts",
        "src/data/themes/types.ts",
        "src/data/wallpapers/types.ts",
        "src/lib/theme/tokens/colors.ts",
        "src/components/projects/ProjectImageLoader.types.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
});
