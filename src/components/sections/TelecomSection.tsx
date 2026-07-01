'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TELECOM_BLOCKS } from '@/data/telecom';

/**
 * TelecomSection — Displays telecom competency blocks with staggered
 * reveal animation on viewport entry.
 *
 * Features:
 * - 7 competency blocks (CSG Mediation, CDR Processing, IMS, SMS, Billing, Mediation, Mavenair)
 * - Each block shows area name + associated tools/technologies as badges
 * - Staggered appearance (150ms between blocks, 500ms duration) when 20% visible
 * - Rendered in active locale via next-intl
 * - Responsive grid: 1 col mobile, 2 cols tablet, 3-4 cols desktop
 * - Respects prefers-reduced-motion
 *
 * @see Requirements 11.1, 11.2, 11.3, 11.4
 */

/** Maps data nameKey to the corresponding translation key within the 'telecom' namespace */
function getBlockTranslationKey(nameKey: string): string {
  const keyMap: Record<string, string> = {
    'telecom.csgMediation': 'csgMediation',
    'telecom.cdrProcessing': 'cdrProcessing',
    'telecom.ims': 'imsCore',
    'telecom.sms': 'smsGateway',
    'telecom.billing': 'billingSystems',
    'telecom.mediation': 'mediation',
    'telecom.mavenair': 'mavenair',
  };
  return keyMap[nameKey] ?? nameKey;
}

export default function TelecomSection() {
  const t = useTranslations('telecom');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  // Container variants for stagger effect (150ms between blocks)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // 150ms between blocks
      },
    },
  };

  // Individual block variants (500ms duration)
  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5, // 500ms
        ease: [0.16, 1, 0.3, 1], // ease-out-custom
      },
    },
  };

  return (
    <section
      ref={ref}
      id="telecom"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="telecom-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        {shouldAnimate ? (
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h2
              id="telecom-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              {t('title')}
            </h2>
            <p className="mt-3 text-foreground-muted text-lg">
              {t('subtitle')}
            </p>
          </motion.div>
        ) : (
          <div className="mb-12 text-center">
            <h2
              id="telecom-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              {t('title')}
            </h2>
            <p className="mt-3 text-foreground-muted text-lg">
              {t('subtitle')}
            </p>
          </div>
        )}

        {/* Competency blocks grid */}
        {shouldAnimate ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            role="list"
            aria-label={t('title')}
          >
            {TELECOM_BLOCKS.map((block) => (
              <motion.article
                key={block.id}
                variants={blockVariants}
                className="rounded-xl bg-background-card border border-border p-6"
                role="listitem"
              >
                {/* Area name */}
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t(getBlockTranslationKey(block.nameKey))}
                </h3>

                {/* Tools/technologies as badges */}
                <div className="flex flex-wrap gap-2">
                  {block.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label={t('title')}
          >
            {TELECOM_BLOCKS.map((block) => (
              <article
                key={block.id}
                className="rounded-xl bg-background-card border border-border p-6"
                role="listitem"
              >
                {/* Area name */}
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t(getBlockTranslationKey(block.nameKey))}
                </h3>

                {/* Tools/technologies as badges */}
                <div className="flex flex-wrap gap-2">
                  {block.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
