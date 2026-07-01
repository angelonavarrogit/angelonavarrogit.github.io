'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Engineering Philosophy — Values that drive every decision.
 * @see Sprint 06
 */

const PRINCIPLES = [
  { id: 'automation', icon: '⚡' },
  { id: 'security', icon: '🛡️' },
  { id: 'documentation', icon: '📝' },
  { id: 'learning', icon: '📚' },
  { id: 'scalable', icon: '🚀' },
];

export default function PhilosophySection() {
  const t = useTranslations('philosophy');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  const grid = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PRINCIPLES.map((p) => (
        <div key={p.id} className="rounded-2xl border border-border/50 bg-background-card/50 p-7 backdrop-blur-sm transition-all duration-300 hover:border-accent/20">
          <span className="mb-3 block text-2xl" aria-hidden="true">{p.icon}</span>
          <h3 className="text-base font-semibold text-foreground">{t(`${p.id}.title`)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{t(`${p.id}.description`)}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section id="philosophy" ref={ref} className="relative py-24 px-6 sm:px-8 lg:px-12" aria-labelledby="philosophy-heading">
      <div className="mx-auto max-w-5xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="philosophy-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{grid}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="philosophy-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {grid}
          </>
        )}
      </div>
    </section>
  );
}
