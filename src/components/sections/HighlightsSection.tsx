'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Professional Highlights — Impact metrics that tell a story.
 * Not just numbers — meaningful enterprise achievements.
 * @see Sprint 06
 */

const HIGHLIGHTS = [
  { id: 'years', value: '6+' },
  { id: 'enterprise', value: '—' },
  { id: 'cdr', value: 'Millions' },
  { id: 'capm', value: '—' },
  { id: 'platforms', value: '—' },
  { id: 'mediation', value: '—' },
];

export default function HighlightsSection() {
  const t = useTranslations('highlights');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  const grid = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {HIGHLIGHTS.map((h) => (
        <div key={h.id} className="flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-background-card/30 p-6 text-center">
          {h.value !== '—' && <span className="text-2xl font-bold text-accent">{h.value}</span>}
          <span className="text-xs font-medium leading-tight text-foreground-muted">{t(h.id)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section id="highlights" ref={ref} className="relative py-20 px-6 sm:px-8 lg:px-12" aria-labelledby="highlights-heading">
      <div className="mx-auto max-w-5xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="highlights-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{grid}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="highlights-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {grid}
          </>
        )}
      </div>
    </section>
  );
}
