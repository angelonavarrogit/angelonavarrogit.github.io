'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import TypingEffect from '@/components/shared/TypingEffect';
import ParticleBackground from '@/components/shared/ParticleBackground';

/**
 * HeroSection — Premium landing section.
 *
 * Design philosophy: Clean, spacious, confident.
 * Inspired by: Vercel, Linear, Raycast landing pages.
 *
 * Features:
 * - Subtle radial gradient glow behind name
 * - Staggered entrance animations (greeting → name → titles → CTAs)
 * - TypingEffect for professional titles
 * - ParticleBackground for ambient depth
 * - Metrics bar showing key stats at a glance
 * - Clean CTA hierarchy (primary + secondary)
 * - Fully responsive with different spacing for mobile
 *
 * @see Sprint 01: Hero Experience
 */

const TITLES = [
  'Systems Engineer',
  'Telecom Specialist',
  'Backend Developer',
  'Automation & AI',
];

export default function HeroSection() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [cvError, setCvError] = useState<string | null>(null);

  const shouldAnimate = !prefersReducedMotion;

  const handleHireMe = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDownloadCv = useCallback(async () => {
    setCvError(null);
    try {
      const res = await fetch('/cv/angelo-navarro-cv.pdf', { method: 'HEAD' });
      if (!res.ok) {
        setCvError(t('errors.cvNotAvailable'));
        return;
      }
      const link = document.createElement('a');
      link.href = '/cv/angelo-navarro-cv.pdf';
      link.download = 'angelo-navarro-cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setCvError(t('errors.cvNotAvailable'));
    }
  }, [t]);

  // Stagger animation config
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Particle Background */}
      <ParticleBackground enabled={!prefersReducedMotion} />

      {/* Radial gradient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-[120px] sm:h-[800px] sm:w-[800px]" />
      </div>

      {/* Content */}
      {shouldAnimate ? (
        <motion.div
          className="relative z-10 flex max-w-3xl flex-col items-center text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              {t('hero.available')}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Angelo Navarro
          </motion.h1>

          {/* Typing titles */}
          <motion.div
            variants={fadeUp}
            className="mt-6 h-9 text-xl font-medium text-accent sm:text-2xl md:text-3xl"
            aria-live="polite"
          >
            <TypingEffect
              strings={TITLES}
              typeSpeed={50}
              deleteSpeed={30}
              pauseDuration={2000}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <button
              type="button"
              onClick={handleHireMe}
              className="group relative inline-flex min-h-[48px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-3 text-base font-semibold text-background transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative z-10">{t('hero.hireCta')}</span>
              <svg className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleDownloadCv}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-8 py-3 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-accent/50 hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('hero.downloadCv')}
            </button>
          </motion.div>

          {/* Error */}
          {cvError && (
            <p role="alert" className="mt-3 text-sm text-red-400">{cvError}</p>
          )}

          {/* Metrics bar */}
          <motion.div
            variants={fadeIn}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-border/50 pt-8 sm:gap-12"
          >
            <Metric value="6+" label={t('hero.metrics.years')} />
            <Metric value="100+" label={t('hero.metrics.automations')} />
            <Metric value="50+" label={t('hero.metrics.scripts')} />
            <Metric value="20+" label={t('hero.metrics.projects')} />
          </motion.div>
        </motion.div>
      ) : (
        /* Reduced motion fallback — no animations */
        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {t('hero.available')}
            </span>
          </div>
          <h1 id="hero-heading" className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Angelo Navarro
          </h1>
          <div className="mt-6 h-9 text-xl font-medium text-accent sm:text-2xl md:text-3xl">
            <TypingEffect strings={TITLES} typeSpeed={50} deleteSpeed={30} pauseDuration={2000} />
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button type="button" onClick={handleHireMe} className="group relative inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 text-base font-semibold text-background">
              {t('hero.hireCta')}
            </button>
            <button type="button" onClick={handleDownloadCv} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-8 py-3 text-base font-semibold text-foreground">
              {t('hero.downloadCv')}
            </button>
          </div>
          {cvError && <p role="alert" className="mt-3 text-sm text-red-400">{cvError}</p>}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-border/50 pt-8 sm:gap-12">
            <Metric value="6+" label={t('hero.metrics.years')} />
            <Metric value="100+" label={t('hero.metrics.automations')} />
            <Metric value="50+" label={t('hero.metrics.scripts')} />
            <Metric value="20+" label={t('hero.metrics.projects')} />
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      {shouldAnimate && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-foreground-subtle">
              Scroll
            </span>
            <div className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-accent/60 to-transparent" />
          </div>
        </motion.div>
      )}
    </section>
  );
}

/** Compact metric display for the hero stats bar */
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl font-bold text-foreground sm:text-3xl">{value}</span>
      <span className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">{label}</span>
    </div>
  );
}
