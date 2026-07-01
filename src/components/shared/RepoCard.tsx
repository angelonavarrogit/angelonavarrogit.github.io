'use client';

import { useTranslations } from 'next-intl';
import type { PinnedRepo } from '@/lib/types';
import { truncateText } from '@/lib/utils';

interface RepoCardProps {
  repo: PinnedRepo;
}

/**
 * RepoCard — Displays a single pinned GitHub repository.
 *
 * Features:
 * - Repo name as clickable link (opens in new tab)
 * - Description truncated to 120 characters
 * - Primary language with color dot
 * - Star count
 *
 * @see Requirements 8.2
 */
export default function RepoCard({ repo }: RepoCardProps) {
  const t = useTranslations('github');

  const truncatedDescription = truncateText(repo.description, { maxLength: 120 });

  return (
    <article className="flex flex-col rounded-lg border border-border/50 bg-card p-4 transition-colors duration-200 hover:border-accent/30 hover:bg-card/80">
      {/* Repo name */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 text-base font-semibold text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card rounded-sm"
        aria-label={`${repo.name} - GitHub repository`}
      >
        {repo.name}
      </a>

      {/* Description */}
      {truncatedDescription && (
        <p className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {truncatedDescription}
        </p>
      )}

      {/* Meta: language + stars */}
      <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
        {/* Language with color dot */}
        {repo.language && repo.language !== 'Unknown' && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}

        {/* Stars */}
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>
            {repo.stars} {t('stars')}
          </span>
        </span>
      </div>
    </article>
  );
}

/** Common language colors used on GitHub. */
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
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
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Dart: '#00B4AB',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Vue: '#41b883',
    Svelte: '#ff3e00',
  };
  return colors[language] || '#8b8b8b';
}
