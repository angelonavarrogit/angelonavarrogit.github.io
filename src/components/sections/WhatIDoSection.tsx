'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * WhatIDoSection — Capabilities, not skills.
 *
 * Sells what Angelo can DO for an enterprise, not what tools he knows.
 * Each capability card shows the domain + a one-line value proposition.
 *
 * @see Sprint 05: Professional Positioning
 */

const CAPABILITIES = [
  { id: 'enterprise', icon: '🏢' },
  { id: 'telecom', icon: '📡' },
  { id: 'automation', icon: '⚡' },
  { id: 'ai', icon: '🧠' },
];

export default function WhatIDoSection() {
  const t = useTranslations('whatIDo');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const grid = (
    <div className="grid gap-6 sm:grid-cols-2" role="list">
      {CAPABILITIES.map((cap) => (
        <article
          key={cap.id}
          role="listitem"
          className="group rounded-2xl border border-border/50 bg-background-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5"
        >
          <div className="mb-4 text-3xl" aria-hidden="true">{cap.icon}</div>
          <h3 className="text-lg font-semibold text-foreground">{t(`${cap.id}.title`)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{t(`${cap.id}.description`)}</p>
        </article>
      ))}
    </div>
  );

  return (
    <section id="what-i-do" ref={ref} className="relative py-24 px-6 sm:px-8 lg:px-12" aria-labelledby="whatido-heading">
      <div className="mx-auto max-w-4xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="whatido-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{grid}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="whatido-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {grid}
          </>
        )}
      </div>
    </section>
  );
}
