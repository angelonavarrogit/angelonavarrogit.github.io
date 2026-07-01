'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SKILL_CATEGORIES } from '@/data/skills';
import type { Skill, SkillLevel } from '@/lib/types';

/**
 * SkillsSection — Categorized skill dashboard with badges per proficiency level.
 *
 * Features:
 * - Skills organized in a grid of category cards
 * - Each skill displays name + level via styled badges (NOT progress bars)
 *   - Expert: solid accent bg, bold text
 *   - Advanced: outlined accent border
 *   - Intermediate: subtle/muted styling
 * - Stagger animation: 100ms between category cards, 300-600ms per card
 * - Triggers once on 20% viewport entry
 * - Respects prefers-reduced-motion
 * - Semantic structure with role="list" / role="listitem"
 * - Logical keyboard focus order; skills announced to assistive technologies
 * - Renders text in active locale via next-intl
 *
 * @see Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

/** Returns Tailwind classes for the skill level badge */
function getSkillLevelStyles(level: SkillLevel): string {
  switch (level) {
    case 'expert':
      return 'bg-accent text-background-DEFAULT font-bold';
    case 'advanced':
      return 'border border-accent text-accent bg-transparent font-medium';
    case 'intermediate':
      return 'bg-background-elevated text-foreground-muted border border-border font-normal';
  }
}

/** Framer Motion variants for staggered category card entrance */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // 100ms between category cards
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // 500ms (within 300-600ms range)
      ease: 'easeOut',
    },
  },
};

/**
 * Strips the `skills.` prefix from a key so it works with useTranslations('skills').
 * e.g. 'skills.categories.backend' → 'categories.backend'
 *      'skills.python' → 'python'
 */
function resolveKey(nameKey: string): string {
  return nameKey.startsWith('skills.') ? nameKey.slice(7) : nameKey;
}

/** Individual skill badge component */
function SkillBadge({
  skill,
  t,
}: {
  skill: Skill;
  t: ReturnType<typeof useTranslations>;
}) {
  const levelStyles = getSkillLevelStyles(skill.level);
  const skillName = t(resolveKey(skill.nameKey));
  const levelLabel = t(`levels.${skill.level}`);

  return (
    <li
      role="listitem"
      className="inline-flex items-center gap-2"
    >
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${levelStyles}`}
        aria-label={`${skillName} — ${levelLabel}`}
      >
        {skillName}
        <span className="ml-1.5 text-xs opacity-80">
          {levelLabel}
        </span>
      </span>
    </li>
  );
}

export default function SkillsSection() {
  const t = useTranslations('skills');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        <h2
          id="skills-heading"
          className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl"
        >
          {t('title')}
        </h2>

        {/* Category Cards Grid */}
        {shouldAnimate ? (
          <motion.div
            role="list"
            aria-label={t('title')}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {SKILL_CATEGORIES.map((category) => (
              <motion.article
                key={category.id}
                role="listitem"
                variants={cardVariants}
                className="rounded-xl border border-border bg-background-card p-6 transition-colors hover:border-border-hover"
                aria-labelledby={`skill-category-${category.id}`}
              >
                <h3
                  id={`skill-category-${category.id}`}
                  className="mb-4 text-lg font-semibold text-foreground"
                >
                  {t(resolveKey(category.nameKey))}
                </h3>
                <ul
                  role="list"
                  aria-label={t(resolveKey(category.nameKey))}
                  className="flex flex-wrap gap-2"
                >
                  {category.skills.map((skill) => (
                    <SkillBadge
                      key={skill.nameKey}
                      skill={skill}
                      t={t}
                    />
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          /* Reduced-motion fallback: no animation, immediate render */
          <div
            role="list"
            aria-label={t('title')}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {SKILL_CATEGORIES.map((category) => (
              <article
                key={category.id}
                role="listitem"
                className="rounded-xl border border-border bg-background-card p-6"
                aria-labelledby={`skill-category-${category.id}`}
              >
                <h3
                  id={`skill-category-${category.id}`}
                  className="mb-4 text-lg font-semibold text-foreground"
                >
                  {t(resolveKey(category.nameKey))}
                </h3>
                <ul
                  role="list"
                  aria-label={t(resolveKey(category.nameKey))}
                  className="flex flex-wrap gap-2"
                >
                  {category.skills.map((skill) => (
                    <SkillBadge
                      key={skill.nameKey}
                      skill={skill}
                      t={t}
                    />
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
