'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { ContributionDay } from '@/lib/types';

interface ContributionGraphProps {
  contributions: ContributionDay[];
}

/**
 * ContributionGraph — GitHub-style contribution heatmap grid.
 *
 * Features:
 * - 7 rows (days of week) × ~52 columns (weeks of the year)
 * - Color intensity based on level (0-4): 0=empty, 1-4=increasingly green
 * - CSS grid layout with gap between cells
 * - Legend showing activity levels
 * - Accessible with aria-label per cell
 *
 * @see Requirements 8.1
 */
export default function ContributionGraph({ contributions }: ContributionGraphProps) {
  const t = useTranslations('github');

  // Organize contributions into weeks (columns) with 7 days (rows) each
  const weeks = useMemo(() => {
    if (contributions.length === 0) return [];

    // Group into weeks of 7 days
    const result: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Pad the first week so it starts on Sunday (day 0)
    const firstDate = new Date(contributions[0].date);
    const firstDay = firstDate.getDay(); // 0=Sunday

    // Add empty placeholders for days before the first contribution
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }

    for (const day of contributions) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    // Push any remaining partial week
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [contributions]);

  if (contributions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        {t('noContributions')}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Heatmap grid */}
      <div
        className="overflow-x-auto pb-2"
        role="img"
        aria-label={t('contributions')}
      >
        <div
          className="inline-grid gap-[3px]"
          style={{
            gridTemplateRows: 'repeat(7, 1fr)',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(10px, 1fr)',
          }}
        >
          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className={`h-[10px] w-[10px] rounded-[2px] sm:h-[12px] sm:w-[12px] ${getLevelColor(day.level)}`}
                title={
                  day.date
                    ? `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`
                    : ''
                }
                aria-hidden="true"
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>{t('lessActivity')}</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-[10px] w-[10px] rounded-[2px] ${getLevelColor(level as 0 | 1 | 2 | 3 | 4)}`}
          />
        ))}
        <span>{t('moreActivity')}</span>
      </div>
    </div>
  );
}

/** Maps a contribution level (0-4) to a Tailwind background color class. */
function getLevelColor(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
    case 0:
      return 'bg-muted/40';
    case 1:
      return 'bg-emerald-900/60';
    case 2:
      return 'bg-emerald-700/80';
    case 3:
      return 'bg-emerald-500';
    case 4:
      return 'bg-emerald-400';
    default:
      return 'bg-muted/40';
  }
}
