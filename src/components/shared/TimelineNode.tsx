'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { ExperiencePosition } from '@/lib/types';

interface TimelineNodeProps {
  position: ExperiencePosition;
  index: number;
}

/**
 * TimelineNode — Individual timeline entry with expandable achievements.
 *
 * Features:
 * - Shows title, company, date range, and description (always visible)
 * - Achievements expand on hover (desktop) or touch (mobile)
 * - Expansion transition completes in <300ms
 * - Displays "Present" / "Presente" for null endDate (i18n)
 * - All text rendered in active locale via useTranslations
 *
 * @see Requirements 3.1, 3.3, 3.5
 */
export default function TimelineNode({ position, index }: TimelineNodeProps) {
  const t = useTranslations();
  const tExp = useTranslations('experience');
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract the nested key prefix from the titleKey (e.g., "experience.cableWireless.title" → "cableWireless")
  const keyParts = position.titleKey.split('.');
  const positionPrefix = keyParts.length >= 2 ? keyParts[1] : '';

  const title = t(position.titleKey);
  const description = t(position.descriptionKey);

  // Format date range
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
    });
  };

  const startFormatted = formatDate(position.startDate);
  const endFormatted = position.endDate
    ? formatDate(position.endDate)
    : tExp('present');

  const dateRange = `${startFormatted} – ${endFormatted}`;

  // Determine side for alternating layout (desktop): even = left, odd = right
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`group relative flex w-full items-start gap-4 md:gap-8 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onTouchStart={() => setIsExpanded((prev) => !prev)}
      role="article"
      aria-label={`${title} - ${position.company}`}
    >
      {/* Timeline dot and connector */}
      <div className="absolute left-4 top-0 flex h-full flex-col items-center md:left-1/2 md:-translate-x-1/2">
        <div className="z-10 h-4 w-4 rounded-full border-2 border-accent bg-background ring-4 ring-accent/20 transition-colors duration-200 group-hover:bg-accent" />
        <div className="w-0.5 flex-1 bg-accent/20" />
      </div>

      {/* Content card */}
      <div
        className={`ml-10 w-full rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
        }`}
      >
        {/* Header: Title & Company */}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm font-medium text-accent">
          {position.company}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{dateRange}</p>

        {/* Description (always visible) */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Achievements (expandable on hover/touch) */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
          aria-hidden={!isExpanded}
        >
          <ul className="mt-3 space-y-1.5 border-t border-border/30 pt-3">
            {position.achievementsKeys.map((achievementKey) => (
              <li
                key={achievementKey}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/60" />
                <span>{t(achievementKey)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Expand hint */}
        <p className="mt-2 text-xs text-muted-foreground/50 transition-opacity duration-200 group-hover:opacity-0">
          {isExpanded ? '' : '↕'}
        </p>
      </div>
    </div>
  );
}
