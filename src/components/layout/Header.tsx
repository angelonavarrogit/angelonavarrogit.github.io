'use client';

import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from './LanguageToggle';
import { HamburgerButton, MobileMenu } from './MobileMenu';
import { useLocaleStore } from '@/hooks/useLocale';
import type { SectionLink } from '@/lib/types';

/**
 * Navigation section links — all portfolio sections.
 */
const SECTION_LINKS: SectionLink[] = [
  { id: 'hero', labelKey: 'nav.home', href: '#hero' },
  { id: 'about', labelKey: 'nav.about', href: '#about' },
  { id: 'experience', labelKey: 'nav.experience', href: '#experience' },
  { id: 'projects', labelKey: 'nav.projects', href: '#projects' },
  { id: 'blog', labelKey: 'nav.blog', href: '#blog' },
  { id: 'contact', labelKey: 'nav.contact', href: '#contact' },
];

/**
 * Header — Sticky navigation bar with section links and language toggle.
 *
 * Features:
 * - Fixed at top with dark background + subtle backdrop blur
 * - Section links hidden on mobile (<768px) — MobileMenu handles mobile nav
 * - LanguageToggle visible on all screen sizes
 * - Smooth scroll navigation with <800ms duration
 * - Accessible focus indicators on all interactive elements
 */
export function Header() {
  const t = useTranslations();
  const locale = useLocaleStore((state) => state.locale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles smooth scroll to a target section.
   * Uses scrollIntoView with smooth behavior.
   */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
    // Return focus to trigger button when menu closes
    setTimeout(() => {
      const trigger = hamburgerRef.current?.querySelector('button');
      trigger?.focus();
    }, 50);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      role="banner"
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo / Brand */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="text-lg font-bold text-foreground transition-colors duration-150 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          AN
        </a>

        {/* Desktop navigation links — hidden on mobile */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {SECTION_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground-muted transition-colors duration-150 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t(link.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: Language toggle (desktop) + Hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <div ref={hamburgerRef}>
            <HamburgerButton
              isOpen={mobileMenuOpen}
              onToggle={handleToggleMobileMenu}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sections={SECTION_LINKS}
        locale={locale}
      />
    </header>
  );
}
