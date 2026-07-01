'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/**
 * Featured Technologies — Grouped by domain, not just icons.
 * Enterprise | Programming | Infrastructure | AI
 * @see Sprint 06
 */

const TECH_GROUPS = [
  { id: 'enterprise', techs: ['CSG', 'Jira', 'ICM', 'SQL', 'SAP'] },
  { id: 'programming', techs: ['Python', 'Java', 'Node.js', 'TypeScript', 'Bash'] },
  { id: 'infrastructure', techs: ['Docker', 'GitHub', 'Vercel', 'Linux', 'CI/CD'] },
  { id: 'ai', techs: ['OpenAI', 'Gemini', 'Claude', 'LangChain', 'Pandas'] },
];

export default function FeaturedTechSection() {
  const t = useTranslations('featuredTech');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  const grid = (
    <div className="grid gap-6 sm:grid-cols-2">
      {TECH_GROUPS.map((group) => (
        <div key={group.id} className="rounded-2xl border border-border/50 bg-background-card/50 p-7 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">{t(group.id)}</h3>
          <div className="flex flex-wrap gap-2">
            {group.techs.map((tech) => (
              <span key={tech} className="rounded-lg border border-border/50 bg-background-elevated/50 px-3 py-1.5 text-sm font-medium text-foreground-muted">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="technologies" ref={ref} className="relative py-24 px-6 sm:px-8 lg:px-12" aria-labelledby="tech-heading">
      <div className="mx-auto max-w-4xl">
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="tech-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </motion.div>
            <motion.div variants={fadeUp}>{grid}</motion.div>
          </motion.div>
        ) : (
          <>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
              <h2 id="tech-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            </div>
            {grid}
          </>
        )}
      </div>
    </section>
  );
}
