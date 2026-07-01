'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * IndustriesSection — Where Angelo can deliver value.
 *
 * Makes a recruiter instantly understand domains of expertise.
 * Clean icon grid with industry labels.
 *
 * @see Sprint 05: Professional Positioning
 */

const INDUSTRIES = [
  { id: 'telecom', icon: '📡' },
  { id: 'finance', icon: '💰' },
  { id: 'enterprise', icon: '🏗️' },
  { id: 'ai', icon: '🤖' },
  { id: 'data', icon: '📊' },
  { id: 'automation', icon: '⚙️' },
  { id: 'pm', icon: '📋' },
];

export default function IndustriesSection() {
  const t = useTranslations('industries');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const grid = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" role="list">
      {INDUSTRIES.map((ind) => (
        <div
          key={ind.id}
          role="listitem"
          className="flex flex-col items-center gap-3 rounded-xl border border-border/30 bg-background-card/30 p-6 text-center transition-all duration-300 hover:border-accent/20 hover:bg-background-card/60"
        >
          <span className="text-2xl" aria-hidden="true">{ind.icon}</span>
          <span className="text-sm font-medium text-foreground-muted">{t(ind.id)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section id="industries" ref={ref} className="relative py-24 px-6 sm:px-8 lg:px-12" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-4xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="industries-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{grid}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="industries-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {grid}
          </>
        )}
      </div>
    </section>
  );
}
