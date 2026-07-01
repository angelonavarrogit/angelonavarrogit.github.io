'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Outside Work — Human side that differentiates.
 * @see Sprint 07
 */

const ACTIVITIES = [
  { id: 'church', icon: '⛪' },
  { id: 'youth', icon: '👥' },
  { id: 'learning', icon: '📖' },
  { id: 'tech', icon: '💡' },
  { id: 'sharing', icon: '🎤' },
];

export default function OutsideWorkSection() {
  const t = useTranslations('outsideWork');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  const content = (
    <div className="flex flex-wrap justify-center gap-4">
      {ACTIVITIES.map((act) => (
        <div key={act.id} className="flex items-center gap-3 rounded-full border border-border/50 bg-background-card/50 px-5 py-3">
          <span aria-hidden="true">{act.icon}</span>
          <span className="text-sm font-medium text-foreground-muted">{t(act.id)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section id="outside-work" ref={ref} className="relative py-20 px-6 sm:px-8 lg:px-12" aria-labelledby="outside-heading">
      <div className="mx-auto max-w-4xl">
        {shouldAnimate ? (
          <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="outside-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {content}
          </motion.div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="outside-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {content}
          </>
        )}
      </div>
    </section>
  );
}
