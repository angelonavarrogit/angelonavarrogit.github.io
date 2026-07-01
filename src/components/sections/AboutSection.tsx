'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * AboutSection — Premium storytelling bio with photo and highlights.
 *
 * Design: Clean two-column layout. Photo with accent ring glow.
 * Bio written as compelling narrative with highlighted key facts.
 * Quick-glance info pills below the bio.
 *
 * @see Sprint 02: About + Experience
 */
export default function AboutSection() {
  const t = useTranslations('about');
  const [imageError, setImageError] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 px-6 sm:px-8 lg:px-12"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
        {shouldAnimate ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid items-center gap-12 lg:grid-cols-[320px_1fr] lg:gap-20"
          >
            {/* Photo column */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-accent/20 via-primary-500/10 to-transparent blur-xl" aria-hidden="true" />
                
                {imageError ? (
                  <div
                    className="relative flex h-72 w-72 items-center justify-center rounded-2xl bg-background-card border border-border"
                    role="img"
                    aria-label={t('photoAlt')}
                  >
                    <span className="text-6xl font-bold text-accent/80 select-none">AN</span>
                  </div>
                ) : (
                  <Image
                    src="/images/angelo-profile.webp"
                    alt={t('photoAlt')}
                    width={288}
                    height={288}
                    className="relative rounded-2xl object-cover border border-border/50 shadow-2xl"
                    priority={false}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </motion.div>

            {/* Content column */}
            <div className="flex flex-col">
              <motion.div variants={fadeUp}>
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  {t('label')}
                </p>
                <h2 id="about-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
                  {t('title')}
                </h2>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-foreground-muted">
                {t('bio1')}
              </motion.p>

              <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-foreground-subtle">
                {t('bio2')}
              </motion.p>

              {/* Quick facts */}
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <InfoPill icon="📍" text={t('location')} />
                <InfoPill icon="🏢" text={t('company')} />
                <InfoPill icon="🎓" text={t('degree')} />
                <InfoPill icon="🗣️" text={t('languages')} />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Reduced motion fallback */
          <div className="grid items-center gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                {imageError ? (
                  <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-background-card border border-border" role="img" aria-label={t('photoAlt')}>
                    <span className="text-6xl font-bold text-accent/80 select-none">AN</span>
                  </div>
                ) : (
                  <Image src="/images/angelo-profile.webp" alt={t('photoAlt')} width={288} height={288} className="rounded-2xl object-cover border border-border/50" onError={() => setImageError(true)} />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="about-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground-muted">{t('bio1')}</p>
              <p className="mt-4 text-base leading-relaxed text-foreground-subtle">{t('bio2')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <InfoPill icon="📍" text={t('location')} />
                <InfoPill icon="🏢" text={t('company')} />
                <InfoPill icon="🎓" text={t('degree')} />
                <InfoPill icon="🗣️" text={t('languages')} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoPill({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background-card/50 px-4 py-2 text-sm text-foreground-muted">
      <span aria-hidden="true">{icon}</span>
      {text}
    </span>
  );
}
