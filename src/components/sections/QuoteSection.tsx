'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Featured Quote — Personal brand statement.
 * @see Sprint 07
 */
export default function QuoteSection() {
  const t = useTranslations('quote');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } } };

  const content = (
    <blockquote className="mx-auto max-w-3xl text-center">
      <p className="text-2xl font-medium italic leading-relaxed text-foreground sm:text-3xl md:text-4xl">
        &ldquo;{t('text')}&rdquo;
      </p>
      <footer className="mt-6 text-sm font-medium text-foreground-muted">
        — Angelo Navarro
      </footer>
    </blockquote>
  );

  return (
    <section id="quote" ref={ref} className="relative py-24 px-6 sm:px-8 lg:px-12" aria-label="Featured quote">
      <div className="mx-auto max-w-5xl">
        {shouldAnimate ? (
          <motion.div variants={fadeIn} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            {content}
          </motion.div>
        ) : content}
      </div>
    </section>
  );
}
