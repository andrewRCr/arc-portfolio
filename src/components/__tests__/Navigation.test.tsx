import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Navigation } from '../Navigation';

describe('Navigation - Behavior Tests', () => {
  describe('Link Rendering and Routing', () => {
    it('renders all navigation links with correct hrefs', () => {
      render(<Navigation />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      const projectsLink = screen.getByRole('link', { name: /projects/i });
      const skillsLink = screen.getByRole('link', { name: /skills/i });
      const aboutLink = screen.getByRole('link', { name: /about/i });
      const contactLink = screen.getByRole('link', { name: /contact/i });

      expect(homeLink).toHaveAttribute('href', '/');
      expect(projectsLink).toHaveAttribute('href', '/projects');
      expect(skillsLink).toHaveAttribute('href', '/skills');
      expect(aboutLink).toHaveAttribute('href', '/about');
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('renders exactly 5 navigation links', () => {
      render(<Navigation />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(5);
    });
  });

  describe('Branding and Content', () => {
    it('renders name/branding text', () => {
      render(<Navigation />);

      expect(screen.getByText('Andrew Creekmore')).toBeInTheDocument();
    });
  });

  describe('Semantic HTML Structure', () => {
    it('renders within a nav element', () => {
      const { container } = render(<Navigation />);

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('uses list structure for navigation links', () => {
      const { container } = render(<Navigation />);

      const ul = container.querySelector('ul');
      const listItems = container.querySelectorAll('li');

      expect(ul).toBeInTheDocument();
      expect(listItems).toHaveLength(5);
    });
  });

  describe('Accessibility', () => {
    it('all links have accessible text', () => {
      render(<Navigation />);

      const links = screen.getAllByRole('link');

      links.forEach((link) => {
        // Each link should have text content
        expect(link.textContent).toBeTruthy();
        expect(link.textContent!.length).toBeGreaterThan(0);
      });
    });
  });
});
