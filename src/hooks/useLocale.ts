/**
 * Locale state management using Zustand.
 *
 * Provides a global store for the current locale with:
 * - Initial value resolved from localStorage or browser detection
 * - Automatic localStorage persistence on change
 * - No page reload on locale switch
 */

import { create } from 'zustand';
import type { Locale } from '@/lib/types';
import { resolveInitialLocale, setStoredLocale } from '@/lib/i18n';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'es', // SSR-safe default; hydrated on client
  setLocale: (locale: Locale) => {
    setStoredLocale(locale);
    set({ locale });
  },
}));

/**
 * Hook to initialize the locale store on the client side.
 * Should be called once in the root layout/provider.
 */
export function initializeLocale(): void {
  const resolved = resolveInitialLocale();
  useLocaleStore.setState({ locale: resolved });
}
