'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Currently Learning — Shows growth mindset.
 * @see Sprint 07
 */

const LEARNING = ['machineLearning', 'cloudArch', 'dataAnalytics', 'aiEngineering', 'advPython', 'enterpriseArch'];

export default function LearningSection() {
  const t = useTranslations('learning');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

  const content = (
    <div className="flex flex-wrap justify-center gap-3">
      {LEARNING.map((item) => (
        <span key={item} className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          {t(item)}
        </span>
      ))}
    </div>
  );

  return (
    <section id="learning" ref={ref} className="relative py-20 px-6 sm:px-8 lg:px-12" aria-labelledby="learning-heading">
      <div className="mx-auto max-w-4xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="learning-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{content}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="learning-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {content}
          </>
        )}
      </div>
    </section>
  );
}
