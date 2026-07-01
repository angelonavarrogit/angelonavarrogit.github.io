import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { HtmlLangUpdater } from '@/components/providers/HtmlLangUpdater';
import { Header } from '@/components/layout/Header';
import CommandPalette from '@/components/shared/CommandPalette';
import CustomCursor from '@/components/shared/CustomCursor';
import './globals.css';

// ============================================
// Font Loading (next/font/google - self-hosted, no external requests)
// ============================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// ============================================
// Viewport Configuration
// ============================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0f0a',
};

// ============================================
// Metadata (SEO defaults + OpenGraph)
// ============================================

export const metadata: Metadata = {
  metadataBase: new URL('https://angelonavarro.dev'),
  title: {
    default: 'Angelo Navarro | Systems Engineer & Telecom Specialist',
    template: '%s | Angelo Navarro',
  },
  description:
    'Professional portfolio of Angelo Navarro — Systems Engineer and Telecom Specialist with 6+ years of experience at +Móvil (Liberty Latin America), Panamá.',
  keywords: [
    'Angelo Navarro',
    'Systems Engineer',
    'Telecom Specialist',
    'Backend Developer',
    'Python',
    'Node.js',
    'Panama',
    '+Móvil',
    'Liberty Latin America',
  ],
  authors: [{ name: 'Angelo Navarro' }],
  creator: 'Angelo Navarro',
  openGraph: {
    type: 'website',
    locale: 'es_PA',
    alternateLocale: 'en_US',
    url: 'https://angelonavarro.dev',
    siteName: 'Angelo Navarro Portfolio',
    title: 'Angelo Navarro | Systems Engineer & Telecom Specialist',
    description:
      'Professional portfolio of Angelo Navarro — Systems Engineer and Telecom Specialist with 6+ years of experience.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Angelo Navarro - Systems Engineer & Telecom Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Angelo Navarro | Systems Engineer & Telecom Specialist',
    description:
      'Professional portfolio — Systems Engineer and Telecom Specialist with 6+ years of experience.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================
// Root Layout
// ============================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        {/* Skip link: first focusable element for keyboard/screen-reader users */}
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[9999] -translate-y-16 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-background transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to main content
        </a>

        <I18nProvider>
          <HtmlLangUpdater />
          <Header />
          <CommandPalette />
          <CustomCursor />
          <main id="main-content" className="pt-16">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
