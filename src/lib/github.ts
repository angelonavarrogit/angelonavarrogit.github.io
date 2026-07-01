/**
 * GitHub data fetching module (SERVER-SIDE only)
 *
 * Fetches GitHub profile data using the REST API v3 with ISR revalidation.
 * Implements timeout handling, fallback data, and partial failure reporting.
 */

import type { GitHubData, PinnedRepo, LanguageStat, ContributionDay } from '@/lib/types';
import { GITHUB_FALLBACK } from '@/data/github-fallback';

// ISR revalidation period in seconds (1 hour)
export const revalidate = 3600;

// Static map of common language colors (GitHub-style)
const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Shell: '#89e051',
  SQL: '#e38c00',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  PowerShell: '#012456',
  Lua: '#000080',
  R: '#198CE7',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  SCSS: '#c6538c',
  MDX: '#fcb32c',
};

/**
 * GitHub API response type for a repository
 */
interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
  updated_at: string;
  pushed_at: string;
}

/**
 * GitHub API response type for an event
 */
interface GitHubEvent {
  type: string;
  created_at: string;
}

/**
 * Calculates language usage percentages from a map of language name to byte count.
 *
 * @param languages - Map of language name → byte count (positive integers)
 * @returns Array of LanguageStat sorted descending by percentage, max 5 entries, sum ≈ 100% (±1 rounding)
 */
export function calculateLanguagePercentages(
  languages: Record<string, number>
): LanguageStat[] {
  const entries = Object.entries(languages).filter(([, bytes]) => bytes > 0);

  if (entries.length === 0) {
    return [];
  }

  // Sort descending by byte count
  const sorted = entries.sort(([, a], [, b]) => b - a);

  // Take top 5
  const top = sorted.slice(0, 5);

  // Normalize: ensure they sum to ~100% by distributing among the top entries
  const topTotal = top.reduce((sum, [, bytes]) => sum + bytes, 0);
  const normalizedPercentages = top.map(([name, bytes]) => ({
    name,
    rawPercentage: (bytes / topTotal) * 100,
  }));

  // Round percentages using largest remainder method for sum ≈ 100%
  const floored = normalizedPercentages.map((entry) => ({
    ...entry,
    floored: Math.floor(entry.rawPercentage),
    remainder: entry.rawPercentage - Math.floor(entry.rawPercentage),
  }));

  const currentSum = floored.reduce((sum, entry) => sum + entry.floored, 0);
  const target = 100;
  const diff = target - currentSum;

  // Distribute remaining points to entries with largest remainders
  const sortedByRemainder = [...floored].sort(
    (a, b) => b.remainder - a.remainder
  );

  for (let i = 0; i < diff && i < sortedByRemainder.length; i++) {
    sortedByRemainder[i].floored += 1;
  }

  // Build final result maintaining original descending order
  const result: LanguageStat[] = floored.map((entry) => {
    // Find the potentially updated floored value
    const updated = sortedByRemainder.find((s) => s.name === entry.name);
    const percentage = updated ? updated.floored : entry.floored;
    return {
      name: entry.name,
      percentage: Math.max(percentage, 1), // Ensure each is > 0%
      color: LANGUAGE_COLORS[entry.name] || '#8b8b8b',
    };
  });

  return result;
}

/**
 * Fetches a URL with a timeout using AbortController.
 */
async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'angelo-portfolio',
      },
      next: { revalidate: 3600 },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches GitHub data for a user with timeout and fallback handling.
 *
 * @param username - GitHub username to fetch data for
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 * @returns GitHubData with live data, fallback, or partial data
 */
export async function fetchGitHubData(
  username: string,
  timeout: number = 5000
): Promise<GitHubData> {
  const baseUrl = 'https://api.github.com';
  const partialFailure: string[] = [];

  let repos: PinnedRepo[] = [];
  let topLanguages: LanguageStat[] = [];
  let contributions: ContributionDay[] = [];
  let totalCommits = 0;

  // --- Fetch repositories ---
  let repoData: GitHubRepo[] = [];
  try {
    const reposResponse = await fetchWithTimeout(
      `${baseUrl}/users/${username}/repos?sort=updated&per_page=10`,
      timeout
    );

    if (!reposResponse.ok) {
      throw new Error(`Repos API returned ${reposResponse.status}`);
    }

    repoData = await reposResponse.json();
    repos = repoData
      .filter((repo: GitHubRepo) => !repo.fork)
      .slice(0, 6)
      .map((repo: GitHubRepo) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        url: repo.html_url,
      }));
  } catch {
    partialFailure.push('repos');
  }

  // --- Fetch languages from top repos ---
  try {
    if (repoData.length > 0 && !partialFailure.includes('repos')) {
      const languageCounts: Record<string, number> = {};
      const topRepos = repoData.filter((r) => !r.fork).slice(0, 5);

      const languagePromises = topRepos.map((repo) =>
        fetchWithTimeout(
          `${baseUrl}/repos/${username}/${repo.name}/languages`,
          timeout
        )
          .then((res) => (res.ok ? res.json() : {}))
          .catch(() => ({}))
      );

      const languageResults = await Promise.all(languagePromises);

      for (const langs of languageResults) {
        for (const [lang, bytes] of Object.entries(langs)) {
          languageCounts[lang] = (languageCounts[lang] || 0) + (bytes as number);
        }
      }

      topLanguages = calculateLanguagePercentages(languageCounts);
    } else if (!partialFailure.includes('repos')) {
      partialFailure.push('languages');
    }
  } catch {
    partialFailure.push('languages');
  }

  // --- Fetch events (for contribution approximation) ---
  try {
    const eventsResponse = await fetchWithTimeout(
      `${baseUrl}/users/${username}/events?per_page=100`,
      timeout
    );

    if (!eventsResponse.ok) {
      throw new Error(`Events API returned ${eventsResponse.status}`);
    }

    const events: GitHubEvent[] = await eventsResponse.json();

    // Count push events as commits approximation
    const pushEvents = events.filter(
      (event) => event.type === 'PushEvent'
    );
    totalCommits = pushEvents.length * 3; // Approximate: each push ~3 commits avg

    // Build contribution data from events
    const contributionMap: Record<string, number> = {};
    for (const event of events) {
      const date = event.created_at.split('T')[0];
      contributionMap[date] = (contributionMap[date] || 0) + 1;
    }

    // Generate contributions for the last 365 days
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    contributions = [];
    for (
      let d = new Date(oneYearAgo);
      d <= now;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      const count = contributionMap[dateStr] || 0;
      const level: 0 | 1 | 2 | 3 | 4 =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

      contributions.push({
        date: dateStr,
        count,
        level,
      });
    }
  } catch {
    partialFailure.push('contributions');
  }

  // --- Determine result ---
  // If ALL sections failed, return full fallback
  const allFailed =
    partialFailure.includes('repos') &&
    partialFailure.includes('contributions');

  if (allFailed) {
    return {
      ...GITHUB_FALLBACK,
      isStale: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Return available data with partial failure info
  return {
    contributions:
      partialFailure.includes('contributions')
        ? GITHUB_FALLBACK.contributions
        : contributions,
    pinnedRepos:
      partialFailure.includes('repos') ? GITHUB_FALLBACK.pinnedRepos : repos,
    totalCommits:
      partialFailure.includes('contributions')
        ? GITHUB_FALLBACK.totalCommits
        : totalCommits,
    topLanguages:
      partialFailure.includes('languages')
        ? GITHUB_FALLBACK.topLanguages
        : topLanguages,
    lastUpdated: new Date().toISOString(),
    isStale: false,
    partialFailure,
  };
}
