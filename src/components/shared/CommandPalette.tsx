'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { CommandResult, SectionLink, ArticleCard } from '@/lib/types';
import { fuzzySearch } from '@/lib/utils/fuzzy-search';
import { PROJECTS } from '@/data/projects';
import { useLocaleStore } from '@/hooks/useLocale';

// ============================================
// Section links (same as Header navigation)
// ============================================

const SECTION_LINKS: SectionLink[] = [
  { id: 'hero', labelKey: 'nav.home', href: '#hero' },
  { id: 'what-i-do', labelKey: 'nav.whatIDo', href: '#what-i-do' },
  { id: 'about', labelKey: 'nav.about', href: '#about' },
  { id: 'experience', labelKey: 'nav.experience', href: '#experience' },
  { id: 'projects', labelKey: 'nav.projects', href: '#projects' },
  { id: 'blog', labelKey: 'nav.blog', href: '#blog' },
  { id: 'contact', labelKey: 'nav.contact', href: '#contact' },
];

// ============================================
// Types
// ============================================

export interface CommandPaletteProps {
  /** Blog articles passed from parent (since they may be dynamic) */
  articles?: ArticleCard[];
}

// ============================================
// CommandPalette
// ============================================

/**
 * CommandPalette — Global command palette with fuzzy search (Ctrl+K / Cmd+K).
 *
 * Features:
 * - Opens on Ctrl+K (Windows) or Cmd+K (macOS) as centered overlay modal
 * - Auto-focus search input on open (<200ms)
 * - Fuzzy search across sections, projects, and blog articles (max 8 results)
 * - Type indicator per result: Section, Project, Article
 * - Keyboard navigation: Arrow up/down, Enter to select, Escape to close
 * - Focus trap while modal is open
 * - Body scroll lock while open
 * - AnimatePresence for smooth open/close
 * - "No results found" when search returns empty
 *
 * @see Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6
 */
export default function CommandPalette({
  articles = [],
}: CommandPaletteProps) {
  const t = useTranslations('commandPalette');
  const tNav = useTranslations('nav');
  const tProjects = useTranslations('projects');
  const locale = useLocaleStore((state) => state.locale);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ---- Build searchable items ----
  const searchableItems = useMemo((): CommandResult[] => {
    const items: CommandResult[] = [];

    // Section links
    for (const section of SECTION_LINKS) {
      items.push({
        id: `section-${section.id}`,
        title: tNav(section.labelKey.replace('nav.', '')),
        type: 'section',
        href: section.href,
      });
    }

    // Projects
    for (const project of PROJECTS) {
      const titleKey = project.titleKey.replace('projects.', '').replace('.title', '');
      items.push({
        id: `project-${project.id}`,
        title: tProjects(`${titleKey}.title`),
        type: 'project',
        href: `#projects`,
      });
    }

    // Blog articles
    for (const article of articles) {
      items.push({
        id: `article-${article.slug}`,
        title: article.title,
        type: 'article',
        href: `/blog/${article.slug}`,
      });
    }

    return items;
  }, [articles, tNav, tProjects, locale]);

  // ---- Fuzzy search results ----
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuzzySearch(query, searchableItems, 8);
  }, [query, searchableItems]);

  // ---- Reset state when opening/closing ----
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // ---- Navigate to result ----
  const navigateToResult = useCallback(
    (result: CommandResult) => {
      close();
      if (result.href.startsWith('#')) {
        const targetId = result.href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // External navigation (blog pages)
        window.location.href = result.href;
      }
    },
    [close]
  );

  // ---- Global keyboard shortcut (Ctrl+K / Cmd+K) ----
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, open, close]);

  // ---- Auto-focus input when opening ----
  useEffect(() => {
    if (isOpen) {
      // Focus input quickly (<200ms requirement)
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // ---- Body scroll lock ----
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

  // ---- Keyboard navigation within palette ----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            results.length > 0 ? (prev + 1) % results.length : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            results.length > 0 ? (prev - 1 + results.length) % results.length : 0
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results.length > 0 && results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    },
    [results, selectedIndex, navigateToResult, close]
  );

  // ---- Scroll selected item into view ----
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results.length]);

  // ---- Reset selected index when results change ----
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // ---- Click outside to dismiss ----
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        close();
      }
    },
    [close]
  );

  // ---- Type icon/badge ----
  const getTypeIcon = (type: CommandResult['type']) => {
    switch (type) {
      case 'section':
        return (
          <span className="inline-flex h-5 items-center rounded bg-accent/20 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {t('typeSection')}
          </span>
        );
      case 'project':
        return (
          <span className="inline-flex h-5 items-center rounded bg-blue-500/20 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
            {t('typeProject')}
          </span>
        );
      case 'article':
        return (
          <span className="inline-flex h-5 items-center rounded bg-purple-500/20 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-purple-400">
            {t('typeArticle')}
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('label')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[9000] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[20vh]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              {/* Search icon */}
              <svg
                className="h-5 w-5 shrink-0 text-foreground-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                aria-label={t('searchLabel')}
                aria-activedescendant={
                  results.length > 0 ? `command-result-${selectedIndex}` : undefined
                }
                aria-controls="command-palette-results"
                aria-expanded={results.length > 0}
                role="combobox"
                aria-autocomplete="list"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-muted outline-none"
              />
              {/* Keyboard shortcut hint */}
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground-muted sm:inline-block">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-72 overflow-y-auto p-2">
              {query.trim() && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-foreground-muted">
                  {t('noResults')}
                </p>
              )}

              {results.length > 0 && (
                <ul
                  id="command-palette-results"
                  ref={listRef}
                  role="listbox"
                  aria-label={t('resultsLabel')}
                >
                  {results.map((result, index) => (
                    <li
                      key={result.id}
                      id={`command-result-${index}`}
                      role="option"
                      aria-selected={index === selectedIndex}
                      onClick={() => navigateToResult(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-100 ${
                        index === selectedIndex
                          ? 'bg-background-elevated text-foreground'
                          : 'text-foreground-muted hover:bg-background-elevated/50'
                      }`}
                    >
                      <span className="truncate font-medium">{result.title}</span>
                      {getTypeIcon(result.type)}
                    </li>
                  ))}
                </ul>
              )}

              {!query.trim() && (
                <p className="px-3 py-6 text-center text-sm text-foreground-muted">
                  {t('hint')}
                </p>
              )}
            </div>

            {/* Footer with keyboard hints */}
            <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-foreground-muted">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">↑↓</kbd>
                {t('navigate')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">↵</kbd>
                {t('select')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">esc</kbd>
                {t('close')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
