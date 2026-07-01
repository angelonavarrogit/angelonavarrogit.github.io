'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * HeroSection — Primary landing section with animated name, typing effect,
 * particle background, and CTA buttons.
 *
 * Features:
 * - Name "Angelo Navarro" fades in (opacity 0→1, <500ms)
 * - CTA buttons: "Hire Me" (→ #contact) and "Download CV" (→ PDF download)
 * - Hover: scale 1.05x + brightness +10%, <200ms transition
 * - CV download error state (shows i18n error message if PDF unavailable)
 * - Respects prefers-reduced-motion
 * - Accessible with aria-labelledby
 *
 * @see Requirements 1.1, 1.3, 1.5, 1.6
 */
export default function HeroSection() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [cvError, setCvError] = useState<string | null>(null);

  const handleHireMe = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleDownloadCv = useCallback(async () => {
    setCvError(null);

    try {
      const response = await fetch('/cv/angelo-navarro-cv.pdf', { method: 'HEAD' });

      if (!response.ok) {
        setCvError(t('errors.cvNotAvailable'));
        return;
      }

      // File exists — trigger download
      const link = document.createElement('a');
      link.href = '/cv/angelo-navarro-cv.pdf';
      link.download = 'angelo-navarro-cv.pdf';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setCvError(t('errors.cvNotAvailable'));
    }
  }, [t]);

  const shouldAnimate = !prefersReducedMotion;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center"
    >
      {/* TODO: ParticleBackground (task 4.3) */}

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6">
        {/* Greeting */}
        <p className="text-lg text-foreground-muted sm:text-xl">
          {t('hero.greeting')}
        </p>

        {/* Name with fade-in animation */}
        {shouldAnimate ? (
          <motion.h1
            id="hero-heading"
            className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            Angelo Navarro
          </motion.h1>
        ) : (
          <h1
            id="hero-heading"
            className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Angelo Navarro
          </h1>
        )}

        {/* TODO: TypingEffect (task 4.2) */}
        <div className="h-8 text-lg text-accent sm:text-xl md:text-2xl" aria-live="polite">
          {/* Placeholder for TypingEffect component */}
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <button
            type="button"
            onClick={handleHireMe}
            className="hero-cta-button inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white transition-all duration-[200ms] ease-out hover:scale-105 hover:brightness-110 focus-visible:scale-105 focus-visible:brightness-110"
          >
            {t('hero.hireCta')}
          </button>

          <button
            type="button"
            onClick={handleDownloadCv}
            className="hero-cta-button inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 py-3 text-base font-semibold text-primary transition-all duration-[200ms] ease-out hover:scale-105 hover:brightness-110 focus-visible:scale-105 focus-visible:brightness-110"
          >
            {t('hero.downloadCv')}
          </button>
        </div>

        {/* CV Download Error Message */}
        {cvError && (
          <p
            role="alert"
            className="mt-2 text-sm text-red-400"
          >
            {cvError}
          </p>
        )}
      </div>
    </section>
  );
}
