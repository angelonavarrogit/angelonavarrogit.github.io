'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ParticleBackground from '@/components/shared/ParticleBackground';

/**
 * HeroSection — Enterprise positioning.
 *
 * Positioning: NOT a frontend dev. NOT a freelancer.
 * This is an Enterprise Systems Engineer specialized in telecom,
 * automation, data engineering, and AI.
 *
 * Target audience: Microsoft, Cisco, AWS, Liberty Latin America, Ericsson,
 * Nokia, Accenture, Deloitte, Capgemini.
 *
 * @see Sprint 05: Professional Positioning
 */

const DOMAINS = ['Telecommunications', 'Automation', 'Data Engineering', 'Artificial Intelligence'];

export default function HeroSection() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [cvError, setCvError] = useState<string | null>(null);
  const shouldAnimate = !prefersReducedMotion;

  const handleContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDownloadCv = useCallback(async () => {
    setCvError(null);
    try {
      const res = await fetch('/cv/angelo-navarro-cv.pdf', { method: 'HEAD' });
      if (!res.ok) { setCvError(t('errors.cvNotAvailable')); return; }
      const link = document.createElement('a');
      link.href = '/cv/angelo-navarro-cv.pdf';
      link.download = 'angelo-navarro-cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch { setCvError(t('errors.cvNotAvailable')); }
  }, [t]);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  const content = (
    <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
      {/* Status */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          {t('hero.available')}
        </span>
      </div>

      {/* Name */}
      <h1 id="hero-heading" className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
        Angelo Navarro
      </h1>

      {/* Title — Enterprise positioning */}
      <p className="mt-5 text-xl font-semibold text-accent sm:text-2xl md:text-3xl">
        Enterprise Systems Engineer
      </p>

      {/* Domains */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-foreground-muted sm:text-base">
        {DOMAINS.map((domain, i) => (
          <span key={domain} className="flex items-center gap-2">
            {i > 0 && <span className="text-accent/40" aria-hidden="true">•</span>}
            {domain}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground-muted sm:text-xl">
        {t('hero.tagline')}
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={handleContact}
          className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 text-base font-semibold text-background transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('hero.contactCta')}
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>
        <button
          type="button"
          onClick={handleDownloadCv}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-8 py-3 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-accent/50 hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {t('hero.downloadCv')}
        </button>
      </div>
      {cvError && <p role="alert" className="mt-3 text-sm text-red-400">{cvError}</p>}

      {/* Trusted by indicator */}
      <div className="mt-16 border-t border-border/30 pt-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground-subtle">
          {t('hero.trustedBy')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-foreground-muted/60">
          <span>Liberty Latin America</span>
          <span className="text-accent/30">•</span>
          <span>+Móvil</span>
          <span className="text-accent/30">•</span>
          <span>Cable & Wireless</span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <ParticleBackground enabled={!prefersReducedMotion} />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="h-[600px] w-[600px] rounded-full bg-primary-500/8 blur-[140px] sm:h-[800px] sm:w-[800px]" />
      </div>

      {shouldAnimate ? (
        <motion.div variants={container} initial="hidden" animate="visible" className="contents">
          <motion.div variants={fadeUp} className="relative z-10 flex max-w-4xl flex-col items-center text-center">
            {content.props.children}
          </motion.div>
        </motion.div>
      ) : content}
    </section>
  );
}
