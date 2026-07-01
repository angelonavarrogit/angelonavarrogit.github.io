'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { SectionLink, Locale } from '@/lib/types';
import { LanguageToggle } from './LanguageToggle';

// ============================================
// Types
// ============================================

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionLink[];
  locale: Locale;
}

export interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ============================================
// HamburgerButton
// ============================================

/**
 * Hamburger trigger button for the mobile navigation menu.
 *
 * - Visible only below 768px
 * - Minimum 44x44px touch target
 * - aria-expanded reflects menu state
 * - aria-label describes the action
 * - Keyboard: Enter/Space opens the menu (native button behavior)
 */
export function HamburgerButton({ isOpen, onToggle }: HamburgerButtonProps) {
  const t = useTranslations('nav');

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? t('closeMenu') : t('openMenu')}
      className="relative z-50 flex h-11 w-11 items-center justify-center rounded-md md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      <div className="flex h-5 w-6 flex-col justify-between" aria-hidden="true">
        <span
          className={`block h-0.5 w-full rounded-full bg-foreground transition-transform duration-300 ease-out-custom ${
            isOpen ? 'translate-y-[9px] rotate-45' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full rounded-full bg-foreground transition-opacity duration-200 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block h-0.5 w-full rounded-full bg-foreground transition-transform duration-300 ease-out-custom ${
            isOpen ? '-translate-y-[9px] -rotate-45' : ''
          }`}
        />
      </div>
    </button>
  );
}

// ============================================
// MobileMenu
// ============================================

/**
 * Full-screen mobile navigation overlay.
 *
 * Accessibility features:
 * - Focus trap: Tab/Shift+Tab cycles only within menu items
 * - Escape key closes the menu
 * - When opened, focus moves to the first menu item
 * - When closed, focus returns to the trigger button (handled by parent)
 * - All interactive elements have 44x44px minimum touch targets
 * - aria-expanded announced via the trigger button
 * - Section links rendered as a vertical list with smooth transitions
 */
export function MobileMenu({ isOpen, onClose, sections, locale }: MobileMenuProps) {
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  // ---- Focus trap logic ----
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Escape closes menu
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap: Tab / Shift+Tab
      if (e.key === 'Tab') {
        const menu = menuRef.current;
        if (!menu) return;

        const focusableElements = menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab on first element -> wrap to last
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab on last element -> wrap to first
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  // Attach/detach keydown listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Move focus to first item when menu opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow AnimatePresence to render
      const timeout = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    // Close menu — smooth scroll handled naturally by href anchor
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={tNav('menuLabel')}
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 flex flex-col bg-background/98 backdrop-blur-sm md:hidden"
        >
          {/* Overlay content */}
          <nav
            aria-label={tNav('mobileNavigation')}
            className="flex flex-1 flex-col items-center justify-center gap-2 px-6"
          >
            <ul className="flex w-full max-w-xs flex-col items-center gap-1">
              {sections.map((section, index) => (
                <li key={section.id} className="w-full">
                  <motion.a
                    ref={index === 0 ? firstFocusableRef : undefined}
                    href={section.href}
                    onClick={handleLinkClick}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-3 text-lg font-medium text-foreground transition-colors duration-200 hover:bg-background-elevated hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {t(section.labelKey)}
                  </motion.a>
                </li>
              ))}
            </ul>

            {/* Language Toggle inside mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: sections.length * 0.05 + 0.05,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6"
            >
              <LanguageToggle />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
