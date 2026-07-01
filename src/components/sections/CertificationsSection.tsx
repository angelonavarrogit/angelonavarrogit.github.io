'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CERTIFICATIONS } from '@/data/certifications';

/**
 * CertificationsSection — Premium credential badges.
 *
 * Each cert shows: icon, name, issuer, and year.
 * Clean horizontal card design with subtle hover glow.
 *
 * @see Sprint 04: Skills + Certifications
 */

const CERT_ICONS: Record<string, string> = {
  capm: '📋', pmi: '📊', nodejs: '🟢', python: '🐍', scrum: '🔄', linux: '🐧', docker: '🐳',
};

function getNameKey(nameKey: string): string {
  const map: Record<string, string> = {
    'certs.capm': 'capm', 'certs.pmi': 'pmi', 'certs.nodejs': 'nodejsCert',
    'certs.python': 'pythonCert', 'certs.scrum': 'scrumCert', 'certs.linux': 'linuxCert', 'certs.docker': 'dockerCert',
  };
  return map[nameKey] ?? nameKey;
}

function getOrgKey(orgKey: string): string {
  const map: Record<string, string> = {
    'certs.org.pmi': 'pmi', 'certs.org.openjs': 'nodejsOrg', 'certs.org.python': 'pythonOrg',
    'certs.org.scrum': 'scrumOrg', 'certs.org.lpi': 'linuxOrg', 'certs.org.docker': 'dockerOrg',
  };
  return map[orgKey] ?? orgKey;
}

export default function CertificationsSection() {
  const t = useTranslations('certifications');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      ref={ref}
      id="certifications"
      className="relative py-24 px-6 sm:px-8 lg:px-12"
      aria-labelledby="certifications-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        {shouldAnimate ? (
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="certifications-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              {t('title')}
            </h2>
          </motion.div>
        ) : (
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="certifications-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
          </div>
        )}

        {/* Credentials grid */}
        {shouldAnimate ? (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            role="list"
          >
            {CERTIFICATIONS.map((cert) => (
              <motion.article
                key={cert.nameKey}
                variants={fadeUp}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-background-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:shadow-md hover:shadow-accent/5"
                role="listitem"
                tabIndex={0}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-2xl" aria-hidden="true">
                  {CERT_ICONS[cert.icon] ?? '🏅'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {t(getNameKey(cert.nameKey))}
                  </h3>
                  <p className="text-xs text-foreground-muted truncate">
                    {t(getOrgKey(cert.orgKey))}
                  </p>
                </div>
                {/* Verified badge */}
                <div className="ml-auto shrink-0">
                  <svg className="h-5 w-5 text-accent/60" fill="currentColor" viewBox="0 0 24 24" aria-label="Verified">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {CERTIFICATIONS.map((cert) => (
              <article
                key={cert.nameKey}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-background-card/50 p-5 transition-all duration-300 hover:border-accent/20 hover:shadow-md"
                role="listitem"
                tabIndex={0}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-2xl" aria-hidden="true">
                  {CERT_ICONS[cert.icon] ?? '🏅'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{t(getNameKey(cert.nameKey))}</h3>
                  <p className="text-xs text-foreground-muted truncate">{t(getOrgKey(cert.orgKey))}</p>
                </div>
                <div className="ml-auto shrink-0">
                  <svg className="h-5 w-5 text-accent/60" fill="currentColor" viewBox="0 0 24 24" aria-label="Verified">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
