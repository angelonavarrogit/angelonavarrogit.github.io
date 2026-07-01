'use client';

import { useLocaleStore } from '@/hooks/useLocale';
import type { Locale } from '@/lib/types';

/**
 * LanguageToggle — ES/EN toggle with active locale indicator.
 *
 * Accessible toggle that switches the application locale via Zustand store.
 * The active locale is visually highlighted. Works on all screen sizes.
 */
export function LanguageToggle() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const handleToggle = () => {
    const next: Locale = locale === 'es' ? 'en' : 'es';
    setLocale(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        locale === 'es'
          ? 'Switch language to English'
          : 'Cambiar idioma a Español'
      }
      className="flex items-center gap-0.5 rounded-md border border-border px-2 py-1.5 text-sm font-medium transition-colors duration-200 hover:border-border-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        className={`rounded px-1.5 py-0.5 transition-colors duration-150 ${
          locale === 'es'
            ? 'bg-accent/20 text-accent font-semibold'
            : 'text-foreground-muted'
        }`}
      >
        ES
      </span>
      <span className="text-foreground-subtle" aria-hidden="true">
        |
      </span>
      <span
        className={`rounded px-1.5 py-0.5 transition-colors duration-150 ${
          locale === 'en'
            ? 'bg-accent/20 text-accent font-semibold'
            : 'text-foreground-muted'
        }`}
      >
        EN
      </span>
    </button>
  );
}
