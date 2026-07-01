'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore, initializeLocale } from '@/hooks/useLocale';
import type { Locale } from '@/lib/types';

import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

const messages: Record<Locale, typeof esMessages> = {
  es: esMessages,
  en: enMessages,
};

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side i18n provider that wraps the app with NextIntlClientProvider.
 * Resolves locale from localStorage/browser on mount, then reactively
 * switches translations when locale changes via the Zustand store.
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const locale = useLocaleStore((state) => state.locale);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    initializeLocale();
    setIsHydrated(true);
  }, []);

  // During SSR / before hydration, render with default locale
  const activeLocale = isHydrated ? locale : 'es';

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages[activeLocale]}>
      {children}
    </NextIntlClientProvider>
  );
}
