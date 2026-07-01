/**
 * GitHub fallback data for when the API is unavailable
 * Static data used as a resilience mechanism with ISR
 */

import type { GitHubData } from '@/lib/types';

export const GITHUB_FALLBACK: GitHubData = {
  contributions: generateFallbackContributions(),
  pinnedRepos: [
    {
      name: 'smart-change-analyzer',
      description: 'Intelligent git change analyzer using NLP to categorize and summarize code modifications',
      language: 'Python',
      stars: 12,
      url: 'https://github.com/angelonavarrogit/smart-change-analyzer',
    },
    {
      name: 'ims-decoder',
      description: 'IMS protocol decoder for telecom network analysis and troubleshooting',
      language: 'Python',
      stars: 8,
      url: 'https://github.com/angelonavarrogit/ims-decoder',
    },
    {
      name: 'cdr-validation-tool',
      description: 'Automated CDR validation and reconciliation tool for telecom billing systems',
      language: 'Python',
      stars: 15,
      url: 'https://github.com/angelonavarrogit/cdr-validation-tool',
    },
    {
      name: 'j-pdve',
      description: 'Community management platform built with Next.js and NestJS',
      language: 'TypeScript',
      stars: 5,
      url: 'https://github.com/angelonavarrogit/j-pdve',
    },
    {
      name: 'portfolio',
      description: 'Professional portfolio with premium dark-mode aesthetics and bilingual support',
      language: 'TypeScript',
      stars: 3,
      url: 'https://github.com/angelonavarrogit/portfolio',
    },
    {
      name: 'telecom-scripts',
      description: 'Collection of automation scripts for telecom operations and monitoring',
      language: 'Python',
      stars: 7,
      url: 'https://github.com/angelonavarrogit/telecom-scripts',
    },
  ],
  totalCommits: 500,
  topLanguages: [
    { name: 'Python', percentage: 45, color: '#3572A5' },
    { name: 'TypeScript', percentage: 25, color: '#3178c6' },
    { name: 'JavaScript', percentage: 15, color: '#f1e05a' },
    { name: 'Shell', percentage: 10, color: '#89e051' },
    { name: 'SQL', percentage: 5, color: '#e38c00' },
  ],
  lastUpdated: '2024-01-01T00:00:00Z',
  isStale: true,
  partialFailure: [],
};

/**
 * Generate realistic contribution data for the fallback heatmap.
 * Produces ~365 days of contribution data with varied activity levels.
 */
function generateFallbackContributions() {
  const contributions = [];
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    // Simulate realistic activity: higher on weekdays
    let count = 0;
    if (isWeekday) {
      const rand = Math.random();
      if (rand > 0.3) count = Math.floor(Math.random() * 8) + 1;
    } else {
      const rand = Math.random();
      if (rand > 0.6) count = Math.floor(Math.random() * 4) + 1;
    }

    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

    contributions.push({
      date: d.toISOString().split('T')[0],
      count,
      level: level as 0 | 1 | 2 | 3 | 4,
    });
  }

  return contributions;
}
