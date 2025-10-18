'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * ThemeToggle Component
 *
 * Simple button to toggle between light and dark themes.
 * Uses next-themes for theme management with localStorage persistence.
 *
 * NOTE: This is a minimal implementation. Visual styling will be enhanced
 * during design phase. Future enhancement: multi-theme switcher with
 * pre-defined themes (rose-pine, gruvbox, etc.).
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-3 py-1 text-sm border rounded" disabled>
        Theme
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-3 py-1 text-sm border rounded hover:bg-accent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
