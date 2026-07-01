'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CERTIFICATIONS } from '@/data/certifications';

/**
 * CertificationsSection — Displays professional certification cards with staggered
 * reveal animation on viewport entry and hover/focus elevation effects.
 *
 * Features:
 * - 7 certification cards (CAPM, PMI, Node.js, Python, Scrum, Linux, Docker)
 * - Each card shows certification name + issuing organization
 * - Hover/focus: elevation (shadow) + brightness increase, <200ms transition
 * - Staggered appearance (150ms between cards) when 20% visible
 * - Rendered in active locale via next-intl
 * - Responsive grid: 1 col mobile, 2 cols tablet, 3-4 cols desktop
 * - Respects prefers-reduced-motion
 *
 * @see Requirements 5.1, 5.2, 5.3, 5.4
 */

/** Map data icon keys to display emoji/placeholder icons */
const CERT_ICONS: Record<string, string> = {
  capm: '📋',
  pmi: '📊',
  nodejs: '🟢',
  python: '🐍',
  scrum: '🔄',
  linux: '🐧',
  docker: '🐳',
};

/** Map orgKey to its corresponding translation key */
function getOrgTranslationKey(orgKey: string): string {
  const orgMap: Record<string, string> = {
    'certs.org.pmi': 'pmi',
    'certs.org.openjs': 'nodejsOrg',
    'certs.org.python': 'pythonOrg',
    'certs.org.scrum': 'scrumOrg',
    'certs.org.lpi': 'linuxOrg',
    'certs.org.docker': 'dockerOrg',
  };
  return orgMap[orgKey] ?? orgKey;
}

/** Map nameKey to its corresponding translation key */
function getNameTranslationKey(nameKey: string): string {
  const nameMap: Record<string, string> = {
    'certs.capm': 'capm',
    'certs.pmi': 'pmi',
    'certs.nodejs': 'nodejsCert',
    'certs.python': 'pythonCert',
    'certs.scrum': 'scrumCert',
    'certs.linux': 'linuxCert',
    'certs.docker': 'dockerCert',
  };
  return nameMap[nameKey] ?? nameKey;
}

export default function CertificationsSection() {
  const t = useTranslations('certifications');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  // Container variants for stagger effect
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // 150ms between cards
      },
    },
  };

  // Individual card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // ease-out-custom
      },
    },
  };

  return (
    <section
      ref={ref}
      id="certifications"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="certifications-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        {shouldAnimate ? (
          <motion.h2
            id="certifications-heading"
            className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {t('title')}
          </motion.h2>
        ) : (
          <h2
            id="certifications-heading"
            className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t('title')}
          </h2>
        )}

        {/* Cards grid */}
        {shouldAnimate ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            role="list"
            aria-label={t('title')}
          >
            {CERTIFICATIONS.map((cert) => (
              <motion.article
                key={cert.nameKey}
                variants={cardVariants}
                className="group relative rounded-xl bg-background-card border border-border p-6 transition-[box-shadow,filter] duration-200 ease-out hover:shadow-lg hover:shadow-accent/10 hover:brightness-110 focus-visible:shadow-lg focus-visible:shadow-accent/10 focus-visible:brightness-110"
                role="listitem"
                tabIndex={0}
              >
                {/* Icon */}
                <div className="mb-4 text-4xl" aria-hidden="true">
                  {CERT_ICONS[cert.icon] ?? '🏅'}
                </div>

                {/* Certification name */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t(getNameTranslationKey(cert.nameKey))}
                </h3>

                {/* Issuing organization */}
                <p className="text-sm text-foreground-muted">
                  {t(getOrgTranslationKey(cert.orgKey))}
                </p>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label={t('title')}
          >
            {CERTIFICATIONS.map((cert) => (
              <article
                key={cert.nameKey}
                className="group relative rounded-xl bg-background-card border border-border p-6 transition-[box-shadow,filter] duration-200 ease-out hover:shadow-lg hover:shadow-accent/10 hover:brightness-110 focus-visible:shadow-lg focus-visible:shadow-accent/10 focus-visible:brightness-110"
                role="listitem"
                tabIndex={0}
              >
                {/* Icon */}
                <div className="mb-4 text-4xl" aria-hidden="true">
                  {CERT_ICONS[cert.icon] ?? '🏅'}
                </div>

                {/* Certification name */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t(getNameTranslationKey(cert.nameKey))}
                </h3>

                {/* Issuing organization */}
                <p className="text-sm text-foreground-muted">
                  {t(getOrgTranslationKey(cert.orgKey))}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
