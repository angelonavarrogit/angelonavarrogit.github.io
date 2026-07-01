'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';

/**
 * Client component that reactively updates the <html> lang attribute
 * when the locale changes via the Zustand store.
 *
 * This is necessary because the <html> element is rendered in the server
 * component (RootLayout) with a static lang attribute, but we need it
 * to update client-side when the user switches languages.
 */
export function HtmlLangUpdater() {
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
