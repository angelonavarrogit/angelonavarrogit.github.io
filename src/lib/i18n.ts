/**
 * i18n Configuration and Utilities
 *
 * Client-side internationalization using next-intl.
 * - Detects browser locale on first visit
 * - Persists preference in localStorage
 * - Falls back gracefully if localStorage is unavailable
 */

import type { I18nConfig, Locale } from './types';

/** i18n system configuration */
export const i18nConfig: I18nConfig = {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  storageKey: 'angelo-portfolio-locale',
};

/**
 * Detects the user's preferred locale from the browser's language settings.
 *
 * - Returns 'es' if the browser locale starts with "es"
 * - Returns 'en' if the browser locale starts with "en"
 * - Returns 'es' (default) for any other value
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return i18nConfig.defaultLocale;
  }

  const browserLang = navigator.language || '';
  const langPrefix = browserLang.toLowerCase();

  if (langPrefix.startsWith('es')) {
    return 'es';
  }

  if (langPrefix.startsWith('en')) {
    return 'en';
  }

  return i18nConfig.defaultLocale;
}

/**
 * Reads the persisted locale from localStorage.
 * Returns null if localStorage is unavailable or has no stored preference.
 */
export function getStoredLocale(): Locale | null {
  try {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(i18nConfig.storageKey);
    if (stored === 'es' || stored === 'en') {
      return stored;
    }
    return null;
  } catch {
    // localStorage unavailable — fall back silently
    return null;
  }
}

/**
 * Persists the locale preference in localStorage.
 * Fails silently if localStorage is unavailable.
 */
export function setStoredLocale(locale: Locale): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(i18nConfig.storageKey, locale);
  } catch {
    // localStorage unavailable — fail silently
  }
}

/**
 * Resolves the initial locale for the application.
 * Priority: localStorage > browser detection > default ('es')
 */
export function resolveInitialLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) return stored;
  return detectBrowserLocale();
}
