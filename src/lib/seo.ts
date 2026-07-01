/**
 * SEO Engine for Angelo Portfolio (EVERGREEN)
 *
 * Provides programmatic SEO metadata generation with:
 * - Per-locale default values (ES/EN)
 * - Title ≤ 60 chars, description ≤ 160 chars (auto-truncated)
 * - OpenGraph metadata (og:title, og:description, og:image, og:url)
 * - JSON-LD structured data builders (Person + WebSite schemas)
 */

import type { Locale, PageSEO } from '@/lib/types';

// ============================================
// Constants
// ============================================

const SITE_URL = 'https://angelonavarro.dev';
const OG_IMAGE_DEFAULT = '/og-image.png';
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

// ============================================
// Default SEO values per locale
// ============================================

const SEO_DEFAULTS: Record<Locale, Omit<PageSEO, 'jsonLd'>> = {
  es: {
    title: 'Angelo Navarro | Ingeniero en Sistemas',
    description:
      'Portafolio profesional de Angelo Navarro — Ingeniero en Sistemas y Especialista en Telecomunicaciones con 6+ años en +Móvil, Panamá.',
    ogImage: OG_IMAGE_DEFAULT,
    ogUrl: SITE_URL,
  },
  en: {
    title: 'Angelo Navarro | Systems Engineer',
    description:
      'Professional portfolio of Angelo Navarro — Systems Engineer and Telecom Specialist with 6+ years at +Móvil, Panama.',
    ogImage: OG_IMAGE_DEFAULT,
    ogUrl: SITE_URL,
  },
};

// ============================================
// Page-specific SEO overrides per locale
// ============================================

const PAGE_SEO: Record<string, Record<Locale, Partial<PageSEO>>> = {
  home: {
    es: {
      title: 'Angelo Navarro | Ingeniero en Sistemas',
      description:
        'Portafolio profesional de Angelo Navarro — Ingeniero en Sistemas y Especialista en Telecomunicaciones con 6+ años en +Móvil, Panamá.',
      ogUrl: SITE_URL,
    },
    en: {
      title: 'Angelo Navarro | Systems Engineer',
      description:
        'Professional portfolio of Angelo Navarro — Systems Engineer and Telecom Specialist with 6+ years at +Móvil, Panama.',
      ogUrl: SITE_URL,
    },
  },
  blog: {
    es: {
      title: 'Blog | Angelo Navarro',
      description:
        'Artículos técnicos sobre telecomunicaciones, automatización con Python, gestión de proyectos y más.',
      ogUrl: `${SITE_URL}/blog`,
    },
    en: {
      title: 'Blog | Angelo Navarro',
      description:
        'Technical articles about telecom, Python automation, project management and more.',
      ogUrl: `${SITE_URL}/blog`,
    },
  },
};

// ============================================
// Utility: Truncate string to max length
// ============================================

function truncateForSEO(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  // Truncate and add ellipsis, keeping total ≤ maxLength
  return text.slice(0, maxLength - 1) + '…';
}

// ============================================
// Main SEO Builder
// ============================================

/**
 * Builds page-level SEO metadata with locale-aware defaults.
 *
 * - Applies page-specific overrides if defined for the given page identifier
 * - Falls back to locale defaults when page-specific content is not defined
 * - Enforces title ≤ 60 chars and description ≤ 160 chars via truncation
 * - Always includes og:image and og:url
 *
 * @param page - Page identifier (e.g., 'home', 'blog', or a blog slug)
 * @param locale - Current locale ('es' | 'en')
 * @param overrides - Optional partial overrides for specific SEO fields
 * @returns Complete PageSEO object
 */
export function buildPageSEO(
  page: string,
  locale: Locale,
  overrides?: Partial<PageSEO>
): PageSEO {
  // Start with locale defaults
  const defaults = SEO_DEFAULTS[locale];

  // Layer page-specific values if they exist
  const pageSpecific = PAGE_SEO[page]?.[locale] ?? {};

  // Merge: defaults < page-specific < explicit overrides
  const merged: PageSEO = {
    title: overrides?.title ?? pageSpecific.title ?? defaults.title,
    description:
      overrides?.description ?? pageSpecific.description ?? defaults.description,
    ogImage: overrides?.ogImage ?? pageSpecific.ogImage ?? defaults.ogImage,
    ogUrl: overrides?.ogUrl ?? pageSpecific.ogUrl ?? defaults.ogUrl,
    jsonLd: overrides?.jsonLd ?? pageSpecific.jsonLd,
  };

  // Enforce length constraints
  merged.title = truncateForSEO(merged.title, MAX_TITLE_LENGTH);
  merged.description = truncateForSEO(merged.description, MAX_DESCRIPTION_LENGTH);

  return merged;
}

// ============================================
// JSON-LD Structured Data Builders
// ============================================

/**
 * Builds Person schema JSON-LD for the homepage.
 * Conforms to schema.org/Person specification.
 */
export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Angelo Navarro',
    jobTitle: 'Systems Engineer & Telecom Specialist',
    url: SITE_URL,
    sameAs: [
      'https://github.com/angelonavarro',
      'https://linkedin.com/in/angelonavarro',
    ],
    worksFor: {
      '@type': 'Organization',
      name: '+Móvil (Liberty Latin America)',
      url: 'https://www.masmovil.com.pa',
    },
    knowsAbout: [
      'Telecommunications',
      'Systems Engineering',
      'Python',
      'Node.js',
      'Backend Development',
      'Project Management',
    ],
  };
}

/**
 * Builds WebSite schema JSON-LD for the homepage.
 * Conforms to schema.org/WebSite specification.
 */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Angelo Navarro Portfolio',
    url: SITE_URL,
    description:
      'Professional portfolio of Angelo Navarro — Systems Engineer and Telecom Specialist',
    author: {
      '@type': 'Person',
      name: 'Angelo Navarro',
    },
  };
}

// ============================================
// Exports for testing
// ============================================

export { SEO_DEFAULTS, PAGE_SEO, SITE_URL, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH };
