'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { ArticleCard, BlogCategory } from '@/lib/types';

/**
 * BlogSection — Homepage blog section with article list and category filtering.
 *
 * Features:
 * - Article cards with title, date, summary, category badge, language indicator (ES/EN)
 * - Category filter buttons: ALL, IMS, CDR, Python Automation, CAPM/PMI, Telecom
 * - Active filter visually highlighted
 * - Empty state message when no articles match
 * - Max ~6 articles displayed on homepage
 * - Animated entrance with scroll reveal
 * - Bilingual via next-intl
 *
 * This is a CLIENT component for filter interactivity; receives articles as prop (SSG data).
 *
 * @see Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 */

const CATEGORIES: BlogCategory[] = [
  'IMS',
  'CDR',
  'Python Automation',
  'CAPM/PMI',
  'Telecom',
];

const MAX_ARTICLES_HOMEPAGE = 6;

interface BlogSectionProps {
  articles: ArticleCard[];
}

export default function BlogSection({ articles }: BlogSectionProps) {
  const t = useTranslations('blog');
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  // Filter articles by active category
  const filteredArticles = activeCategory
    ? articles.filter((article) => article.category === activeCategory)
    : articles;

  // Limit to max articles on homepage
  const displayedArticles = filteredArticles.slice(0, MAX_ARTICLES_HOMEPAGE);

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Container animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      ref={ref}
      id="blog"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        {shouldAnimate ? (
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h2
              id="blog-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              {t('title')}
            </h2>
          </motion.div>
        ) : (
          <div className="mb-8 text-center">
            <h2
              id="blog-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              {t('title')}
            </h2>
          </div>
        )}

        {/* Category Filter Buttons */}
        <div
          className="mb-10 flex flex-wrap justify-center gap-3"
          role="group"
          aria-label={t('title')}
        >
          {/* ALL button */}
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === null
                ? 'bg-accent text-background shadow-md'
                : 'bg-background-card border border-border text-foreground-muted hover:border-accent/50 hover:text-foreground'
            }`}
            aria-pressed={activeCategory === null}
          >
            {t('allCategories')}
          </button>

          {/* Category buttons */}
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-accent text-background shadow-md'
                  : 'bg-background-card border border-border text-foreground-muted hover:border-accent/50 hover:text-foreground'
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles List or Empty State */}
        {displayedArticles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-foreground-muted text-lg">{t('noArticles')}</p>
          </div>
        ) : shouldAnimate ? (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            role="list"
            aria-label={t('title')}
          >
            {displayedArticles.map((article) => (
              <motion.article
                key={article.slug}
                variants={itemVariants}
                className="group rounded-xl bg-background-card border border-border p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg"
                role="listitem"
              >
                {/* Header: category badge + language indicator */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent">
                    {article.category}
                  </span>
                  <span
                    className="inline-flex items-center rounded-md bg-background border border-border px-2 py-0.5 text-xs font-semibold text-foreground-muted"
                    aria-label={`${t('languageIndicator')}: ${article.language}`}
                  >
                    {article.language}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                {/* Date */}
                <time
                  dateTime={article.publishedAt}
                  className="mb-3 block text-sm text-foreground-muted"
                >
                  {formatDate(article.publishedAt)}
                </time>

                {/* Summary */}
                <p className="text-sm text-foreground-muted line-clamp-3">
                  {article.summary}
                </p>

                {/* Read more link */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {t('readMore')} →
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label={t('title')}
          >
            {displayedArticles.map((article) => (
              <article
                key={article.slug}
                className="group rounded-xl bg-background-card border border-border p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg"
                role="listitem"
              >
                {/* Header: category badge + language indicator */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent">
                    {article.category}
                  </span>
                  <span
                    className="inline-flex items-center rounded-md bg-background border border-border px-2 py-0.5 text-xs font-semibold text-foreground-muted"
                    aria-label={`${t('languageIndicator')}: ${article.language}`}
                  >
                    {article.language}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                {/* Date */}
                <time
                  dateTime={article.publishedAt}
                  className="mb-3 block text-sm text-foreground-muted"
                >
                  {formatDate(article.publishedAt)}
                </time>

                {/* Summary */}
                <p className="text-sm text-foreground-muted line-clamp-3">
                  {article.summary}
                </p>

                {/* Read more link */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {t('readMore')} →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
