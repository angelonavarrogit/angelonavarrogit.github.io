/**
 * Stats counter data for Angelo Navarro
 * Animated counter section showing key career metrics
 * Uses i18n keys for bilingual support (ES/EN)
 */

import type { StatItem } from '@/lib/types';

export const STATS: StatItem[] = [
  {
    target: 6,
    suffix: '+',
    labelKey: 'stats.yearsExperience',
  },
  {
    target: 50,
    suffix: '+',
    labelKey: 'stats.scripts',
  },
  {
    target: 100,
    suffix: '+',
    labelKey: 'stats.automations',
  },
  {
    target: 20,
    suffix: '+',
    labelKey: 'stats.projects',
  },
  {
    target: 5,
    suffix: '+',
    labelKey: 'stats.mainTechnologies',
  },
];
