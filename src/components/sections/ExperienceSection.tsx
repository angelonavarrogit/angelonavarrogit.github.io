'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { EXPERIENCE } from '@/data/experience';

/**
 * ExperienceSection — Impact-driven professional timeline.
 *
 * Design: Vertical timeline with left accent line.
 * Each entry emphasizes results over responsibilities.
 * Cards show company, role, period, and bullet-point impacts.
 *
 * @see Sprint 02: About + Experience
 */
export default function ExperienceSection() {
  const t = useTranslations('experience');
  const tRoot = useTranslations();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 px-6 sm:px-8 lg:px-12"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        {shouldAnimate ? (
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              {t('label')}
            </p>
            <h2 id="experience-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              {t('title')}
            </h2>
          </motion.div>
        ) : (
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="experience-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
          </div>
        )}

        {/* Timeline */}
        {shouldAnimate ? (
          <motion.div
            className="relative"
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" aria-hidden="true" />

            <div className="space-y-10">
              {EXPERIENCE.map((position, index) => (
                <motion.div key={position.id} variants={fadeUp}>
                  <TimelineCard position={position} index={index} t={tRoot} tExp={t} isCurrent={!position.endDate} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" aria-hidden="true" />
            <div className="space-y-10">
              {EXPERIENCE.map((position, index) => (
                <TimelineCard key={position.id} position={position} index={index} t={tRoot} tExp={t} isCurrent={!position.endDate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface TimelineCardProps {
  position: typeof EXPERIENCE[number];
  index: number;
  t: ReturnType<typeof useTranslations>;
  tExp: ReturnType<typeof useTranslations>;
  isCurrent: boolean;
}

function TimelineCard({ position, t, tExp, isCurrent }: TimelineCardProps) {
  const title = t(position.titleKey);
  const description = t(position.descriptionKey);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const startFormatted = formatDate(position.startDate);
  const endFormatted = position.endDate ? formatDate(position.endDate) : tExp('present');

  return (
    <div className="group relative pl-10" role="article" aria-label={`${title} - ${position.company}`}>
      {/* Dot */}
      <div className="absolute left-0 top-2">
        <div className={`h-[14px] w-[14px] rounded-full border-2 transition-colors duration-200 ${
          isCurrent
            ? 'border-accent bg-accent shadow-lg shadow-accent/30'
            : 'border-accent/50 bg-background group-hover:border-accent group-hover:bg-accent/20'
        }`} />
        {isCurrent && (
          <div className="absolute -inset-1 animate-ping rounded-full bg-accent/20" />
        )}
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border/50 bg-background-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm font-medium text-accent">{position.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-background-elevated px-3 py-1 text-xs font-medium text-foreground-muted">
              {startFormatted} — {endFormatted}
            </span>
            {isCurrent && (
              <span className="rounded-full bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-xs font-semibold text-accent">
                Current
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          {description}
        </p>

        {/* Impact achievements */}
        <ul className="mt-4 space-y-2">
          {position.achievementsKeys.map((key) => (
            <li key={key} className="flex items-start gap-2.5 text-sm text-foreground-subtle">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
