'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SKILL_CATEGORIES } from '@/data/skills';
import type { Skill, SkillLevel } from '@/lib/types';

/**
 * SkillsSection — Premium categorized skill grid.
 *
 * Design: Clean cards per category with visual level indicators.
 * Categories: Backend, Cloud & DevOps, Telecommunications, Automation, AI, PM.
 *
 * @see Sprint 04: Skills + Certifications
 */
export default function SkillsSection() {
  const t = useTranslations('skills');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const resolveKey = (key: string) => key.startsWith('skills.') ? key.slice(7) : key;

  const renderGrid = () => (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label={t('title')}>
      {SKILL_CATEGORIES.map((category) => (
        <article
          key={category.id}
          role="listitem"
          className="group rounded-2xl border border-border/50 bg-background-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5"
          aria-labelledby={`skill-cat-${category.id}`}
        >
          <h3 id={`skill-cat-${category.id}`} className="mb-4 text-base font-semibold text-foreground">
            {t(resolveKey(category.nameKey))}
          </h3>
          <div className="space-y-2.5">
            {category.skills.map((skill) => (
              <SkillRow key={skill.nameKey} skill={skill} t={t} resolveKey={resolveKey} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 px-6 sm:px-8 lg:px-12"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        {shouldAnimate ? (
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="skills-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              {t('title')}
            </h2>
          </motion.div>
        ) : (
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="skills-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
          </div>
        )}

        {/* Grid */}
        {shouldAnimate ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp}>
              {renderGrid()}
            </motion.div>
          </motion.div>
        ) : (
          renderGrid()
        )}
      </div>
    </section>
  );
}

function SkillRow({ skill, t, resolveKey }: { skill: Skill; t: ReturnType<typeof useTranslations>; resolveKey: (k: string) => string }) {
  const name = t(resolveKey(skill.nameKey));
  const levelLabel = t(`levels.${skill.level}`);

  return (
    <div className="flex items-center justify-between gap-3" aria-label={`${name} — ${levelLabel}`}>
      <span className="text-sm text-foreground-muted">{name}</span>
      <LevelIndicator level={skill.level} label={levelLabel} />
    </div>
  );
}

function LevelIndicator({ level, label }: { level: SkillLevel; label: string }) {
  const dots = level === 'expert' ? 3 : level === 'advanced' ? 2 : 1;
  const colors = {
    expert: 'bg-accent',
    advanced: 'bg-accent/60',
    intermediate: 'bg-accent/30',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-full ${i <= dots ? colors[level] : 'bg-border'}`}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium uppercase tracking-wider text-foreground-subtle w-20 text-right">
        {label}
      </span>
    </div>
  );
}
