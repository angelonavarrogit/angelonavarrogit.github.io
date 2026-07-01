'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Certifications Roadmap — Shows vision, not just completed certs.
 * @see Sprint 07
 */

const ROADMAP = [
  { id: 'capm', status: 'completed' },
  { id: 'pmp', status: 'next' },
  { id: 'aws', status: 'planned' },
  { id: 'azure', status: 'planned' },
  { id: 'gcloud', status: 'future' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  completed: { bg: 'bg-accent/10 border-accent/30', text: 'text-accent', icon: '✓' },
  next: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', icon: '→' },
  planned: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: '◎' },
  future: { bg: 'bg-foreground-subtle/10 border-border', text: 'text-foreground-subtle', icon: '◯' },
};

export default function CertRoadmapSection() {
  const t = useTranslations('certRoadmap');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

  const content = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {ROADMAP.map((cert) => {
        const style = STATUS_STYLES[cert.status];
        return (
          <div key={cert.id} className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center ${style.bg}`}>
            <span className={`text-lg font-bold ${style.text}`}>{style.icon}</span>
            <span className="text-sm font-semibold text-foreground">{t(`${cert.id}.name`)}</span>
            <span className={`text-xs font-medium uppercase tracking-wider ${style.text}`}>{t(`${cert.id}.status`)}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="cert-roadmap" ref={ref} className="relative py-20 px-6 sm:px-8 lg:px-12" aria-labelledby="certroadmap-heading">
      <div className="mx-auto max-w-4xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="certroadmap-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{content}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="certroadmap-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {content}
          </>
        )}
      </div>
    </section>
  );
}
