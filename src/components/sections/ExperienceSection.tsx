'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { EXPERIENCE } from '@/data/experience';
import TimelineNode from '@/components/shared/TimelineNode';

/**
 * ExperienceSection — Professional timeline with sequential stagger animations.
 *
 * Features:
 * - Chronological timeline: Cable & Wireless (2020) → +Móvil (present)
 * - Sequential node animations (200ms stagger) triggered at 20% viewport visibility
 * - Responsive: single column on mobile (<768px), alternating on desktop
 * - All text rendered in active locale via next-intl
 * - Respects prefers-reduced-motion
 *
 * @see Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */
export default function ExperienceSection() {
  const t = useTranslations('experience');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  // Animation variants for staggered children
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // 200ms delay between nodes
      },
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.h2
          id="experience-heading"
          className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : prefersReducedMotion
                ? undefined
                : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {t('title')}
        </motion.h2>

        {/* Timeline container */}
        <motion.div
          className="relative"
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={
            isInView
              ? 'visible'
              : prefersReducedMotion
                ? undefined
                : 'hidden'
          }
        >
          {/* Vertical timeline line (visible on md+) */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-accent/20 md:left-1/2 md:-translate-x-1/2" />

          {/* Timeline nodes */}
          <div className="space-y-12">
            {EXPERIENCE.map((position, index) => (
              <motion.div
                key={position.id}
                variants={prefersReducedMotion ? undefined : nodeVariants}
              >
                <TimelineNode position={position} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
