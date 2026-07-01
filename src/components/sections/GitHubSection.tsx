'use client';

import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ContributionGraph from '@/components/shared/ContributionGraph';
import RepoCard from '@/components/shared/RepoCard';
import type { GitHubData } from '@/lib/types';

interface GitHubSectionProps {
  data: GitHubData;
}

/**
 * GitHubSection — Orchestrator for the GitHub Integration section.
 *
 * Features:
 * - Contribution heatmap (ContributionGraph)
 * - Pinned repositories grid (max 6 RepoCards)
 * - Total commits stat
 * - Top 5 programming languages with percentage bars
 * - Stale data indicator when isStale=true
 * - Partial failure indicators per sub-section
 *
 * @see Requirements 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function GitHubSection({ data }: GitHubSectionProps) {
  const t = useTranslations('github');

  const {
    contributions,
    pinnedRepos,
    totalCommits,
    topLanguages,
    isStale,
    partialFailure,
  } = data;

  const hasContributionFailure = partialFailure.includes('contributions');
  const hasReposFailure = partialFailure.includes('repos');
  const hasLanguagesFailure = partialFailure.includes('languages');

  return (
    <section
      id="github"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="github-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <ScrollReveal duration={500}>
          <h2
            id="github-heading"
            className="mb-8 text-center text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t('title')}
          </h2>
        </ScrollReveal>

        {/* Stale data banner */}
        {isStale && (
          <div
            className="mb-6 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{t('staleData')}</span>
          </div>
        )}

        {/* Contributions heatmap */}
        <ScrollReveal delay={100} duration={500}>
          <div className="mb-10">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t('contributions')}
            </h3>
            {hasContributionFailure && (
              <PartialFailureIndicator message={t('partialFailure')} />
            )}
            <ContributionGraph contributions={contributions} />
          </div>
        </ScrollReveal>

        {/* Total commits stat */}
        <ScrollReveal delay={150} duration={500}>
          <div className="mb-10 flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 px-4 py-3">
              <p className="text-2xl font-bold text-accent">
                {totalCommits.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('totalCommits')}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Pinned Repositories grid (max 6) */}
        <ScrollReveal delay={200} duration={500}>
          <div className="mb-10">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t('pinnedRepos')}
            </h3>
            {hasReposFailure && (
              <PartialFailureIndicator message={t('partialFailure')} />
            )}
            {pinnedRepos.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pinnedRepos.slice(0, 6).map((repo) => (
                  <RepoCard key={repo.name} repo={repo} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t('noRepos')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Top Languages */}
        <ScrollReveal delay={250} duration={500}>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t('topLanguages')}
            </h3>
            {hasLanguagesFailure && (
              <PartialFailureIndicator message={t('partialFailure')} />
            )}
            {topLanguages.length > 0 && (
              <div className="space-y-3">
                {topLanguages.slice(0, 5).map((lang) => (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: lang.color }}
                          aria-hidden="true"
                        />
                        {lang.name}
                      </span>
                      <span className="text-muted-foreground">
                        {lang.percentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: lang.color,
                        }}
                        role="progressbar"
                        aria-valuenow={lang.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${lang.name}: ${lang.percentage}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/**
 * PartialFailureIndicator — inline warning shown when a sub-section's data failed to load.
 */
function PartialFailureIndicator({ message }: { message: string }) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-xs text-yellow-400/80" role="status">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>{message}</span>
    </p>
  );
}
