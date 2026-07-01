/**
 * Unit tests for the SEO engine (src/lib/seo.ts)
 *
 * Tests buildPageSEO(), buildPersonJsonLd(), and buildWebSiteJsonLd()
 */

import { describe, it, expect } from 'vitest';
import {
  buildPageSEO,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  SEO_DEFAULTS,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from '@/lib/seo';

describe('buildPageSEO', () => {
  describe('default behavior', () => {
    it('returns ES defaults for unknown page with es locale', () => {
      const seo = buildPageSEO('unknown-page', 'es');
      expect(seo.title).toBe(SEO_DEFAULTS.es.title);
      expect(seo.description).toBe(SEO_DEFAULTS.es.description);
      expect(seo.ogUrl).toBe(SEO_DEFAULTS.es.ogUrl);
      expect(seo.ogImage).toBe(SEO_DEFAULTS.es.ogImage);
    });

    it('returns EN defaults for unknown page with en locale', () => {
      const seo = buildPageSEO('unknown-page', 'en');
      expect(seo.title).toBe(SEO_DEFAULTS.en.title);
      expect(seo.description).toBe(SEO_DEFAULTS.en.description);
      expect(seo.ogUrl).toBe(SEO_DEFAULTS.en.ogUrl);
    });
  });

  describe('page-specific values', () => {
    it('returns home page SEO for es locale', () => {
      const seo = buildPageSEO('home', 'es');
      expect(seo.title).toContain('Angelo Navarro');
      expect(seo.ogUrl).toBe('https://angelonavarro.dev');
    });

    it('returns blog page SEO for en locale', () => {
      const seo = buildPageSEO('blog', 'en');
      expect(seo.title).toContain('Blog');
      expect(seo.ogUrl).toBe('https://angelonavarro.dev/blog');
    });
  });

  describe('overrides', () => {
    it('applies explicit title override', () => {
      const seo = buildPageSEO('home', 'es', { title: 'Custom Title' });
      expect(seo.title).toBe('Custom Title');
    });

    it('applies explicit description override', () => {
      const seo = buildPageSEO('home', 'en', {
        description: 'Custom description for testing.',
      });
      expect(seo.description).toBe('Custom description for testing.');
    });

    it('applies ogUrl override', () => {
      const seo = buildPageSEO('home', 'es', {
        ogUrl: 'https://angelonavarro.dev/custom',
      });
      expect(seo.ogUrl).toBe('https://angelonavarro.dev/custom');
    });

    it('applies jsonLd override', () => {
      const jsonLd = { '@type': 'Article', headline: 'Test' };
      const seo = buildPageSEO('home', 'es', { jsonLd });
      expect(seo.jsonLd).toEqual(jsonLd);
    });
  });

  describe('length constraints', () => {
    it('truncates title to 60 chars max', () => {
      const longTitle = 'A'.repeat(100);
      const seo = buildPageSEO('home', 'es', { title: longTitle });
      expect(seo.title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
    });

    it('truncates description to 160 chars max', () => {
      const longDesc = 'B'.repeat(200);
      const seo = buildPageSEO('home', 'es', { description: longDesc });
      expect(seo.description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    });

    it('does not truncate title that fits within 60 chars', () => {
      const shortTitle = 'Short Title';
      const seo = buildPageSEO('home', 'es', { title: shortTitle });
      expect(seo.title).toBe(shortTitle);
    });

    it('does not truncate description that fits within 160 chars', () => {
      const shortDesc = 'A short description.';
      const seo = buildPageSEO('home', 'es', { description: shortDesc });
      expect(seo.description).toBe(shortDesc);
    });

    it('adds ellipsis indicator when truncating', () => {
      const longTitle = 'A'.repeat(100);
      const seo = buildPageSEO('home', 'es', { title: longTitle });
      expect(seo.title).toMatch(/…$/);
    });
  });

  describe('non-empty guarantees', () => {
    it('title is never empty for any locale', () => {
      const esHome = buildPageSEO('home', 'es');
      const enHome = buildPageSEO('home', 'en');
      expect(esHome.title.length).toBeGreaterThan(0);
      expect(enHome.title.length).toBeGreaterThan(0);
    });

    it('description is never empty for any locale', () => {
      const esHome = buildPageSEO('home', 'es');
      const enHome = buildPageSEO('home', 'en');
      expect(esHome.description.length).toBeGreaterThan(0);
      expect(enHome.description.length).toBeGreaterThan(0);
    });
  });
});

describe('buildPersonJsonLd', () => {
  it('returns a valid Person schema object', () => {
    const person = buildPersonJsonLd();
    expect(person['@context']).toBe('https://schema.org');
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Angelo Navarro');
    expect(person.jobTitle).toBeDefined();
    expect(person.url).toBe('https://angelonavarro.dev');
  });

  it('includes social profiles in sameAs', () => {
    const person = buildPersonJsonLd();
    expect(Array.isArray(person.sameAs)).toBe(true);
    const sameAs = person.sameAs as string[];
    expect(sameAs.length).toBeGreaterThan(0);
    expect(sameAs.some((url) => url.includes('github'))).toBe(true);
    expect(sameAs.some((url) => url.includes('linkedin'))).toBe(true);
  });

  it('includes worksFor organization', () => {
    const person = buildPersonJsonLd();
    expect(person.worksFor).toBeDefined();
    const worksFor = person.worksFor as Record<string, unknown>;
    expect(worksFor['@type']).toBe('Organization');
    expect(worksFor.name).toContain('Móvil');
  });
});

describe('buildWebSiteJsonLd', () => {
  it('returns a valid WebSite schema object', () => {
    const website = buildWebSiteJsonLd();
    expect(website['@context']).toBe('https://schema.org');
    expect(website['@type']).toBe('WebSite');
    expect(website.name).toBe('Angelo Navarro Portfolio');
    expect(website.url).toBe('https://angelonavarro.dev');
    expect(website.description).toBeDefined();
  });

  it('includes an author of type Person', () => {
    const website = buildWebSiteJsonLd();
    expect(website.author).toBeDefined();
    const author = website.author as Record<string, unknown>;
    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('Angelo Navarro');
  });
});
