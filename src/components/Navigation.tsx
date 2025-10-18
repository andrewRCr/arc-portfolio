import Link from 'next/link';

/**
 * Navigation Component
 *
 * Basic navigation header with branding and section links.
 *
 * Structure:
 * - Name/branding on top row
 * - Navigation links on second row
 * - Centered layout
 *
 * NOTE: This is a placeholder component using structural Tailwind classes only.
 * Visual design (colors, shadows, borders, animations) will be added via v0.dev
 * iteration as part of Task 5.0 workflow validation.
 */
export function Navigation() {
  return (
    <nav className="flex flex-col items-center gap-4 p-4">
      {/* Name/branding row */}
      <div className="text-lg font-semibold">Andrew Creekmore</div>

      {/* Navigation links row */}
      <ul className="flex gap-6 list-none">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href="/skills">Skills</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
