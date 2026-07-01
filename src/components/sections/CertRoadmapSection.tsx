'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Certifications Roadmap — Shows vision, not just completed certs.
 * @see Sprint 07
 */

const ROADMAP = [
  { id: 'capm', status: 'completed', credlyId: 'ef7f2452-54cf-4340-aa9b-f038e1fabc2f' },
  { id: 'pmp', status: 'next', credlyId: null },
  { id: 'aws', status: 'planned', credlyId: null },
  { id: 'azure', status: 'planned', credlyId: null },
  { id: 'gcloud', status: 'future', credlyId: null },
];

/** Credly verified badges */
const CREDLY_BADGES = [
  { id: 'ef7f2452-54cf-4340-aa9b-f038e1fabc2f', label: 'CAPM (PMI)' },
  { id: '786bd1e2-3614-4d11-8a6c-41f0b6e8356a', label: 'Microsoft Elevate' },
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
    <div className="space-y-10">
      {/* Roadmap grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ROADMAP.map((cert) => {
          const style = STATUS_STYLES[cert.status];
          return (
            <div key={cert.id} className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center ${style.bg}`}>
              <span className={`text-lg font-bold ${style.text}`}>{style.icon}</span>
              <span className="text-sm font-semibold text-foreground">{t(`${cert.id}.name`)}</span>
              <span className={`text-xs font-medium uppercase tracking-wider ${style.text}`}>{t(`${cert.id}.status`)}</span>
              {cert.credlyId && (
                <a
                  href={`https://www.credly.com/badges/${cert.credlyId}/public_url`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-accent/70 hover:text-accent transition-colors"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verify
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Verified Credly Badges */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-medium uppercase tracking-widest text-foreground-subtle">
          {t('verified')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {CREDLY_BADGES.map((badge) => (
            <a
              key={badge.id}
              href={`https://www.credly.com/badges/${badge.id}/public_url`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-lg border border-border/50 bg-background-card/50 px-4 py-3 transition-all duration-200 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
              aria-label={`Verify ${badge.label} on Credly`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{badge.label}</span>
                <span className="text-[10px] text-foreground-subtle">Credly Verified</span>
              </div>
              <svg className="ml-2 h-3.5 w-3.5 text-foreground-subtle group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>
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
